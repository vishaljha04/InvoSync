import React, { useState, useEffect } from "react";
import {
  Loader2,
  Mail,
  Copy,
  Send,
  FileText,
  Calendar,
  User,
  DollarSign,
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPath";
import toast from "react-hot-toast";

const TextAreaField = ({ icons: Icon, label, name, ...props }) => {
  return (
    <div>
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="w-5 h-5 text-slate-400" />
            </div>
          )}
          <textarea
            name={name}
            id={name}
            rows={3}
            {...props}
            className={`w-full min-h-[100px] pr-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              Icon ? "pl-10" : "pl-3"
            }`}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

const Button = ({
  varient = "primary",
  size = "medium",
  isLoading = false,
  children,
  icon: Icon,
  className = "",
  type = "button",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const varientClasses = {
    primary: "bg-blue-900 hover:bg-blue-800 active:bg-blue-900 text-white",
    secondary:
      "bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300",
    ghost:
      "bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700",
  };

  const sizeClasses = {
    small: "px-3 py-1 h-8 text-sm gap-1",
    medium: "px-4 py-2 h-10 text-sm gap-2",
    large: "px-6 py-3 h-12 text-base gap-3",
  };

  // Calculate icon size based on button size
  const iconSize = {
    small: "w-3.5 h-3.5",
    medium: "w-4 h-4",
    large: "w-5 h-5",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${varientClasses[varient]} ${sizeClasses[size]} ${className}`}
      disabled={isLoading || props.disabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2
            className={`${iconSize[size]} animate-spin`}
            aria-hidden="true"
          />
          {children && <span className="ml-2">{children}</span>}
        </>
      ) : (
        <>
          {Icon && <Icon className={iconSize[size]} aria-hidden="true" />}
          {children}
        </>
      )}
    </button>
  );
};

const RemainderModal = ({ isOpen, onClose, invoiceId }) => {
  const [remainderText, setRemainderText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  useEffect(() => {
    if (isOpen && invoiceId) {
      // Reset states when modal opens
      setRemainderText("");
      setInvoiceDetails(null);

      // Fetch invoice details and generate email
      fetchInvoiceAndGenerateEmail();
    }
  }, [isOpen, invoiceId]);

  const fetchInvoiceAndGenerateEmail = async () => {
    if (!invoiceId) return;

    try {
      setIsLoading(true);

      const response = await axiosInstance.get(
        API_PATHS.INVOICE.GET_ALL_INVOICE_BY_ID(invoiceId)
      );

      if (response.data) {
        setInvoiceDetails(response.data);
        generateFormalEmail(response.data);
        toast.success("Invoice loaded & email generated");
      } else {
        throw new Error("No invoice data received");
      }
    } catch (error) {
      console.error("Failed to fetch invoice:", error);

      // Show appropriate error message
      if (error.response?.status === 404) {
        toast.error("Invoice not found");
      } else if (error.response?.status === 401) {
        toast.error("Not authorized to view this invoice");
      } else {
        toast.error("Failed to load invoice");
      }

      createMinimalFallback();
    } finally {
      setIsLoading(false);
    }
  };

  const generateFormalEmail = (invoice) => {
    if (!invoice) return;

    const dueDate = new Date(invoice.dueDate);
    const formattedDate = dueDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const totalAmount = invoice.total?.toFixed(2) || "0.00";
    const clientName = invoice.billTo?.clientName || "Valued Client";
    const invoiceNumber = invoice.invoiceNumber || "N/A";
    const clientEmail = invoice.billTo?.clientEmail || "client@example.com";

    let itemsDescription = "";
    if (invoice.items && invoice.items.length > 0) {
      itemsDescription = invoice.items
        .map((item, index) => {
          const price = item.price?.toFixed(2) || "0.00";
          const quantity = item.quantity || 1;
          const description = item.description || `Item ${index + 1}`;
          return `• ${description}: $${price} × ${quantity} = $${(
            price * quantity
          ).toFixed(2)}`;
        })
        .join("\n");
    } else {
      itemsDescription = "• Services as per agreement";
    }

    const formalEmail = `TO: ${clientEmail}
SUBJECT: Payment Reminder - Invoice ${invoiceNumber}

Dear ${clientName},

I hope this message finds you well.

This is a formal reminder regarding Invoice #${invoiceNumber} amounting to $${totalAmount}, which was due on ${formattedDate}.

INVOICE DETAILS:
────────────────
Invoice Number: ${invoiceNumber}
Client: ${clientName}
Date Issued: ${new Date(invoice.invoiceDate || Date.now()).toLocaleDateString()}
Due Date: ${formattedDate}

ITEMS:
${itemsDescription}

TOTAL AMOUNT DUE: $${totalAmount}
────────────────

PAYMENT INSTRUCTIONS:
Please make the payment using one of the following methods:

1. Bank Transfer:
   • Account Name: [Your Company Name]
   • Account Number: [Your Account Number]
   • Bank: [Your Bank Name]
   • Reference: Invoice ${invoiceNumber}

2. Credit/Debit Card:
   • Pay online at: [Your Payment Link]

3. Check:
   • Payable to: [Your Company Name]
   • Mail to: [Your Address]

IMPORTANT NOTES:
• If you have already made the payment, please disregard this reminder.
• Late payments may be subject to additional charges as per our terms.
• For any queries or discrepancies, please contact our accounts department.

We value your business and appreciate your prompt attention to this matter.

Best regards,

[Your Name]
Accounts Department
[Your Company Name]
📞 [Your Phone Number]
📧 [Your Email Address]
📍 [Your Address]

────────────────
This is an automated reminder. Please do not reply to this email.
`;

    setRemainderText(formalEmail);
  };

  const createMinimalFallback = () => {
    const minimalEmail = `TO: client@example.com
SUBJECT: Invoice Payment Reminder

Dear Client,

This is a reminder regarding your outstanding invoice.

Please contact our accounts department for details.

Best regards,
Accounts Team`;

    setRemainderText(minimalEmail);
  };

  const handleSend = async () => {
    if (!remainderText.trim()) {
      toast.error("Nothing to send!");
      return;
    }

    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const clientName = invoiceDetails?.billTo?.clientName || "client";
      toast.success(`Reminder prepared for ${clientName}!`);

      // Here you would integrate with your email service
      // Example: await axiosInstance.post('/api/send-email', { invoiceId, emailText: remainderText });

      onClose();
    } catch (error) {
      console.error("Failed to send:", error);
      toast.error("Failed to send. You can copy and send manually.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!remainderText.trim()) {
      toast.error("Nothing to copy!");
      return;
    }
    navigator.clipboard.writeText(remainderText);
    toast.success("Copied to clipboard ✅");
  };

  const handleRegenerate = () => {
    if (invoiceDetails) {
      generateFormalEmail(invoiceDetails);
      toast.info("Email regenerated");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2">
      <div className="bg-white w-full max-w-[95%] xs:max-w-[400px] sm:max-w-[500px] rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-start p-3 sm:p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-start gap-2 min-w-0">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                Create Reminder
              </h3>
              {invoiceDetails && (
                <p className="text-xs sm:text-sm text-slate-600 truncate">
                  Invoice #{invoiceDetails.invoiceNumber}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-xl sm:text-2xl font-bold hover:bg-slate-100 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0 ml-2"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-2 sm:p-3 rounded-lg border border-slate-200">
              Formal reminder email generated from invoice details. Edit as
              needed.
            </p>
          </div>

          {invoiceDetails && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    {invoiceDetails.billTo?.clientName || "Client"}
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    ${invoiceDetails.total?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    #{invoiceDetails.invoiceNumber}
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    {new Date(invoiceDetails.dueDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          <TextAreaField
            name="remainderText"
            label="Reminder Email"
            value={remainderText}
            onChange={(e) => setRemainderText(e.target.value)}
            placeholder={
              isLoading
                ? "Loading invoice details..."
                : "Email will appear here..."
            }
            rows={8}
            className="font-mono text-xs sm:text-sm min-h-[180px]"
            disabled={isLoading}
          />

          {isLoading && (
            <div className="flex flex-col items-center justify-center mt-3 sm:mt-4 py-3 sm:py-4">
              <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500 animate-spin mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm text-slate-600">
                Fetching invoice details...
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-3 sm:p-4 bg-slate-50">
          <div className="sm:hidden space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                varient="ghost"
                onClick={onClose}
                size="small"
                className="w-full text-xs"
              >
                Cancel
              </Button>
              <Button
                varient="secondary"
                onClick={handleCopy}
                disabled={!remainderText || isLoading}
                icon={Copy}
                size="small"
                className="w-full text-xs"
              >
                Copy
              </Button>
            </div>

            {remainderText && !isLoading && (
              <Button
                varient="secondary"
                onClick={handleRegenerate}
                size="small"
                className="w-full text-xs"
              >
                Regenerate Email
              </Button>
            )}

            <Button
              onClick={handleSend}
              isLoading={isLoading}
              disabled={!remainderText || isLoading}
              icon={Send}
              size="small"
              className="w-full text-xs bg-blue-600 hover:bg-blue-700"
            >
              Send Email
            </Button>
          </div>

          <div className="hidden sm:flex flex-col sm:flex-row gap-2">
            <div className="flex flex-wrap gap-2 flex-1">
              <Button
                varient="ghost"
                onClick={onClose}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                varient="secondary"
                onClick={handleCopy}
                disabled={!remainderText || isLoading}
                icon={Copy}
                className="flex-1 sm:flex-none"
              >
                Copy Text
              </Button>
              {remainderText && !isLoading && (
                <Button
                  varient="secondary"
                  onClick={handleRegenerate}
                  className="flex-1 sm:flex-none"
                >
                  Regenerate
                </Button>
              )}
            </div>
            <Button
              onClick={handleSend}
              isLoading={isLoading}
              disabled={!remainderText || isLoading}
              icon={Send}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
            >
              Send Email
            </Button>
          </div>

          <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-slate-500 text-center">
            <p>Email will be sent to client's registered email address</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemainderModal;
