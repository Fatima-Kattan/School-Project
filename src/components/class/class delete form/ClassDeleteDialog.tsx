'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/shared/button/button';

interface ClassDeleteDialogProps {
    isOpen: boolean;
    classData: {
        id: number;
        name: string;
        statistics?: {
            total_students: number;
        };
        students?: Array<{
            id: number;
            full_name: string;
        }>;
    } | null;
    onClose: () => void;
}

export const ClassDeleteDialog = ({
    isOpen,
    classData,
    onClose,
}: ClassDeleteDialogProps) => {
    const [studentsList, setStudentsList] = useState<Array<{ id: number; full_name: string }>>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [totalStudents, setTotalStudents] = useState(0);

    
    const fetchStudents = async () => {
        if (!classData?.id) return;

        setLoadingStudents(true);
        try {
            const token = localStorage.getItem('token') || '';
            const response = await fetch(
                `http://localhost:8000/api/dashboard/students/class/${classData.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                }
            );

            const result = await response.json();

            if (result.success && result.data) {
                
                const students = result.data.map((student: any) => ({
                    id: student.id,
                    full_name: student.full_name || student.user?.full_name || student.name || 'طالب',
                }));

                // خذ أول 3 طلاب فقط
                const firstThree = students.slice(0, 3);
                setStudentsList(firstThree);
                setTotalStudents(students.length);
            } else {
                
                if (classData.students && classData.students.length > 0) {
                    const students = classData.students.map((s: any) => ({
                        id: s.id,
                        full_name: s.full_name || s.name || 'طالب',
                    }));
                    const firstThree = students.slice(0, 3);
                    setStudentsList(firstThree);
                    setTotalStudents(students.length);
                } else {
                    setStudentsList([]);
                    setTotalStudents(0);
                }
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            
            
            if (classData.students && classData.students.length > 0) {
                const students = classData.students.map((s: any) => ({
                    id: s.id,
                    full_name: s.full_name || s.name || 'طالب',
                }));
                const firstThree = students.slice(0, 3);
                setStudentsList(firstThree);
                setTotalStudents(students.length);
            } else {
                setStudentsList([]);
                setTotalStudents(0);
            }
        } finally {
            setLoadingStudents(false);
        }
    };

    
    useEffect(() => {
        if (isOpen && classData) {
            
            if (classData.students && classData.students.length > 0) {
                const students = classData.students.map((s: any) => ({
                    id: s.id,
                    full_name: s.full_name || s.name || 'طالب',
                }));
                const firstThree = students.slice(0, 3);
                setStudentsList(firstThree);
                setTotalStudents(students.length);
                setLoadingStudents(false);
            } else {
                // جلب من الـ API
                fetchStudents();
            }
        }
    }, [isOpen, classData]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ====== Header ====== */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">حذف صف</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-red-50 active:bg-red-100hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* ====== Body ====== */}
                <div className="px-6 py-4">
                    
                    <p className="text-red-600 text-base mb-3">
                        لا يمكن حذف الصف لأنه يحتوي على {totalStudents} طالب
                        {totalStudents > 1 ? '' : ''}
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
                            
                            
                            {totalStudents > 3 && (
                                <p className="text-gray-500 text-sm mr-2">
                                    و {totalStudents - 3} طالب آخر
                                    {totalStudents - 3 > 1 ? 'ين' : ''}
                                </p>
                            )}
                        </>
                    )}

                    
                    <p className="text-red-600 text-sm font-medium mt-3">
                        قم بحذف الطلاب أولاً ثم احذف الصف
                    </p>
                </div>

                {/* ====== Footer ====== */}
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