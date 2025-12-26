import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  FileText,
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import moment from "moment";
import AIInsightsCard from "../../components/AIInsightsCard";
import Loader from "../../components/Loader";

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

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
    totalClients: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const aiFetchedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );
        const invoices = response.data;

        // Calculate stats
        const totalInvoices = invoices.length;
        const paidInvoices = invoices.filter((inv) => inv.status === "Paid");
        const unpaidInvoices = invoices.filter((inv) => inv.status !== "Paid");
        const pendingInvoices = invoices.filter(
          (inv) => inv.status === "Pending"
        ).length;

        // Calculate totals
        const totalPaid = paidInvoices.reduce((acc, inv) => acc + inv.total, 0);
        const totalUnpaid = unpaidInvoices.reduce(
          (acc, inv) => acc + inv.total,
          0
        );

        // Get unique clients
        const uniqueClients = new Set(
          invoices.map((inv) => inv.billTo?.clientName)
        ).size;

        // Calculate overdue invoices
        const today = new Date();
        const overdueInvoices = invoices.filter(
          (inv) => inv.status !== "Paid" && new Date(inv.dueDate) < today
        ).length;

        setStats({
          totalInvoices,
          totalPaid,
          totalUnpaid,
          totalClients: uniqueClients,
          pendingInvoices,
          overdueInvoices,
        });

        // Get recent invoices (sorted by date)
        const sortedInvoices = [...invoices]
          .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
          .slice(0, 5);
        setRecentInvoices(sortedInvoices);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Stats cards data
  const statsData = [
    {
      icon: FileText,
      label: "Total Invoices",
      value: stats.totalInvoices,
      change: "+12%",
      trend: "up",
      color: "blue",
      description: "All time invoices",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${stats.totalPaid.toFixed(2)}`,
      change: "+18%",
      trend: "up",
      color: "emerald",
      description: "Paid amount",
    },
    {
      icon: AlertCircle,
      label: "Pending Amount",
      value: `$${stats.totalUnpaid.toFixed(2)}`,
      change: "-5%",
      trend: "down",
      color: "amber",
      description: "Awaiting payment",
    },
    {
      icon: Users,
      label: "Active Clients",
      value: stats.totalClients,
      change: "+8%",
      trend: "up",
      color: "violet",
      description: "Total clients",
    },
    {
      icon: Clock,
      label: "Pending Invoices",
      value: stats.pendingInvoices,
      change: "+3",
      trend: "up",
      color: "orange",
      description: "Awaiting action",
    },
    {
      icon: CheckCircle,
      label: "Paid Invoices",
      value:
        stats.totalInvoices - stats.pendingInvoices - stats.overdueInvoices,
      change: "+15%",
      trend: "up",
      color: "green",
      description: "Successfully paid",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <Loader
        name="Loading Dashboard"
        subtitle="Gathering your financial insights..."
        size="small"
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Welcome back! 👋
            </h1>
            <p className="text-slate-600 mt-2">
              Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              varient="secondary"
              onClick={() => navigate("/invoices/new")}
              icon={Plus}
              className="whitespace-nowrap"
            >
              New Invoice
            </Button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Today's Date
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {moment().format("MMM D, YYYY")}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Overdue</p>
                <p className="text-lg font-semibold text-slate-900">
                  {stats.overdueInvoices}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Payment Rate
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {stats.totalInvoices > 0
                    ? `${Math.round(
                        ((stats.totalInvoices -
                          stats.pendingInvoices -
                          stats.overdueInvoices) /
                          stats.totalInvoices) *
                          100
                      )}%`
                    : "0%"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Avg. Invoice
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  $
                  {stats.totalInvoices > 0
                    ? (
                        stats.totalPaid /
                        (stats.totalInvoices -
                          stats.pendingInvoices -
                          stats.overdueInvoices)
                      ).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-violet-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all duration-300 hover:border-slate-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${
                      {
                        blue: "bg-blue-50",
                        emerald: "bg-emerald-50",
                        amber: "bg-amber-50",
                        violet: "bg-violet-50",
                        orange: "bg-orange-50",
                        green: "bg-green-50",
                      }[stat.color]
                    } flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon
                      className={`w-6 h-6 ${
                        {
                          blue: "text-blue-600",
                          emerald: "text-emerald-600",
                          amber: "text-amber-600",
                          violet: "text-violet-600",
                          orange: "text-orange-600",
                          green: "text-green-600",
                        }[stat.color]
                      }`}
                    />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      stat.trend === "up"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-400">{stat.description}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Last 30 days</span>
                    <ArrowUpRight
                      className={`w-4 h-4 ${
                        {
                          blue: "text-blue-600",
                          emerald: "text-emerald-600",
                          amber: "text-amber-600",
                          violet: "text-violet-600",
                          orange: "text-orange-600",
                          green: "text-green-600",
                        }[stat.color]
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Invoices Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Recent Invoices
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Latest 5 invoices from your account
                  </p>
                </div>
                <Button
                  varient="ghost"
                  onClick={() => navigate("/invoices")}
                  icon={ArrowRight}
                  className="whitespace-nowrap"
                >
                  View All
                </Button>
              </div>
            </div>

            {recentInvoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-4 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentInvoices.map((invoice) => (
                      <tr
                        key={invoice._id}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/invoices/${invoice._id}`)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">
                                {invoice.billTo.clientName}
                              </div>
                              <div className="text-xs text-slate-500">
                                #{invoice.invoiceNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-900">
                            ${invoice.total.toFixed(2)}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                            ${
                              invoice.status === "Paid"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : invoice.status === "Pending"
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : "bg-red-50 text-red-700 border border-red-100"
                            }`}
                          >
                            {invoice.status === "Paid" && (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            {invoice.status === "Pending" && (
                              <Clock className="w-3 h-3" />
                            )}
                            {invoice.status === "Unpaid" && (
                              <AlertCircle className="w-3 h-3" />
                            )}
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell">
                          <div className="text-sm text-slate-700">
                            {moment(invoice.dueDate).format("MMM D, YYYY")}
                          </div>
                          <div className="text-xs text-slate-500">
                            {moment(invoice.dueDate).fromNow()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No invoices yet
                </h3>
                <p className="text-slate-600 max-w-md mx-auto mb-6">
                  Start managing your finances by creating your first invoice.
                </p>
                <Button
                  onClick={() => navigate("/invoices/new")}
                  icon={Plus}
                  className="mx-auto"
                >
                  Create First Invoice
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - AI Insights and Quick Actions */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <AIInsightsCard
            isLoading={aiInsightsLoading}
            onLoad={() => setAiInsightsLoading(false)}
          />

          {/* Quick Actions Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                varient="primary"
                onClick={() => navigate("/invoices/new")}
                icon={Plus}
                className="w-full justify-start"
              >
                Create New Invoice
              </Button>
              <Button
                varient="secondary"
                onClick={() => navigate("/clients")}
                icon={Users}
                className="w-full justify-start"
              >
                Manage Clients
              </Button>
              <Button
                varient="secondary"
                onClick={() => navigate("/reports")}
                icon={FileText}
                className="w-full justify-start"
              >
                View Reports
              </Button>
              <Button
                varient="ghost"
                onClick={() => navigate("/settings")}
                icon={Clock}
                className="w-full justify-start"
              >
                Settings
              </Button>
            </div>
          </div>

          {/* Revenue Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Revenue Summary
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-600">Paid Revenue</span>
                  <span className="text-sm font-medium text-slate-900">
                    ${stats.totalPaid.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.totalPaid + stats.totalUnpaid > 0
                          ? (stats.totalPaid /
                              (stats.totalPaid + stats.totalUnpaid)) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-600">
                    Pending Revenue
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    ${stats.totalUnpaid.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.totalPaid + stats.totalUnpaid > 0
                          ? (stats.totalUnpaid /
                              (stats.totalPaid + stats.totalUnpaid)) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-900">
                    Total Revenue
                  </span>
                  <span className="text-lg font-bold text-slate-900">
                    ${(stats.totalPaid + stats.totalUnpaid).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Conversion Rate</p>
              <p className="text-2xl font-bold mt-1">
                {stats.totalInvoices > 0
                  ? `${Math.round(
                      ((stats.totalInvoices -
                        stats.pendingInvoices -
                        stats.overdueInvoices) /
                        stats.totalInvoices) *
                        100
                    )}%`
                  : "0%"}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg. Payment Time</p>
              <p className="text-2xl font-bold mt-1">7 days</p>
            </div>
            <Clock className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Client Satisfaction</p>
              <p className="text-2xl font-bold mt-1">94%</p>
            </div>
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
