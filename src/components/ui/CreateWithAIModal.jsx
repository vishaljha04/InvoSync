import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import Button from "./Button";
import TextAreaField from "./TextAreaField";
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
