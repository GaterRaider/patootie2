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

// Lazy load admin bundles to reduce initial bundle size
// Login page is separate, admin app loads all pages at once after login
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminApp = lazy(() => import("./AdminApp"));

function RootRedirect() {
  const { language, isInitialized } = useLanguage();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to the current language version only after initialization
    if (isInitialized) {
      setLocation(`/${language}`);
    }
  }, [language, setLocation, isInitialized]);

  // Optional: Show a loading spinner while determining language
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen"></div>;
  }

  return null;
}

function Router() {
  return (
    <Switch>
      {/* Admin Routes - MUST come before language routes to avoid /:lang matching /admin */}

      {/* Login page - separate bundle */}
      <Route path="/admin/login">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLogin />
        </Suspense>
      </Route>

      {/* All other admin routes - single bundle loaded after login */}
      {/* All other admin routes - single bundle loaded after login */}
      <Route path="/admin" nest>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminApp />
        </Suspense>
      </Route>

      {/* Match /admin and /admin/ - redirect to login */}
      <Route path="/admin">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLogin />
        </Suspense>
      </Route>

      {/* Root redirect */}
      <Route path="/" component={RootRedirect} />

      {/* Language-specific routes - STRICT MATCHING to avoid capturing admin routes */}
      {/* Matches /en, /ko, /de */}
      <Route path={/^\/(en|ko|de)\/?$/} component={Home} />

      {/* Matches /en/privacy-policy, etc */}
      <Route path={/^\/(en|ko|de)\/privacy-policy\/?$/} component={PrivacyPolicy} />

      {/* Matches /en/imprint, etc */}
      <Route path={/^\/(en|ko|de)\/imprint\/?$/} component={Imprint} />

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
