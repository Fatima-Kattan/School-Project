// components/teacher/TeacherCard.tsx

'use client';
import { useState } from 'react';
import { Teacher, TeacherClass, TeacherSubject, TeacherWithDetails } from '@/services/api/teachers/teacherService';
import {
    Trash,
    PenSquareIcon,
    Copy,
    Check,
    ChevronDown,
    ChevronUp,
    BookOpen,
    Users,
    GraduationCap,
    Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TeacherCardProps {
    teacher: Teacher | TeacherWithDetails; // ✅ Union Type
    onDelete: () => void;
    onEdit: () => void;
    renderCopyIcon: (teacherId: number, field: string, size: number, color: string, value: string) => React.ReactNode;
    isExpanded: boolean;
    onToggle: () => void;
    teacherClasses?: TeacherClass[];
    teacherSubjects?: TeacherSubject[];
    loadingDetails?: boolean;
}

export default function TeacherCard({
    teacher,
    onDelete,
    onEdit,
    renderCopyIcon,
    isExpanded,
    onToggle,
    teacherClasses = [],
    teacherSubjects = [],
    loadingDetails = false
}: TeacherCardProps) {
    // ✅ التحقق من وجود classes و subjects في teacher
    const hasDetails = 'classes' in teacher && 'subjects' in teacher;
    const classesData = hasDetails ? (teacher as TeacherWithDetails).classes : teacherClasses;
    const subjectsData = hasDetails ? (teacher as TeacherWithDetails).subjects : teacherSubjects;

    return (
        <>
            <tr className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-[#eaf7f0]' : ''}`}>
                {/* Full Name with expand button */}
                <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onToggle}
                            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                            title={isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                        >
                            {isExpanded ? (
                                <ChevronUp size={16} className="text-gray-500" />
                            ) : (
                                <ChevronDown size={16} className="text-gray-500" />
                            )}
                        </button>
                        <span className="text-gray-800 font-semibold text-sm">
                            {teacher.full_name || '-'}
                        </span>
                    </div>
                </td>

                {/* Gender */}
                <td className="px-3 py-3">
                    <span className={`text-xs font-medium ${teacher.gender === 'ذكر'
                        ? 'text-blue-600'
                        : 'text-pink-600'
                        }`}>
                        {teacher.gender || '-'}
                    </span>
                </td>

                {/* Email with copy icon */}
                <td className="px-3 py-3">
                    <div className="flex items-center justify-around text-gray-600 text-md">
                        <a
                            href={`mailto:${teacher.email}`}
                            className="text-[#1e88e5] hover:text-[#0d47a1] underline text-md break-words"
                            style={{ wordBreak: 'break-word', maxWidth: '130px' }}
                        >
                            {teacher.email || '-'}
                        </a>
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                            {renderCopyIcon(teacher.id, 'email', 14, 'text-[#1e88e5]', teacher.email || '')}
                        </div>
                    </div>
                </td>

                {/* Username with copy icon */}
                <td className="px-3 py-3">
                    <div className="flex items-center justify-around text-gray-600 text-xs">
                        <span className="font-mono text-left text-xs text-[#cf993f]">
                            {teacher.user_name || '-'}
                        </span>
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                            {renderCopyIcon(teacher.id, 'username', 14, 'text-[#cf993f]', teacher.user_name || '')}
                        </div>
                    </div>
                </td>

                {/* Phone Number with copy icon */}
                <td className="px-3 py-3">
                    <div className="flex items-center justify-around text-gray-600 text-xs">
                        <span dir="ltr" className="font-mono text-left text-xs text-[#007353]">
                            {teacher.phone_number || '-'}
                        </span>
                        <div />

                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                            {renderCopyIcon(teacher.id, 'phone', 14, 'text-[#007353]', teacher.phone_number || '')}
                        </div>
                    </div>
                </td>

                {/* Created At */}
                <td className="px-3 py-3 text-gray-500 text-xs">
                    {teacher.created_at ? new Date(teacher.created_at).toLocaleDateString('en-CA') : '-'}
                </td>

                {/* Comment */}
                <td className="px-3 py-3">
                    <span className="text-gray-500 text-xs line-clamp-2 max-w-[100px]">
                        {teacher.comment || '-'}
                    </span>
                </td>

                {/* Actions */}
                <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                        <button
                            className="text-orange-500 hover:text-orange-700 p-1 rounded-lg hover:bg-orange-50 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            title="تعديل"
                        >
                            <PenSquareIcon size={15} />
                        </button>
                        <button
                            className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            title="حذف"
                        >
                            <Trash size={15} />
                        </button>
                    </div>
                </td>
            </tr>

            {/* Expanded Row - Classes and Subjects */}
{isExpanded && (
    <tr className="bg-[#f0f7f5] border-t border-gray-100">
        <td colSpan={8} className="p-0">
            <div className="py-2 px-2">
                {loadingDetails ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="animate-spin text-[#2e7d32]" size={24} />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                            الصفوف والمواد
                        </h4>

                        {/* classes with their sections and subjects */}
                        {!classesData || (Array.isArray(classesData) && classesData.length === 0) ? (
                            <p className="text-gray-500 text-sm pr-6">لا يوجد صفوف مسندة</p>
                        ) : (
                            <div className="space-y-3 pr-6">
                                {Array.isArray(classesData) && classesData.map((cls: any) => {
                                    const classId = cls.class_id || cls.id;
                                    const className = cls.class_name || cls.name || 'بدون صف';
                                    const sections = cls.sections || [];
                                    // Filter subjects for this class
                                    const classSubjects = Array.isArray(subjectsData) 
                                        ? subjectsData.filter((s: any) => {
                                            const subjectClass = s.class_name || s.class || '';
                                            return subjectClass.includes(className) || subjectClass.includes(classId);
                                        })
                                        : [];

                                    const displaySubjects = classSubjects.length > 0 ? classSubjects : subjectsData;

                                    return (
                                        <div key={classId} className="bg-white rounded-lg p-1.5 border border-gray-200">
                                            {/* name class and sections */}
                                            <div className="flex items-center gap-2 mb-2 ">
                                                <GraduationCap size={22} className="bg-[#F0F7F5] p-2 rounded-xl text-[#2e7d32] shrink-0 w-[44px] h-[44px] flex items-center justify-center" />
                                                <span className="font-semibold text-gray-800 text-sm border-l-2 border-[#e8e8e8] pl-3">
                                                    {className}
                                                    <br />
                                                    <span className="text-gray-600 text-xs font-medium">
                                                    الشعب :{Array.isArray(sections) && sections.length > 0 ? (
                                                        <span className="mr-1">
                                                            {sections.map((s: any) => s.section_name || s).join('، ')}
                                                        </span>
                                                    ) : (
                                                        <span className="mr-1 text-gray-400">,</span>
                                                    )}
                                                </span>
                                                </span>
                                                {/* subjects */}
                                                <div className="pr-1 flex flex-wrap gap-2">
                                                {Array.isArray(displaySubjects) && displaySubjects.length > 0 ? (
                                                    displaySubjects.map((subject: any, idx: number) => {
                                                        const subjectName = subject.subject_name || subject.name || subject;
                                                        return (
                                                            <span 
                                                                key={idx} 
                                                                className="inline-flex items-center px-3 py-1 rounded-full text-md font-large bg-[#ffffff] text-black border border-[#007353]"
                                                            >
                                                                {subjectName}
                                                            </span>
                                                        );
                                                    })
                                                ) : (
                                                    <span className="text-xs text-gray-400">لا يوجد مواد</span>
                                                )}
                                            </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </td>
    </tr>
)}
        </>
    );
}