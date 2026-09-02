// components/student/student grades/StudentGrades.tsx

'use client';

import { useState } from 'react';
import type { Student as StudentType } from '@/services/api/students/getStudent';
import { ChevronDown, ChevronLeft, Inbox } from 'lucide-react';
import { Table, Column } from '@/components/shared/table/table';

interface StudentGradesProps {
    student: StudentType;
}
interface ExamRow {
    id: number;
    exam_type: string;
    date: string;
    teacher_name: string;
    mark: number | string | null;
    note: string | null;
}

export const StudentGrades = ({ student }: StudentGradesProps) => {
    const subjects = student.subjects || [];
    const hasGrades = subjects.length > 0;

    
    const [openSemester, setOpenSemester] = useState<string | null>('الفصل الدراسي الأول');
    const [openSubject, setOpenSubject] = useState<string | null>(null);

    
    const semesters: Record<string, typeof subjects> = {};
    subjects.forEach((sub) => {
        const semesterName = (sub as any).semester_name || 'الفصل الدراسي الأول';
        if (!semesters[semesterName]) {
            semesters[semesterName] = [];
        }
        semesters[semesterName].push(sub);
    });

    if (Object.keys(semesters).length === 0 && subjects.length > 0) {
        semesters['الفصل الدراسي الأول'] = subjects;
    }

    
    const getMaxMark = (sub: any) => {
        return sub.max_mark || sub.full_mark || 100;
    };

    
    const getTeacherName = (sub: any) => {
        return sub.teacher_name || 
                sub.teacher || 
                sub.teacher_full_name || 
                sub.teacherName || 
                sub.teacher_details?.name || 
                sub.teacher_details?.full_name || 
                '-';
    };

    
    const buildExamRows = (sub: any): ExamRow[] => {
        const teacherName = getTeacherName(sub);
        
        return [
            {
                id: 1,
                exam_type: 'امتحان نصفي',
                date: sub.date || '-',
                teacher_name: teacherName,
                mark: sub.exam_type === 'نصفي' ? (sub.mark ?? '-') : ((sub as any).midterm_mark ?? '-'),
                note: sub.note || '-',
            },
            {
                id: 2,
                exam_type: 'امتحان نهائي',
                date: sub.date || '-',
                teacher_name: teacherName,
                mark: sub.exam_type === 'نهائي' ? (sub.mark ?? '-') : ((sub as any).final_mark ?? '-'),
                note: sub.note || '-',
            },
        ];
    };

    
    const cellStyle = {
        verticalAlign: 'middle' as const,
        height: '48px',
        padding: '10px 16px',
    };

    return (
        <div className="w-full space-y-4" dir="rtl">
            {hasGrades ? (
                <>
                    {Object.entries(semesters).map(([semesterName, semesterSubjects]) => {
                        const semesterTotal = semesterSubjects.reduce((acc, s) => acc + (s.mark || 0), 0);
                        const semesterMax = semesterSubjects.reduce((acc, s) => acc + (getMaxMark(s)), 0);

                        const isSemesterOpen = openSemester === semesterName;

                        return (
                            <div 
                                key={semesterName}
                                className="bg-white rounded-[16px] border overflow-hidden"
                                style={{ border: '1px solid #E5E7EB' }}
                            >
                                
                                <button
                                    onClick={() => setOpenSemester(isSemesterOpen ? null : semesterName)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {isSemesterOpen ? <ChevronDown size={20} className="text-green-600" /> : <ChevronLeft size={20} className="text-green-600" />}
                                        <span className="text-[16px] font-bold text-gray-800" style={{ fontFamily: 'Cairo' }}>
                                            {semesterName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[18px] font-bold text-green-600" style={{ fontFamily: 'Cairo' }}>
                                            {semesterTotal.toLocaleString()}/{semesterMax.toLocaleString()}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                            ناجح
                                        </span>
                                    </div>
                                </button>

                                
                                {isSemesterOpen && (
                                    <div className="border-t p-4 space-y-4" style={{ borderColor: '#E5E7EB' }}>
                                        {semesterSubjects.map((sub, i) => {
                                            
                                            const subject: any = sub; 
                                            const maxMark = getMaxMark(subject);
                                            
                                        
                                            const isPassed = subject.is_passed || subject.status === 'ناجح' || (subject.mark !== null && Number(subject.mark) >= 50);
                                            
                                            const isSubjectOpen = openSubject === subject.name;
                                            const examRows: ExamRow[] = buildExamRows(subject);

                                            
                                            const columns: Column<any>[] = [
                                                {
                                                    key: 'id',
                                                    header: 'الرقم',
                                                    align: 'center',
                                                    width: 80,
                                                    render: (row) => (
                                                        <span className="text-gray-500 font-medium" style={cellStyle}>{String(row.id).padStart(2, '0')}</span>
                                                    ),
                                                },
                                                {
                                                    key: 'exam_type',
                                                    header: 'النوع',
                                                    align: 'center',
                                                    width: 140,
                                                    render: (row) => (
                                                        <span className="text-gray-600" style={cellStyle}>{row.exam_type || 'امتحان'}</span>
                                                    ),
                                                },
                                                {
                                                    key: 'date',
                                                    header: 'تاريخ التقديم',
                                                    align: 'center',
                                                    width: 140,
                                                    render: (row) => (
                                                        <span className="text-gray-500" style={cellStyle}>{row.date || '-'}</span>
                                                    ),
                                                },
                                                {
                                                    key: 'teacher_name',
                                                    header: 'الأستاذ المصحح',
                                                    align: 'center',
                                                    width: 180,
                                                    minWidth: 180,
                                                    render: (row) => (
                                                        <span className="text-gray-600" style={cellStyle}>{row.teacher_name || '-'}</span>
                                                    ),
                                                },
                                                {
                                                    key: 'mark',
                                                    header: 'العلامة',
                                                    align: 'center',
                                                    width: 120,
                                                    render: (row) => {
                                                        const mark = row.mark ?? '-';
                                                        return (
                                                            <span className={`font-bold text-[15px] ${isPassed ? 'text-green-600' : 'text-red-600'}`} style={cellStyle}>
                                                                {mark} / {maxMark}
                                                            </span>
                                                        );
                                                    },
                                                },
                                                {
                                                    key: 'status',
                                                    header: 'الحالة',
                                                    align: 'center',
                                                    width: 90,
                                                    render: (row) => (
                                                        <span style={cellStyle}>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {isPassed ? 'ناجح' : 'راسب'}
                                                            </span>
                                                        </span>
                                                    ),
                                                },
                                                {
                                                    key: 'note',
                                                    header: 'ملاحظات الأستاذ',
                                                    align: 'center',
                                                    width: 200,
                                                    minWidth: 200,
                                                    render: (row) => (
                                                        <span className="text-gray-500" style={cellStyle}>{row.note || '-'}</span>
                                                    ),
                                                },
                                            ];

                                            return (
                                                <div 
                                                    key={i}
                                                    className="border rounded-[12px] overflow-hidden"
                                                    style={{ border: '1px solid #E5E7EB' }}
                                                >
                                                    
                                                    <button
                                                        onClick={() => setOpenSubject(isSubjectOpen ? null : subject.name)}
                                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {isSubjectOpen ? <ChevronDown size={18} className="text-green-600" /> : <ChevronLeft size={18} className="text-green-600" />}
                                                            <span className="text-[16px] font-semibold text-gray-800" style={{ fontFamily: 'Cairo' }}>
                                                                {subject.name}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isPassed ? 'bg-red-100 text-red-700' : 'bg-red-100 text-red-700'}`}>
                                                                {isPassed ? 'راسب' : 'راسب'}
                                                            </span>
                                                            <span className={`text-[22px] font-extrabold leading-none ${isPassed ? 'text-red-600' : 'text-red-600'}`} style={{ fontFamily: 'Cairo' }}>
                                                                {subject.mark ?? '-'}
                                                            </span>
                                                            <span className="text-[16px] font-bold text-gray-400 leading-none" style={{ fontFamily: 'Cairo' }}>
                                                                /{maxMark}
                                                            </span>
                                                        </div>
                                                    </button>

                                                    
                                                    {isSubjectOpen && (
                                                        <div className="border-t" style={{ borderColor: '#E5E7EB' }}>
                                                            <Table
                                                                columns={columns}
                                                                data={examRows}
                                                                keyExtractor={(row) => row.id}
                                                                emptyTitle="لا توجد علامات لهذه المادة"
                                                                emptyDescription=""
                                                                emptyIcon={<Inbox size={32} className="text-gray-400" />}
                                                                compact
                                                                headerBgColor="#F9FAFB"
                                                                rowBgColor="#FFFFFF"
                                                                borderColor="#E5E7EB"
                                                                radius={0}
                                                                headerTextColor="#6B7280"
                                                                headerFontWeight={700}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </>
            ) : (
                <div className="w-full flex flex-col items-center justify-center text-center py-16">
                    <h4 
                        className="mb-2"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 700,
                            fontSize: '16px',
                            lineHeight: '24px',
                            color: '#000F0B',
                        }}
                    >
                        لا سجل علامات بعد
                    </h4>
                    <p 
                        className="max-w-md"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 400,
                            fontSize: '13px',
                            lineHeight: '22px',
                            color: '#6B7280',
                        }}
                    >
                        ستظهر علامات الطالب هنا بمجرد خضوعه إلى اختبار وتصحيح نتائجه
                    </p>
                </div>
            )}
        </div>
    );
};