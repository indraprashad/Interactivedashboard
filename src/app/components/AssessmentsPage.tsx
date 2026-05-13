import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  Download,
  Eye,
  MapPin,
  Plus,
  CalendarDays,
  ClipboardCheck,
  AlertTriangle,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

const assessmentsData = [
  {
    id: "ASM-1284",
    date: "2025-03-15",
    farm: "Lhamo Poultry Farm",
    type: "Poultry",
    dzongkhag: "Thimphu",
    gewog: "Chang",
    score: 2.15,
    nc: 5,
    status: "Good",
    inspector: "K. Dorji",
    priority: "Normal",
  },
  {
    id: "ASM-1283",
    date: "2025-03-14",
    farm: "Dorji Piggery",
    type: "Pig",
    dzongkhag: "Paro",
    gewog: "Doteng",
    score: 1.85,
    nc: 8,
    status: "Moderate",
    inspector: "T. Wangmo",
    priority: "Medium",
  },
  {
    id: "ASM-1282",
    date: "2025-03-14",
    farm: "Sonam Poultry",
    type: "Poultry",
    dzongkhag: "Punakha",
    gewog: "Kabisa",
    score: 1.2,
    nc: 12,
    status: "Non-compliant",
    inspector: "P. Tshering",
    priority: "High",
  },
  {
    id: "ASM-1281",
    date: "2025-03-13",
    farm: "Tashi Cattle Farm",
    type: "Cattle",
    dzongkhag: "Bumthang",
    gewog: "Chhoekhor",
    score: 2.45,
    nc: 3,
    status: "Good",
    inspector: "S. Lhamo",
    priority: "Normal",
  },
  {
    id: "ASM-1280",
    date: "2025-03-13",
    farm: "Namgay Piggery",
    type: "Pig",
    dzongkhag: "Thimphu",
    gewog: "Mewang",
    score: 1.67,
    nc: 10,
    status: "Moderate",
    inspector: "K. Dorji",
    priority: "Medium",
  },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Good":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "Moderate":
      return "bg-amber-100 text-amber-700 border border-amber-200";
    default:
      return "bg-red-100 text-red-700 border border-red-200";
  }
};

