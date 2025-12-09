import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useNavigate } from "react-router-dom";
import { Loader2, FileText, DollarSign, Plus } from "lucide-react";
import moment from "moment";

import Button from "../../components/ui/Button";
import AIInsightsCard from "../../components/AIInsightsCard";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [laoding, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );
        const invoices = response.data;
        const totalInvoices = invoices.length;
        const totalPaid = invoices
          .filter((inv) => inv.status === "Paid")
          .reduce((acc, inv) => acc + inv.total, 0);
        const totalUnpaid = invoices
          .filter((inv) => inv.status !== "Paid")
          .reduce((acc, inv) => acc + inv.total, 0);
        setStats({ totalInvoices, totalPaid, totalUnpaid });
        setRecentInvoices(
          invoices
            .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statsData = [
    {
      icon: FileText,
      label: "Total Invoices",
      value: stats?.totalInvoices,
      color: "blue",
    },
    {
      icon: DollarSign,
      label: "Total Paid",
      value: `${stats?.totalPaid.toFixed(2)}`,
      color: "emerald",
    },
    {
      icon: DollarSign,
      label: "Total Unpaid",
      value: `${stats?.totalUnpaid.toFixed(2)}`,
      color: "red",
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
    },
    red: {
      bg: "bg-red-100",
      text: "text-red-600",
    },
  };

  if (laoding) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }
  return (
    <div className="space-y-8 ">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-600 mt-1">
          A quick overview of your business finances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stats, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-slate-200 shadow-lg shadow-gray-100 p-4"
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 w-12 h-12 ${
                  colorClasses[stats.color].bg
                } rounded-lg flex items-center justify-center`}
              >
                <stats.icon
                  className={`w-6 h-6 ${colorClasses[stats.color].text}`}
                />
              </div>

              <div className="ml-4 min-w-0">
                <div className="text-sm font-medium text-slate-500 truncate">
                  {stats.label}
                </div>
                <div className="text-2xl font-bold text-slate-900 wrap-break-word">
                  {stats.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


        <AIInsightsCard/>

      <div className="bg-white w-full border border-slate-200 rounded-xl shadow-md shadow-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">
            Recent Invoices
          </h3>
          <Button variant="ghost" onClick={() => navigate("/invoices")}>
            View All
          </Button>
        </div>

        {/* Invoices List */}
        {recentInvoices.length > 0 ? (
          <div className="w-[90vw] md:w-auto overflow-x-auto">
            <table className="w-full min-w-[650px] divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                    Due Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentInvoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    className="hover:bg-slate-50 cursor-pointer transition"
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                  >
                    {/* Client Info */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">
                        {invoice.billTo.clientName}
                      </div>
                      <div className="text-xs text-slate-500">
                        #{invoice.invoiceNumber}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3 text-slate-800 font-semibold">
                      ${invoice.total.toFixed(2)}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                    ${
                      invoice.status === "Paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : invoice.status === "Pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-3 text-slate-700">
                      {moment(invoice.dueDate).format("MMM D, YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <FileText className="w-7 h-7 text-slate-500" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              No invoices yet
            </h3>

            <p className="text-slate-600 max-w-md">
              You haven't created any invoices yet. Get started by creating your
              first one.
            </p>

            <Button onClick={() => navigate("/invoices/new")} icon={Plus}>
              Create Invoice
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
