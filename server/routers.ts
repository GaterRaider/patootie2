import { router, publicProcedure } from "./_core/trpc";
import { adminProcedure } from "./admin-auth";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createContactSubmission,
  checkRateLimit,
  recordSubmissionAttempt,
  getAllContactSubmissions,
  getDb,
  getUserByOpenId,
  upsertUser,
  getAllActivityLogs,
  bulkUpdateSubmissionStatus,
  getContactSubmissionsByIds,
  getContactSubmissionsCount,
  getContactSubmissionById,
  updateContactSubmissionStatus,
  getSubmissionNotes,
  createSubmissionNote,
  getAllAdminUsers,
  createAdminUser,
  deleteAdminUser,
  updateAdminUserPassword,
  getFAQItemsByLanguage,
  getAllFAQItems,
  createFAQItem,
  updateFAQItem,
  deleteFAQItem,
  reorderFAQItems,
  toggleFAQItemPublish,
} from "./db";
import {
  getCompanySettings,
  upsertCompanySettings,
  createInvoice,
  getInvoiceById,
  getAllInvoices,
  updateInvoice,
  updateInvoiceItems,
  deleteInvoice,
  addPayment,
  getInvoicePayments,
  getInvoicesCount,
  createInvoiceFromSubmission,
} from "./invoice-db";
import { sendConfirmationEmail, sendAdminNotificationEmail, sendInvoiceEmail, getInvoiceEmailHTML } from "./email";
import { adminUsers, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, signAdminToken } from "./admin-auth";
import { getSessionCookieOptions } from "./_core/cookies";
import { logActivity } from "./activity-log";
import {
  getSummaryMetrics,
  getSubmissionsOverTime,
  getSubmissionsByService,
  getRevenueTrends,
  getInvoiceStatusDistribution,
  getResponseTimeMetrics,
  getTopServicesByRevenue,
} from "./analytics";

const COOKIE_NAME = "session_id"; // Session cookie name

