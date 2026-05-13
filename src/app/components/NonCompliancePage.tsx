import { motion } from "motion/react";
import { AlertTriangle, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";

const stats = [
  { title: "Total NC", value: "108", subtitle: "Flagged - 31", color: "#c2410c" },
  { title: "Overdue", value: "14", subtitle: "Within 7d", color: "#8a8a8a" },
  { title: "Resolved", value: "52", subtitle: "Closed within", color: "#1a6b58" },
  { title: "In Progress", value: "23", subtitle: "30d Avg", color: "#fbbf24" },
];

const nonComplianceData = [
  {
    id: "NC-0312",
    farm: "Sonam Poultry",
    issue: "Functional hand-wash at entrance",
    severity: "High",
    flagged: "2025-02-15",
    deadline: "2025-04-01",
    status: "Flagged",
    dzongkhag: "Punakha"
  },
  {
    id: "NC-0311",
    farm: "Rinchen Poultry",
    issue: "Hand-wash before entering",
    severity: "High",
    flagged: "2025-02-10",
    deadline: "2025-03-27",
    status: "Flagged",
    dzongkhag: "Punakha"
  },
  {
    id: "NC-0310",
    farm: "Ugyen Dairy",
    issue: "Disposal of carcasses",
    severity: "Critical",
    flagged: "2025-02-05",
    deadline: "2025-03-22",
    status: "Overdue",
    dzongkhag: "Thimphu"
  },
  {
    id: "NC-0309",
    farm: "Namgay Piggery",
    issue: "Biosecurity signboard at entrance",
    severity: "Medium",
    flagged: "2025-01-28",
    deadline: "2025-03-15",
    status: "In Progress",
    dzongkhag: "Thimphu"
  },
  {
    id: "NC-0308",
    farm: "Tashi Cattle Farm",
    issue: "Functional foot-bath at entrance",
    severity: "Medium",
    flagged: "2025-01-20",
    deadline: "2025-03-07",
    status: "Resolved",
    dzongkhag: "Bumthang"
  },
  {
    id: "NC-0307",
    farm: "Dorji Piggery",
    issue: "Disease surveillance",
    severity: "High",
    flagged: "2025-01-15",
    deadline: "2025-03-01",
    status: "Resolved",
    dzongkhag: "Paro"
  },
  {
    id: "NC-0306",
    farm: "Pema Poultry",
    issue: "Disinfection of equipment",
    severity: "Medium",
    flagged: "2025-01-10",
    deadline: "2025-02-25",
    status: "Resolved",
    dzongkhag: "Paro"
  },
];

export function NonCompliancePage() {
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
          <p className="text-[#8a8a8a] text-sm mb-1">Non-compliance / Follow-up</p>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-[#0b1f1a] text-2xl lg:text-3xl font-bold">Non-compliance follow-up</h2>
              <p className="text-[#8a8a8a] text-sm">Track and resolve biosecurity issues</p>
            </div>
            <button className="px-4 py-2 bg-[#0b1f1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a2f2a] flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Report Dashboard
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white rounded-lg p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-[#1a6b58] text-sm lg:text-base font-bold mb-2">{stat.title}</h3>
              <p className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-[#8a8a8a] text-xs lg:text-sm">{stat.subtitle}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex gap-2 flex-wrap flex-1">
              <button className="px-4 py-2 bg-[#c2410c] text-white rounded-lg text-sm font-medium">
                Flagged - 31
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-[#0b1f1a] rounded-lg text-sm font-medium hover:bg-gray-50">
                Overdue - 14
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-[#0b1f1a] rounded-lg text-sm font-medium hover:bg-gray-50">
                In Progress - 23
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-[#0b1f1a] rounded-lg text-sm font-medium hover:bg-gray-50">
                All Status
              </button>
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a6b58] bg-white text-sm">
              <option>All Dzongkhags</option>
              <option>Thimphu</option>
              <option>Paro</option>
              <option>Punakha</option>
              <option>Bumthang</option>
            </select>
          </div>
        </div>

        {/* Non-Compliance Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">NC ID</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Farm</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden lg:table-cell">Issue</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden xl:table-cell">Severity</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden xl:table-cell">Flagged</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden lg:table-cell">Deadline</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Status</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {nonComplianceData.map((nc, index) => (
                  <motion.tr
                    key={nc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-[#0b1f1a] font-medium text-sm">{nc.id}</td>
                    <td className="py-3 px-4 text-[#0b1f1a] font-bold text-sm">{nc.farm}</td>
                    <td className="py-3 px-4 text-[#8a8a8a] text-sm hidden lg:table-cell max-w-xs truncate">
                      {nc.issue}
                    </td>
                    <td className="py-3 px-4 hidden xl:table-cell">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          nc.severity === "Critical"
                            ? "bg-[#c2410c] text-white"
                            : nc.severity === "High"
                            ? "bg-[#fb923c] text-white"
                            : "bg-[#fbbf24] text-white"
                        }`}
                      >
                        {nc.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#8a8a8a] text-sm hidden xl:table-cell">{nc.flagged}</td>
                    <td className="py-3 px-4 text-[#8a8a8a] text-sm hidden lg:table-cell">{nc.deadline}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                          nc.status === "Flagged"
                            ? "bg-[#c2410c] text-white"
                            : nc.status === "Overdue"
                            ? "bg-[#8a8a8a] text-white"
                            : nc.status === "In Progress"
                            ? "bg-[#fbbf24] text-white"
                            : "bg-[#1a6b58] text-white"
                        }`}
                      >
                        {nc.status === "Resolved" && <CheckCircle className="w-3 h-3" />}
                        {nc.status === "Overdue" && <XCircle className="w-3 h-3" />}
                        {nc.status === "In Progress" && <Clock className="w-3 h-3" />}
                        {nc.status === "Flagged" && <AlertTriangle className="w-3 h-3" />}
                        {nc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="px-3 py-1 bg-[#0b1f1a] text-white rounded text-xs font-medium hover:bg-[#1a2f2a]">
                        {nc.status === "Resolved" ? "View" : "Follow-up"}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col lg:flex-row items-center justify-between p-4 border-t border-gray-200 gap-4">
            <p className="text-[#8a8a8a] text-sm">
              Showing {nonComplianceData.length} of 108 non-compliance cases
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 bg-[#1a6b58] text-white rounded text-sm">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">3</button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
