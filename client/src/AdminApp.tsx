import { Route, Switch } from "wouter";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSubmissions from "./pages/admin/Submissions";
import SubmissionDetail from "./pages/admin/SubmissionDetail";
import SubmissionBoard from "./pages/admin/SubmissionBoard";
import ActivityLog from "./pages/admin/ActivityLog";
import Invoices from "./pages/admin/Invoices";
import InvoiceForm from "./pages/admin/InvoiceForm";
import SiteSettings from "./pages/admin/SiteSettings";
import CompanySettings from "./pages/admin/CompanySettings";
import EmailTemplates from "./pages/admin/EmailTemplates";
import EmailTemplateEditor from "./pages/admin/EmailTemplateEditor";
import AdminUsers from "./pages/admin/AdminUsers";
import FAQManager from "./pages/admin/FAQManager";

/**
 * Admin application router
 * All admin components are eagerly imported to eliminate loading screens
 * when navigating within the admin area.
 */
export default function AdminApp() {
    return (
        <Switch>
            <Route path="/admin/dashboard">
                <AdminLayout>
                    <AdminDashboard />
                </AdminLayout>
            </Route>

            <Route path="/admin/submissions/:id">
                <AdminLayout>
                    <SubmissionDetail />
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

            <Route path="/admin/invoices">
                <AdminLayout>
                    <Invoices />
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

            <Route path="/admin/faq">
                <AdminLayout>
                    <FAQManager />
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

            {/* Fallback - redirect to dashboard */}
            <Route path="/admin">
                <AdminLayout>
                    <AdminDashboard />
                </AdminLayout>
            </Route>
        </Switch>
    );
}
