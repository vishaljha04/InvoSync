import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPath";
import {
  ArrowLeft,
  FileText,
  Download,
  Edit,
  DollarSign,
  Calendar,
  Mail,
  MapPin,
  Phone,
  User,
  Loader2,
} from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICE_BY_ID(id)
        );
        setInvoice(response.data);
      } catch (error) {
        toast.error("Failed to load invoice details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleStatusToggle = async () => {
    if (!invoice) return;
    const nextStatus = invoice.status === "Paid" ? "Unpaid" : "Paid";
    setStatusLoading(true);

    try {
      const response = await axiosInstance.put(
        API_PATHS.INVOICE.UPDATE_INVOICE(id),
        {
          ...invoice,
          status: nextStatus,
        }
      );
      setInvoice(response.data);
      toast.success(`Invoice marked ${nextStatus}`);
    } catch (error) {
      toast.error("Failed to update invoice status.");
      console.error(error);
    } finally {
      setStatusLoading(false);
    }
  };

  const downloadInvoicePdf = () => {
    if (!invoice) return;
    setDownloadLoading(true);

    const theme = {
      classic: {
        header: "#1d4ed8",
        accent: "#2563eb",
        text: "#0f172a",
      },
      modern: {
        header: "#111827",
        accent: "#f59e0b",
        text: "#111827",
      },
      minimal: {
        header: "#334155",
        accent: "#64748b",
        text: "#0f172a",
      },
    };

    const selectedTheme = theme[invoice.template] || theme.classic;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const left = 40;
    let y = 60;

    doc.setFillColor(selectedTheme.header);
    doc.rect(0, 0, 595, 70, "F");
    doc.setTextColor("#ffffff");
    doc.setFontSize(22);
    doc.text("Invoice", left, 46);
    doc.setFontSize(10);
    doc.text(
      invoice.template.charAt(0).toUpperCase() + invoice.template.slice(1),
      left,
      63
    );

    doc.setTextColor(selectedTheme.text);
    doc.setFontSize(14);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, left, y + 60);
    doc.setFontSize(10);
    doc.text(`Date: ${moment(invoice.invoiceDate).format("MMM D, YYYY")}`, left, y + 78);
    doc.text(`Due: ${moment(invoice.dueDate).format("MMM D, YYYY")}`, left, y + 96);
    doc.text(`Status: ${invoice.status || "Pending"}`, left, y + 114);

    const rightColumn = 320;
    doc.setFontSize(10);
    doc.setTextColor(selectedTheme.accent);
    doc.text("Bill From", rightColumn, y + 60);
    doc.setTextColor(selectedTheme.text);
    doc.text(invoice.billFrom.businessName || "", rightColumn, y + 78);
    doc.text(invoice.billFrom.email || "", rightColumn, y + 96);
    doc.text(invoice.billFrom.phone || "", rightColumn, y + 114);
    doc.text(invoice.billFrom.address || "", rightColumn, y + 132);

    y += 160;
    doc.setDrawColor(selectedTheme.accent);
    doc.setLineWidth(1);
    doc.line(left, y, 555, y);
    y += 20;

    doc.setTextColor(selectedTheme.accent);
    doc.setFontSize(12);
    doc.text("Bill To", left, y);
    doc.setTextColor(selectedTheme.text);
    doc.setFontSize(10);
    y += 18;
    doc.text(invoice.billTo.clientName || "", left, y);
    doc.text(invoice.billTo.email || "", left, y + 16);
    doc.text(invoice.billTo.phone || "", left, y + 32);
    doc.text(invoice.billTo.address || "", left, y + 48);

    y += 80;
    doc.setFontSize(11);
    doc.setTextColor(selectedTheme.text);
    doc.text("Description", left, y);
    doc.text("Qty", 340, y);
    doc.text("Price", 390, y);
    doc.text("Tax", 450, y);
    doc.text("Line Total", 520, y);
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(left, y, 555, y);
    y += 18;

    invoice.items.forEach((item) => {
      const lineTotal =
        (item.quantity || 0) * (item.unitPrice || 0) *
        (1 + (item.taxPercent || 0) / 100);
      doc.text(item.name || "", left, y);
      doc.text(`${item.quantity}`, 340, y);
      doc.text(`$${Number(item.unitPrice || 0).toFixed(2)}`, 390, y);
      doc.text(`${item.taxPercent || 0}%`, 450, y);
      doc.text(`$${Number(lineTotal).toFixed(2)}`, 520, y);
      y += 18;
    });

    y += 10;
    doc.line(left, y, 555, y);
    y += 20;
    doc.setFontSize(11);
    doc.text("Subtotal", 420, y);
    doc.text(`$${Number(invoice.subTotal || 0).toFixed(2)}`, 520, y);
    y += 18;
    doc.text("Tax", 420, y);
    doc.text(`$${Number(invoice.taxTotal || 0).toFixed(2)}`, 520, y);
    y += 18;
    doc.setFontSize(13);
    doc.text("Total", 420, y);
    doc.text(`$${Number(invoice.total || 0).toFixed(2)}`, 520, y);

    if (invoice.notes) {
      y += 32;
      doc.setFontSize(11);
      doc.setTextColor(selectedTheme.accent);
      doc.text("Notes", left, y);
      y += 18;
      doc.setTextColor(selectedTheme.text);
      const notes = doc.splitTextToSize(invoice.notes, 500);
      doc.text(notes, left, y);
    }

    doc.save(`${invoice.invoiceNumber || "invoice"}.pdf`);
    setDownloadLoading(false);
  };

  const templateLabel = useMemo(() => {
    if (!invoice) return "";
    return invoice.template
      ? invoice.template.charAt(0).toUpperCase() + invoice.template.slice(1)
      : "Classic";
  }, [invoice]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-slate-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-700">
        <p>Unable to display invoice details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadInvoicePdf}
            disabled={downloadLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm text-white transition hover:bg-blue-800 disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            {downloadLoading ? "Preparing PDF..." : "Download PDF"}
          </button>
          <button
            type="button"
            onClick={() =>
              navigate("/invoices/new", { state: { existingInvoice: invoice } })
            }
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Edit className="w-4 h-4" /> Edit Invoice
          </button>
          <button
            type="button"
            onClick={handleStatusToggle}
            disabled={statusLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white transition hover:bg-emerald-500 disabled:opacity-60"
          >
            <DollarSign className="w-4 h-4" />
            {statusLoading ? "Saving..." : invoice.status === "Paid" ? "Mark Unpaid" : "Mark Paid"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {templateLabel} Template
              </p>
              <h1 className="mt-3 text-2xl font-semibold text-slate-900">
                {invoice.invoiceNumber}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {invoice.billTo.clientName}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-4 py-3 text-right">
              <p className="text-xs uppercase text-slate-500">Status</p>
              <p
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                  invoice.status === "Paid"
                    ? "bg-emerald-100 text-emerald-800"
                    : invoice.status === "Pending"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {invoice.status || "Pending"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Bill From</p>
              <p className="mt-3 text-sm font-medium text-slate-900">
                {invoice.billFrom.businessName}
              </p>
              <p className="text-sm text-slate-600">{invoice.billFrom.email}</p>
              <p className="text-sm text-slate-600">{invoice.billFrom.phone}</p>
              <p className="mt-2 text-sm text-slate-600">{invoice.billFrom.address}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Bill To</p>
              <p className="mt-3 text-sm font-medium text-slate-900">
                {invoice.billTo.clientName}
              </p>
              <p className="text-sm text-slate-600">{invoice.billTo.email}</p>
              <p className="text-sm text-slate-600">{invoice.billTo.phone}</p>
              <p className="mt-2 text-sm text-slate-600">{invoice.billTo.address}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Invoice Date</p>
              <p className="mt-2 text-sm text-slate-900">
                {moment(invoice.invoiceDate).format("MMM D, YYYY")}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Due Date</p>
              <p className="mt-2 text-sm text-slate-900">
                {moment(invoice.dueDate).format("MMM D, YYYY")}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Terms</p>
              <p className="mt-2 text-sm text-slate-900">
                {invoice.paymentTerms}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Tax
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {invoice.items.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-4 text-sm text-slate-900">
                      {item.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-right text-slate-900">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-4 text-sm text-right text-slate-900">
                      ${Number(item.unitPrice || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right text-slate-900">
                      {Number(item.taxPercent || 0).toFixed(0)}%
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-right text-slate-900">
                      ${Number(item.total || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Notes</p>
              <p className="mt-3 text-sm text-slate-600 whitespace-pre-line">
                {invoice.notes || "No additional notes."}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>${Number(invoice.subTotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600 mt-3">
                <span>Tax</span>
                <span>${Number(invoice.taxTotal || 0).toFixed(2)}</span>
              </div>
              <div className="mt-4 border-t border-slate-200 pt-4 text-xl font-semibold text-slate-900 flex items-center justify-between">
                <span>Total</span>
                <span>${Number(invoice.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Template</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{templateLabel}</p>
            <p className="mt-2 text-sm text-slate-600">A clean invoice design saved with this document.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <FileText className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Client Information</p>
                <p className="mt-3 text-sm font-medium text-slate-900">{invoice.billTo.clientName}</p>
                <p className="text-sm text-slate-600">{invoice.billTo.email}</p>
                <p className="text-sm text-slate-600">{invoice.billTo.phone}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              <span>{moment(invoice.invoiceDate).format("MMM D, YYYY")}</span>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
              <Mail className="w-4 h-4" />
              <span>{invoice.billTo.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
              <Phone className="w-4 h-4" />
              <span>{invoice.billTo.phone}</span>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
              <MapPin className="w-4 h-4" />
              <span>{invoice.billTo.address}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default InvoiceDetail;