export function AssessmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredAssessments = useMemo(() => {
    return assessmentsData.filter((assessment) => {
      const matchesSearch =
        assessment.farm
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assessment.id
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "All" ||
        assessment.type === filterType;

      const matchesStatus =
        filterStatus === "All" ||
        assessment.status === filterStatus;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [searchTerm, filterType, filterStatus]);

  const stats = [
    {
      title: "Total Assessments",
      value: "919",
      icon: ClipboardCheck,
    },
    {
      title: "Good Compliance",
      value: "624",
      icon: ShieldCheck,
    },
    {
      title: "Moderate Risk",
      value: "198",
      icon: AlertTriangle,
    },
    {
      title: "High Priority",
      value: "97",
      icon: CalendarDays,
    },
  ];

  return (
    <div
      className="
        min-h-screen
        bg-[#eef4ef]
        p-4 lg:p-8
      "
      style={{
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto max-w-[1600px]"
      >
        {/* Header */}
        <div
          className="
            relative overflow-hidden
            rounded-[32px]
            bg-gradient-to-r
            from-[#0f2a22]
            via-[#16392f]
            to-[#1b4a3c]
            p-6 lg:p-8
            shadow-2xl
          "
        >
          <div
            className="
              absolute -top-24 -right-24
              h-72 w-72
              rounded-full
              bg-white/5 blur-3xl
            "
          />

          <div
            className="
              relative z-10
              flex flex-col gap-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              <p
                className="
                  text-sm font-medium
                  text-[#b7d0c2]
                "
              >
                Assessments / FY 2025-26
              </p>

              <h1
                className="
                  mt-2
                  text-3xl lg:text-5xl
                  font-extrabold tracking-tight
                  text-white
                "
              >
                Assessments
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm lg:text-base
                  text-[#d4e5dc]
                "
              >
                Manage farm biosecurity assessments,
                inspection records, compliance
                scoring, and monitoring activities
                across Bhutan.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                className="
                  flex items-center gap-2
                  rounded-2xl
                  border border-white/15
                  bg-white/10
                  px-5 py-3
                  text-sm font-semibold
                  text-white
                  backdrop-blur-md
                  transition-all duration-200
                  hover:bg-white/20
                "
              >
                <Download className="h-4 w-4" />
                Export
              </button>

              <button
                className="
                  flex items-center gap-2
                  rounded-2xl
                  bg-white
                  px-5 py-3
                  text-sm font-semibold
                  text-[#0f2a22]
                  shadow-lg
                  transition-all duration-200
                  hover:scale-[1.02]
                "
              >
                <Plus className="h-4 w-4" />
                New Assessment
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          className="
            mt-6
            grid grid-cols-1 gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.06,
                }}
                className="
                  rounded-3xl
                  border border-white/60
                  bg-white/80
                  p-5
                  shadow-sm
                  backdrop-blur-xl
                "
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className="
                        text-sm font-medium
                        text-[#7d8b84]
                      "
                    >
                      {item.title}
                    </p>

                    <h3
                      className="
                        mt-3
                        text-3xl
                        font-extrabold
                        text-[#102821]
                      "
                    >
                      {item.value}
                    </h3>
                  </div>

                  <div
                    className="
                      flex h-12 w-12
                      items-center justify-center
                      rounded-2xl
                      bg-[#edf5f0]
                    "
                  >
                    <Icon className="h-6 w-6 text-[#1a6b58]" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <div
          className="
            mt-6
            rounded-[28px]
            border border-white/60
            bg-white/80
            p-5
            shadow-sm
            backdrop-blur-xl
          "
        >
          <div
            className="
              flex flex-col gap-4
              xl:flex-row
              xl:items-center
            "
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="
                  absolute left-4 top-1/2
                  h-5 w-5
                  -translate-y-1/2
                  text-[#7d8b84]
                "
              />

              <input
                type="text"
                placeholder="Search by assessment ID or farm name..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="
                  h-14 w-full
                  rounded-2xl
                  border border-[#dbe6df]
                  bg-[#f7faf8]
                  pl-12 pr-4
                  text-sm
                  outline-none
                  transition-all duration-200
                  focus:border-[#1a6b58]
                  focus:ring-4
                  focus:ring-[#1a6b58]/10
                "
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div
                className="
                  flex items-center gap-2
                  rounded-2xl
                  border border-[#dbe6df]
                  bg-[#f7faf8]
                  px-4
                "
              >
                <SlidersHorizontal className="h-4 w-4 text-[#7d8b84]" />

                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(e.target.value)
                  }
                  className="
                    h-14
                    bg-transparent
                    text-sm font-medium
                    outline-none
                  "
                >
                  <option value="All">
                    All Types
                  </option>
                  <option value="Poultry">
                    Poultry
                  </option>
                  <option value="Cattle">
                    Cattle
                  </option>
                  <option value="Pig">Pig</option>
                </select>
              </div>

              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value)
                }
                className="
                  h-14
                  rounded-2xl
                  border border-[#dbe6df]
                  bg-[#f7faf8]
                  px-4
                  text-sm font-medium
                  outline-none
                  focus:border-[#1a6b58]
                "
              >
                <option value="All">
                  All Status
                </option>
                <option value="Good">
                  Good
                </option>
                <option value="Moderate">
                  Moderate
                </option>
                <option value="Non-compliant">
                  Non-compliant
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div
          className="
            mt-6 overflow-hidden
            rounded-[32px]
            border border-white/60
            bg-white/85
            shadow-sm
            backdrop-blur-xl
          "
        >
          <div
            className="
    overflow-hidden
    rounded-[28px]
    border border-[#d7e1e5]
    bg-white
    shadow-[0_4px_20px_rgba(15,23,42,0.04)]
  "
          >
            {/* Filters */}
            <div className="border-b border-[#dfe7ea] bg-[#f8fbfc] p-4">
              <div className="flex flex-col gap-4 lg:flex-row">
                {/* Search */}
                <div className="relative flex-1">
                  <Search
                    className="
            absolute left-4 top-1/2
            h-5 w-5
            -translate-y-1/2
            text-[#6b7c85]
          "
                  />

                  <input
                    type="text"
                    placeholder="Search by ID or farm..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    className="
            h-14 w-full
            rounded-2xl
            border border-[#cfd8dc]
            bg-white
            pl-12 pr-4
            text-[15px]
            text-[#102821]
            outline-none
            transition-all duration-200
            placeholder:text-[#7c8c94]
            focus:border-[#1a6b58]
            focus:ring-4
            focus:ring-[#1a6b58]/10
          "
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value)
                  }
                  className="
          h-14 min-w-[220px]
          rounded-2xl
          border border-[#cfd8dc]
          bg-white
          px-4
          text-[15px]
          text-[#102821]
          outline-none
          transition-all duration-200
          focus:border-[#1a6b58]
          focus:ring-4
          focus:ring-[#1a6b58]/10
        "
                >
                  <option value="All">
                    All Status
                  </option>

                  <option value="Good">
                    Good
                  </option>

                  <option value="Moderate">
                    Moderate
                  </option>

                  <option value="Non-compliant">
                    Non-compliant
                  </option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                {/* Header */}
                <thead className="bg-[#edf3f5]">
                  <tr>
                    {[
                      "ID",
                      "FARM",
                      "DZONGKHAG",
                      "DATE",
                      "INSPECTOR",
                      "SCORE",
                      "NC",
                      "STATUS",
                    ].map((header) => (
                      <th
                        key={header}
                        className="
                px-6 py-5
                text-left
                text-[13px]
                font-extrabold
                uppercase
                tracking-[0.04em]
                text-[#53636c]
              "
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {filteredAssessments.map(
                    (assessment, index) => (
                      <motion.tr
                        key={assessment.id}
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.03,
                        }}
                        className="
                border-b border-[#dfe7ea]
                bg-white
                transition-all duration-200
                hover:bg-[#f8fbfc]
              "
                      >
                        {/* ID */}
                        <td
                          className="
                  px-6 py-5
                  text-[16px]
                  font-semibold
                  text-[#0f6c7b]
                "
                        >
                          {assessment.id}
                        </td>

                        {/* Farm */}
                        <td
                          className="
                  px-6 py-5
                  text-[16px]
                  font-semibold
                  text-[#102821]
                "
                        >
                          {assessment.farm}
                        </td>

                        {/* Dzongkhag */}
                        <td
                          className="
                  px-6 py-5
                  text-[16px]
                  text-[#556972]
                "
                        >
                          {assessment.dzongkhag}
                        </td>

                        {/* Date */}
                        <td
                          className="
                  px-6 py-5
                  text-[16px]
                  text-[#556972]
                "
                        >
                          {assessment.date}
                        </td>

                        {/* Inspector */}
                        <td
                          className="
                  px-6 py-5
                  text-[16px]
                  text-[#556972]
                "
                        >
                          {assessment.inspector}
                        </td>

                        {/* Score */}
                        <td className="px-6 py-5">
                          <div
                            className="
                    inline-flex items-center gap-2
                    rounded-full
                    bg-[#ef2d2d]
                    px-4 py-2
                    text-sm font-bold
                    text-white
                    shadow-sm
                  "
                          >
                            <div
                              className="
                      h-2 w-2 rounded-full
                      bg-white
                    "
                            />

                            Poor · {assessment.score}
                          </div>
                        </td>

                        {/* NC */}
                        <td
                          className="
                  px-6 py-5
                  text-[16px]
                  text-[#556972]
                "
                        >
                          {assessment.nc}
                        </td>

                        {/* Status */}
                        <td
                          className="
                  px-6 py-5
                  text-[16px]
                  font-medium
                  text-[#1f2937]
                "
                        >
                          {assessment.status}
                        </td>
                      </motion.tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div
            className="
              flex flex-col gap-4
              border-t border-[#edf1ee]
              bg-[#fafcfb]
              px-6 py-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <p className="text-sm text-[#7d8b84]">
              Showing{" "}
              <span className="font-bold text-[#102821]">
                {filteredAssessments.length}
              </span>{" "}
              assessments
            </p>

            <div className="flex items-center gap-2">
              <button
                className="
                  rounded-xl
                  border border-[#dbe6df]
                  bg-white
                  px-4 py-2
                  text-sm font-medium
                  text-[#55635c]
                  hover:bg-[#f4f7f5]
                "
              >
                Previous
              </button>

              <button
                className="
                  rounded-xl
                  bg-[#1a6b58]
                  px-4 py-2
                  text-sm font-semibold
                  text-white
                "
              >
                1
              </button>

              <button
                className="
                  rounded-xl
                  border border-[#dbe6df]
                  bg-white
                  px-4 py-2
                  text-sm font-medium
                  text-[#55635c]
                  hover:bg-[#f4f7f5]
                "
              >
                2
              </button>

              <button
                className="
                  rounded-xl
                  border border-[#dbe6df]
                  bg-white
                  px-4 py-2
                  text-sm font-medium
                  text-[#55635c]
                  hover:bg-[#f4f7f5]
                "
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}