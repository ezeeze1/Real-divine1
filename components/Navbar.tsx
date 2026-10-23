'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { UserRole } from '@/lib/types';
import { TabType } from './Sidebar';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  BookOpen,
  Bell,
  RefreshCw,
  Sparkles,
  ChevronDown,
  LogOut,
  Building2,
  PhoneCall,
  Mail,
  Menu,
  MonitorPlay,
  FileCheck2,
  LayoutDashboard,
  Megaphone,
} from 'lucide-react';

interface NavbarProps {
  activeTab?: TabType;
  setActiveTab?: (tab: TabType) => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'dashboard',
  setActiveTab,
  onToggleMobileMenu,
}) => {
  const { currentUser, switchUserRole, schoolProfile, resetDataToDefaults, logout, cbtExams, announcements } =
    useSchool();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);

  const activeCbtCount = cbtExams.filter((e) => e.status === 'Published').length;

  const rolesList: { role: UserRole; label: string; icon: React.ReactNode; badgeColor: string }[] = [
    {
      role: 'ADMIN',
      label: 'Administrator (Principal / VP)',
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      role: 'TEACHER',
      label: 'Subject Teacher (Mr. Ibrahim Sule)',
      icon: <UserCheck className="w-4 h-4 text-blue-600" />,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      role: 'STUDENT',
      label: 'Student (Divine Johnson - JSS1)',
      icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      role: 'PARENT',
      label: 'Parent (Chief Johnson)',
      icon: <BookOpen className="w-4 h-4 text-amber-600" />,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
  ];

  const currentRoleConfig = rolesList.find((r) => r.role === currentUser.role) || rolesList[0];

  const getTabLabel = (tab: TabType): string => {
    switch (tab) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'cbt':
        return 'CBT Examination System';
      case 'results':
        return 'Results & Report Cards';
      case 'curriculum':
        return 'Curriculum Centre (JSS-SS)';
      case 'timetable':
        return 'Class Timetable';
      case 'attendance':
        return 'Attendance Register';
      case 'students':
        return 'Student Directory';
      case 'teachers':
        return 'Teacher Directory';
      case 'classes':
        return 'Classes & Subjects';
      case 'announcements':
        return 'Announcements Board';
      case 'settings':
        return 'School Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      {/* Top Banner Accent */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white text-xs px-4 py-1.5 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-wide flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            {schoolProfile.name}
          </span>
          <span className="hidden sm:inline text-emerald-200">|</span>
          <span className="hidden sm:inline text-emerald-100 italic">&quot;{schoolProfile.motto}&quot;</span>
        </div>
        <div className="flex items-center gap-3 text-emerald-100 text-[11px]">
          <span>📍 {schoolProfile.address}</span>
          <span className="hidden md:inline bg-emerald-700/80 px-2 py-0.5 rounded-full font-medium text-amber-200 border border-emerald-600">
            {schoolProfile.currentSession} • {schoolProfile.currentTerm}
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Button + School Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              aria-label="Toggle navigation menu"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>
          )}

          <div
            onClick={() => setActiveTab && setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-sm border border-emerald-600">
              DA
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm sm:text-base leading-tight tracking-tight flex items-center gap-1.5">
                <span>Divine Academy</span>
                <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                  Portal
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                School Management & CBT System
              </p>
            </div>
          </div>
        </div>

        {/* Center: Desktop Quick Nav Shortcuts for Easy Navigation */}
        {setActiveTab && (
          <div className="hidden xl:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('cbt')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'cbt'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <MonitorPlay className="w-3.5 h-3.5 text-amber-500" />
              <span>CBT Exam</span>
              {activeCbtCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] flex items-center justify-center font-bold">
                  {activeCbtCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Results</span>
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'announcements'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5 text-blue-500" />
              <span>Notices</span>
            </button>
          </div>
        )}

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Active section pill on tablet/mobile */}
          <div className="hidden md:flex xl:hidden items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="truncate max-w-[130px]">{getTabLabel(activeTab)}</span>
          </div>

          {/* Quick Role Switcher Button */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl border bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 transition cursor-pointer shadow-2xs"
              title="Click to switch role view"
            >
              <span className="hidden sm:inline text-slate-500">Role:</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-bold ${currentRoleConfig.badgeColor}`}
              >
                {currentRoleConfig.icon}
                {currentUser.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                  <span>Switch Testing Role</span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                {rolesList.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      switchUserRole(item.role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 text-xs transition cursor-pointer ${
                      currentUser.role === item.role
                        ? 'bg-emerald-50/60 font-semibold text-emerald-900'
                        : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {currentUser.role === item.role && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    )}
                  </button>
                ))}
                <div className="pt-2 mt-1 border-t border-slate-100 px-3">
                  <button
                    onClick={() => {
                      if (confirm('Reset all portal demo data back to default state?')) {
                        resetDataToDefaults();
                        setShowRoleDropdown(false);
                      }
                    }}
                    className="w-full text-left text-[11px] text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1.5 py-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset Portal Data Defaults
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={() => setShowNotifModal(!showNotifModal)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 sm:border-transparent transition cursor-pointer"
            title="School Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {announcements.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600"></span>
            )}
          </button>

          {/* User Avatar & Name */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 pl-1.5 sm:pl-2 sm:border-l sm:border-slate-200 hover:opacity-90 transition text-left cursor-pointer"
            title="View user details"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-xs text-emerald-800 overflow-hidden shadow-2xs">
              {currentUser.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
            <div className="hidden lg:block text-xs">
              <p className="font-bold text-slate-800 line-clamp-1">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 capitalize">{currentUser.role.toLowerCase()}</p>
            </div>
          </button>

          {/* Top Right Logout Button */}
          <button
            onClick={() => logout()}
            className="px-2.5 sm:px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Log out of school portal"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 border-2 border-emerald-600 overflow-hidden flex items-center justify-center font-bold text-lg text-emerald-900 shadow-xs">
                {currentUser.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentUser.name.charAt(0)
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{currentUser.name}</h3>
                <span
                  className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${currentRoleConfig.badgeColor}`}
                >
                  {currentUser.role}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">{currentUser.email}</p>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>
                  Email: <strong className="text-slate-900">{currentUser.email}</strong>
                </span>
              </div>
              {currentUser.phoneNumber && (
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-slate-400" />
                  <span>
                    Phone: <strong className="text-slate-900">{currentUser.phoneNumber}</strong>
                  </span>
                </div>
              )}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-semibold text-slate-800 mb-1">Active Role Permissions:</p>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {currentUser.role === 'ADMIN' &&
                    'Full administrative access: Student/Teacher management, CBT creation, Score approval, Curriculum oversight, and Settings.'}
                  {currentUser.role === 'TEACHER' &&
                    'Subject Teacher access: View assigned classes, enter CA & Exam scores, create CBT exams, and view curriculum lesson plans.'}
                  {currentUser.role === 'STUDENT' &&
                    'Student portal access: Take CBT exams, check published report cards, view class timetable, and curriculum topics.'}
                  {currentUser.role === 'PARENT' &&
                    'Parent portal access: Monitor child academic progress, review CBT score history, and download printable report cards.'}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  logout();
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                Sign Out
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotifModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-start justify-end p-4 pt-16">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                School Announcements
              </h3>
              <button
                onClick={() => setShowNotifModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="py-3 space-y-3 max-h-80 overflow-y-auto no-scrollbar">
              {announcements.slice(0, 3).map((anc) => (
                <div key={anc.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="font-bold text-emerald-700">{anc.category}</span>
                    <span>{anc.createdAt}</span>
                  </div>
                  <p className="font-bold text-xs text-slate-900">{anc.title}</p>
                  <p className="text-[11px] text-slate-600 mt-1 leading-normal line-clamp-2">
                    {anc.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
