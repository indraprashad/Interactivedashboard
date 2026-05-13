import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Search, UserPlus, Edit, Trash2, Key, MapPin } from "lucide-react";
import { userService } from "../../services/userService";
import { useAuth } from "../../auth/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type UserRole =
  | "Administrator"
  | "Inspector"
  | "Veterinarian"
  | "Viewer"
  | "Supervisor";

const roleColors: Record<string, string> = {
  Administrator: "#c2410c",
  Inspector: "#1a6b58",
  Veterinarian: "#fbbf24",
  Viewer: "#8a8a8a",
  Supervisor: "#9333ea",
};

const PER_PAGE = 10;

export function UserManagementPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const [page, setPage] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Inspector" as UserRole,
    dzongkhag: "Thimphu",
    phone: "",
  });

  useEffect(() => {
    setUsers(userService.getAllUsers());
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user: any) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === "All" || user.role === filterRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterRole]);

  const totalPages = Math.ceil(filteredUsers.length / PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filteredUsers.slice(start, start + PER_PAGE);
  }, [filteredUsers, page]);

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "Inspector",
      dzongkhag: "Thimphu",
      phone: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setFormData(user);
    setIsDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      userService.updateUser(
        editingUser.id,
        formData,
        currentUser?.id || "system"
      );
    } else {
      userService.createUser(
        { ...formData, status: "Active" },
        currentUser?.id || "system"
      );
    }

    setUsers(userService.getAllUsers());
    setIsDialogOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Delete this user?")) {
      userService.deleteUser(userId, currentUser?.id || "system");
      setUsers(userService.getAllUsers());
    }
  };

  const handleToggleStatus = (user: any) => {
    if (user.status === "Active") {
      userService.deactivateUser(user.id, currentUser?.id || "system");
    } else {
      userService.activateUser(user.id, currentUser?.id || "system");
    }
    setUsers(userService.getAllUsers());
  };

  return (
    <div className="flex-1 bg-[#e7efe9] p-4 lg:p-8 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1400px] mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-xl p-5 mb-6 flex flex-col lg:flex-row justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0b1f1a]">
              User Management
            </h2>
            <p className="text-sm text-gray-500">
              Manage system users, roles, and access
            </p>
          </div>

          <button
            onClick={handleCreateUser}
            className="bg-[#1a6b58] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#0b1f1a]"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Search + Filter */}
        <div className="bg-white p-4 rounded-xl mb-4 flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="Administrator">Administrator</SelectItem>
              <SelectItem value="Inspector">Inspector</SelectItem>
              <SelectItem value="Veterinarian">Veterinarian</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
              <SelectItem value="Supervisor">Supervisor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-left">S/N</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left hidden md:table-cell">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left hidden lg:table-cell">
                  Dzongkhag
                </th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-6 text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">{index + 1}</td>
                    <td className="p-3 font-medium">{user.name}</td>

                    <td className="p-3 hidden md:table-cell text-gray-500">
                      {user.email}
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-1 text-xs rounded text-black">
                        {user.role}
                      </span>
                    </td>

                    <td className="p-3 hidden lg:table-cell text-gray-500">
                      {user.dzongkhag}
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 rounded ${user.status === "Active"
                            ? "text-green-900"
                            : "text-gray-600"
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="p-3 flex gap-2">
                      <button onClick={() => handleEditUser(user)}>
                        <Edit className="w-4 h-4 text-green-700" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user)}
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 bg-white p-3 rounded-xl">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages || 1}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>

            <Button
              variant="outline"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Dialog (unchanged but functional) */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Create User"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <Input
                placeholder="Email"
                value={formData.email}
                disabled={!!editingUser}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <DialogFooter>
              <Button onClick={handleSaveUser}>
                {editingUser ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}