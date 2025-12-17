import { useState, useEffect, useRef } from "react";
import { Lightbulb, AlertCircle } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

const AIInsightsCard = () => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use ref to track if API has been called
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const fetchInsights = async () => {
      // Prevent multiple API calls
      if (hasFetchedRef.current) {
        return;
      }

      hasFetchedRef.current = true;

      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          API_PATHS.AI.GET_DASHBOARD_SUMMARY
        );

        if (response.data && response.data.insights) {
          setInsights(response.data.insights);
        } else {
          // Fallback if no insights in response
          setInsights(getDefaultInsights());
        }
      } catch (error) {
        console.log("Failed to fetch AI insights", error);
        setError("Unable to load insights at the moment.");
        // Fallback to default insights on error
        setInsights(getDefaultInsights());
      } finally {
        // Always stop loading after timeout
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchInsights();
  }, []); // Empty dependency array ensures it runs only once

  // Default fallback insights in case API fails
  const getDefaultInsights = () => {
    return [
      "Track your invoice payment patterns to identify trends.",
      "Send reminders for overdue invoices to improve cash flow.",
      "Consider offering early payment discounts for loyal clients.",
      "Review your highest-value clients for growth opportunities.",
    ];
  };

  // Get fallback insights based on error state
  const getDisplayInsights = () => {
    if (error && insights.length === 0) {
      return getDefaultInsights();
    }
    return insights.length > 0 ? insights : getDefaultInsights();
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-yellow-50 border border-yellow-200">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
            AI Insights
          </h3>
          {error && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Using cached insights
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-3.5 bg-slate-200 rounded-md w-5/6"></div>
          <div className="h-3.5 bg-slate-200 rounded-md w-4/6"></div>
          <div className="h-3.5 bg-slate-200 rounded-md w-5/6"></div>
          <div className="h-3.5 bg-slate-200 rounded-md w-4/6"></div>
        </div>
      ) : (
        <div>
          <div className="h-px bg-slate-100 my-3"></div>
          <ul className="space-y-2 list-disc list-inside text-slate-700">
            {getDisplayInsights().map((insight, index) => (
              <li key={index} className="text-sm leading-relaxed">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIInsightsCard;
