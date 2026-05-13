import { motion } from "motion/react";
import { MapPin, Filter, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

const dzongkhagRiskData = [
  {
    name: "Thimphu",
    total: 234,
    low: 180,
    medium: 42,
    high: 10,
    critical: 2,
    riskLevel: "Low",
    trend: "stable"
  },
  {
    name: "Paro",
    total: 156,
    low: 110,
    medium: 32,
    high: 12,
    critical: 2,
    riskLevel: "Medium",
    trend: "improving"
  },
  {
    name: "Punakha",
    total: 189,
    low: 120,
    medium: 45,
    high: 20,
    critical: 4,
    riskLevel: "Medium",
    trend: "deteriorating"
  },
  {
    name: "Bumthang",
    total: 98,
    low: 75,
    medium: 18,
    high: 4,
    critical: 1,
    riskLevel: "Low",
    trend: "stable"
  },
  {
    name: "Wangdue",
    total: 142,
    low: 95,
    medium: 35,
    high: 10,
    critical: 2,
    riskLevel: "Medium",
    trend: "improving"
  },
  {
    name: "Trongsa",
    total: 87,
    low: 68,
    medium: 15,
    high: 3,
    critical: 1,
    riskLevel: "Low",
    trend: "stable"
  },
];

const riskLevelColors: Record<string, string> = {
  Low: "#1a6b58",
  Medium: "#fbbf24",
  High: "#fb923c",
  Critical: "#c2410c"
};

export function RiskMapPage() {
  return (
    <div className="flex-1 bg-[#e7efe9] p-4 lg:p-8 overflow-auto" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1400px] mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <p className="text-[#8a8a8a] text-sm mb-1">Risk Assessment / Geographic View</p>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-[#0b1f1a] text-2xl lg:text-3xl font-bold">Risk Map</h2>
              <p className="text-[#8a8a8a] text-sm">Biosecurity risk assessment by region</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-[#8a8a8a] text-[#0b1f1a] rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Risk Legend */}
        <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm mb-6">
          <h3 className="text-[#0b1f1a] text-lg font-bold mb-4">Risk Level Legend</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1a6b58]" />
              <div>
                <p className="text-[#0b1f1a] font-bold text-sm">Low Risk</p>
                <p className="text-[#8a8a8a] text-xs">Score: 2.0 - 3.0</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fbbf24]" />
              <div>
                <p className="text-[#0b1f1a] font-bold text-sm">Medium Risk</p>
                <p className="text-[#8a8a8a] text-xs">Score: 1.5 - 1.9</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fb923c]" />
              <div>
                <p className="text-[#0b1f1a] font-bold text-sm">High Risk</p>
                <p className="text-[#8a8a8a] text-xs">Score: 1.0 - 1.4</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c2410c]" />
              <div>
                <p className="text-[#0b1f1a] font-bold text-sm">Critical Risk</p>
                <p className="text-[#8a8a8a] text-xs">Score: 0.0 - 0.9</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="aspect-video bg-[#e7efe9] rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-[#1a6b58] mx-auto mb-4" />
              <p className="text-[#0b1f1a] font-bold text-lg mb-2">Interactive Map View</p>
              <p className="text-[#8a8a8a] text-sm">Geographic visualization of risk distribution across Bhutan</p>
              <button className="mt-4 px-6 py-2 bg-[#1a6b58] text-white rounded-lg text-sm font-medium hover:bg-[#0b1f1a]">
                Load Map
              </button>
            </div>
          </div>
        </div>

        {/* Dzongkhag Risk Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <h3 className="text-[#0b1f1a] text-xl font-bold">Risk Assessment by Dzongkhag</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Dzongkhag</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Total Farms</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden lg:table-cell">Low</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden lg:table-cell">Medium</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden lg:table-cell">High</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden lg:table-cell">Critical</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Risk Level</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden xl:table-cell">Trend</th>
                </tr>
              </thead>
              <tbody>
                {dzongkhagRiskData.map((dzongkhag, index) => (
                  <motion.tr
                    key={dzongkhag.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#1a6b58]" />
                        <span className="text-[#0b1f1a] font-bold">{dzongkhag.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#0b1f1a] font-bold">{dzongkhag.total}</td>
                    <td className="py-4 px-4 text-[#8a8a8a] hidden lg:table-cell">{dzongkhag.low}</td>
                    <td className="py-4 px-4 text-[#8a8a8a] hidden lg:table-cell">{dzongkhag.medium}</td>
                    <td className="py-4 px-4 text-[#8a8a8a] hidden lg:table-cell">{dzongkhag.high}</td>
                    <td className="py-4 px-4 text-[#8a8a8a] hidden lg:table-cell">{dzongkhag.critical}</td>
                    <td className="py-4 px-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: riskLevelColors[dzongkhag.riskLevel] }}
                      >
                        {dzongkhag.riskLevel}
                      </span>
                    </td>
                    <td className="py-4 px-4 hidden xl:table-cell">
                      <div className="flex items-center gap-1">
                        {dzongkhag.trend === "improving" && (
                          <>
                            <TrendingDown className="w-4 h-4 text-[#1a6b58]" />
                            <span className="text-[#1a6b58] text-sm">Improving</span>
                          </>
                        )}
                        {dzongkhag.trend === "deteriorating" && (
                          <>
                            <TrendingUp className="w-4 h-4 text-[#c2410c]" />
                            <span className="text-[#c2410c] text-sm">Deteriorating</span>
                          </>
                        )}
                        {dzongkhag.trend === "stable" && (
                          <span className="text-[#8a8a8a] text-sm">Stable</span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
