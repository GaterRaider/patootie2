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
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSubmissions from "./pages/admin/Submissions";
import ActivityLog from "./pages/admin/ActivityLog";
import SubmissionDetail from "./pages/admin/SubmissionDetail";
import Invoices from "./pages/admin/Invoices";
import InvoiceForm from "./pages/admin/InvoiceForm";
import Settings from "./pages/admin/Settings";
import EmailTemplates from "./pages/admin/EmailTemplates";
import EmailTemplateEditor from "./pages/admin/EmailTemplateEditor";
import AdminLayout from "./components/AdminLayout";

import { useLanguage } from "./contexts/LanguageContext";
import { useLocation } from "wouter";
import { useEffect } from "react";

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
      {/* Root redirect */}
      <Route path="/" component={RootRedirect} />

      {/* Language-specific routes */}
      <Route path="/:lang" component={Home} />
      <Route path="/:lang/privacy-policy" component={PrivacyPolicy} />
      <Route path="/:lang/imprint" component={Imprint} />

      {/* Admin Routes (Keep unlocalized) */}
      <Route path="/admin/login" component={AdminLogin} />

      <Route path="/admin/dashboard">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>

      <Route path="/admin/submissions">
        <AdminLayout>
          <AdminSubmissions />
        </AdminLayout>
      </Route>

      <Route path="/admin/activity">
        <AdminLayout>
          <ActivityLog />
        </AdminLayout>
      </Route>

      <Route path="/admin/submissions/:id">
        <AdminLayout>
          <SubmissionDetail />
        </AdminLayout>
      </Route>

      <Route path="/admin/invoices">
        <AdminLayout>
          <Invoices />
        </AdminLayout>
      </Route>

      <Route path="/admin/invoices/new">
        <AdminLayout>
          <InvoiceForm />
        </AdminLayout>
      </Route>

      <Route path="/admin/invoices/:id/edit">
        <AdminLayout>
          <InvoiceForm />
        </AdminLayout>
      </Route>

      <Route path="/admin/settings">
        <AdminLayout>
          <Settings />
        </AdminLayout>
      </Route>

      <Route path="/admin/emails/:key/:language">
        <AdminLayout>
          <EmailTemplateEditor />
        </AdminLayout>
      </Route>

      <Route path="/admin/emails">
        <AdminLayout>
          <EmailTemplates />
        </AdminLayout>
      </Route>

      <Route path="/admin" component={() => <AdminLogin />} /> {/* Redirect /admin to login */}

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
