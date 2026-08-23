import { useState } from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import "./Navbar.css";

/**
 * Navbar (top bar)
 * @param {() => void} onMenuClick - opens the mobile sidebar drawer
 * @param {{ full_name?: string, avatar_url?: string }} profile - from your Supabase profiles table
 */
export default function Navbar({ onMenuClick, profile }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = profile?.full_name || "there";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="navbar">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>

      <div className="navbar-search">
        <Search size={16} />
        <input type="text" placeholder="Search jobs, skills, roadmap…" />
      </div>

      <div className="navbar-actions">
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={19} />
          <span className="notif-dot" />
        </button>

        <div className="user-menu">
          <button className="user-menu-trigger" onClick={() => setMenuOpen((o) => !o)}>
            <span className="avatar">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} />
              ) : (
                initials || "U"
              )}
            </span>
            <ChevronDown size={16} />
          </button>

          {menuOpen && (
            <div className="user-menu-dropdown">
              <a href="/profile">My Profile</a>
              <a href="/settings">Settings</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
