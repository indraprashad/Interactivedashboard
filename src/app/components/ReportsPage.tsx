import { motion } from "motion/react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download, Calendar, TrendingUp, FileText, BarChart3, PieChart } from "lucide-react";

const trendData = [
  { month: "Apr", total: 65, assessed: 58, compliant: 45 },
  { month: "May", total: 70, assessed: 62, compliant: 50 },
  { month: "Jun", total: 73, assessed: 65, compliant: 52 },
  { month: "Jul", total: 77, assessed: 70, compliant: 56 },
  { month: "Aug", total: 79, assessed: 72, compliant: 59 },
  { month: "Sep", total: 82, assessed: 75, compliant: 62 },
  { month: "Oct", total: 83, assessed: 78, compliant: 65 },
  { month: "Nov", total: 83, assessed: 80, compliant: 67 },
  { month: "Dec", total: 88, assessed: 83, compliant: 70 },
];

const reportCards = [
  {
    title: "Biosecurity inspection goals",
    description: "Track progress towards annual inspection targets",
    icon: BarChart3,
    color: "#1a6b58",
    action: "Open"
  },
  {
    title: "Disease outbreak alert",
    description: "Monitor and respond to disease outbreaks",
    icon: AlertTriangle,
    color: "#c2410c",
    action: "Open"
  },
  {
    title: "Risk-based inspection",
    description: "Prioritize inspections based on risk assessment",
    icon: TrendingUp,
    color: "#fbbf24",
    action: "Open"
  },
  {
    title: "Biosecurity clearance",
    description: "Generate clearance certificates for compliant farms",
    icon: FileText,
    color: "#1a6b58",
    action: "Open"
  },
  {
    title: "Compliance status",
    description: "Overview of farm compliance across all dzongkhags",
    icon: PieChart,
    color: "#0b1f1a",
    action: "Open"
  },
  {
    title: "Standard NC report",
    description: "Non-compliance tracking and resolution reports",
    icon: FileText,
    color: "#fb923c",
    action: "Open"
  },
];

function AlertTriangle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

export function ReportsPage() {
  return (
    <div className="flex-1 bg-[#e7efe9] p-4 lg:p-8 overflow-auto" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1400px] mx-auto"
      >
        {/* Header */}
        <div className="mb-6 bg-white rounded-lg p-4">
          <p className="text-[#8a8a8a] text-sm mb-1">Reports / Query</p>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-[#0b1f1a] text-2xl lg:text-3xl font-bold">High-score Query</h2>
              <p className="text-[#8a8a8a] text-sm">View assessment trends and compliance metrics</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-[#8a8a8a] text-[#0b1f1a] rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                FY 2025-26
              </button>
              <button className="px-4 py-2 bg-[#0b1f1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a2f2a] flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#0b1f1a] text-lg lg:text-xl font-bold">Compliance Trend</h3>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0b1f1a]" />
                <span className="text-[#8a8a8a]">Total Farms</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                <span className="text-[#8a8a8a]">Assessed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#1a6b58]" />
                <span className="text-[#8a8a8a]">Compliant</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#0b1f1a" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="assessed" stroke="#fbbf24" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="compliant" stroke="#1a6b58" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Report Cards Grid */}
        <div>
          <h3 className="text-[#0b1f1a] text-xl font-bold mb-4">Available Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportCards.map((report, index) => {
              const Icon = report.icon;
              return (
                <motion.div
                  key={report.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${report.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: report.color }} />
                    </div>
                    <button
                      className="px-3 py-1 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: report.color, color: 'white' }}
                    >
                      {report.action} →
                    </button>
                  </div>
                  <h4 className="text-[#0b1f1a] font-bold text-base mb-2">{report.title}</h4>
                  <p className="text-[#8a8a8a] text-sm">{report.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
