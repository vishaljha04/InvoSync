import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-md text-slate-400
             hover:text-slate-600 hover:bg-slate-100
             focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2
             transition-colors duration-200"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4">
          Paste any text containing invoice details (client name, items,
          quantities, prices). Our AI will automatically create an invoice for
          you.
        </p>

        {/* Textarea */}
        <div className="flex flex-col w-full">
          <label
            htmlFor="invoiceText"
            className="mb-2 text-sm font-medium text-gray-700"
          >
            Paste Invoice Text
          </label>
          <textarea
            id="invoiceText"
            name="invoiceText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Example:
Invoice for ClientCorp
2 hours of design work at $50/hour
Website maintenance - $100`}
            rows={8}
            className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg
               focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-500
               resize-none placeholder-gray-400"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          {/* Cancel – Secondary */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex items-center justify-center font-medium rounded-lg
             transition-colors duration-200
             focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2
             bg-white hover:bg-slate-50 active:bg-slate-100
             text-slate-700 border border-slate-200 hover:border-slate-300
             px-4 py-2 h-10 text-sm
             disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          {/* Generate Invoice – Primary with loading */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            aria-busy={isLoading}
            className="inline-flex items-center justify-center font-medium rounded-lg
             transition-colors duration-200
             focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2
             bg-blue-900 hover:bg-blue-800 active:bg-blue-900
             text-white
             px-4 py-2 h-10 text-sm gap-2
             disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && (
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}

            {isLoading ? "Generating..." : "Generate Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWithAIModal;
