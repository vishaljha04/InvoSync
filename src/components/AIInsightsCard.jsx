import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

const AIInsightsCard = () => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.AI.GET_DASHBOARD_SUMMARY
        );
        setInsights(response.data.insights || []);
      } catch (error) {
        console.log("Failed to fetch AI insights", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 ">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-yellow-50 border border-yellow-200">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
          AI Insights
        </h3>
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
            {insights.map((insight, index) => (
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
