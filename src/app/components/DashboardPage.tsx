import { motion } from "motion/react";
import { StatsCard } from "./StatsCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { MapPin, TrendingUp, Clock } from "lucide-react";

const statsData = [
  {
    title: "REGISTERED FARM",
    value: "1,284",
    subtitle: "+24 This Month",
    valueColor: "#0b1f1a",
    subtitleColor: "#1a6b58"
  },
  {
    title: "ASSESSED (FY)",
    value: "919",
    subtitle: "71.5% coverage",
    valueColor: "#0b1f1a",
    subtitleColor: "#1a6b58"
  },
  {
    title: "COMPLIANT",
    value: "612",
    subtitle: "66.6%",
    valueColor: "#1a6b58",
    subtitleColor: "#1a6b58"
  },
  {
    title: "ACTIVE NC",
    value: "108",
    subtitle: "14 overdue",
    valueColor: "#c2410c",
    subtitleColor: "#1a6b58"
  }
];

const assessmentData = [
  { month: "Apr", Compliant: 45, NonCompliant: 20, Assessed: 65 },
  { month: "May", Compliant: 52, NonCompliant: 18, Assessed: 70 },
  { month: "Jun", Compliant: 48, NonCompliant: 25, Assessed: 73 },
  { month: "Jul", Compliant: 55, NonCompliant: 22, Assessed: 77 },
  { month: "Aug", Compliant: 60, NonCompliant: 19, Assessed: 79 },
  { month: "Sep", Compliant: 58, NonCompliant: 24, Assessed: 82 },
  { month: "Oct", Compliant: 62, NonCompliant: 21, Assessed: 83 },
  { month: "Nov", Compliant: 65, NonCompliant: 18, Assessed: 83 },
  { month: "Dec", Compliant: 68, NonCompliant: 20, Assessed: 88 },
  { month: "Jan", Compliant: 70, NonCompliant: 17, Assessed: 87 },
  { month: "Feb", Compliant: 72, NonCompliant: 19, Assessed: 91 },
  { month: "Mar", Compliant: 75, NonCompliant: 16, Assessed: 91 },
];

const recentAssessments = [
  { id: "ASM-1284", farm: "Lhamo Poultry Farm", location: "Thimphu", date: "2025-03-15", status: "Good", priority: "Normal" },
  { id: "ASM-1283", farm: "Dorji Piggery", location: "Paro", date: "2025-03-14", status: "Moderate", priority: "Normal" },
  { id: "ASM-1282", farm: "Sonam Poultry", location: "Punakha", date: "2025-03-14", status: "Critical", priority: "High" },
  { id: "ASM-1281", farm: "Tashi Cattle Farm", location: "Bumthang", date: "2025-03-13", status: "Good", priority: "Normal" },
];

const riskByDzongkhag = [
  { dzongkhag: "Thimphu", low: 45, medium: 12, high: 3, critical: 0 },
  { dzongkhag: "Paro", low: 38, medium: 8, high: 2, critical: 1 },
  { dzongkhag: "Punakha", low: 42, medium: 10, high: 4, critical: 2 },
  { dzongkhag: "Bumthang", low: 35, medium: 7, high: 1, critical: 0 },
];

