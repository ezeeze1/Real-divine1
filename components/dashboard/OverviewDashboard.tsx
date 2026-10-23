'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { TabType } from '../Sidebar';
import {
  GraduationCap,
  Users,
  BookOpenCheck,
  MonitorPlay,
  FileCheck2,
  CalendarCheck2,
  Megaphone,
  PlusCircle,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  Award,
  BookMarked,
  Clock3,
  Settings,
  Search,
  CheckCircle2,
  Calendar,
  KeyRound,
  Shield,
  UserCheck,
  BookOpen,
  Eye,
  FileText,
} from 'lucide-react';

interface OverviewProps {
  setActiveTab: (tab: TabType) => void;
}

export const OverviewDashboard: React.FC<OverviewProps> = ({ setActiveTab }) => {
  const {
    currentUser,
    schoolProfile,
    students,
    teachers,
    classes,
    cbtExams,
    cbtAttempts,
    scores,
    announcements,
    timetable,
    reportCards,
  } = useSchool();

  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<
    'all' | 'exams' | 'academics' | 'records' | 'admin'
  >('all');

  const activeCbtExams = cbtExams.filter((e) => e.status === 'Published');
  const activeCbtCount = activeCbtExams.length;
  const totalSubmissions = cbtAttempts.length;

  // Find student record if student or parent
  const linkedStudent =
    currentUser.role === 'STUDENT'
      ? students.find((s) => s.id === currentUser.studentId || s.fullName.toLowerCase().includes(currentUser.name.toLowerCase())) || students[0]
      : currentUser.role === 'PARENT'
      ? students.find((s) => s.id === currentUser.studentId || s.guardianName.toLowerCase().includes(currentUser.name.toLowerCase())) || students[0]
      : null;

  // Find teacher record if teacher
  const linkedTeacher =
    currentUser.role === 'TEACHER'
      ? teachers.find((t) => t.id === currentUser.teacherId || t.fullName.toLowerCase().includes(currentUser.name.toLowerCase())) || teachers[0]
      : null;

  // Student specific data
  const studentScores = linkedStudent
    ? scores.filter((s) => s.studentId === linkedStudent.id)
    : [];
  const studentReportCard = linkedStudent
    ? reportCards.find((r) => r.studentId === linkedStudent.id)
    : null;
  const studentAttempts = linkedStudent
    ? cbtAttempts.filter((a) => a.studentId === linkedStudent.id)
    : [];

  // Today's day of the week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
  const todayIndex = new Date().getDay();
  const currentDayName = daysOfWeek[todayIndex];
  const activeDay = (currentDayName === 'Saturday' || currentDayName === 'Sunday') ? 'Monday' : currentDayName;

  const todayTimetable = timetable.filter((t) => t.day === activeDay).slice(0, 4);

  // All available navigation cards
  const navigationHubCards: {
    id: TabType;
    title: string;
    description: string;
    icon: React.ReactNode;
    category: 'exams' | 'academics' | 'records' | 'admin';
    roles: ('ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT')[];
    badge?: string;
    badgeColor?: string;
    accentColor: string;
    quickStats?: string;
  }[] = [
    {
      id: 'cbt',
      title: 'CBT Examination Portal',
      description:
        currentUser.role === 'STUDENT'
          ? 'Take active mid-term tests and view instant scores'
          : currentUser.role === 'TEACHER'
          ? 'Create test questions, set timer, and review student attempts'
          : 'Monitor online examinations, student logs, and test performance',
      icon: <MonitorPlay className="w-5 h-5" />,
      category: 'exams',
      roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      badge: `${activeCbtCount} Active Tests`,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      accentColor: 'from-amber-500/10 to-amber-500/5 hover:border-amber-400',
      quickStats: `${totalSubmissions} attempts logged`,
    },
    {
      id: 'results',
      title: 'Results & Report Cards',
      description:
        currentUser.role === 'STUDENT'
          ? 'Check 1st Term academic report card, grades, position & remarks'
          : currentUser.role === 'PARENT'
          ? 'Unlock ward report card using Divine Academy Result Pin'
          : 'Enter CA1, CA2 & Exam scores, generate report cards, and manage PINs',
      icon: <FileCheck2 className="w-5 h-5" />,
      category: 'exams',
      roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      badge: 'Grading Hub',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      accentColor: 'from-emerald-500/10 to-emerald-500/5 hover:border-emerald-400',
      quickStats: `${scores.length} scores recorded`,
    },
    {
      id: 'curriculum',
      title: 'Curriculum Centre',
      description:
        'JSS1 to SS3 Nigerian syllabus, weekly schemes of work, AI lesson plans & lesson notes',
      icon: <BookMarked className="w-5 h-5" />,
      category: 'academics',
      roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      badge: 'JSS1 - SS3',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      accentColor: 'from-blue-500/10 to-blue-500/5 hover:border-blue-400',
      quickStats: '13 Weeks Scheme',
    },
    {
      id: 'timetable',
      title: 'Class Timetable',
      description: 'Weekly schedule of periods, subjects, and instructor allocations across arms',
      icon: <Clock3 className="w-5 h-5" />,
      category: 'academics',
      roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      badge: 'Weekly Plan',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      accentColor: 'from-purple-500/10 to-purple-500/5 hover:border-purple-400',
      quickStats: '8 Daily Periods',
    },
    {
      id: 'attendance',
      title: 'Attendance Register',
      description:
        currentUser.role === 'TEACHER'
          ? 'Mark morning roll call for assigned class students with one click'
          : 'Track student daily attendance, punctuality records, and absence notes',
      icon: <CalendarCheck2 className="w-5 h-5" />,
      category: 'records',
      roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      badge: 'Daily Roll',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      accentColor: 'from-teal-500/10 to-teal-500/5 hover:border-teal-400',
      quickStats: 'Term Session',
    },
    {
      id: 'classes',
      title: 'Classes & Subjects',
      description: 'Class arms (JSS1-SS3), form teacher designations, and subject catalog',
      icon: <BookOpenCheck className="w-5 h-5" />,
      category: 'academics',
      roles: ['ADMIN', 'TEACHER'],
      badge: `${classes.length} Arms`,
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      accentColor: 'from-indigo-500/10 to-indigo-500/5 hover:border-indigo-400',
      quickStats: `${classes.length} Class Arms`,
    },
    {
      id: 'students',
      title: 'Student Directory',
      description: 'Student profiles, admission numbers, guardian contacts, and enrollment records',
      icon: <GraduationCap className="w-5 h-5" />,
      category: 'records',
      roles: ['ADMIN', 'TEACHER', 'PARENT'],
      badge: `${students.length} Enrolled`,
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      accentColor: 'from-emerald-500/10 to-emerald-500/5 hover:border-emerald-400',
      quickStats: `${students.length} Total Students`,
    },
    {
      id: 'teachers',
      title: 'Teacher Directory',
      description: 'Teaching staff records, qualifications, subject assignments, and form teachers',
      icon: <Users className="w-5 h-5" />,
      category: 'records',
      roles: ['ADMIN', 'TEACHER'],
      badge: `${teachers.length} Staff`,
      badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
      accentColor: 'from-cyan-500/10 to-cyan-500/5 hover:border-cyan-400',
      quickStats: `${teachers.length} Faculty Members`,
    },
    {
      id: 'announcements',
      title: 'School Notice Board',
      description: 'Official school circulars, exam dates, PTA meetings, and important notices',
      icon: <Megaphone className="w-5 h-5" />,
      category: 'admin',
      roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      badge: `${announcements.length} Notices`,
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      accentColor: 'from-rose-500/10 to-rose-500/5 hover:border-rose-400',
      quickStats: 'Live Broadcasts',
    },
    {
      id: 'settings',
      title: 'School Settings',
      description: 'Configure academic session, active term, grading criteria, and institution branding',
      icon: <Settings className="w-5 h-5" />,
      category: 'admin',
      roles: ['ADMIN'],
      badge: 'Admin Only',
      badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
      accentColor: 'from-slate-500/10 to-slate-500/5 hover:border-slate-400',
      quickStats: 'Configuration',
    },
  ];

  // Filter cards by role, search query, and category
  const filteredCards = navigationHubCards.filter((card) => {
    const roleMatches = card.roles.includes(currentUser.role);
    if (!roleMatches) return false;

    if (selectedFilterCategory !== 'all' && card.category !== selectedFilterCategory) {
      return false;
    }

    if (navSearchQuery.trim()) {
      const q = navSearchQuery.toLowerCase();
      const titleMatches = card.title.toLowerCase().includes(q);
      const descMatches = card.description.toLowerCase().includes(q);
      const idMatches = card.id.toLowerCase().includes(q);
      return titleMatches || descMatches || idMatches;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. ROLE-TAILORED HERO BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-emerald-50/50 to-amber-50/40 border-2 border-slate-200 p-5 sm:p-7 shadow-xs">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
            <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              {currentUser.role} Dashboard
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-700 font-semibold">{schoolProfile.name}</span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-300">
              {schoolProfile.currentSession} • {schoolProfile.currentTerm}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {currentUser.name}! 👋
          </h2>

          <p className="text-slate-700 text-xs sm:text-sm mt-2 leading-relaxed max-w-3xl">
            {currentUser.role === 'ADMIN' &&
              'Comprehensive school administration center. Use the quick launchpad below to manage students, supervise CBT exams, approve terminal results, and update school records.'}
            {currentUser.role === 'TEACHER' &&
              `Instructor cockpit for ${linkedTeacher ? linkedTeacher.fullName : 'Faculty'}. Access your assigned class roster, enter CA & Exam scores, build CBT tests, and check your timetable.`}
            {currentUser.role === 'STUDENT' &&
              `Welcome, ${linkedStudent ? linkedStudent.fullName : 'Student'} (${linkedStudent ? linkedStudent.className : 'JSS1'} • ${linkedStudent ? linkedStudent.admissionNo : 'DA/2024/001'}). Check your active CBT exams, terminal report card, and class lesson plans.`}
            {currentUser.role === 'PARENT' &&
              `Guardian Portal for ${currentUser.name}. Monitoring academic performance, CBT attempt logs, and official terminal report card for ${linkedStudent ? linkedStudent.fullName : 'your child'}.`}
          </p>

          {/* Quick Action Buttons for Easy Navigation */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-4 border-t border-slate-200">
            {currentUser.role === 'ADMIN' && (
              <>
                <button
                  onClick={() => setActiveTab('students')}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer border border-amber-500/50"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
                  Register Student
                </button>
                <button
                  onClick={() => setActiveTab('cbt')}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <MonitorPlay className="w-3.5 h-3.5 text-amber-300" />
                  CBT Exam Portal
                </button>
                <button
                  onClick={() => setActiveTab('results')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                  Results & Scores
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <BookMarked className="w-3.5 h-3.5 text-blue-600" />
                  Curriculum Centre
                </button>
              </>
            )}

            {currentUser.role === 'TEACHER' && (
              <>
                <button
                  onClick={() => setActiveTab('results')}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
                  Enter CA & Exam Scores
                </button>
                <button
                  onClick={() => setActiveTab('cbt')}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <MonitorPlay className="w-3.5 h-3.5 text-amber-300" />
                  Create CBT Test
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CalendarCheck2 className="w-3.5 h-3.5 text-teal-600" />
                  Mark Attendance
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpenCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Lesson Plans & Notes
                </button>
              </>
            )}

            {currentUser.role === 'STUDENT' && (
              <>
                <button
                  onClick={() => setActiveTab('cbt')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <MonitorPlay className="w-4 h-4 text-amber-300" />
                  Start CBT Examination ({activeCbtCount} Ready)
                </button>
                <button
                  onClick={() => setActiveTab('results')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4 text-amber-300" />
                  Check 1st Term Report Card
                </button>
                <button
                  onClick={() => setActiveTab('timetable')}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Clock3 className="w-3.5 h-3.5 text-purple-600" />
                  Today&apos;s Timetable
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <BookMarked className="w-3.5 h-3.5 text-blue-600" />
                  Lesson Notes
                </button>
              </>
            )}

            {currentUser.role === 'PARENT' && (
              <>
                <button
                  onClick={() => setActiveTab('results')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4 text-amber-300" />
                  View & Print Ward Report Card
                </button>
                <button
                  onClick={() => setActiveTab('cbt')}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <MonitorPlay className="w-3.5 h-3.5 text-amber-300" />
                  CBT Exam Scores Log
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CalendarCheck2 className="w-3.5 h-3.5 text-teal-600" />
                  Attendance Summary
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. ROLE-AWARE METRICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {currentUser.role === 'ADMIN' && (
          <>
            <div
              onClick={() => setActiveTab('students')}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Total Students
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{students.length}</div>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                Enrolled across {classes.length} Arms
              </span>
            </div>

            <div
              onClick={() => setActiveTab('teachers')}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Active Faculty
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{teachers.length}</div>
              <span className="text-[11px] text-slate-500 font-medium block mt-1">
                Subject Teachers & Form Masters
              </span>
            </div>

            <div
              onClick={() => setActiveTab('cbt')}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Active CBT Tests
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <MonitorPlay className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{activeCbtCount}</div>
              <span className="text-[11px] text-amber-700 font-semibold block mt-1">
                {totalSubmissions} Student Attempt Logs
              </span>
            </div>

            <div
              onClick={() => setActiveTab('results')}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Scores & Grading
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{scores.length}</div>
              <span className="text-[11px] text-purple-700 font-semibold block mt-1">
                {reportCards.length} Published Report Cards
              </span>
            </div>
          </>
        )}

        {currentUser.role === 'TEACHER' && (
          <>
            <div
              onClick={() => setActiveTab('classes')}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Form Class
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <BookOpenCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-slate-900">
                {linkedTeacher?.isFormTeacherOf || 'JSS1'}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                Form Master Oversight
              </span>
            </div>

            <div
              onClick={() => setActiveTab('results')}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  My Subjects Taught
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {linkedTeacher?.subjectsTaught?.length || 2}
              </div>
              <span className="text-[11px] text-slate-500 font-medium block mt-1">
                Mathematics & Basic Science
              </span>
            </div>

            <div
              onClick={() => setActiveTab('cbt')}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Active CBT Tests
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <MonitorPlay className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{activeCbtCount}</div>
              <span className="text-[11px] text-amber-700 font-semibold block mt-1">
                {totalSubmissions} Student Attempts
              </span>
            </div>

            <div
              onClick={() => setActiveTab('timetable')}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Today&apos;s Schedule
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Clock3 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-slate-900">{activeDay}</div>
              <span className="text-[11px] text-purple-700 font-semibold block mt-1">
                {todayTimetable.length} Scheduled Periods
              </span>
            </div>
          </>
        )}

        {(currentUser.role === 'STUDENT' || currentUser.role === 'PARENT') && (
          <>
            <div
              onClick={() => setActiveTab('students')}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Enrolled Class
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {linkedStudent?.className || 'JSS1'}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                {linkedStudent?.admissionNo || 'DA/2024/001'}
              </span>
            </div>

            <div
              onClick={() => setActiveTab('cbt')}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Active CBT Tests
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <MonitorPlay className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{activeCbtCount}</div>
              <span className="text-[11px] text-amber-700 font-semibold block mt-1">
                Available to take online
              </span>
            </div>

            <div
              onClick={() => setActiveTab('results')}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Average Score
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {studentReportCard ? `${studentReportCard.averageScore}%` : '78.5%'}
              </div>
              <span className="text-[11px] text-blue-700 font-semibold block mt-1">
                {studentReportCard ? `Rank: ${studentReportCard.positionInClass} of ${studentReportCard.classSize}` : '1st Term Evaluation'}
              </span>
            </div>

            <div
              onClick={() => setActiveTab('attendance')}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Attendance Standing
                </span>
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-600">96.4%</div>
              <span className="text-[11px] text-slate-500 font-medium block mt-1">
                Punctual & Regular
              </span>
            </div>
          </>
        )}
      </div>

      {/* 3. QUICK NAVIGATION COMMAND HUB (FILTER & SEARCH) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Easy Navigation Launchpad
            </h3>
            <p className="text-xs text-slate-500">
              Select any school module or service below to jump directly
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={navSearchQuery}
              onChange={(e) => setNavSearchQuery(e.target.value)}
              placeholder="Search module or tool..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 mb-4">
          <span className="text-[11px] font-bold uppercase text-slate-400 mr-1 hidden sm:inline">
            Filter:
          </span>
          <button
            onClick={() => setSelectedFilterCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedFilterCategory === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Modules ({navigationHubCards.filter((c) => c.roles.includes(currentUser.role)).length})
          </button>
          <button
            onClick={() => setSelectedFilterCategory('exams')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedFilterCategory === 'exams'
                ? 'bg-amber-500 text-slate-950 shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Exams & Results
          </button>
          <button
            onClick={() => setSelectedFilterCategory('academics')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedFilterCategory === 'academics'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Academics & Timetable
          </button>
          <button
            onClick={() => setSelectedFilterCategory('records')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedFilterCategory === 'records'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            People & Attendance
          </button>
          {currentUser.role === 'ADMIN' && (
            <button
              onClick={() => setSelectedFilterCategory('admin')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedFilterCategory === 'admin'
                  ? 'bg-purple-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              School Admin
            </button>
          )}
        </div>

        {/* Dynamic Grid of Nav Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setActiveTab(card.id)}
              className={`group p-4 rounded-2xl border border-slate-200 bg-gradient-to-br ${card.accentColor} hover:shadow-md transition cursor-pointer flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-800 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  {card.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        card.badgeColor || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {card.badge}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors flex items-center gap-1">
                  {card.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/60 text-xs font-semibold text-emerald-800 group-hover:text-emerald-950">
                <span className="text-[11px] text-slate-500 font-medium">{card.quickStats}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Open Module <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}

          {filteredCards.length === 0 && (
            <div className="col-span-full p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-700">No navigation modules match your search</p>
              <p className="text-xs text-slate-500 mt-1">Try clearing the search query or selecting &quot;All Modules&quot;.</p>
              <button
                onClick={() => {
                  setNavSearchQuery('');
                  setSelectedFilterCategory('all');
                }}
                className="mt-3 px-3 py-1.5 bg-slate-200 text-slate-800 text-xs font-bold rounded-lg hover:bg-slate-300 transition"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. LIVE ACTIVITY & FEEDS: CBT EXAMS & TIMETABLE SNAPSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CBT Exams Quick Center */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <MonitorPlay className="w-5 h-5 text-emerald-700" />
                  Active CBT Examination Center
                </h3>
                <p className="text-xs text-slate-500">
                  {currentUser.role === 'STUDENT'
                    ? 'Available tests ready for your class'
                    : 'Online examinations currently open for submissions'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('cbt')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
              >
                View Full CBT Portal <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeCbtExams.slice(0, 3).map((exam) => (
                <div
                  key={exam.id}
                  className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                        {exam.className}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{exam.subjectName}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 mt-1">{exam.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {exam.durationMinutes} Mins
                      </span>
                      <span>•</span>
                      <span>{exam.questions.length} Questions ({exam.totalMarks} Marks)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('cbt')}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      {currentUser.role === 'STUDENT' ? (
                        <>
                          <MonitorPlay className="w-3.5 h-3.5 text-amber-300" />
                          Take Test
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Manage Exam
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {activeCbtExams.length === 0 && (
                <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl">
                  No active CBT examinations at this moment.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Powered by Divine Academy Automated Grading Engine</span>
            <span className="font-semibold text-emerald-700">Instant CBT Feedback</span>
          </div>
        </div>

        {/* Notice Board Side Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-500" />
                School Notice Board
              </h3>
              <button
                onClick={() => setActiveTab('announcements')}
                className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
              >
                View All ({announcements.length})
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((anc) => (
                <div
                  key={anc.id}
                  onClick={() => setActiveTab('announcements')}
                  className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 hover:bg-amber-50 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[10px] text-amber-800 font-bold mb-1">
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-200/80">{anc.category}</span>
                    <span>{anc.createdAt}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{anc.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-normal">
                    {anc.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Timetable Snippet */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Clock3 className="w-3.5 h-3.5 text-purple-600" />
                Today&apos;s Classes ({activeDay})
              </span>
              <button
                onClick={() => setActiveTab('timetable')}
                className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
              >
                Full Timetable
              </button>
            </div>
            <div className="space-y-1.5">
              {todayTimetable.slice(0, 2).map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200"
                >
                  <span className="font-semibold text-slate-800">{slot.subjectName}</span>
                  <span className="text-slate-500 font-mono text-[10px]">{slot.timeRange}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
