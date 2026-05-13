import { ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  permission?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, permission, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  if (permission && !hasPermission(permission)) {
    return fallback || (
      <div className="flex-1 bg-[#e7efe9] p-8 flex items-center justify-center" style={{ fontFamily: 'Manrope, sans-serif' }}>
        <div className="bg-white rounded-lg p-8 shadow-sm text-center max-w-md">
          <h2 className="text-2xl font-bold text-[#0b1f1a] mb-4">Access Denied</h2>
          <p className="text-[#8a8a8a] mb-6">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
