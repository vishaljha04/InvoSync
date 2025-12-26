import { useState, useEffect } from "react";
import { Sparkles, X,Loader2 } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

const CreateWithAIModal = ({ isOpen, onClose }) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please paste invoice details first");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.PARSE_INVOICE_TEXT,
        { text }
      );
      const invoiceData = response.data;

      toast.success("Invoice generated successfully ✨");

      // navigate to edit invoice
      onClose();
      navigate("/invoices/new", { state: { aiData: invoiceData } });
    } catch (error) {
      console.error(error);

      if (error.response?.status === 400) {
        toast.error("AI could not understand the invoice text");
      } else if (error.response?.status === 500) {
        toast.error("AI service is temporarily unavailable");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 🔹 Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 🔹 Modal */}
      <div
        className="relative w-[95%] sm:w-[500px] bg-white rounded-xl shadow-xl p-6
                      animate-scaleIn"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Create Invoice with AI
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4">
          Paste any text containing invoice details (client name, items,
          quantities, prices). Our AI will automatically create an invoice for
          you.
        </p>

        {/* Textarea */}
        <TextAreaField
          name="invoiceText"
          label="Paste Invoice Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Example:
Invoice for ClientCorp
2 hours of design work at $50/hour
Website maintenance - $100`}
          rows={8}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button varient="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} isLoading={isLoading}>
            {isLoading ? "Generating..." : "Generate Invoice"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateWithAIModal;
