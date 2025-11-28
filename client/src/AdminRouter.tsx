import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ScrollToTop from "./components/ScrollToTop";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSubmissions from "./pages/admin/Submissions";
import SubmissionBoard from "./pages/admin/SubmissionBoard";
import ActivityLog from "./pages/admin/ActivityLog";
import SubmissionDetail from "./pages/admin/SubmissionDetail";
import Invoices from "./pages/admin/Invoices";
import InvoiceForm from "./pages/admin/InvoiceForm";
import SiteSettings from "./pages/admin/SiteSettings";
import CompanySettings from "./pages/admin/CompanySettings";
import EmailTemplates from "./pages/admin/EmailTemplates";
import EmailTemplateEditor from "./pages/admin/EmailTemplateEditor";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLayout from "./components/AdminLayout";

function AdminRouter() {
    return (
        <ErrorBoundary>
            <ThemeProvider switchable>
                <LanguageProvider>
                    <TooltipProvider>
                        <Toaster />
                        <ScrollToTop />
                        <Switch>
                            {/* Admin Routes ONLY - no public routes */}
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

                            <Route path="/admin/board">
                                <AdminLayout>
                                    <SubmissionBoard />
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
                                    <SiteSettings />
                                </AdminLayout>
                            </Route>

                            <Route path="/admin/company-settings">
                                <AdminLayout>
                                    <CompanySettings />
                                </AdminLayout>
                            </Route>

                            <Route path="/admin/users">
                                <AdminLayout>
                                    <AdminUsers />
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

                            <Route path="/admin" component={() => <AdminLogin />} />

                            {/* 404 for unknown admin routes */}
                            <Route component={NotFound} />
                        </Switch>
                    </TooltipProvider>
                </LanguageProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default AdminRouter;
