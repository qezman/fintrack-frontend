import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Receipt, LogOut, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface SidebarProps {
  onClose?: () => void;
}

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/transactions", label: "Transactions", icon: Receipt },
];

export const Sidebar = ({ onClose }: SidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 400);
  };

  return (
    <>
      <aside className="w-[var(--sidebar-width)] h-full glass-panel flex flex-col border-r border-[var(--border)] relative z-40">
        <div className="flex items-center justify-between h-[72px] px-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <span className="font-heading text-lg font-bold text-[var(--text-primary)] tracking-wide ">
              FinTrack
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-2 -mr-2 text-[var(--text-secondary)] hover:text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <div className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-[0.1em] mb-4 px-3">
            Menu
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium ${
                  isActive
                    ? "bg-gradient-to-r from-[rgba(14,165,233,0.15)] to-transparent text-[var(--accent-primary)] border-l-2 border-[var(--accent-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-input)] hover:text-[var(--text-primary)] border-l-2 border-transparent"
                }`
              }
            >
              <item.icon size={18} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--border)]">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex cursor-pointer items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--expense-dim)] hover:text-[var(--expense)] transition-colors font-medium"
          >
            <LogOut size={18} strokeWidth={2} />
            Sign Out
          </button>
        </div>
      </aside>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out of FinTrack?"
        confirmLabel="Sign Out"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        isLoading={isLoggingOut}
      />
    </>
  );
};
