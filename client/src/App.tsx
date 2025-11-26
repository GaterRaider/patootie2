import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Imprint from "./pages/Imprint";
import ScrollToTop from "./components/ScrollToTop";
import { useLanguage } from "./contexts/LanguageContext";
import { useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";

// Lazy load admin routes to reduce initial bundle size
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminSubmissions = lazy(() => import("./pages/admin/Submissions"));
const ActivityLog = lazy(() => import("./pages/admin/ActivityLog"));
const SubmissionDetail = lazy(() => import("./pages/admin/SubmissionDetail"));
const Invoices = lazy(() => import("./pages/admin/Invoices"));
const InvoiceForm = lazy(() => import("./pages/admin/InvoiceForm"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const EmailTemplates = lazy(() => import("./pages/admin/EmailTemplates"));
const EmailTemplateEditor = lazy(() => import("./pages/admin/EmailTemplateEditor"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const SubmissionBoard = lazy(() => import("./pages/admin/SubmissionBoard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));

function RootRedirect() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to the current language version
    setLocation(`/${language}`);
  }, [language, setLocation]);

  return null;
}

function Router() {
  return (
    <Switch>
      {/* Admin Routes - MUST come before language routes to avoid /:lang matching /admin */}
      <Route path="/admin/login">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLogin />
        </Suspense>
      </Route>

      <Route path="/admin/dashboard">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </Suspense>
      </Route>

      <Route path="/admin/submissions">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLayout>
            <AdminSubmissions />
          </AdminLayout>
        </Suspense>
      </Route>

      <Route path="/admin/board">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLayout>
            <SubmissionBoard />
          </AdminLayout>
        </Suspense>
      </Route>

      <Route path="/admin/activity">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLayout>
            <ActivityLog />
          </AdminLayout>
        </Suspense>
      </Route>

      <Route path="/admin/submissions/:id">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLayout>
            <SubmissionDetail />
          </AdminLayout>
        </Suspense>
      </Route>

      <Route path="/admin/invoices">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLayout>
            <Invoices />
          </AdminLayout>
        </Suspense>
      </Route>

      <Route path="/admin/invoices/new">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLayout>
            <InvoiceForm />
          </AdminLayout>
        </Suspense>
      </Route>

      <Route path="/admin/invoices/:id/edit">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLayout>
            <InvoiceForm />
          </AdminLayout>
        </Suspense>
      </Route>

      <Route path="/admin/settings">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLayout>
            <Settings />
          </AdminLayout>
        </Suspense>
      </Route>

      <Route path="/admin/users">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLayout>
            <AdminUsers />
          </AdminLayout>
        </Suspense>
      </Route>

      <Route path="/admin/emails/:key/:language">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLayout>
            <EmailTemplateEditor />
          </AdminLayout>
        </Suspense>
      </Route>

      <Route path="/admin/emails">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLayout>
            <EmailTemplates />
          </AdminLayout>
        </Suspense>
      </Route>

      <Route path="/admin">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLogin />
        </Suspense>
      </Route>

      {/* Root redirect */}
      <Route path="/" component={RootRedirect} />

      {/* Language-specific routes */}
      <Route path="/:lang" component={Home} />
      <Route path="/:lang/privacy-policy" component={PrivacyPolicy} />
      <Route path="/:lang/imprint" component={Imprint} />

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider switchable>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <ScrollToTop />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
