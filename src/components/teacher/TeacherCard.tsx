// components/teacher/TeacherCard.tsx

'use client';
import { useState } from 'react';
import { Teacher, TeacherClass, TeacherSubject } from '@/services/api/teachers/teacherService';
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
    teacher: Teacher;
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
                    <div className="flex items-center justify-around text-gray-600 text-xs">
                        <a
                            href={`mailto:${teacher.email}`}
                            className="text-[#1e88e5] hover:text-[#0d47a1] underline text-xs break-words"
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
                        <div className="py-4 px-6">
                            {loadingDetails ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="animate-spin text-[#2e7d32]" size={24} />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Classes Section */}
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                                            <BookOpen size={16} className="text-[#2e7d32]" />
                                            الصفوف والشعب
                                        </h4>
                                        {teacherClasses.length === 0 ? (
                                            <p className="text-gray-500 text-sm">لا يوجد صفوف مسندة</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {teacherClasses.map((cls) => (
                                                    <div key={cls.id} className="bg-white rounded-lg p-3 border border-gray-200">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <GraduationCap size={14} className="text-[#2e7d32]" />
                                                            <span className="font-semibold text-gray-800 text-sm">
                                                                {cls.class_name}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-gray-600 pr-6">
                                                            <Users size={12} className="text-gray-400" />
                                                            <span>الشعب: {cls.sections.join('، ')}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Subjects Section */}
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                                            <BookOpen size={16} className="text-[#2e7d32]" />
                                            المواد المشرف عليها
                                        </h4>
                                        {teacherSubjects.length === 0 ? (
                                            <p className="text-gray-500 text-sm">لا يوجد مواد مسندة</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {teacherSubjects.map((subject) => (
                                                    <div key={subject.id} className="bg-white rounded-lg p-3 border border-gray-200">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-semibold text-gray-800 text-sm">
                                                                {subject.subject_name}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {subject.class_name} - {subject.section_name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}