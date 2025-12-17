import React, { useState, useEffect } from "react";
import { Loader2, Mail, Copy } from "lucide-react";
import Button from "../../components/ui/Button";
import TextAreaField from "../../components/ui/TextAreaField";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";

const RemainderModal = ({ isOpen, onClose, invoiceId }) => {
  const [remainderText, setRemainderText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && invoiceId) {
      generateRemainder();
    }
  }, [isOpen, invoiceId]);

  const generateRemainder = async () => {
    if (!invoiceId) return;
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_REMAINDER, {
        invoiceId,
      });
      setRemainderText(response.data.remainderText || "");
      toast.success("Remainder generated successfully ✨");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        toast.error("Invoice not found");
      } else if (error.response?.status === 400) {
        toast.error("Invoice ID is required");
      } else if (error.response?.status === 500) {
        toast.error("AI service temporarily unavailable");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!remainderText.trim()) {
      toast.error("Nothing to send!");
      return;
    }

    try {
      setIsLoading(true);
      // Implement actual send API if needed
      toast.success("Remainder email sent successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send remainder");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn">
      <div className="bg-white w-[90%] sm:w-[500px] rounded-lg shadow-lg overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            Generate Remainder
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-sm text-slate-600 mb-3">
            The AI will generate a friendly reminder email for the selected invoice. You can edit it before sending.
          </p>

          <TextAreaField
            name="remainderText"
            label="Remainder Email"
            value={remainderText}
            onChange={(e) => setRemainderText(e.target.value)}
            placeholder="Remainder email will appear here..."
            row={8}
          />

          {isLoading && (
            <div className="flex justify-center mt-2">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-slate-200">
          <Button varient="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCopy} isLoading={isLoading}>
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
          <Button onClick={handleSend} isLoading={isLoading}>
            Send Remainder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RemainderModal;
