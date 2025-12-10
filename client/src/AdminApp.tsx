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
import ClientUsers from "./pages/admin/ClientUsers";
import ClientUserDetail from "./pages/admin/ClientUserDetail";
import CreateSubmissionPage from "./pages/admin/CreateSubmissionPage";

/**
 * Admin application router
 * All admin components are eagerly imported to eliminate loading screens
 */
export default function AdminApp() {
    return (
        <AdminLayout>
            <Switch>
                <Route path="/dashboard" component={AdminDashboard} />
                <Route path="/submissions/create" component={CreateSubmissionPage} />
                <Route path="/submissions/:id" component={SubmissionDetail} />
                <Route path="/submissions" component={AdminSubmissions} />
                <Route path="/board" component={SubmissionBoard} />
                <Route path="/activity" component={ActivityLog} />
                <Route path="/invoices/new" component={InvoiceForm} />
                <Route path="/invoices/:id/edit" component={InvoiceForm} />
                <Route path="/invoices" component={Invoices} />
                <Route path="/settings" component={SiteSettings} />
                <Route path="/company-settings" component={CompanySettings} />
                <Route path="/users" component={AdminUsers} />
                <Route path="/clients/:id" component={ClientUserDetail} />
                <Route path="/clients" component={ClientUsers} />
                <Route path="/faq" component={FAQManager} />
                <Route path="/emails/:key/:language" component={EmailTemplateEditor} />
                <Route path="/emails" component={EmailTemplates} />


                {/* Fallback - redirect to dashboard */}
                <Route path="/" component={AdminDashboard} />
            </Switch>
        </AdminLayout>
    );
}
