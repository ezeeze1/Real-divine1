'use client';

import React, { useState } from 'react';
import { SchoolProvider, useSchool } from '@/context/SchoolContext';
import { Navbar } from '@/components/Navbar';
import { Sidebar, TabType } from '@/components/Sidebar';
import { LoginPage } from '@/components/auth/LoginPage';
import { OverviewDashboard } from '@/components/dashboard/OverviewDashboard';
import { StudentManagement } from '@/components/students/StudentManagement';
import { TeacherManagement } from '@/components/teachers/TeacherManagement';
import { ClassSubjectManagement } from '@/components/classes/ClassSubjectManagement';
import { CBTModule } from '@/components/cbt/CBTModule';
import { ResultManagement } from '@/components/results/ResultManagement';
import { CurriculumCentre } from '@/components/curriculum/CurriculumCentre';
import { AttendanceRegister } from '@/components/attendance/AttendanceRegister';
import { ClassTimetable } from '@/components/timetable/ClassTimetable';
import { AnnouncementBoard } from '@/components/announcements/AnnouncementBoard';
import { SchoolSettings } from '@/components/settings/SchoolSettings';

function AppContent() {
  const { isAuthenticated } = useSchool();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-emerald-200">
      {/* Top Sticky Header with Navigation shortcuts & Mobile menu button */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* Main Application Shell */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 gap-6">
        {/* Navigation Sidebar (Desktop persistent + Mobile responsive drawer) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && <OverviewDashboard setActiveTab={setActiveTab} />}
          {activeTab === 'students' && <StudentManagement />}
          {activeTab === 'teachers' && <TeacherManagement />}
          {activeTab === 'classes' && <ClassSubjectManagement />}
          {activeTab === 'cbt' && <CBTModule />}
          {activeTab === 'results' && <ResultManagement />}
          {activeTab === 'curriculum' && <CurriculumCentre />}
          {activeTab === 'attendance' && <AttendanceRegister />}
          {activeTab === 'timetable' && <ClassTimetable />}
          {activeTab === 'announcements' && <AnnouncementBoard />}
          {activeTab === 'settings' && <SchoolSettings />}
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}