const systemRouter = router({
  health: publicProcedure.query(() => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }),
});

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
          subService: z.string().optional(),
          subServices: z.array(z.string()).optional(),
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
          currentResidence: z.string().optional(),
          preferredLanguage: z.string().optional(),
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
          subService: input.subService || null,
          subServices: input.subServices || null,
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
          currentResidence: input.currentResidence || null,
          preferredLanguage: input.preferredLanguage || null,
          message: input.message,
          contactConsent: input.contactConsent,
          privacyConsent: input.privacyConsent,
          submitterIp: ipAddress,
          userAgent: userAgent,
        };

        try {
          // Save to database
          const result = await createContactSubmission(submission);

          // Record rate limit attempt
          await recordSubmissionAttempt(input.email, ipAddress);

          // Send emails (don't block on email failures)
          const submissionWithDate = {
            ...submission,
            id: 0,
            refId: result.refId,
            status: "new",
            createdAt: new Date(),
          };

          await Promise.all([
            sendConfirmationEmail(submissionWithDate),
            sendAdminNotificationEmail(submissionWithDate),
          ]).catch((error) => {
            console.error("[Contact] Failed to send emails:", error);
          });
          // ...
          // Log activity


          return {
            success: true,
            message: "Your inquiry has been submitted successfully. We will contact you soon!",
            refId: result.refId,
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

  admin: router({
    auth: router({
      login: publicProcedure
        .input(z.object({
          username: z.string(),
          password: z.string(),
          keepMeLoggedIn: z.boolean().optional().default(false)
        }))
        .mutation(async ({ input, ctx }) => {
          // Get IP address for rate limiting
          const ipAddress = ctx.req.ip || ctx.req.socket.remoteAddress || "unknown";

          // Check rate limit BEFORE authentication
          const { checkAdminLoginRateLimit, recordAdminLoginAttempt } = await import("./db");
          const canAttempt = await checkAdminLoginRateLimit(ipAddress);
          if (!canAttempt) {
            throw new TRPCError({
              code: "TOO_MANY_REQUESTS",
              message: "Too many login attempts. Please try again in 15 minutes.",
            });
          }

          const db = await getDb();
          if (!db) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
          }
          const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, input.username)).limit(1);

          if (!admin) {
            // Record failed attempt
            await recordAdminLoginAttempt(ipAddress, input.username, false);
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
          }

          const isValid = await verifyPassword(input.password, admin.passwordHash);
          if (!isValid) {
            // Record failed attempt
            await recordAdminLoginAttempt(ipAddress, input.username, false);
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
          }

          // Record successful attempt
          await recordAdminLoginAttempt(ipAddress, input.username, true);

          const token = await signAdminToken(admin.id, input.keepMeLoggedIn);
          const cookieOptions = getSessionCookieOptions(ctx.req);
          const cookieConfig: any = { ...cookieOptions };

          // Set maxAge only if keepMeLoggedIn is true (persistent cookie)
          // Otherwise, omit maxAge for session cookie (expires on browser close)
          if (input.keepMeLoggedIn) {
            cookieConfig.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
          }

          console.log('[Admin Login] Setting cookie with options:', cookieConfig);
          ctx.res.cookie("admin_token", token, cookieConfig);
          console.log('[Admin Login] Cookie set successfully');

          // Log activity
          await logActivity({
            adminId: admin.id,
            action: "LOGIN",
            entityType: "ADMIN",
            entityId: admin.id,
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return { success: true };
        }),

      logout: publicProcedure.mutation(({ ctx }) => {
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.clearCookie("admin_token", { ...cookieOptions, maxAge: -1 });
        return { success: true };
      }),

      me: adminProcedure.query(({ ctx }) => {
        return { adminId: ctx.adminId };
      }),
    }),

    users: router({
      getAll: adminProcedure.query(async () => {
        return await getAllAdminUsers();
      }),

      create: adminProcedure
        .input(
          z.object({
            username: z.string().min(3, "Username must be at least 3 characters"),
            password: z.string().min(6, "Password must be at least 6 characters"),
          })
        )
        .mutation(async ({ input, ctx }) => {
          const passwordHash = await hashPassword(input.password);
          const newAdmin = await createAdminUser(input.username, passwordHash);

          await logActivity({
            adminId: ctx.adminId,
            action: "CREATE_ADMIN",
            entityType: "ADMIN",
            entityId: newAdmin.id,
            details: { username: newAdmin.username },
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return newAdmin;
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
          // Prevent deleting yourself
          if (input.id === ctx.adminId) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "You cannot delete your own account",
            });
          }

          await deleteAdminUser(input.id);

          await logActivity({
            adminId: ctx.adminId,
            action: "DELETE_ADMIN",
            entityType: "ADMIN",
            entityId: input.id,
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return { success: true };
        }),

      updatePassword: adminProcedure
        .input(
          z.object({
            id: z.number(),
            password: z.string().min(6, "Password must be at least 6 characters"),
          })
        )
        .mutation(async ({ input, ctx }) => {
          const passwordHash = await hashPassword(input.password);
          await updateAdminUserPassword(input.id, passwordHash);

          await logActivity({
            adminId: ctx.adminId,
            action: "UPDATE_ADMIN_PASSWORD",
            entityType: "ADMIN",
            entityId: input.id,
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return { success: true };
        }),
    }),

    submissions: router({
      getAll: adminProcedure
        .input(
          z.object({
            page: z.number().optional(),
            limit: z.number().optional(),
            search: z.string().optional(),
            status: z.string().optional(),
            service: z.string().optional(),
            sortBy: z.string().optional(),
            sortOrder: z.enum(["asc", "desc"]).optional(),
          })
        )
        .query(async ({ input }) => {
          const submissions = await getAllContactSubmissions(input);
          const total = await getContactSubmissionsCount(input);
          return { submissions, total };
        }),

      bulkUpdate: adminProcedure
        .input(
          z.object({
            ids: z.array(z.number()),
            status: z.string(),
          })
        )
        .mutation(async ({ input, ctx }) => {
          await bulkUpdateSubmissionStatus(input.ids, input.status);

          // Log activity
          await logActivity({
            adminId: ctx.adminId,
            action: "BULK_UPDATE",
            entityType: "SUBMISSION",
            entityId: undefined,
            details: { ids: input.ids, status: input.status },
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return { success: true };
        }),

      export: adminProcedure
        .input(
          z.object({
            ids: z.array(z.number()),
          })
        )
        .mutation(async ({ input }) => {
          const submissions = await getContactSubmissionsByIds(input.ids);
          return submissions;
        }),

      getOne: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          const submission = await getContactSubmissionById(input.id);
          if (!submission) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Submission not found" });
          }
          return submission;
        }),

      updateStatus: adminProcedure
        .input(
          z.object({
            id: z.number(),
            status: z.string(),
          })
        )
        .mutation(async ({ input, ctx }) => {
          await updateContactSubmissionStatus(input.id, input.status);

          // Log activity
          await logActivity({
            adminId: ctx.adminId,
            action: "UPDATE_STATUS",
            entityType: "SUBMISSION",
            entityId: input.id,
            details: { status: input.status },
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return { success: true };
        }),

      notes: router({
        getAll: adminProcedure
          .input(z.object({ submissionId: z.number() }))
          .query(async ({ input }) => {
            return await getSubmissionNotes(input.submissionId);
          }),

        create: adminProcedure
          .input(
            z.object({
              submissionId: z.number(),
              note: z.string(),
            })
          )
          .mutation(async ({ input, ctx }) => {
            const newNote = await createSubmissionNote({
              submissionId: input.submissionId,
              adminId: ctx.adminId,
              note: input.note,
            });

            // Log activity
            await logActivity({
              adminId: ctx.adminId,
              action: "ADD_NOTE",
              entityType: "SUBMISSION",
              entityId: input.submissionId,
              details: { note: input.note },
              ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
              userAgent: ctx.req.headers["user-agent"],
            });

            return newNote;
          }),
      }),
    }),

    activity: router({
      getAll: adminProcedure
        .input(
          z.object({
            limit: z.number().optional(),
            offset: z.number().optional(),
            adminId: z.number().optional(),
            action: z.string().optional(),
            entityType: z.string().optional(),
            search: z.string().optional(),
          })
        )
        .query(async ({ input }) => {
          return await getAllActivityLogs(input);
        }),
    }),

    invoices: router({
      getAll: adminProcedure
        .input(
          z.object({
            page: z.number().optional(),
            limit: z.number().optional(),
            status: z.string().optional(),
            clientName: z.string().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
          })
        )
        .query(async ({ input }) => {
          const invoices = await getAllInvoices(input);
          const total = await getInvoicesCount(input);
          return { invoices, total };
        }),

      getOne: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          const invoice = await getInvoiceById(input.id);
          if (!invoice) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
          }
          return invoice;
        }),

      create: adminProcedure
        .input(
          z.object({
            invoice: z.object({
              submissionId: z.number().optional(),
              clientName: z.string(),
              clientEmail: z.string(),
              clientAddress: z.string(),
              issueDate: z.string(),
              dueDate: z.string(),
              serviceDate: z.string().optional(),
              subtotal: z.string(),
              taxRate: z.string(),
              taxAmount: z.string(),
              total: z.string(),
              currency: z.string().default("EUR"),
              status: z.string().default("draft"),
              notes: z.string().optional(),
              termsAndConditions: z.string().optional(),

              createdBy: z.number(),
            }),
            items: z.array(
              z.object({
                description: z.string(),
                quantity: z.string(),
                unitPrice: z.string(),
                amount: z.string(),
              })
            ),
          })
        )
        .mutation(async ({ input, ctx }) => {
          const invoiceData = {
            ...input.invoice,
            submissionId: input.invoice.submissionId,
          };
          const itemsWithSortOrder = input.items.map((item, index) => ({ ...item, sortOrder: index }));
          const newInvoice = await createInvoice(invoiceData as any, itemsWithSortOrder);

          await logActivity({
            adminId: ctx.adminId,
            action: "CREATE_INVOICE",
            entityType: "INVOICE",
            entityId: newInvoice.id,
            details: { invoiceNumber: newInvoice.invoiceNumber },
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return newInvoice;
        }),

      createFromSubmission: adminProcedure
        .input(
          z.object({
            submissionId: z.number(),
            invoice: z.object({
              issueDate: z.string(),
              dueDate: z.string(),
              serviceDate: z.string().optional(),
              subtotal: z.string(),
              taxRate: z.string(),
              taxAmount: z.string(),
              total: z.string(),
              notes: z.string().optional(),
              termsAndConditions: z.string().optional(),
              createdBy: z.number(),
            }),
            items: z.array(
              z.object({
                description: z.string(),
                quantity: z.string(),
                unitPrice: z.string(),
                amount: z.string(),
              })
            ),
          })
        )
        .mutation(async ({ input, ctx }) => {
          const itemsWithSortOrder = input.items.map((item, index) => ({ ...item, sortOrder: index }));
          const newInvoice = await createInvoiceFromSubmission(
            input.submissionId,
            input.invoice as any,
            itemsWithSortOrder
          );

          await logActivity({
            adminId: ctx.adminId,
            action: "CREATE_INVOICE",
            entityType: "INVOICE",
            entityId: newInvoice.id,
            details: { invoiceNumber: newInvoice.invoiceNumber, submissionId: input.submissionId },
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return newInvoice;
        }),

      update: adminProcedure
        .input(
          z.object({
            id: z.number(),
            updates: z.object({
              clientName: z.string().optional(),
              clientEmail: z.string().optional(),
              clientAddress: z.string().optional(),
              issueDate: z.string().optional(),
              dueDate: z.string().optional(),
              serviceDate: z.string().optional(),
              subtotal: z.string().optional(),
              taxRate: z.string().optional(),
              taxAmount: z.string().optional(),
              total: z.string().optional(),
              status: z.string().optional(),
              notes: z.string().optional(),
              termsAndConditions: z.string().optional(),
            }),
            items: z
              .array(
                z.object({
                  description: z.string(),
                  quantity: z.string(),
                  unitPrice: z.string(),
                  amount: z.string(),
                })
              )
              .optional(),
          })
        )
        .mutation(async ({ input, ctx }) => {
          const updated = await updateInvoice(input.id, input.updates as any);

          if (input.items) {
            const itemsWithSortOrder = input.items.map((item, index) => ({ ...item, sortOrder: index }));
            await updateInvoiceItems(input.id, itemsWithSortOrder);
          }

          await logActivity({
            adminId: ctx.adminId,
            action: "UPDATE_INVOICE",
            entityType: "INVOICE",
            entityId: input.id,
            details: input.updates,
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return updated;
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
          await deleteInvoice(input.id);

          await logActivity({
            adminId: ctx.adminId,
            action: "DELETE_INVOICE",
            entityType: "INVOICE",
            entityId: input.id,
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return { success: true };
        }),

      payments: router({
        getAll: adminProcedure
          .input(z.object({ invoiceId: z.number() }))
          .query(async ({ input }) => {
            return await getInvoicePayments(input.invoiceId);
          }),

        add: adminProcedure
          .input(
            z.object({
              invoiceId: z.number(),
              amount: z.string(),
              paymentDate: z.string(),
              paymentMethod: z.string(),
              reference: z.string().optional(),
              notes: z.string().optional(),
              recordedBy: z.number(),
            })
          )
          .mutation(async ({ input, ctx }) => {
            const payment = await addPayment(input as any);

            await logActivity({
              adminId: ctx.adminId,
              action: "ADD_PAYMENT",
              entityType: "INVOICE",
              entityId: input.invoiceId,
              details: { amount: input.amount, method: input.paymentMethod },
              ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
              userAgent: ctx.req.headers["user-agent"],
            });

            return payment;
          }),
      }),

      generatePdf: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          const invoice = await getInvoiceById(input.id);
          if (!invoice) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
          }

          const settings = await getCompanySettings();
          if (!settings) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Company settings not configured" });
          }

          const { generateInvoicePDF } = await import("./pdf-generator");

          const pdfBuffer = await generateInvoicePDF(invoice as any, settings as any);

          // Return base64 encoded PDF
          return {
            pdf: pdfBuffer.toString("base64"),
            filename: `${invoice.invoiceNumber}.pdf`,
          };
        }),

      previewEmail: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          const invoice = await getInvoiceById(input.id);
          if (!invoice) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
          }
          return getInvoiceEmailHTML(invoice);
        }),

      send: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
          const invoice = await getInvoiceById(input.id);
          if (!invoice) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
          }

          const settings = await getCompanySettings();
          if (!settings) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Company settings not configured" });
          }

          // Generate PDF
          const { generateInvoicePDF } = await import("./pdf-generator");
          const pdfBuffer = await generateInvoicePDF(invoice as any, settings as any);
          const pdfBase64 = pdfBuffer.toString("base64");

          // Send Email
          const sent = await sendInvoiceEmail(invoice, pdfBase64);

          if (!sent) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to send email via MailJet"
            });
          }

          // Update Invoice Status
          await updateInvoice(input.id, {
            status: "sent",
            emailSentAt: new Date(),
          });

          // Log Activity
          await logActivity({
            adminId: ctx.adminId,
            action: "SEND_INVOICE",
            entityType: "INVOICE",
            entityId: input.id,
            details: { email: invoice.clientEmail },
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return { success: true };
        }),
    }),

    settings: router({
      get: adminProcedure.query(async () => {
        return await getCompanySettings();
      }),

      update: adminProcedure
        .input(
          z.object({
            companyName: z.string().optional(),
            address: z.string().optional(),
            email: z.string().optional(),
            phone: z.string().optional(),
            taxId: z.string().optional(),
            vatId: z.string().optional(),
            iban: z.string().optional(),
            bic: z.string().optional(),
            bankName: z.string().optional(),
            logoUrl: z.string().optional(),
            defaultTaxRate: z.string().optional(),
            paymentTermsDays: z.number().optional(),
            termsAndConditions: z.string().optional(),
          })
        )
        .mutation(async ({ input, ctx }) => {
          const updated = await upsertCompanySettings(input as any);

          await logActivity({
            adminId: ctx.adminId,
            action: "UPDATE_SETTINGS",
            entityType: "SETTINGS",
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return updated;
        }),
    }),

    analytics: router({
      getSummaryMetrics: adminProcedure
        .input(z.object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }).optional())
        .query(async ({ input }) => {
          return await getSummaryMetrics(input);
        }),
      getSubmissionsOverTime: adminProcedure
        .input(z.object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          groupBy: z.enum(['day', 'week', 'month']).optional(),
        }).optional())
        .query(async ({ input }) => {
          return await getSubmissionsOverTime(input, input?.groupBy);
        }),
      getSubmissionsByService: adminProcedure
        .input(z.object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }).optional())
        .query(async ({ input }) => {
          return await getSubmissionsByService(input);
        }),
      getRevenueTrends: adminProcedure
        .input(z.object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }).optional())
        .query(async ({ input }) => {
          return await getRevenueTrends(input);
        }),
      getInvoiceStatusDistribution: adminProcedure
        .input(z.object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }).optional())
        .query(async ({ input }) => {
          return await getInvoiceStatusDistribution(input);
        }),
      getResponseTimeMetrics: adminProcedure
        .input(z.object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }).optional())
        .query(async ({ input }) => {
          return await getResponseTimeMetrics(input);
        }),
      getTopServicesByRevenue: adminProcedure
        .input(z.object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          limit: z.number().optional(),
        }).optional())
        .query(async ({ input }) => {
          return await getTopServicesByRevenue(input, input?.limit);
        }),
      generatePdf: adminProcedure
        .input(z.object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }).optional())
        .mutation(async ({ input }) => {
          // Fetch all analytics data
          const summaryMetrics = await getSummaryMetrics(input);
          const submissionsOverTime = await getSubmissionsOverTime(input);
          const submissionsByService = await getSubmissionsByService(input);
          const revenueTrends = await getRevenueTrends(input);
          const invoiceStatus = await getInvoiceStatusDistribution(input);
          const topServices = await getTopServicesByRevenue(input, 10);

          // Generate PDF
          const { generateAnalyticsPDF } = await import("./analytics-pdf-generator");
          const pdfBuffer = await generateAnalyticsPDF({
            summaryMetrics: summaryMetrics as any,
            submissionsOverTime: submissionsOverTime as any,
            submissionsByService: submissionsByService as any,
            revenueTrends: revenueTrends as any,
            invoiceStatus: invoiceStatus as any,
            topServices: topServices as any,
            dateRange: input,
          });

          // Return base64 encoded PDF
          return {
            pdf: pdfBuffer.toString("base64"),
            filename: `analytics_report_${new Date().toISOString().split('T')[0]}.pdf`,
          };
        }),
    }),

    emailTemplates: router({
      getAll: adminProcedure.query(async () => {
        const { getAllEmailTemplates, initializeEmailTemplates } = await import("./email-templates");
        // Ensure templates exist
        await initializeEmailTemplates();
        return await getAllEmailTemplates();
      }),

      getOne: adminProcedure
        .input(z.object({ key: z.string(), language: z.string() }))
        .query(async ({ input }) => {
          const { getEmailTemplate } = await import("./email-templates");
          const template = await getEmailTemplate(input.key, input.language);
          if (!template) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Template not found" });
          }
          return template;
        }),

      update: adminProcedure
        .input(
          z.object({
            id: z.number(),
            subject: z.string(),
            htmlContent: z.string(),
            textContent: z.string().optional(),
            senderName: z.string().optional(),
            senderEmail: z.string().optional(),
          })
        )
        .mutation(async ({ input, ctx }) => {
          const { updateEmailTemplate } = await import("./email-templates");
          const updated = await updateEmailTemplate(input.id, input, ctx.adminId);

          await logActivity({
            adminId: ctx.adminId,
            action: "UPDATE_EMAIL_TEMPLATE",
            entityType: "EMAIL_TEMPLATE",
            entityId: input.id,
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return updated;
        }),

      getPlaceholders: adminProcedure
        .input(z.object({ key: z.string() }))
        .query(async ({ input }) => {
          const { PLACEHOLDERS } = await import("./email-templates");
          return PLACEHOLDERS[input.key as keyof typeof PLACEHOLDERS] || [];
        }),
    }),
  }),

  // FAQ Management
  faq: router({
    // Public endpoint - get published FAQ items by language
    getByLanguage: publicProcedure
      .input(z.object({
        language: z.enum(['en', 'ko', 'de']),
      }))
      .query(async ({ input }) => {
        const items = await getFAQItemsByLanguage(input.language);

        // Transform to JSON-LD format for SEO
        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": items.map((item) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer,
            },
          })),
        };

        return {
          items: items.map(({ question, answer }) => ({ question, answer })),
          jsonLd,
        };
      }),

    // Admin endpoints
    admin: router({
      getAll: adminProcedure
        .query(async ({ ctx }) => {
          return await getAllFAQItems();
        }),

      create: adminProcedure
        .input(z.object({
          language: z.enum(['en', 'ko', 'de']),
          question: z.string().min(1),
          answer: z.string().min(1),
          isPublished: z.boolean().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          const item = await createFAQItem({
            ...input,
            createdBy: ctx.adminId,
            updatedBy: ctx.adminId,
          });

          await logActivity({
            adminId: ctx.adminId,
            action: "CREATE_FAQ",
            entityType: "FAQ_ITEM",
            entityId: item.id,
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return item;
        }),

      update: adminProcedure
        .input(z.object({
          id: z.number(),
          question: z.string().min(1).optional(),
          answer: z.string().min(1).optional(),
          isPublished: z.boolean().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          const { id, ...data } = input;
          const item = await updateFAQItem(id, {
            ...data,
            updatedBy: ctx.adminId,
          });

          await logActivity({
            adminId: ctx.adminId,
            action: "UPDATE_FAQ",
            entityType: "FAQ_ITEM",
            entityId: id,
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return item;
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
          await deleteFAQItem(input.id);

          await logActivity({
            adminId: ctx.adminId,
            action: "DELETE_FAQ",
            entityType: "FAQ_ITEM",
            entityId: input.id,
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return { success: true };
        }),

      reorder: adminProcedure
        .input(z.object({
          language: z.enum(['en', 'ko', 'de']),
          itemIds: z.array(z.number()),
        }))
        .mutation(async ({ input, ctx }) => {
          await reorderFAQItems(input.language, input.itemIds);

          await logActivity({
            adminId: ctx.adminId,
            action: "REORDER_FAQ",
            entityType: "FAQ_ITEM",
            details: { language: input.language, count: input.itemIds.length },
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return { success: true };
        }),

      togglePublish: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
          const item = await toggleFAQItemPublish(input.id);

          await logActivity({
            adminId: ctx.adminId,
            action: item.isPublished ? "PUBLISH_FAQ" : "UNPUBLISH_FAQ",
            entityType: "FAQ_ITEM",
            entityId: input.id,
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
            userAgent: ctx.req.headers["user-agent"],
          });

          return item;
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
