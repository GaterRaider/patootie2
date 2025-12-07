# Phase 2 - Remaining Pages to Update

## ✅ Completed (2/16)
1. Dashboard.tsx ✅
2. Submissions.tsx ✅

## 🔄 High Priority (Do Next - 5 pages)
3. Invoices.tsx - Invoice management
4. SiteSettings.tsx - Settings page
5. ActivityLog.tsx - Activity tracking
6. SubmissionDetail.tsx - Individual submission view
7. InvoiceForm.tsx - Invoice creation/editing

## 📋 Medium Priority (6 pages)
8. SubmissionBoard.tsx - Kanban board
9. EmailTemplates.tsx - Email management
10. EmailTemplateEditor.tsx - Template editing
11. FAQManager.tsx - FAQ management
12. AdminUsers.tsx - User management
13. CompanySettings.tsx - Company settings

## 🔽 Lower Priority (3 pages)
14. ClientUsers.tsx - Client listing
15. ClientUserDetail.tsx - Client details
16. Login.tsx - Login page (special case - maybe skip animation)

---

## Pattern to Apply

For each page:
1. Add import: `import { PageTransition } from "@/components/motion";`
2. Wrap return with `<PageTransition>` instead of `<>`
3. Close with `</PageTransition>` instead of `</>`

**Time per page**: ~1 minute
**Total remaining**: ~14 minutes

---

**Current Status**: 2/16 complete (12.5%)
**Next**: Invoices, Settings, ActivityLog
