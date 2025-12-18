import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPath";
import {
  Plus,
  Trash2,
  Calculator,
  FileText,
  User,
  Calendar,
  DollarSign,
  Phone,
  MapPin,
  Mail,
  CreditCard,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";
import { useAuth } from "@/context/AuthContext";

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

const Inputfield = ({ icon: Icon, label, name, ...props }) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
        )}
        <input
          id={name}
          {...props}
          name={name}
          className={`w-full h-10 pr-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-tranaparent ${
            Icon ? "pl-10" : "pl-3"
          }`}
        />
      </div>
    </div>
  );
};

const SelectField = ({ icon: Icon, label, name, options = [], ...props }) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
        )}
        <select
          id={name}
          name={name}
          {...props}
          className={`w-full h-10 pr-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            Icon ? "pl-10" : "pl-3"
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
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

const CreateInvoice = ({ existingInvoice, onSave }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [formData, setFormData] = useState(
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
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(
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
          address: aiData.address || "",
          phone: aiData.phone || "",
        },
        items: aiData.items || [
          {
            name: "",
            quantity: 1,
            unitPrice: 0,
            taxPercent: 0,
          },
        ],
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
        setIsGeneratingNumber(true);
        try {
          const response = await axiosInstance.get(
            API_PATHS.INVOICE.GET_ALL_INVOICES
          );
          const invoices = response.data;
          let maxNum = 0;
          invoices.forEach((inv) => {
            const match = inv.invoiceNumber?.match(/INV-(\d+)/);
            if (match) {
              const num = parseInt(match[1]);
              if (!isNaN(num) && num > maxNum) {
                maxNum = num;
              }
            }
          });
          const newInvoiceNumber = `INV-${String(maxNum + 1).padStart(3, "0")}`;
          setFormData((prev) => ({ ...prev, invoiceNumber: newInvoiceNumber }));
        } catch (error) {
          console.error("Failed to Generate invoice number", error);
          setFormData((prev) => ({
            ...prev,
            invoiceNumber: `INV-${Date.now().toString().slice(-5)}`,
          }));
        }
        setIsGeneratingNumber(false);
      };

      generateNewInvoiceNumber();
    }
  }, [existingInvoice, location.state]);

  const handleInputChange = (e, section, index) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (section === "items") {
        const updatedItems = [...prev.items];
        updatedItems[index] = {
          ...updatedItems[index],
          [name]:
            name === "quantity" || name === "unitPrice" || name === "taxPercent"
              ? Number(value)
              : value,
        };
        return { ...prev, items: updatedItems };
      }

      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [name]: value,
          },
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { name: "", quantity: 1, unitPrice: 0, taxPercent: 0 },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  // Calculate totals
  const { subTotal, taxTotal, total } = formData.items.reduce(
    (acc, item) => {
      const quantity = item.quantity || 0;
      const unitPrice = item.unitPrice || 0;
      const taxPercent = item.taxPercent || 0;
      const itemTotal = quantity * unitPrice;
      const itemTax = itemTotal * (taxPercent / 100);

      return {
        subTotal: acc.subTotal + itemTotal,
        taxTotal: acc.taxTotal + itemTax,
        total: acc.total + itemTotal + itemTax,
      };
    },
    { subTotal: 0, taxTotal: 0, total: 0 }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.items.some((item) => !item.name.trim())) {
      toast.error("Please fill all item descriptions");
      return;
    }

    setLoading(true);

    const itemsWithTotal = formData.items.map((item) => ({
      ...item,
      total:
        (item.quantity || 0) *
        (item.unitPrice || 0) *
        (1 + (item.taxPercent || 0) / 100),
    }));

    const finalFormData = {
      ...formData,
      items: itemsWithTotal,
      subTotal,
      taxTotal,
      total,
    };

    if (onSave) {
      await onSave(finalFormData);
    } else {
      try {
        await axiosInstance.post(API_PATHS.INVOICE.CREATE, finalFormData);
        toast.success("Invoice Created Successfully 🎉");
        navigate("/invoices");
      } catch (error) {
        toast.error("Failed to create invoice.");
        console.error(error);
      }
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-6 md:space-y-8 px-2 sm:px-4 md:px-0"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 sm:p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {existingInvoice ? "Edit Invoice" : "Create New Invoice"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {existingInvoice
                ? "Update invoice details"
                : "Fill in the details below"}
            </p>
          </div>
        </div>
        <Button
          type="submit"
          isLoading={loading || isGeneratingNumber}
          className="w-full sm:w-auto"
        >
          {existingInvoice ? "Save Changes" : "Create Invoice"}
        </Button>
      </div>

      {/* Invoice Basics Card */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
            Invoice Details
          </h3>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="relative">
            <Inputfield
              label="Invoice Number"
              name="invoiceNumber"
              readOnly
              value={formData.invoiceNumber}
              placeholder={isGeneratingNumber ? "Generating..." : ""}
              disabled={isGeneratingNumber}
              icon={FileText}
              className="bg-slate-50"
            />
            {isGeneratingNumber && (
              <div className="absolute right-3 top-9">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <Inputfield
            label="Invoice Date"
            type="date"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleInputChange}
            icon={Calendar}
          />

          <Inputfield
            label="Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            icon={Calendar}
            min={formData.invoiceDate}
          />
        </div>
      </div>

      {/* Billing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Bill From Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
              Bill From
            </h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Inputfield
              label="Business Name"
              name="businessName"
              value={formData.billFrom.businessName}
              onChange={(e) => handleInputChange(e, "billFrom")}
              icon={User}
            />
            <Inputfield
              label="Email"
              type="email"
              name="email"
              value={formData.billFrom.email}
              onChange={(e) => handleInputChange(e, "billFrom")}
              icon={Mail}
            />
            <TextAreaField
              label="Address"
              name="address"
              value={formData.billFrom.address}
              onChange={(e) => handleInputChange(e, "billFrom")}
              icon={MapPin}
              rows={2}
            />
            <Inputfield
              label="Phone"
              type="tel"
              name="phone"
              value={formData.billFrom.phone}
              onChange={(e) => handleInputChange(e, "billFrom")}
              icon={Phone}
            />
          </div>
        </div>

        {/* Bill To Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
              Bill To
            </h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Inputfield
              label="Client Name"
              name="clientName"
              value={formData.billTo.clientName}
              onChange={(e) => handleInputChange(e, "billTo")}
              icon={User}
              required
            />
            <Inputfield
              label="Client Email"
              type="email"
              name="email"
              value={formData.billTo.email}
              onChange={(e) => handleInputChange(e, "billTo")}
              icon={Mail}
            />
            <TextAreaField
              label="Client Address"
              name="address"
              value={formData.billTo.address}
              onChange={(e) => handleInputChange(e, "billTo")}
              icon={MapPin}
              rows={2}
            />
            <Inputfield
              label="Client Phone"
              type="tel"
              name="phone"
              value={formData.billTo.phone}
              onChange={(e) => handleInputChange(e, "billTo")}
              icon={Phone}
            />
          </div>
        </div>
      </div>

      {/* Items Card */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-amber-100 rounded-lg">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
              Items & Services
            </h3>
          </div>
          <Button
            type="button"
            varient="secondary"
            onClick={handleAddItem}
            icon={Plus}
            size="small"
            className="w-full sm:w-auto"
          >
            Add Item
          </Button>
        </div>

        {/* Mobile Items View */}
        <div className="sm:hidden space-y-3">
          {formData.items.map((item, index) => {
            const quantity = item.quantity || 0;
            const unitPrice = item.unitPrice || 0;
            const taxPercent = item.taxPercent || 0;
            const itemTotal =
              quantity * unitPrice + quantity * unitPrice * (taxPercent / 100);

            return (
              <div
                key={index}
                className="p-3 border border-slate-200 rounded-lg bg-slate-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      name="name"
                      value={item.name || ""}
                      onChange={(e) => handleInputChange(e, "items", index)}
                      placeholder="Item description"
                      className="w-full font-medium text-sm mb-1 bg-transparent border-none focus:outline-none"
                    />
                    <div className="text-xs text-slate-500">
                      ${unitPrice.toFixed(2)} × {quantity}
                      {taxPercent > 0 && ` + ${taxPercent}% tax`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">
                      ${itemTotal.toFixed(2)}
                    </div>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="mt-1 text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  <input
                    type="number"
                    name="quantity"
                    value={quantity}
                    min="1"
                    onChange={(e) => handleInputChange(e, "items", index)}
                    placeholder="Qty"
                    className="text-xs p-2 rounded border border-slate-300"
                  />
                  <input
                    type="number"
                    name="unitPrice"
                    value={unitPrice}
                    min="0"
                    step="0.01"
                    onChange={(e) => handleInputChange(e, "items", index)}
                    placeholder="Price"
                    className="text-xs p-2 rounded border border-slate-300"
                  />
                  <input
                    type="number"
                    name="taxPercent"
                    value={taxPercent}
                    min="0"
                    onChange={(e) => handleInputChange(e, "items", index)}
                    placeholder="Tax %"
                    className="text-xs p-2 rounded border border-slate-300"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Items Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[800px]">
            {" "}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-3 px-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider min-w-[100px]">
                  Qty
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider min-w-[140px]">
                  Price
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider min-w-[100px]">
                  Tax %
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider min-w-[120px]">
                  Total
                </th>
                <th className="py-3 px-4 min-w-[60px]"></th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => {
                const quantity = item.quantity || 0;
                const unitPrice = item.unitPrice || 0;
                const taxPercent = item.taxPercent || 0;
                const itemTotal =
                  quantity * unitPrice +
                  quantity * unitPrice * (taxPercent / 100);

                return (
                  <tr
                    key={index}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                  >
                    {/* Description */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        name="name"
                        value={item.name || ""}
                        onChange={(e) => handleInputChange(e, "items", index)}
                        placeholder="Item description"
                        className="w-full text-sm rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-4">
                      <div className="min-w-[80px]">
                        <input
                          type="number"
                          name="quantity"
                          value={quantity}
                          min="1"
                          onChange={(e) => handleInputChange(e, "items", index)}
                          className="w-full text-sm rounded border border-slate-300 px-3 py-2 text-center"
                        />
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <div className="min-w-[120px]">
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-slate-500">
                            $
                          </span>
                          <input
                            type="number"
                            name="unitPrice"
                            value={unitPrice}
                            min="0"
                            step="0.01"
                            onChange={(e) =>
                              handleInputChange(e, "items", index)
                            }
                            className="w-full text-sm rounded border border-slate-300 pl-8 pr-3 py-2"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Tax */}
                    <td className="py-3 px-4">
                      <div className="min-w-[80px]">
                        <div className="relative">
                          <input
                            type="number"
                            name="taxPercent"
                            value={taxPercent}
                            min="0"
                            onChange={(e) =>
                              handleInputChange(e, "items", index)
                            }
                            className="w-full text-sm rounded border border-slate-300 px-3 py-2 pr-8 text-center"
                          />
                          <span className="absolute right-3 top-2 text-slate-500">
                            %
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                      ${itemTotal.toFixed(2)}
                    </td>

                    {/* Remove Button */}
                    <td className="py-3 px-4">
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes & Totals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Notes & Terms Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 bg-violet-100 rounded-lg">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
              Notes & Terms
            </h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <TextAreaField
              label="Additional Notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleInputChange}
              placeholder="Additional notes or instructions..."
              rows={3}
            />

            <SelectField
              label="Payment Terms"
              name="paymentTerms"
              value={formData.paymentTerms || "Net 15"}
              onChange={handleInputChange}
              icon={CreditCard}
              options={["Net 15", "Net 30", "Net 60", "Due on receipt"]}
            />
          </div>
        </div>

        {/* Totals Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
              Invoice Summary
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Subtotal</span>
              <span className="text-sm font-medium text-slate-900">
                ${subTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Tax</span>
              <span className="text-sm font-medium text-slate-900">
                ${taxTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-t border-slate-200">
              <span className="text-lg font-bold text-slate-900">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-blue-600">
                ${total.toFixed(2)}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                {formData.paymentTerms === "Due on receipt"
                  ? "Payment is due immediately upon receipt"
                  : `Payment is due within ${formData.paymentTerms?.replace(
                      "Net ",
                      ""
                    )} days`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
        <Button
          type="button"
          varient="secondary"
          onClick={() => navigate("/invoices")}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={loading || isGeneratingNumber}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          {loading
            ? "Saving..."
            : existingInvoice
            ? "Update Invoice"
            : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
};

export default CreateInvoice;
