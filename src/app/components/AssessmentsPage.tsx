import { useState } from "react";
import { motion } from "motion/react";
import { Search, Filter, Download, Eye, Calendar, MapPin } from "lucide-react";

const assessmentsData = [
  {
    id: "ASM-1284",
    date: "2025-03-15",
    farm: "Lhamo Poultry Farm",
    type: "Poultry",
    dzongkhag: "Thimphu",
    gewog: "Chang",
    score: 2.15,
    status: "Good",
    inspector: "K. Dorji",
    priority: "Normal"
  },
  {
    id: "ASM-1283",
    date: "2025-03-14",
    farm: "Dorji Piggery",
    type: "Pig",
    dzongkhag: "Paro",
    gewog: "Doteng",
    score: 1.85,
    status: "Moderate",
    inspector: "T. Wangmo",
    priority: "Medium"
  },
  {
    id: "ASM-1282",
    date: "2025-03-14",
    farm: "Sonam Poultry",
    type: "Poultry",
    dzongkhag: "Punakha",
    gewog: "Kabisa",
    score: 1.20,
    status: "Non-compliant",
    inspector: "P. Tshering",
    priority: "High"
  },
  {
    id: "ASM-1281",
    date: "2025-03-13",
    farm: "Tashi Cattle Farm",
    type: "Cattle",
    dzongkhag: "Bumthang",
    gewog: "Chhoekhor",
    score: 2.45,
    status: "Good",
    inspector: "S. Lhamo",
    priority: "Normal"
  },
  {
    id: "ASM-1280",
    date: "2025-03-13",
    farm: "Namgay Piggery",
    type: "Pig",
    dzongkhag: "Thimphu",
    gewog: "Mewang",
    score: 1.67,
    status: "Moderate",
    inspector: "K. Dorji",
    priority: "Medium"
  },
  {
    id: "ASM-1279",
    date: "2025-03-12",
    farm: "Pema Poultry",
    type: "Poultry",
    dzongkhag: "Paro",
    gewog: "Lamgong",
    score: 2.30,
    status: "Good",
    inspector: "T. Wangmo",
    priority: "Normal"
  },
  {
    id: "ASM-1278",
    date: "2025-03-12",
    farm: "Ugyen Dairy",
    type: "Cattle",
    dzongkhag: "Thimphu",
    gewog: "Genye",
    score: 1.95,
    status: "Moderate",
    inspector: "S. Lhamo",
    priority: "Medium"
  },
  {
    id: "ASM-1277",
    date: "2025-03-11",
    farm: "Rinchen Poultry",
    type: "Poultry",
    dzongkhag: "Punakha",
    gewog: "Toewang",
    score: 1.40,
    status: "Non-compliant",
    inspector: "P. Tshering",
    priority: "High"
  },
];

export function AssessmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredAssessments = assessmentsData.filter((assessment) => {
    const matchesSearch = assessment.farm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || assessment.type === filterType;
    const matchesStatus = filterStatus === "All" || assessment.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

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
          <p className="text-[#8a8a8a] text-sm mb-1">Assessments / FY 2025-26</p>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-[#0b1f1a] text-2xl lg:text-3xl font-bold">Assessments</h2>
              <p className="text-[#8a8a8a] text-sm">919 assessments in FY 2025-26</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-[#8a8a8a] text-[#0b1f1a] rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="px-4 py-2 bg-[#1a6b58] text-white rounded-lg text-sm font-medium hover:bg-[#0b1f1a] flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule New
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a8a8a]" />
              <input
                type="text"
                placeholder="Search by farm name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a6b58]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a6b58] bg-white"
              >
                <option value="All">All Types</option>
                <option value="Poultry">Poultry</option>
                <option value="Cattle">Cattle</option>
                <option value="Pig">Pig</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a6b58] bg-white"
              >
                <option value="All">All Status</option>
                <option value="Good">Good</option>
                <option value="Moderate">Moderate</option>
                <option value="Non-compliant">Non-compliant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assessments Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">ID</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Date</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Farm</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden lg:table-cell">Type</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden lg:table-cell">Dzongkhag</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden xl:table-cell">Score</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Status</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden xl:table-cell">Inspector</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessments.map((assessment, index) => (
                  <motion.tr
                    key={assessment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-[#0b1f1a] font-medium text-sm">{assessment.id}</td>
                    <td className="py-3 px-4 text-[#8a8a8a] text-sm">{assessment.date}</td>
                    <td className="py-3 px-4 text-[#0b1f1a] font-bold text-sm">{assessment.farm}</td>
                    <td className="py-3 px-4 text-[#8a8a8a] text-sm hidden lg:table-cell">{assessment.type}</td>
                    <td className="py-3 px-4 text-[#8a8a8a] text-sm hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {assessment.dzongkhag}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#0b1f1a] font-bold text-sm hidden xl:table-cell">{assessment.score}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
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
                    <td className="py-3 px-4 text-[#8a8a8a] text-sm hidden xl:table-cell">{assessment.inspector}</td>
                    <td className="py-3 px-4">
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-[#1a6b58]" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <p className="text-[#8a8a8a] text-sm">
              Showing {filteredAssessments.length} of {assessmentsData.length} assessments
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
