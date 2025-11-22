import PDFDocument from "pdfkit";
import { Readable } from "stream";
import { format } from "date-fns";

interface InvoiceData {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    serviceDate?: string;
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    items: Array<{
        description: string;
        quantity: string;
        unitPrice: string;
        amount: string;
    }>;
    subtotal: string;
    taxRate: string;
    taxAmount: string;
    total: string;
    currency: string;
    notes?: string;
    termsAndConditions?: string;
}

interface CompanySettings {
    companyName: string;
    address: string;
    email: string;
    phone?: string;
    taxId?: string;
    vatId?: string;
    iban?: string;
    bic?: string;
    bankName?: string;
}

export async function generateInvoicePDF(
    invoice: InvoiceData,
    company: CompanySettings
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: "A4", margin: 50 });
            const buffers: Buffer[] = [];

            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
            doc.on("error", reject);

            // Header - Company Information
            doc
                .fontSize(20)
                .font("Helvetica-Bold")
                .text(company.companyName, 50, 50);

            doc
                .fontSize(10)
                .font("Helvetica")
                .text(company.address, 50, 80, { width: 250 });

            if (company.email) {
                doc.text(`Email: ${company.email}`, 50, doc.y + 5);
            }
            if (company.phone) {
                doc.text(`Phone: ${company.phone}`, 50, doc.y + 5);
            }
            if (company.taxId) {
                doc.text(`Steuernummer: ${company.taxId}`, 50, doc.y + 5);
            }
            if (company.vatId) {
                doc.text(`USt-IdNr: ${company.vatId}`, 50, doc.y + 5);
            }

            // Invoice Title and Number
            doc
                .fontSize(24)
                .font("Helvetica-Bold")
                .text("RECHNUNG", 50, 180);

            doc
                .fontSize(12)
                .font("Helvetica")
                .text(`Rechnungsnummer: ${invoice.invoiceNumber}`, 50, 215);

            // Client Information (Right side)
            doc
                .fontSize(10)
                .font("Helvetica-Bold")
                .text("Rechnungsempfänger:", 350, 180);

            doc
                .fontSize(10)
                .font("Helvetica")
                .text(invoice.clientName, 350, 195);

            doc.text(invoice.clientAddress, 350, doc.y + 5, { width: 200 });

            // Invoice Details
            const detailsY = 250;
            doc
                .fontSize(10)
                .font("Helvetica-Bold")
                .text("Rechnungsdatum:", 50, detailsY);
            doc
                .font("Helvetica")
                .text(format(new Date(invoice.issueDate), "dd.MM.yyyy"), 150, detailsY);

            doc
                .font("Helvetica-Bold")
                .text("Fälligkeitsdatum:", 50, detailsY + 15);
            doc
                .font("Helvetica")
                .text(format(new Date(invoice.dueDate), "dd.MM.yyyy"), 150, detailsY + 15);

            if (invoice.serviceDate) {
                doc
                    .font("Helvetica-Bold")
                    .text("Leistungsdatum:", 50, detailsY + 30);
                doc
                    .font("Helvetica")
                    .text(format(new Date(invoice.serviceDate), "dd.MM.yyyy"), 150, detailsY + 30);
            }

            // Items Table
            const tableTop = detailsY + 60;
            doc
                .fontSize(10)
                .font("Helvetica-Bold");

            // Table Headers
            doc.text("Beschreibung", 50, tableTop);
            doc.text("Menge", 300, tableTop, { width: 60, align: "right" });
            doc.text("Einzelpreis", 370, tableTop, { width: 80, align: "right" });
            doc.text("Betrag", 460, tableTop, { width: 90, align: "right" });

            // Table Line
            doc
                .strokeColor("#aaaaaa")
                .lineWidth(1)
                .moveTo(50, tableTop + 15)
                .lineTo(550, tableTop + 15)
                .stroke();

            // Table Rows
            let yPosition = tableTop + 25;
            doc.font("Helvetica");

            invoice.items.forEach((item) => {
                if (yPosition > 700) {
                    doc.addPage();
                    yPosition = 50;
                }

                doc.text(item.description, 50, yPosition, { width: 240 });
                doc.text(parseFloat(item.quantity).toFixed(2), 300, yPosition, {
                    width: 60,
                    align: "right",
                });
                doc.text(`€${parseFloat(item.unitPrice).toFixed(2)}`, 370, yPosition, {
                    width: 80,
                    align: "right",
                });
                doc.text(`€${parseFloat(item.amount).toFixed(2)}`, 460, yPosition, {
                    width: 90,
                    align: "right",
                });

                yPosition += 25;
            });

            // Totals
            yPosition += 10;
            doc
                .strokeColor("#aaaaaa")
                .lineWidth(1)
                .moveTo(350, yPosition)
                .lineTo(550, yPosition)
                .stroke();

            yPosition += 15;

            // Subtotal
            doc.font("Helvetica");
            doc.text("Zwischensumme:", 350, yPosition);
            doc.text(`€${parseFloat(invoice.subtotal).toFixed(2)}`, 460, yPosition, {
                width: 90,
                align: "right",
            });

            // Tax
            yPosition += 20;
            doc.text(`MwSt (${parseFloat(invoice.taxRate).toFixed(2)}%):`, 350, yPosition);
            doc.text(`€${parseFloat(invoice.taxAmount).toFixed(2)}`, 460, yPosition, {
                width: 90,
                align: "right",
            });

            // Total
            yPosition += 20;
            doc
                .strokeColor("#000000")
                .lineWidth(2)
                .moveTo(350, yPosition)
                .lineTo(550, yPosition)
                .stroke();

            yPosition += 15;
            doc.fontSize(12).font("Helvetica-Bold");
            doc.text("Gesamtbetrag:", 350, yPosition);
            doc.text(`€${parseFloat(invoice.total).toFixed(2)}`, 460, yPosition, {
                width: 90,
                align: "right",
            });

            // Bank Details
            if (company.iban || company.bic) {
                yPosition += 40;
                doc.fontSize(10).font("Helvetica-Bold");
                doc.text("Bankverbindung:", 50, yPosition);

                yPosition += 15;
                doc.font("Helvetica");

                if (company.bankName) {
                    doc.text(`Bank: ${company.bankName}`, 50, yPosition);
                    yPosition += 15;
                }
                if (company.iban) {
                    doc.text(`IBAN: ${company.iban}`, 50, yPosition);
                    yPosition += 15;
                }
                if (company.bic) {
                    doc.text(`BIC: ${company.bic}`, 50, yPosition);
                    yPosition += 15;
                }
            }

            // Notes
            if (invoice.notes) {
                yPosition += 20;
                doc.fontSize(10).font("Helvetica-Bold");
                doc.text("Hinweise:", 50, yPosition);
                yPosition += 15;
                doc.font("Helvetica");
                doc.text(invoice.notes, 50, yPosition, { width: 500 });
            }

            // Terms and Conditions
            if (invoice.termsAndConditions) {
                yPosition += 30;
                doc.fontSize(10).font("Helvetica-Bold");
                doc.text("Zahlungsbedingungen:", 50, yPosition);
                yPosition += 15;
                doc.fontSize(9).font("Helvetica");
                doc.text(invoice.termsAndConditions, 50, yPosition, { width: 500 });
            }

            // Footer
            doc.fontSize(8).font("Helvetica");
            doc.text(
                `${company.companyName} | ${company.email}`,
                50,
                750,
                { align: "center", width: 500 }
            );

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}
