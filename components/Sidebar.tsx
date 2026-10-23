'use client';

import React from 'react';
import { useSchool } from '@/context/SchoolContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpenCheck,
  MonitorPlay,
  FileCheck2,
  BookMarked,
  CalendarCheck2,
  Clock3,
  Megaphone,
  Settings,
  Sparkles,
  X,
  ChevronRight,
  Shield,
  UserCheck,
  BookOpen,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'classes'
  | 'cbt'
  | 'results'
  | 'curriculum'
  | 'attendance'
  | 'timetable'
  | 'announcements'
  | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavCategory {
  title: string;
  items: {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    roles: ('ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT')[];
    badge?: string;
    badgeColor?: string;
    description?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const { currentUser, cbtExams, announcements } = useSchool();

  const publishedCbtCount = cbtExams.filter((e) => e.status === 'Published').length;

  const categories: NavCategory[] = [
    {
      title: 'Main Hub',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard Overview',
          icon: <LayoutDashboard className="w-4 h-4" />,
          roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
          description: 'Portal summary & quick launchpad',
        },
      ],
    },
    {
      title: 'Exams & Assessment',
      items: [
        {
          id: 'cbt',
          label: 'CBT Examination System',
          icon: <MonitorPlay className="w-4 h-4" />,
          roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
          badge: publishedCbtCount > 0 ? `${publishedCbtCount} Active` : undefined,
          badgeColor: 'bg-amber-400 text-slate-950',
          description: 'Live tests, question bank & attempts',
        },
        {
          id: 'results',
          label: 'Results & Report Cards',
          icon: <FileCheck2 className="w-4 h-4" />,
          roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
          badge: 'Scratch Pin',
          badgeColor: 'bg-emerald-800 text-emerald-200 border border-emerald-600',
          description: 'Broadsheet, grading & report cards',
        },
      ],
    },
    {
      title: 'Academic & Learning',
      items: [
        {
          id: 'curriculum',
          label: 'Curriculum Centre',
          icon: <BookMarked className="w-4 h-4" />,
          roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
          description: 'JSS1-SS3 schemes, lesson plans & notes',
        },
        {
          id: 'timetable',
          label: 'Class Timetable',
          icon: <Clock3 className="w-4 h-4" />,
          roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
          description: 'Weekly schedule & period allocations',
        },
        {
          id: 'classes',
          label: 'Classes & Subjects',
          icon: <BookOpenCheck className="w-4 h-4" />,
          roles: ['ADMIN', 'TEACHER'],
          description: 'Arms, form teachers & course codes',
        },
      ],
    },
    {
      title: 'School Community & Records',
      items: [
        {
          id: 'attendance',
          label: 'Attendance Register',
          icon: <CalendarCheck2 className="w-4 h-4" />,
          roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
          description: 'Daily roll call & student attendance logs',
        },
        {
          id: 'students',
          label: 'Student Directory',
          icon: <GraduationCap className="w-4 h-4" />,
          roles: ['ADMIN', 'TEACHER', 'PARENT'],
          description: 'Profiles, enrollment & guardians',
        },
        {
          id: 'teachers',
          label: 'Teacher Directory',
          icon: <Users className="w-4 h-4" />,
          roles: ['ADMIN', 'TEACHER'],
          description: 'Staff directory & subject assignments',
        },
      ],
    },
    {
      title: 'School Management',
      items: [
        {
          id: 'announcements',
          label: 'Announcements Board',
          icon: <Megaphone className="w-4 h-4" />,
          roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
          badge: announcements.length > 0 ? `${announcements.length}` : undefined,
          badgeColor: 'bg-blue-900/80 text-blue-200 border border-blue-700',
          description: 'Broadcasts & official school circulars',
        },
        {
          id: 'settings',
          label: 'School Settings',
          icon: <Settings className="w-4 h-4" />,
          roles: ['ADMIN'],
          description: 'Term configuration & school profile',
        },
      ],
    },
  ];

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const getRoleIcon = () => {
    switch (currentUser.role) {
      case 'ADMIN':
        return <Shield className="w-3.5 h-3.5 text-purple-400" />;
      case 'TEACHER':
        return <UserCheck className="w-3.5 h-3.5 text-blue-400" />;
      case 'STUDENT':
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />;
      case 'PARENT':
        return <BookOpen className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Header with Role Card */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Portal Navigation
            </span>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Current User Quick Role Box */}
        <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center">
              {getRoleIcon()}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5 leading-tight">
                {currentUser.name}
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 block mt-0.5">
                {currentUser.role} Portal
              </span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700 font-mono">
            v2.5
          </span>
        </div>
      </div>

      {/* Nav Categories & Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
        {categories.map((category) => {
          // Filter items by current user's role
          const visibleItems = category.items.filter((item) =>
            item.roles.includes(currentUser.role)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={category.title} className="space-y-1">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-3 py-1">
                {category.title}
              </h4>
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition group text-left cursor-pointer ${
                        isActive
                          ? 'bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-950/40'
                          : 'hover:bg-slate-800/80 hover:text-slate-100 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`shrink-0 ${
                            isActive
                              ? 'text-amber-300'
                              : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                              item.badgeColor || 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform ${
                            isActive
                              ? 'text-amber-300 translate-x-0.5'
                              : 'text-slate-600 opacity-0 group-hover:opacity-100'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer Quick Status */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-200 text-[11px]">Divine Academy Okene</p>
            <p className="text-[10px] text-slate-400">Easy Navigation Portal</p>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-slate-800 self-start sticky top-20 max-h-[calc(100vh-6rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (When Opened via Hamburger) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
