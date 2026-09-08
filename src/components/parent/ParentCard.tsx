'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Parent } from '@/services/api/parents/parentService';
import {
    Plus,
    Trash2,
    PenSquare,
    ChevronDown,
    ChevronUp,
    Mail,
    User2,
    Loader2,
    Trash,
    PenSquareIcon,
    Copy,
    Check,
    ChevronLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/shared/button/button';

interface Child {
    id: number;
    student_name: string;
    class_name: string;
}
interface ParentCardProps {
    parent: Parent;
    isExpanded: boolean;
    children: Child[];
    childrenLoading: boolean;
    onToggle: () => void;
    onDelete: () => void;
    onEdit: () => void;
    renderCopyIcon: (parentId: number, field: string, size: number, color: string, value: string) => React.ReactNode;
}

export default function ParentCard({
    parent,
    isExpanded,
    children,
    childrenLoading,
    onToggle,
    onDelete,
    onEdit,
    renderCopyIcon
}: ParentCardProps) {
    const router = useRouter();

    const handleCopy = (e: React.MouseEvent<HTMLDivElement>, parentId: number, field: string, text: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            toast.success('تم النسخ بنجاح!');
        }).catch(() => {
            toast.error('تعذر النسخ');
        });
    };

    return (
        <>
            <tr
                className={`border-b border-gray-100 hover:bg-gray-50 ${isExpanded ? 'bg-[#eaf7f0]' : ''}`}
            >
                {/* الأب */}
                <td className="px-3 py-3">
                    <div
                        className="flex items-center gap-1.5 cursor-pointer hover:text-[#128c5e] transition-colors"
                        onClick={onToggle}
                    >
                        <span className="text-gray-800 font-semibold text-xs">{parent.full_name_father || '-'}</span>
                        {isExpanded ? <ChevronUp size={12} className="text-gray-500" /> : <ChevronDown size={12} className="text-gray-500" />}
                    </div>
                </td>

                {/* هاتف الأب - الأيقونة ثابتة في أقصى اليمين */}
                <td className="px-3 py-3">
                    <div className="flex items-center justify-between gap-1.5 text-gray-600 text-xs">
                        <span dir="ltr" className="font-mono text-left text-xs text-[#007353]">
                            {parent.phone_number_father || '-'}
                        </span>
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                            {renderCopyIcon(parent.id, 'phone_father', 16, 'text-[#007353]', parent.phone_number_father || '')}
                        </div>
                    </div>
                </td>

                {/* مهنة الأب */}
                <td className="px-3 py-3 text-gray-600 text-xs">{parent.job_father || '-'}</td>

                {/* الأم */}
                <td className="px-3 py-3 text-gray-800 text-xs">{parent.full_name_mother || '-'}</td>

                {/* هاتف الأم - الأيقونة ثابتة في أقصى اليمين */}
                <td className="px-3 py-3">
                    <div className="flex items-center justify-between gap-1.5 text-gray-600 text-xs">
                        <span dir="ltr" className="font-mono text-left text-xs text-[#007353]">
                            {parent.phone_number_mother || '-'}
                        </span>
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                            {renderCopyIcon(parent.id, 'phone_mother', 16, 'text-[#007353]', parent.phone_number_mother || '')}
                        </div>
                    </div>
                </td>

                {/* مهنة الأم */}
                <td className="px-3 py-3 text-gray-600 text-xs">{parent.job_mother || '-'}</td>

                {/* البريد الإلكتروني - يظهر على سطرين */}
                <td className="px-3 py-3 w-[180px]">
                    <div className="flex items-start justify-between gap-1 leading-tight text-sm">
                        <a
                            href={`mailto:${parent.email}`}
                            className="text-[#1e88e5] hover:text-[#0d47a1] underline break-words whitespace-normal"
                            style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '140px' }}
                        >
                            {parent.email || '-'}
                        </a>
                        <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                            {renderCopyIcon(parent.id, 'email', 16, 'text-[#1e88e5]', parent.email || '')}
                        </div>
                    </div>
                </td>

                {/* اسم المستخدم - الأيقونة ثابتة في أقصى اليمين */}
                <td className="px-3 py-3">
                    <div className="flex items-center justify-between gap-1.5 text-gray-600 text-xs">
                        <span className="font-mono text-left text-xs text-[#cf993f]">{parent.user_name || '-'}</span>
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                            {renderCopyIcon(parent.id, 'user_name', 16, 'text-[#cf993f]', parent.user_name || '')}
                        </div>
                    </div>
                </td>

                {/* تاريخ التسجيل */}
                <td className="px-3 py-3 text-gray-600 text-xs">
                    {parent.created_at ? new Date(parent.created_at).toLocaleDateString('en-CA') : '-'}
                </td>

                {/* خيارات */}
                <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                        <button
                            className="text-orange-500 hover:text-orange-700 p-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            title="تعديل"
                        >
                            <PenSquareIcon size={15} />
                        </button>
                        <button
                            className="text-red-500 hover:text-red-700 p-1"
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            title="حذف"
                        >
                            <Trash size={15} />
                        </button>
                    </div>
                </td>
            </tr>

            {/* صف الأبناء الممتد */}
            {isExpanded && (
                <tr className="bg-[#f0f7f5] border-t border-gray-100">
                    <td colSpan={10} className="p-0">
                        <div className="py-4 px-6 border-t border-gray-300">
                            <h3 className="font-bold text-gray-800 mb-4 pr-4 text-sm">أبنائهم الطلاب</h3>

                            {childrenLoading ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="animate-spin text-[#2e7d32]" size={20} />
                                </div>
                            ) : children.length === 0 ? (
                                <p className="text-gray-500 pr-4 text-xs">لا يوجد أبناء مسجلين لهذا ولي الأمر.</p>
                            ) : (
                                <div className="flex flex-wrap gap-4">
                                    {children.map((child) => (
                                        <div
                                            key={child.id}
                                            className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-2"
                                        >
                                            <div className="bg-[#f0f7f5] p-2 rounded-xl text-[#2e7d32] shrink-0 ml-2 w-[44px] h-[44px] flex items-center justify-center">
                                                <User2 size={25} />
                                            </div>

                                            <div className="flex flex-col items-start flex-1 min-w-0 gap-1">
                                                <p className="font-bold text-gray-800 text-sm text-center break-words">
                                                    {child.student_name}
                                                </p>
                                                <div className="flex items-start flex-col min-w-0 h-2">
                                                    <button
                                                        className="flex items-start gap-0.5 text-[#2e7d32] text-xs font-medium hover:underline"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/student/details/${child.id}`);
                                                        }}
                                                    >
                                                        عرض التفاصيل
                                                        <ChevronLeft size={12} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="shrink-0 mr-2 h-[33]">
                                                <span className="bg-[#f0f7f5] text-[#2e7d32] text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                                    {child.class_name}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}