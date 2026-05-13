import { useState } from "react";
import { motion } from "motion/react";
import { Search, UserPlus, Edit, Trash2, Shield, MapPin, Mail, Phone } from "lucide-react";

const users = [
  {
    id: "U001",
    name: "Soho Tshering",
    email: "soho.t@bbas.gov.bt",
    role: "Administrator",
    dzongkhag: "National",
    status: "Active",
    lastLogin: "2025-03-15"
  },
  {
    id: "U002",
    name: "Kinley Wangmo",
    email: "kinley.w@bbas.gov.bt",
    role: "Inspector",
    dzongkhag: "Thimphu",
    status: "Active",
    lastLogin: "2025-03-14"
  },
  {
    id: "U003",
    name: "Pema Dorji",
    email: "pema.d@bbas.gov.bt",
    role: "Veterinarian",
    dzongkhag: "Paro",
    status: "Active",
    lastLogin: "2025-03-13"
  },
  {
    id: "U004",
    name: "Tshering Lhamo",
    email: "tshering.l@bbas.gov.bt",
    role: "Inspector",
    dzongkhag: "Punakha",
    status: "Active",
    lastLogin: "2025-03-12"
  },
  {
    id: "U005",
    name: "Dorji Wangchuk",
    email: "dorji.w@bbas.gov.bt",
    role: "Veterinarian",
    dzongkhag: "Bumthang",
    status: "Active",
    lastLogin: "2025-03-10"
  },
  {
    id: "U006",
    name: "Ugyen Tshomo",
    email: "ugyen.t@bbas.gov.bt",
    role: "Viewer",
    dzongkhag: "Thimphu",
    status: "Inactive",
    lastLogin: "2025-02-28"
  },
];

const roleColors: Record<string, string> = {
  Administrator: "#c2410c",
  Inspector: "#1a6b58",
  Veterinarian: "#fbbf24",
  Viewer: "#8a8a8a"
};

const pppsConfig = [
  { name: "Livestock Officer", role: "Inspector", count: 12 },
  { name: "Veterinary Doctor", role: "Veterinarian", count: 8 },
  { name: "Laboratory Technician", role: "Viewer", count: 5 },
  { name: "Farm Owner", role: "Viewer", count: 1284 },
];

export function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All" || user.role === filterRole;
    return matchesSearch && matchesRole;
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
          <p className="text-[#8a8a8a] text-sm mb-1">Users & Roles</p>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-[#0b1f1a] text-2xl lg:text-3xl font-bold">System administration</h2>
              <p className="text-[#8a8a8a] text-sm">Manage user access and permissions</p>
            </div>
            <button className="px-4 py-2 bg-[#1a6b58] text-white rounded-lg text-sm font-medium hover:bg-[#0b1f1a] flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-[#8a8a8a] text-sm mb-2">Total Users</p>
            <p className="text-2xl lg:text-3xl font-bold text-[#0b1f1a]">1,309</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-[#8a8a8a] text-sm mb-2">Active Users</p>
            <p className="text-2xl lg:text-3xl font-bold text-[#1a6b58]">25</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-[#8a8a8a] text-sm mb-2">Inspectors</p>
            <p className="text-2xl lg:text-3xl font-bold text-[#0b1f1a]">12</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-[#8a8a8a] text-sm mb-2">Administrators</p>
            <p className="text-2xl lg:text-3xl font-bold text-[#c2410c]">3</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users Table */}
          <div className="lg:col-span-2">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a8a8a]" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a6b58]"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a6b58] bg-white"
                >
                  <option value="All">All Roles</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Inspector">Inspector</option>
                  <option value="Veterinarian">Veterinarian</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Name</th>
                      <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden lg:table-cell">Email</th>
                      <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Role</th>
                      <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden xl:table-cell">Dzongkhag</th>
                      <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Status</th>
                      <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-[#0b1f1a] font-bold text-sm">{user.name}</p>
                            <p className="text-[#8a8a8a] text-xs lg:hidden">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#8a8a8a] text-sm hidden lg:table-cell">{user.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className="px-2 py-1 rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: roleColors[user.role] }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#8a8a8a] text-sm hidden xl:table-cell">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {user.dzongkhag}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              user.status === "Active"
                                ? "bg-[#1a6b58] text-white"
                                : "bg-[#8a8a8a] text-white"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <Edit className="w-4 h-4 text-[#1a6b58]" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <Trash2 className="w-4 h-4 text-[#c2410c]" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* PPPS Configuration Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-[#1a6b58]" />
                <h3 className="text-[#0b1f1a] text-lg font-bold">PPPS Configuration</h3>
              </div>
              <div className="space-y-3">
                {pppsConfig.map((config, index) => (
                  <div key={index} className="pb-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[#0b1f1a] font-bold text-sm">{config.name}</p>
                      <span className="text-[#8a8a8a] text-sm">{config.count}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: roleColors[config.role] }}
                      >
                        {config.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-[#0b1f1a] text-lg font-bold mb-4">Audit Log</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-[#0b1f1a] font-bold">User added</p>
                  <p className="text-[#8a8a8a] text-xs">K. Dorji added new user</p>
                  <p className="text-[#8a8a8a] text-xs">2 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="text-[#0b1f1a] font-bold">Role updated</p>
                  <p className="text-[#8a8a8a] text-xs">P. Tshering role changed</p>
                  <p className="text-[#8a8a8a] text-xs">5 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="text-[#0b1f1a] font-bold">User deactivated</p>
                  <p className="text-[#8a8a8a] text-xs">S. Lhamo deactivated</p>
                  <p className="text-[#8a8a8a] text-xs">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
