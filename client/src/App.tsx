import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router as WouterRouter } from "wouter";
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
import ClientOnly from "./components/ClientOnly";

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
    return <div className="flex items-center justify-center min-h-screen pointer-events-none"></div>;
  }

  return null;
}

function AppRoutes() {
  return (
    <Switch>
      {/* ... routes ... */}
      <Route path="/admin/login">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLogin />
        </Suspense>
      </Route>

      <Route path="/admin" nest>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminApp />
        </Suspense>
      </Route>

      <Route path="/admin">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminLogin />
        </Suspense>
      </Route>

      <Route path="/" component={RootRedirect} />

      <Route path="/en" component={Home} />
      <Route path="/ko" component={Home} />
      <Route path="/de" component={Home} />
      <Route path="/en/" component={Home} />
      <Route path="/ko/" component={Home} />
      <Route path="/de/" component={Home} />

      <Route path={/^\/(en|ko|de)\/privacy-policy\/?$/} component={PrivacyPolicy} />
      <Route path={/^\/(en|ko|de)\/imprint\/?$/} component={Imprint} />

      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

interface AppProps {
  initialLanguage?: import("./i18n/translations").Language;
  locationHook?: any;
}

function App({ initialLanguage, locationHook }: AppProps) {
  return (
    <WouterRouter hook={locationHook}>
      <ErrorBoundary>
        <ThemeProvider switchable>
          <LanguageProvider initialLanguage={initialLanguage}>
            <TooltipProvider>
              <ClientOnly>
                <Toaster />
                <ScrollToTop />
              </ClientOnly>
              <AppRoutes />
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </WouterRouter>
  );
}

export default App;
