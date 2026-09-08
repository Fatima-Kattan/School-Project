// src/components/class sections/SectionDeleteDialog.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/shared/button/button';

interface SectionDeleteDialogProps {
    isOpen: boolean;
    sectionData: {
        id: number;
        name: string;
        total_students?: number;      // ✅ إضافة
        students_count?: number;
        statistics?: {
            students_count: number;
        };
        students?: Array<{
            id: number;
            full_name?: string;
            user?: {
                full_name: string;
            };
        }>;
    } | null;
    onClose: () => void;
}

export const SectionDeleteDialog = ({
    isOpen,
    sectionData,
    onClose,
}: SectionDeleteDialogProps) => {
    const [studentsList, setStudentsList] = useState<Array<{ id: number; full_name: string }>>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [totalStudents, setTotalStudents] = useState(0);

    // ✅ حساب عدد الطلاب من جميع المصادر الممكنة
    const getStudentsCount = (data: typeof sectionData): number => {
        if (!data) return 0;
        return data.total_students ||           // ✅ من التعديل الجديد
               data.statistics?.students_count || 
               data.students_count || 
               data.students?.length || 
               0;
    };

    useEffect(() => {
        if (isOpen && sectionData) {
            const count = getStudentsCount(sectionData);
            setTotalStudents(count);

            // ✅ إذا كان هناك طلاب في البيانات
            if (sectionData.students && sectionData.students.length > 0) {
                const students = sectionData.students.map((s: any) => ({
                    id: s.id,
                    full_name: s.full_name || s.user?.full_name || s.name || 'طالب',
                }));
                const firstThree = students.slice(0, 3);
                setStudentsList(firstThree);
                setLoadingStudents(false);
            } else {
                setStudentsList([]);
                setLoadingStudents(false);
            }
        }
    }, [isOpen, sectionData]);

    if (!isOpen) return null;

    const count = getStudentsCount(sectionData);

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">حذف شعبة</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-red-50 active:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    <p className="text-red-600 text-base mb-3">
                        لا يمكن حذف الشعبة "{sectionData?.name}" لأنه يحتوي على {count} طالب
                        {count > 1 ? '' : ''}
                    </p>

                    {loadingStudents ? (
                        <div className="flex justify-center py-3">
                            <Loader2 className="animate-spin text-gray-400" size={24} />
                        </div>
                    ) : (
                        <>
                            {studentsList.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {studentsList.map((student) => (
                                        <span
                                            key={student.id}
                                            className="flex items-center justify-center flex-shrink-1 bg-[#fae5e5] text-red-600 text-md font-bold min-w-[60px] h-[30px] p-2 rounded-xl"
                                        >
                                            {student.full_name}
                                        </span>
                                    ))}
                                </div>
                            )}
                            
                            {count > 3 && (
                                <p className="text-gray-500 text-sm mr-2">
                                    و {count - 3} طالب آخر
                                    {count - 3 > 1 ? 'ين' : ''}
                                </p>
                            )}
                        </>
                    )}

                    <p className="text-red-600 text-sm font-medium mt-3">
                        قم بحذف الطلاب أولاً ثم احذف الشعبة
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t border-gray-200">
                    <Button
                        variant="ghost-outline"
                        onClick={onClose}
                        size="md"
                        className="h-[36px] rounded-[12px] text-sm"
                        minWidth="80px"
                    >
                        إغلاق
                    </Button>
                </div>
            </div>
        </div>
    );
};