import { useState } from "react";
import { motion } from "motion/react";
import { Home, MapPin, Phone, User, Calendar, FileText, TrendingUp, CheckCircle, XCircle, AlertCircle, LineChart } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const scoreHistory = [
  { date: "Apr", score: 1.8 },
  { date: "Jun", score: 1.9 },
  { date: "Aug", score: 2.0 },
  { date: "Oct", score: 2.1 },
  { date: "Dec", score: 2.15 },
];

const checklist = [
  { id: 1, item: "Farm has designated biosecurity personnel", status: "Good", score: "Full" },
  { id: 2, item: "Biosecurity signboard at entrance", status: "Good", score: "Full" },
  { id: 3, item: "Functional hand-wash at entrance", status: "Poor", score: "Fail" },
  { id: 4, item: "Functional foot-bath at entrance", status: "Good", score: "Full" },
  { id: 5, item: "Hand-wash before entering", status: "Poor", score: "Fail" },
  { id: 6, item: "Disinfection of equipment", status: "Good", score: "Partial" },
  { id: 7, item: "Disposal of carcasses", status: "Good", score: "Full" },
  { id: 8, item: "Disease surveillance", status: "Good", score: "Full" },
];

const assessmentHistory = [
  { date: "2025-03-15", assessmentId: "ASM-1284", inspector: "K. Dorji", score: 2.15, status: "Good" },
  { date: "2024-12-10", assessmentId: "ASM-985", inspector: "K. Dorji", score: 2.1, status: "Good" },
  { date: "2024-10-05", assessmentId: "ASM-762", inspector: "T. Wangmo", score: 2.0, status: "Moderate" },
  { date: "2024-08-12", assessmentId: "ASM-543", inspector: "K. Dorji", score: 1.9, status: "Moderate" },
];

