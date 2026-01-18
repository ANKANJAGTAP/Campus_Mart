import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

import {
  FiMenu,
  FiX,
  FiHome,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiLogOut,
  FiBox,
  FiSun,
  FiMoon,
  FiSearch
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
import { FiBell } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount, notifications } = useNotification();
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isActive = (path) => location.pathname === path;
  const isMarketPage = location.pathname === "/items";

  const handleSearch = (e) => {
      const term = e.target.value;
      const newParams = new URLSearchParams(searchParams);
      if (term) {
          newParams.set("search", term);
      } else {
          newParams.delete("search");
      }
      setSearchParams(newParams);
  };
// ... existing components ...
  const ThemeToggle = () => (
    <button 
      onClick={(e) => {
        e.preventDefault();
        console.log('Toggle clicked, current:', theme);
        toggleTheme();
      }} 
      className="p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-slate-700 transition cursor-pointer text-text-primary"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      type="button"
    >
      {theme === 'dark' ? <FiSun className="text-yellow-400" size={20} /> : <FiMoon className="text-text-primary" size={20} />}
    </button>
  );

  const NotificationIcon = () => (
    <div className="relative">
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative cursor-pointer hover:bg-emerald-50 dark:hover:bg-green-100 p-2 rounded-full transition outline-none"
      >
        <FiBell size={20} className="text-text-primary " />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount > 4 ? '4+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showNotifications && (
        <>
        <div className="fixed inset-0 z-[90] z-index-50 " onClick={() => setShowNotifications(false)}></div>
        <div className="absolute right-0 mt-2 w-80 dark:bg-slate-700 bg-white rounded-xl shadow-lg border border-border-color overflow-hidden z-[100] animate-fade-in max-w-[90vw]">
            <div className="p-3 border-b border-border-color bg-surface">
                <h3 className="font-bold text-text-primary">Notifications</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-text-secondary text-sm">
                        No new notifications
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <Link 
                            key={notif.orderId}
                            to={`/order/${notif.orderId}`}
                            onClick={() => setShowNotifications(false)}
                            className="block p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition border-b border-border-color last:border-none"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-sm text-text-primary">{notif.senderName}</p>
                                    <p className="text-xs text-text-secondary truncate max-w-[180px]">{notif.lastMessage}</p>
                                </div>
                                {notif.count > 0 && (
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {notif.count} new
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
        </>
      )}
    </div>
  );

  const NavLinks = ({ mobile = false }) => {
    const linkBaseClass = mobile 
      ? "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
      : "relative px-1 py-2 text-sm font-medium transition-colors duration-200";

    const activeClass = mobile
      ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold"
      : "text-slate-900 dark:text-white";

    const inactiveClass = mobile
      ? "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white";

    const DesktopActiveIndicator = () => (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
    );

    return (
        <>
            <Link 
                to="/" 
                className={`${linkBaseClass} ${isActive("/") ? activeClass : inactiveClass}`}
                onClick={() => setOpen(false)}
            >
                <div className="flex items-center gap-2">
                    {mobile && <FiHome />}
                    <span>Home</span>
                </div>
                {!mobile && isActive("/") && <DesktopActiveIndicator />}
            </Link>

            {user ? (
                <>
                    <Link 
                        to="/orders" 
                        className={`${linkBaseClass} ${isActive("/orders") ? activeClass : inactiveClass}`}
                        onClick={() => setOpen(false)}
                    >
                        <div className="flex items-center gap-2">
                            {mobile && <FiShoppingBag />}
                            <span>Orders</span>
                        </div>
                        {!mobile && isActive("/orders") && <DesktopActiveIndicator />}
                    </Link>

                    <Link 
                        to="/items" 
                        className={`${linkBaseClass} ${isActive("/items") ? activeClass : inactiveClass}`}
                        onClick={() => setOpen(false)}
                    >
                        <div className="flex items-center gap-2">
                            {mobile && <FiBox />}
                            <span>Market</span>
                        </div>
                        {!mobile && isActive("/items") && <DesktopActiveIndicator />}
                    </Link>

                    <Link 
                        to="/favorite" 
                        className={`${linkBaseClass} ${isActive("/favorite") ? activeClass : inactiveClass}`}
                        onClick={() => setOpen(false)}
                    >
                        <div className="flex items-center gap-2">
                            {mobile && <FiHeart />}
                            <span>Favorites</span>
                        </div>
                        {!mobile && isActive("/favorite") && <DesktopActiveIndicator />}
                    </Link>

                    <div className={`h-6 w-px bg-slate-200 dark:bg-white/10 mx-2 ${mobile ? 'hidden' : 'block'}`}></div>

                    <Link 
                        to="/my-account" 
                        className={ mobile 
                            ? `${linkBaseClass} ${isActive("/my-account") ? activeClass : inactiveClass}`
                            : `flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-full transition-all duration-200 border ${isActive("/my-account") ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" : "border-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"}`
                        }
                        onClick={() => setOpen(false)}
                    >
                        {user.image ? (
                            <img src={user.image} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs">
                                <FiUser />
                            </div>
                        )}
                        <span className="text-sm font-medium">Account</span>
                    </Link>
                </>
            ) : (
                <>
                    <div className={`h-6 w-px bg-slate-200 dark:bg-white/10 mx-2 ${mobile ? 'hidden' : 'block'}`}></div>
                    <Link 
                        to="/login" 
                        className={`${linkBaseClass} ${inactiveClass}`} 
                        onClick={() => setOpen(false)}
                    >
                        Log In
                    </Link>
                    <Link 
                        to="/register" 
                        className={mobile 
                            ? "w-full text-center py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold mt-2" 
                            : "px-5 py-2 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition shadow-lg shadow-emerald-500/10"
                        } 
                        onClick={() => setOpen(false)}
                    >
                        Sign Up
                    </Link>
                </>
            )}
        </>
    );
  };

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 sm:h-20 bg-white/80 dark:bg-[#02040a]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">

          {/* Logo Area */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
             <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-heading font-black text-lg">
                 C
             </div>
             <span className="hidden sm:block text-xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">CampusMart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
             <NavLinks />
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
             <NotificationIcon />
             <ThemeToggle />
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-4 ml-auto">
            <NotificationIcon />
            <ThemeToggle />
            <button
                onClick={() => setOpen(true)}
                className="p-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition"
            >
                <FiMenu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white dark:bg-[#0B0E14] z-[70] transform ${
          open ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) shadow-2xl border-l border-slate-200 dark:border-white/5`}
      >
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 h-20 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
                <span className="font-bold font-heading text-lg text-slate-900 dark:text-white">Menu</span>
                <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition text-slate-500"
                >
                    <FiX size={24} />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
                <NavLinks mobile={true} />
            </div>
            
            {/* Footer */}
            {user && (
                <div className="p-6 border-t border-slate-100 dark:border-white/5">
                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition">
                        <FiLogOut /> Logout
                    </button>
                </div>
            )}
        </div>
      </aside>

      {/* Spacer to prevent content overlap */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;