export function DashboardPage() {
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <p className="text-[#8a8a8a] text-sm mb-1">Dashboard / FY 2025-26</p>
              <h2 className="text-[#0b1f1a] text-2xl lg:text-3xl font-bold">
                Biosecurity compliance: FY 2025-26
              </h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button className="px-4 py-2 bg-white border border-[#8a8a8a] text-[#0b1f1a] rounded-lg text-sm font-medium hover:bg-gray-50">
                FY 2025-26
              </button>
              <button className="px-4 py-2 bg-white border border-[#8a8a8a] text-[#0b1f1a] rounded-lg text-sm font-medium hover:bg-gray-50">
                All Dzongkhags
              </button>
              <button className="px-4 py-2 bg-[#0b1f1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a2f2a]">
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Assessments by Dzongkhag Chart */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-lg p-4 lg:p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0b1f1a] text-lg lg:text-xl font-bold">Monthly Assessment Trend</h3>
              <button className="text-[#1a6b58] text-sm font-medium hover:underline">View All</button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={assessmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Compliant" fill="#1a6b58" radius={[4, 4, 0, 0]} />
                <Bar dataKey="NonCompliant" fill="#c2410c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Assessed" fill="#8a8a8a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Compliance Distribution */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-lg p-4 lg:p-6 shadow-sm"
          >
            <h3 className="text-[#0b1f1a] text-lg lg:text-xl font-bold mb-4">Compliance Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1a6b58] flex items-center justify-center text-white font-bold">
                    67%
                  </div>
                  <div>
                    <p className="text-[#0b1f1a] font-bold">Compliant</p>
                    <p className="text-[#8a8a8a] text-sm">612 farms</p>
                  </div>
                </div>
                <TrendingUp className="text-[#1a6b58] w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#c2410c] flex items-center justify-center text-white font-bold">
                    12%
                  </div>
                  <div>
                    <p className="text-[#0b1f1a] font-bold">Non-compliant</p>
                    <p className="text-[#8a8a8a] text-sm">108 farms</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#fbbf24] flex items-center justify-center text-white font-bold">
                    21%
                  </div>
                  <div>
                    <p className="text-[#0b1f1a] font-bold">Pending</p>
                    <p className="text-[#8a8a8a] text-sm">199 farms</p>
                  </div>
                </div>
                <Clock className="text-[#fbbf24] w-5 h-5" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Assessments and Risk by Dzongkhag */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Assessments */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-lg p-4 lg:p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0b1f1a] text-lg lg:text-xl font-bold">Recent Assessments</h3>
              <button className="text-[#1a6b58] text-sm font-medium hover:underline">View All →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-[#8a8a8a] font-medium">ID</th>
                    <th className="text-left py-2 text-[#8a8a8a] font-medium">Farm</th>
                    <th className="text-left py-2 text-[#8a8a8a] font-medium hidden lg:table-cell">Location</th>
                    <th className="text-left py-2 text-[#8a8a8a] font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssessments.map((assessment) => (
                    <tr key={assessment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-[#0b1f1a]">{assessment.id}</td>
                      <td className="py-3 text-[#0b1f1a] font-medium">{assessment.farm}</td>
                      <td className="py-3 text-[#8a8a8a] hidden lg:table-cell">{assessment.location}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            assessment.status === "Good"
                              ? "bg-[#1a6b58] text-white"
                              : assessment.status === "Moderate"
                              ? "bg-[#fbbf24] text-white"
                              : "bg-[#c2410c] text-white"
                          }`}
                        >
                          {assessment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Risk by Dzongkhag */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-lg p-4 lg:p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0b1f1a] text-lg lg:text-xl font-bold">Risk by Dzongkhag</h3>
              <button className="text-[#1a6b58] text-sm font-medium hover:underline">View Map →</button>
            </div>
            <div className="space-y-3">
              {riskByDzongkhag.map((item) => (
                <div key={item.dzongkhag} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#1a6b58]" />
                      <span className="text-[#0b1f1a] font-bold">{item.dzongkhag}</span>
                    </div>
                    <span className="text-[#8a8a8a] text-sm">{item.low + item.medium + item.high + item.critical} farms</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-[#1a6b58] h-2 rounded" style={{ width: `${(item.low / 60) * 100}%` }} title={`Low: ${item.low}`} />
                    <div className="flex-1 bg-[#fbbf24] h-2 rounded" style={{ width: `${(item.medium / 60) * 100}%` }} title={`Medium: ${item.medium}`} />
                    <div className="flex-1 bg-[#fb923c] h-2 rounded" style={{ width: `${(item.high / 60) * 100}%` }} title={`High: ${item.high}`} />
                    {item.critical > 0 && <div className="flex-1 bg-[#c2410c] h-2 rounded" style={{ width: `${(item.critical / 60) * 100}%` }} title={`Critical: ${item.critical}`} />}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
