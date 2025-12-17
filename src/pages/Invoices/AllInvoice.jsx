import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import {
  Loader2,
  Trash2,
  Edit,
  Search,
  FileText,
  Plus,
  AlertCircle,
  Sparkles,
  Mail,
  Loader,
} from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import RemainderModal from "../../components/ui/RemainderModal";
import CreateWithAIModal from "../../components/ui/CreateWithAIModal";

const AllInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isRemainderModalOpen, setIsRemainderModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [invoiceId, setInvoiceId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );
        setInvoices(
          response.data.sort(
            (a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)
          )
        );
      } catch (error) {
        setError("Failed to fetch invoices.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handleStatusChange = async (invoice) => {
    const prevInvoice = invoice;
    const newStatus = invoice.status === "Paid" ? "Unpaid" : "Paid";
    const optimisticInvoice = { ...invoice, status: newStatus };

    setInvoices((prev) =>
      prev.map((inv) => (inv._id === invoice._id ? optimisticInvoice : inv))
    );

    setStatusChangeLoading(invoice._id);

    try {
      const response = await axiosInstance.put(
        API_PATHS.INVOICE.UPDATE_INVOICE(invoice._id),
        optimisticInvoice
      );

      setInvoices((prev) =>
        prev.map((inv) => (inv._id === invoice._id ? response.data : inv))
      );
    } catch (error) {
      setInvoices((prev) =>
        prev.map((inv) => (inv._id === invoice._id ? prevInvoice : inv))
      );

      console.error("Update failed:", error.response?.data || error);
      setError("Failed to update invoice status");
    } finally {
      setStatusChangeLoading(null);
    }
  };

  const handleOpenReminderModal = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsRemainderModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      // console.log("Deleting invoice id:", id);
      await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));
      setInvoices(invoices.filter((invoice) => invoice._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete invoice");
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesStatus =
        statusFilter === "All" || invoice.status === statusFilter;

      const matchesSearch =
        invoice.invoiceNumber
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.billTo?.clientName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [invoices, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full  animate-spin h-96 text-blue-600">
        <Loader2 className="h-8 w-8 " />
      </div>
    );
  }

  return (
    <div>
      <CreateWithAIModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(!isAiModalOpen)}
      />
      <RemainderModal
        isOpen={isRemainderModalOpen}
        onClose={() => setIsRemainderModalOpen(!isRemainderModalOpen)}
        invoiceId={selectedInvoiceId}
      />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="w-full sm:w-auto">
          <h1 className="text-lg xs:text-xl sm:text-2xl font-semibold text-slate-900">
            All Invoices
          </h1>
          <p className="text-xs xs:text-sm text-slate-600 mt-0.5 xs:mt-1">
            Manage all your invoices in one place.
          </p>
        </div>
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 w-full sm:w-auto ">
          <Button
            varient="secondary"
            onClick={() => setIsAiModalOpen(true)}
            icon={Sparkles}
            className="w-full xs:w-auto justify-center text-xs xs:text-sm"
            size="small"
          >
            <span className="hidden xs:inline">Create with AI</span>
            <span className="xs:hidden">AI Create</span>
          </Button>
          <Button
            onClick={() => navigate("/invoices/new")}
            icon={Plus}
            className="w-full xs:w-auto justify-center text-xs xs:text-sm"
            size="small"
          >
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 sm:p-4 rounded-lg bg-red-50 border border-red-200 mb-4 sm:mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-4 h-4 xs:w-5 xs:h-5 text-red-600 mt-0.5 mr-2 xs:mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xs xs:text-sm font-medium text-red-800 mb-1">
                Error
              </h3>
              <p className="text-xs xs:text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {/* Filters Section */}
        <div className="p-3 xs:p-4 sm:p-6 border-b border-slate-200">
          <div className="flex flex-col xs:flex-row gap-3 xs:gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-2 xs:pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 xs:w-5 xs:h-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search invoices..."
                className="w-full h-9 xs:h-10 pl-7 xs:pl-10 pr-3 xs:pr-4 py-1.5 xs:py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs xs:text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0">
              <select
                className="w-full xs:w-auto h-9 xs:h-10 px-2 xs:px-3 py-1.5 xs:py-2 border border-slate-200 rounded-lg bg-white text-xs xs:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filterInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 xs:py-8 sm:py-12 text-center px-3 xs:px-4">
            <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 xs:mb-4">
              <FileText className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-slate-400" />
            </div>
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-slate-900 mb-1 xs:mb-2">
              No invoices found
            </h3>
            <p className="text-xs xs:text-sm text-slate-500 mb-4 xs:mb-6 max-w-xs">
              Your search or filter criteria did not match any invoices.
            </p>
            {invoices.length === 0 && (
              <Button
                onClick={() => navigate("/invoices/new")}
                icon={Plus}
                className="w-full sm:w-auto text-xs xs:text-sm"
                size="small"
              >
                Create First Invoice
              </Button>
            )}
          </div>
        ) : (
          /* Invoices Table - Card Layout for Mobile */
          <div className="block sm:hidden">
            {/* Mobile Card View */}
            {filterInvoices.map((invoice) => (
              <div
                key={invoice._id}
                className="p-3 xs:p-4 border-b border-slate-200 hover:bg-slate-50"
                onClick={() => navigate(`/invoices/${invoice._id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">
                        {invoice.invoiceNumber}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : invoice.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 truncate">
                      {invoice.billTo.clientName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      ${invoice.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {moment(invoice.dueDate).format("MMM D")}
                    </p>
                  </div>
                </div>

                {/* Action Buttons for Mobile */}
                <div
                  className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="small"
                    onClick={() => handleStatusChange(invoice)}
                    isLoading={statusChangeLoading === invoice._id}
                    className="text-xs"
                    title={
                      invoice.status === "Paid" ? "Mark Unpaid" : "Mark Paid"
                    }
                  >
                    {invoice.status === "Paid" ? "Unpaid" : "Mark Paid"}
                  </Button>

                  <Button
                    size="small"
                    varient="ghost"
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    size="small"
                    varient="ghost"
                    onClick={() => handleDelete(invoice._id)}
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </Button>

                  {invoice.status !== "Paid" && (
                    <Button
                      size="small"
                      varient="ghost"
                      onClick={() => handleOpenReminderModal(invoice._id)}
                      title="Send Reminder"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop Table View (hidden on mobile) */}
        {filterInvoices.length > 0 && (
          <div className="hidden sm:block overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Invoice #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filterInvoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-slate-50">
                      <td
                        onClick={() => navigate(`/invoices/${invoice._id}`)}
                        className="px-4 py-4 text-sm font-medium text-slate-900 cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap"
                      >
                        {invoice.invoiceNumber}
                      </td>
                      <td
                        onClick={() => navigate(`/invoices/${invoice._id}`)}
                        className="px-4 py-4 text-sm font-medium text-slate-900 cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap"
                      >
                        <div className="max-w-[180px] truncate">
                          {invoice.billTo.clientName}
                        </div>
                      </td>
                      <td
                        onClick={() => navigate(`/invoices/${invoice._id}`)}
                        className="px-4 py-4 text-sm font-medium text-slate-900 cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap"
                      >
                        ${invoice.total.toFixed(2)}
                      </td>
                      <td
                        onClick={() => navigate(`/invoices/${invoice._id}`)}
                        className="px-4 py-4 text-sm font-medium text-slate-900 cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap"
                      >
                        {moment(invoice.dueDate).format("MMM D, YYYY")}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                            invoice.status === "Paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : invoice.status === "Pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            size="small"
                            onClick={() => handleStatusChange(invoice)}
                            isLoading={statusChangeLoading === invoice._id}
                          >
                            {invoice.status === "Paid"
                              ? "Mark Unpaid"
                              : "Mark Paid"}
                          </Button>
                          <Button
                            size="small"
                            varient="ghost"
                            onClick={() => navigate(`/invoices/${invoice._id}`)}
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="small"
                            varient="ghost"
                            onClick={() => handleDelete(invoice._id)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                          {invoice.status !== "Paid" && (
                            <Button
                              size="small"
                              varient="ghost"
                              onClick={() =>
                                handleOpenReminderModal(invoice._id)
                              }
                              title="Send Reminder"
                            >
                              <Mail className="w-4 h-4 text-blue-500" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllInvoice;