export function FarmRegistryPage() {
  const [activeTab, setActiveTab] = useState("overview");

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
          <p className="text-[#8a8a8a] text-sm mb-1">Farm Registry / FRM-1002 / Lhamo Poultry</p>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Home className="w-8 h-8 lg:w-10 lg:h-10 text-[#1a6b58]" />
              </div>
              <div>
                <h2 className="text-[#0b1f1a] text-2xl lg:text-3xl font-bold">Lhamo Poultry Farm</h2>
                <p className="text-[#1a6b58] text-sm font-medium mt-1">Active since 2022</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-[#1a6b58] text-white rounded-lg text-sm font-medium hover:bg-[#0b1f1a]">
              Schedule Assessment
            </button>
          </div>
        </div>

        {/* Farm Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[#1a6b58]" />
              <p className="text-[#8a8a8a] text-sm">Latest Score</p>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-[#1a6b58]">2.15</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-[#1a6b58]" />
              <p className="text-[#8a8a8a] text-sm">Score History</p>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-[#0b1f1a]">6</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-[#fb923c]" />
              <p className="text-[#8a8a8a] text-sm">Active NC</p>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-[#fb923c]">2</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-[#1a6b58]" />
              <p className="text-[#8a8a8a] text-sm">Last Assessed</p>
            </div>
            <p className="text-sm lg:text-base font-bold text-[#0b1f1a]">Mar 15, '25</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
          <div className="flex border-b border-gray-200 min-w-max">
            {[
              { id: "overview", label: "Overview" },
              { id: "checklist", label: "Checklist" },
              { id: "history", label: "Assessment History" },
              { id: "documents", label: "Documents" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-bold text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-[#1a6b58] border-b-2 border-[#1a6b58]"
                    : "text-[#8a8a8a] hover:text-[#0b1f1a]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Farm Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-[#0b1f1a] text-xl font-bold mb-4">Farm Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#1a6b58] mt-1" />
                  <div>
                    <p className="text-[#8a8a8a] text-sm">Owner</p>
                    <p className="text-[#0b1f1a] font-bold">Lhamo Dorji</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#1a6b58] mt-1" />
                  <div>
                    <p className="text-[#8a8a8a] text-sm">Location</p>
                    <p className="text-[#0b1f1a] font-bold">Chang, Thimphu</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#1a6b58] mt-1" />
                  <div>
                    <p className="text-[#8a8a8a] text-sm">Contact</p>
                    <p className="text-[#0b1f1a] font-bold">17123456</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-[#1a6b58] mt-1" />
                  <div>
                    <p className="text-[#8a8a8a] text-sm">Farm Type</p>
                    <p className="text-[#0b1f1a] font-bold">Poultry - Layer</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-[#1a6b58] mt-1" />
                  <div>
                    <p className="text-[#8a8a8a] text-sm">Registration</p>
                    <p className="text-[#0b1f1a] font-bold">FRM-1002</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#1a6b58] mt-1" />
                  <div>
                    <p className="text-[#8a8a8a] text-sm">PPPS Code</p>
                    <p className="text-[#0b1f1a] font-bold">PPPS-00123</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Score History Chart */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-[#0b1f1a] text-xl font-bold mb-4">Score History</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsLineChart data={scoreHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 3]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#1a6b58" strokeWidth={3} dot={{ fill: "#1a6b58", r: 5 }} />
                </RechartsLineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-[#f0f9f4] rounded-lg">
                <p className="text-[#1a6b58] font-bold text-sm">Improving Trend</p>
                <p className="text-[#8a8a8a] text-xs mt-1">Score has improved by 19% over the last 6 assessments</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "checklist" && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-gray-200">
              <h3 className="text-[#0b1f1a] text-xl font-bold">Checklist Evaluation</h3>
              <p className="text-[#8a8a8a] text-sm mt-1">From ASM-1284 • Excel</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">#</th>
                    <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Checklist Item</th>
                    <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Status</th>
                    <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {checklist.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-[#8a8a8a]">{index + 1}</td>
                      <td className="py-3 px-4 text-[#0b1f1a] font-medium">{item.item}</td>
                      <td className="py-3 px-4">
                        {item.status === "Good" ? (
                          <div className="flex items-center gap-2 text-[#1a6b58]">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-bold">Good</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[#c2410c]">
                            <XCircle className="w-4 h-4" />
                            <span className="text-sm font-bold">Poor</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.score === "Full"
                              ? "bg-[#1a6b58] text-white"
                              : item.score === "Partial"
                              ? "bg-[#fbbf24] text-white"
                              : "bg-[#c2410c] text-white"
                          }`}
                        >
                          {item.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 flex items-center justify-between">
              <p className="text-[#8a8a8a] text-sm">Overall compliance: 75%</p>
              <div className="w-48 bg-gray-200 rounded-full h-2">
                <div className="bg-[#1a6b58] h-2 rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-gray-200">
              <h3 className="text-[#0b1f1a] text-xl font-bold">Assessment History</h3>
              <p className="text-[#8a8a8a] text-sm mt-1">All assessments for this farm</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Date</th>
                    <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Assessment ID</th>
                    <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Inspector</th>
                    <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Score</th>
                    <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assessmentHistory.map((assessment) => (
                    <tr key={assessment.assessmentId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-[#0b1f1a]">{assessment.date}</td>
                      <td className="py-3 px-4 text-[#1a6b58] font-bold">{assessment.assessmentId}</td>
                      <td className="py-3 px-4 text-[#8a8a8a]">{assessment.inspector}</td>
                      <td className="py-3 px-4 text-[#0b1f1a] font-bold">{assessment.score}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            assessment.status === "Good"
                              ? "bg-[#1a6b58] text-white"
                              : "bg-[#fbbf24] text-white"
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
          </div>
        )}

        {activeTab === "documents" && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-[#0b1f1a] text-xl font-bold mb-4">Documents</h3>
            <p className="text-[#8a8a8a]">No documents uploaded yet.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
