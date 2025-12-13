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
} from "lucide-react";
import moment from "moment";
import { useNavigation } from "react-router-dom";
import Button from "../../components/ui/Button";

const AllInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAiModalOpen, setTsAiModalOpen] = useState(false);
  const [isRemainderModalOpen, setisRemainderModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const navigate = useNavigation();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
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
        setLoading(true);
      }
    };
    fetchInvoices();
  }, []);

  return (<div>
    
  </div>);
};

export default AllInvoice;
