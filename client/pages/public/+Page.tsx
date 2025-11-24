import { Route, Switch } from "wouter";
import { ThemeProvider } from "../../src/contexts/ThemeContext";
import { LanguageProvider } from "../../src/contexts/LanguageContext";
import { TooltipProvider } from "../../src/components/ui/tooltip";
import { Toaster } from "../../src/components/ui/sonner";
import ErrorBoundary from "../../src/components/ErrorBoundary";
import ScrollToTop from "../../src/components/ScrollToTop";
import Home from "../../src/pages/Home";
import PrivacyPolicy from "../../src/pages/PrivacyPolicy";
import Imprint from "../../src/pages/Imprint";
import NotFound from "../../src/pages/NotFound";

// No HelmetProvider here - it's in the renderer
export default function PublicApp() {
    return (
        <ErrorBoundary>
            <ThemeProvider switchable>
                <LanguageProvider>
                    <TooltipProvider>
                        <Toaster />
                        <ScrollToTop />
                        <Switch>
                            <Route path="/" component={Home} />
                            <Route path="/privacy-policy" component={PrivacyPolicy} />
                            <Route path="/imprint" component={Imprint} />
                            <Route component={NotFound} />
                        </Switch>
                    </TooltipProvider>
                </LanguageProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
