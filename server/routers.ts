import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createContactSubmission, checkRateLimit, recordSubmissionAttempt, getAllContactSubmissions } from "./db";
import { sendConfirmationEmail, sendAdminNotificationEmail } from "./email";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          service: z.string().min(1, "Service is required"),
          salutation: z.string().min(1, "Salutation is required"),
          firstName: z.string().min(1, "First name is required"),
          lastName: z.string().min(1, "Last name is required"),
          dateOfBirth: z.string().min(1, "Date of birth is required"),
          email: z.string().email("Valid email is required"),
          phoneNumber: z.string().min(1, "Phone number is required"),
          street: z.string().min(1, "Street address is required"),
          addressLine2: z.string().optional(),
          postalCode: z.string().min(1, "Postal code is required"),
          city: z.string().min(1, "City is required"),
          stateProvince: z.string().optional(),
          country: z.string().min(1, "Country is required"),
          currentResidence: z.string().min(1, "Current residence is required"),
          preferredLanguage: z.string().min(1, "Preferred language is required"),
          message: z.string().min(10, "Please provide a detailed message (at least 10 characters)"),
          contactConsent: z.boolean().refine((val) => val === true, {
            message: "Please confirm your consent to be contacted by us.",
          }),
          privacyConsent: z.boolean().refine((val) => val === true, {
            message: "You must agree to the Privacy Policy.",
          }),
          honeypot: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Anti-spam: Check honeypot
        if (input.honeypot && input.honeypot.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid submission detected",
          });
        }

        // Get IP address from request
        const ipAddress = ctx.req.ip || ctx.req.socket.remoteAddress || "unknown";

        // Rate limiting check
        const canSubmit = await checkRateLimit(input.email, ipAddress);
        if (!canSubmit) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "You are submitting too quickly. Please wait 30 seconds before trying again.",
          });
        }

        // Get user agent
        const userAgent = ctx.req.headers["user-agent"] || "";

        // Create submission record
        const submission = {
          service: input.service,
          salutation: input.salutation,
          firstName: input.firstName,
          lastName: input.lastName,
          dateOfBirth: input.dateOfBirth,
          email: input.email,
          phoneNumber: input.phoneNumber,
          street: input.street,
          addressLine2: input.addressLine2 || null,
          postalCode: input.postalCode,
          city: input.city,
          stateProvince: input.stateProvince || null,
          country: input.country,
          currentResidence: input.currentResidence,
          preferredLanguage: input.preferredLanguage,
          message: input.message,
          contactConsent: input.contactConsent,
          privacyConsent: input.privacyConsent,
          submitterIp: ipAddress,
          userAgent: userAgent,
        };

        try {
          // Save to database
          await createContactSubmission(submission);

          // Record rate limit attempt
          await recordSubmissionAttempt(input.email, ipAddress);

          // Send emails (don't block on email failures)
          const submissionWithDate = {
            ...submission,
            id: 0,
            createdAt: new Date(),
          };

          await Promise.all([
            sendConfirmationEmail(submissionWithDate),
            sendAdminNotificationEmail(submissionWithDate),
          ]).catch((error) => {
            console.error("[Contact] Failed to send emails:", error);
          });

          return {
            success: true,
            message: "Your inquiry has been submitted successfully. We will contact you soon!",
          };
        } catch (error) {
          console.error("[Contact] Submission error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to submit your inquiry. Please try again later.",
          });
        }
      }),

    getAll: publicProcedure.query(async () => {
      // In production, this should be protected and only accessible to admins
      // For now, keeping it public for testing purposes
      return await getAllContactSubmissions();
    }),
  }),

  geo: router({
    getCountry: publicProcedure.query(async ({ ctx }) => {
      // Get IP address from request
      const ipAddress = ctx.req.ip || ctx.req.socket.remoteAddress || "";
      
      // For development/testing, check if IP is localhost
      if (ipAddress === "::1" || ipAddress === "127.0.0.1" || ipAddress.startsWith("::ffff:127.")) {
        return { countryCode: null, ip: ipAddress };
      }

      try {
        // Use a free IP geolocation service
        const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
        const data = await response.json();
        
        if (data.status === "success") {
          return {
            countryCode: data.countryCode,
            ip: ipAddress,
          };
        }
      } catch (error) {
        console.error("[Geo] Failed to get country:", error);
      }

      return { countryCode: null, ip: ipAddress };
    }),
  }),
});

export type AppRouter = typeof appRouter;
