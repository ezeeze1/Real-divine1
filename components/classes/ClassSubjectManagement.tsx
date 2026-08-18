'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { Subject, SchoolClass } from '@/lib/types';
import { BookOpenCheck, Plus, School, BookMarked, Layers, Pencil, Trash2, FileText, Upload, Calendar, X, CheckCircle2 } from 'lucide-react';

export const ClassSubjectManagement: React.FC = () => {
  const { classes, subjects, teachers, curriculum, lessonNotes, currentUser, addClass, addSubject, updateSubject, deleteSubject, addLessonNote, deleteLessonNote } = useSchool();
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects'>('classes');

  // Modals
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Class Curriculum & Lesson Notes Portal Modal
  const [selectedClassForNotes, setSelectedClassForNotes] = useState<SchoolClass | null>(null);
  const [classModalTab, setClassModalTab] = useState<'curriculum' | 'notes' | 'upload'>('curriculum');

  // Upload Lesson Note Form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubjectId, setNoteSubjectId] = useState('');
  const [noteWeek, setNoteWeek] = useState(1);
  const [noteTerm, setNoteTerm] = useState<'1st Term' | '2nd Term' | '3rd Term'>('1st Term');
  const [noteContent, setNoteContent] = useState('');

  // New Class Form
  const [className, setClassName] = useState('');
  const [level, setLevel] = useState<'JSS1' | 'JSS2' | 'JSS3' | 'SS1' | 'SS2' | 'SS3'>('JSS1');
  const [arm, setArm] = useState<'A' | 'B' | 'Science' | 'Arts' | 'Commercial'>('A');

  // Subject Form
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [category, setCategory] = useState<'Core' | 'Science' | 'Arts' | 'Commercial' | 'General'>('Core');
  const [levelGroup, setLevelGroup] = useState<'JSS' | 'SSS' | 'ALL'>('ALL');

  const openAddSubjectModal = () => {
    setEditingSubject(null);
    setSubjectCode('');
    setSubjectName('');
    setCategory('Core');
    setLevelGroup('ALL');
    setShowSubjectModal(true);
  };

  const openEditSubjectModal = (sub: Subject) => {
    setEditingSubject(sub);
    setSubjectCode(sub.code);
    setSubjectName(sub.name);
    setCategory(sub.category);
    setLevelGroup(sub.levelGroup);
    setShowSubjectModal(true);
  };

  const handleDeleteSubject = (sub: Subject) => {
    if (window.confirm(`Are you sure you want to delete the subject "${sub.name}" (${sub.code})?`)) {
      deleteSubject(sub.id);
    }
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    addClass({
      name: className.trim(),
      level,
      arm,
    });

    setClassName('');
    setShowClassModal(false);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim() || !subjectCode.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        code: subjectCode.trim().toUpperCase(),
        name: subjectName.trim(),
        category,
        levelGroup,
      });
    } else {
      addSubject({
        code: subjectCode.trim().toUpperCase(),
        name: subjectName.trim(),
        category,
        levelGroup,
      });
    }

    setSubjectCode('');
    setSubjectName('');
    setEditingSubject(null);
    setShowSubjectModal(false);
  };

  const handleUploadLessonNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassForNotes || !noteTitle.trim() || !noteSubjectId || !noteContent.trim()) return;

    const sub = subjects.find((s) => s.id === noteSubjectId);
    if (!sub) return;

    addLessonNote({
      classId: selectedClassForNotes.id,
      className: selectedClassForNotes.name,
      subjectId: sub.id,
      subjectName: sub.name,
      title: noteTitle.trim(),
      weekNumber: Number(noteWeek),
      term: noteTerm,
      content: noteContent.trim(),
      uploadedBy: currentUser.name,
    });

    setNoteTitle('');
    setNoteContent('');
    setClassModalTab('notes');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpenCheck className="w-6 h-6 text-emerald-700" />
            Class Arms & Subject Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Divine Academy secondary school structure (Junior & Senior Secondary Arms).
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'classes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Class Arms ({classes.length})
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'subjects' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Subjects ({subjects.length})
          </button>
        </div>
      </div>

      {/* Classes View */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowClassModal(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Class Arm
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((c) => {
              const formTeacher = teachers.find((t) => t.id === c.formTeacherId);
              return (
                <div
                  key={c.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold text-xs">
                        {c.level}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">{c.studentCount} Students</span>
                    </div>

                    <h3 className="font-black text-lg text-slate-900">{c.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Arm Type: <strong className="text-slate-700">{c.arm}</strong></p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-bold">Form Teacher:</span>
                    <span className="font-bold text-slate-900">
                      {formTeacher ? formTeacher.fullName : 'Unassigned'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedClassForNotes(c);
                      setClassModalTab('curriculum');
                    }}
                    className="mt-3 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition flex items-center justify-center gap-1.5"
                  >
                    <BookMarked className="w-4 h-4 text-emerald-600" />
                    Curriculum & Lesson Notes ({lessonNotes.filter((n) => n.classId === c.id).length})
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subjects View */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={openAddSubjectModal}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Subject
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Subject Code</th>
                  <th className="p-4">Subject Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Applicable Level</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {subjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono font-bold text-emerald-800">{sub.code}</td>
                    <td className="p-4 font-bold text-slate-900">{sub.name}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[11px]">
                        {sub.category}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">{sub.levelGroup}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditSubjectModal(sub)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] rounded-lg border border-amber-200 transition inline-flex items-center gap-1"
                        title="Edit Subject"
                      >
                        <Pencil className="w-3 h-3 text-amber-600" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(sub)}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] rounded-lg border border-rose-200 transition inline-flex items-center gap-1"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showClassModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Create Class Arm</h3>
              <button onClick={() => setShowClassModal(false)} className="text-slate-400 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Class Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JSS1 A or SS2 Science"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  >
                    <option value="JSS1">JSS1</option>
                    <option value="JSS2">JSS2</option>
                    <option value="JSS3">JSS3</option>
                    <option value="SS1">SS1</option>
                    <option value="SS2">SS2</option>
                    <option value="SS3">SS3</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Arm Type</label>
                  <select
                    value={arm}
                    onChange={(e) => setArm(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  >
                    <option value="A">Arm A</option>
                    <option value="B">Arm B</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition shadow-xs"
                >
                  Create Class Arm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                {editingSubject ? `Edit Subject: ${editingSubject.name}` : 'Add New Subject'}
              </h3>
              <button onClick={() => setShowSubjectModal(false)} className="text-slate-400 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MTH101"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Further Mathematics"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  >
                    <option value="Core">Core</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commercial">Commercial</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Applicable Level</label>
                  <select
                    value={levelGroup}
                    onChange={(e) => setLevelGroup(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  >
                    <option value="ALL">ALL (JSS & SSS)</option>
                    <option value="JSS">JSS Only</option>
                    <option value="SSS">SSS Only</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition shadow-xs"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Curriculum & Lesson Notes Portal Modal */}
      {selectedClassForNotes && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 bg-emerald-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-700 text-emerald-100 font-extrabold text-xs">
                    {selectedClassForNotes.level} ({selectedClassForNotes.arm})
                  </span>
                  <span className="text-xs text-emerald-200">Divine Academy Academic Portal</span>
                </div>
                <h3 className="font-black text-xl text-white mt-1">
                  {selectedClassForNotes.name} - Curriculum & Lesson Notes
                </h3>
              </div>
              <button
                onClick={() => setSelectedClassForNotes(null)}
                className="w-8 h-8 rounded-full bg-emerald-800 hover:bg-emerald-700 flex items-center justify-center text-white font-bold transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs Bar */}
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 border-b border-slate-200">
              <button
                onClick={() => setClassModalTab('curriculum')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  classModalTab === 'curriculum'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <BookMarked className="w-4 h-4" />
                Integrated Curriculum ({curriculum.filter((c) => c.level === selectedClassForNotes.level).length})
              </button>
              <button
                onClick={() => setClassModalTab('notes')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  classModalTab === 'notes'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                Lesson Notes Library ({lessonNotes.filter((n) => n.classId === selectedClassForNotes.id).length})
              </button>
              <button
                onClick={() => {
                  setClassModalTab('upload');
                  setNoteSubjectId(subjects[0]?.id || '');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  classModalTab === 'upload'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                Upload New Lesson Note
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {classModalTab === 'curriculum' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium">
                      Official 13-week curriculum syllabus and lesson plans for <strong className="text-slate-800">{selectedClassForNotes.name}</strong>.
                    </p>
                  </div>

                  {curriculum.filter((c) => c.level === selectedClassForNotes.level).length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                      <BookOpenCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">No curriculum subjects loaded for this level yet.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Visit the Curriculum Centre to add syllabus subjects.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {curriculum
                        .filter((c) => c.level === selectedClassForNotes.level)
                        .map((subj) => (
                          <div key={subj.id} className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                              <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                {subj.subjectName}
                              </h4>
                              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                                {subj.term}
                              </span>
                            </div>

                            <div className="p-4 space-y-3">
                              {subj.weeks.map((week) => (
                                <div key={week.weekNumber} className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                                  <div className="flex items-center justify-between font-bold text-xs text-slate-900 mb-1">
                                    <span className="text-emerald-800 font-black">Week {week.weekNumber}: {week.topic}</span>
                                    <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                      {week.objectives?.length || 0} Objectives
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 line-clamp-2">
                                    <strong>Teacher Activities:</strong> {week.teacherActivities}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {classModalTab === 'notes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium">
                      Uploaded teacher lesson notes and study guides for <strong className="text-slate-800">{selectedClassForNotes.name}</strong>.
                    </p>
                    <button
                      onClick={() => setClassModalTab('upload')}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Note
                    </button>
                  </div>

                  {lessonNotes.filter((n) => n.classId === selectedClassForNotes.id).length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">No lesson notes uploaded for this class yet.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Click the upload button above to share teaching materials.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {lessonNotes
                        .filter((n) => n.classId === selectedClassForNotes.id)
                        .map((note) => (
                          <div key={note.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between gap-3">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold text-xs">
                                  {note.subjectName} • Week {note.weekNumber} ({note.term})
                                </span>
                                <span className="text-[11px] text-slate-400 font-bold">{note.uploadedAt}</span>
                              </div>

                              <h4 className="font-bold text-base text-slate-900">{note.title}</h4>
                              <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                                {note.content}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                              <span>Uploaded by: <strong className="text-slate-700">{note.uploadedBy}</strong></span>
                              <button
                                onClick={() => deleteLessonNote(note.id)}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200 transition flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3 text-rose-600" />
                                Delete Note
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {classModalTab === 'upload' && (
                <form onSubmit={handleUploadLessonNote} className="space-y-4 max-w-xl mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-black text-slate-900 text-sm mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-emerald-700" />
                    Upload New Lesson Note for {selectedClassForNotes.name}
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                      <select
                        required
                        value={noteSubjectId}
                        onChange={(e) => setNoteSubjectId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name} ({sub.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Term</label>
                      <select
                        value={noteTerm}
                        onChange={(e) => setNoteTerm(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="1st Term">1st Term</option>
                        <option value="2nd Term">2nd Term</option>
                        <option value="3rd Term">3rd Term</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Week Number (1 - 13)</label>
                      <input
                        type="number"
                        min="1"
                        max="13"
                        required
                        value={noteWeek}
                        onChange={(e) => setNoteWeek(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Note Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Introduction to Polynomials"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block font-bold text-slate-700 mb-1">Detailed Lesson Content / Notes *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Type or paste the complete lecture notes, objectives, formulas, and homework instructions here..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setClassModalTab('notes')}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Publish Lesson Note
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
