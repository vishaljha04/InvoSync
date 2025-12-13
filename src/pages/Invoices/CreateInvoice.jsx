import { useState, useEffect } from "react";
import { useNavigate, useLocation, Form } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/ui/InputField";
import TextAreaField from "../../components/ui/TextAreaField";
import Button from "../../components/ui/Button";
import SelectField from "../../components/ui/SelectField";

const CreateInvoice = ({ existingInvoice, onSave }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [FormData, setFormData] = useState(
    existingInvoice || {
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      billFrom: {
        businessName: user?.businessName || "",
        email: user?.email || "",
        address: user?.address || "",
        phone: user?.phone || "",
      },
      billTo: {
        clientName: "",
        email: "",
        address: "",
        phone: "",
      },
      items: [
        {
          name: "",
          quantity: 1,
          unitPrice: 0,
          taxPercent: 0,
        },
      ],
      notes: "",
      paymentTerms: "Net 15",
    }
  );

  const [loading, setLoading] = useState(false);
  const [isGeneratingNumber, setisGeneratingNumber] = useState(
    !existingInvoice
  );

  useEffect(() => {
    const aiData = location.state?.aiData;

    if (aiData) {
      setFormData((prev) => ({
        ...prev,
        billTo: {
          clientName: aiData.clientName || "",
          email: aiData.email || "",
          address: aiData.email || "",
          phone: "",
        },
        items: aiData.items || {
          name: "",
          quantity: 1,
          unitPrice: 0,
          taxPercent: 0,
        },
      }));
    }

    if (existingInvoice) {
      setFormData({
        ...existingInvoice,
        invoiceDate: moment(existingInvoice.invoiceDate).format("YYYY-MM-DD"),
        dueDate: moment(existingInvoice.dueDate).format("YYYY-MM-DD"),
      });
    } else {
      const generateNewInvoiceNumber = async () => {
        setisGeneratingNumber(true);
        try {
          const response = await axiosInstance.get(
            API_PATHS.INVOICE.GET_ALL_INVOICES
          );
          const invoices = response.data;
          let maxNum = 0;
          invoices.forEach((inv) => {
            const num = parseInt(inv.invoiceNumber.split("-")[1]);
            if (isNaN(num) && num > maxNum) {
              maxNum = num;
            }
          });
          const NewInvoiceNumber = `INV-${String(maxNum + 1).padStart(3, "0")}`;
          setFormData((prev) => ({ ...prev, invoiceNumber: NewInvoiceNumber }));
        } catch (error) {
          console.error("Failed to Generate invoice number", error);
          setFormData((prev) => ({
            ...prev,
            invoiceNumber: `INV-${Date.now().toString().slice(-5)}`,
          }));
        }
        setisGeneratingNumber(false);
      };

      generateNewInvoiceNumber();
    }
  }, [existingInvoice]);

  const handleInputChange = (e, section, index) => {};

  const handleAddItem = () => {
    setFormData({
      ...FormData,
      items: [
        ...FormData.items,
        { name: "", quantity: 1, unitPrice: 0, taxPercent: 0 },
      ],
    });
  };

  const handleRemoveItem = (index) => {};

  const { subTotal, taxTotal, total } = (() => {
    let subTotal = 0,
      taxTotal = 0;
    FormData.items.forEach((item) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      subTotal += itemTotal;
      taxTotal += itemTotal * ((item.taxPercent || 0) / 100);
    });
    return { subTotal, taxTotal, total: subTotal + taxTotal };
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  };

  return (
    <form className="space-y-8" action="" onSubmit={handleSubmit}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">
          {existingInvoice ? "Edit Invoice" : "Create Invoice"}
        </h2>
        <Button type="submit" isLoading={loading || isGeneratingNumber}>
          {existingInvoice ? "Save Changes" : "Save Invoices"}
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-lg border shadow-slate-100 border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Invoice Number"
            name="invoiceNumber"
            readOnly
            value={FormData.invoiceNumber}
            placeholder={isGeneratingNumber ? "Generating..." : ""}
            disabled
          />
          <InputField
            label="Invoice Date"
            type="date"
            name="invoiceDate"
            value={FormData.invoiceDate}
            onChange={handleInputChange}
          />

          <InputField
            label="Due Date"
            type="date"
            name="dueDate"
            value={FormData.dueDate}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-100 border border-slate-200 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-2 ">
            Bill From
          </h3>
          <InputField
            label="Business Name"
            name="businessName"
            value={FormData.billFrom.businessName}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={FormData.billFrom.email}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
          <TextAreaField
            label="Address"
            type="address"
            name="address"
            value={FormData.billFrom.address}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
          <InputField
            label="Phone"
            type="phone"
            name="phone"
            value={FormData.billFrom.phone}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-100 border border-slate-200 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-2 ">
            Bill To
          </h3>
          <InputField
            label="Client Name"
            name="clientName"
            value={FormData.billTo.clientName}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
          <InputField
            label="Client Email"
            type="email"
            name="email"
            value={FormData.billTo.email}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
          <TextAreaField
            label="Client Address"
            type="address"
            name="address"
            value={FormData.billTo.address}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
          <InputField
            label="Client Phone"
            type="phone"
            name="phone"
            value={FormData.billTo.phone}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
        </div>
      </div>
    </form>
  );
};

export default CreateInvoice;
