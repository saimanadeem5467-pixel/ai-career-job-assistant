import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Sparkles,
  
  Briefcase,
  Map,



  Settings,
  LogOut,
  X,
  MessageSquare,
} from "lucide-react";
import "./Sidebar.css";

// Nav items live in one place so Sidebar + future breadcrumbs/page titles
// can stay in sync without duplicating strings.
const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/MyProfile", label: "My Profile", icon: User },
  { to: "/resume-builder", label: "Resume Builder", icon: FileText },
  { to: "/AICareerAdvisor", label: "AI Career Advisor", icon: Sparkles },

  { to: "/job-matches", label: "Job Matches", icon: Briefcase },
  { to: "/learning-roadmap", label: "Learning Roadmap", icon: Map },

  {to:"/interview-pre",label:"InterviewPre",icon: MessageSquare},

  { to: "/settings", label: "Settings", icon: Settings },
];

/**
 * Sidebar
 * @param {boolean} isOpen - controls mobile drawer visibility
 * @param {() => void} onClose - closes the mobile drawer
 * @param {() => void} onLogout - wire this to your existing Supabase signOut()
 */
export default function Sidebar({ isOpen, onClose, onLogout }) {
  return (
    <>
      {/* Backdrop only exists on mobile, behind the drawer */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand">
            <span className="brand-mark">
              <Sparkles size={18} strokeWidth={2.5} />
            </span>
            <span className="brand-name">Career Assistant</span>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? "nav-item--active" : ""}`}
              onClick={onClose}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item nav-item--logout" onClick={onLogout}>
            <LogOut size={18} strokeWidth={2} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
