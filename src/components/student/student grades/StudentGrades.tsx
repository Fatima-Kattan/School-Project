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

    
    const [openSubject, setOpenSubject] = useState<string | null>(null);

    
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
                exam_type: 'نصفي',
                date: sub.date || '-',
                teacher_name: teacherName,
                mark: sub.exam_type === 'نصفي' ? (sub.mark ?? '-') : ((sub as any).midterm_mark ?? '-'),
                note: sub.note || '-',
            },
            {
                id: 2,
                exam_type: 'نهائي',
                date: sub.date || '-',
                teacher_name: teacherName,
                mark: sub.exam_type === 'نهائي' ? (sub.mark ?? '-') : ((sub as any).final_mark ?? '-'),
                note: sub.note || '-',
            },
        ];
    };

    
    const getStatus = (mark: number | null) => {
        if (mark === null || mark === undefined) return { text: 'غير محدد', isPassed: false };
        return mark >= 50 ? { text: 'ناجح', isPassed: true } : { text: 'راسب', isPassed: false };
    };

    
    const calculateTotal = () => {
        let total = 0;
        let maxTotal = 0;
        let passedCount = 0;
        let failedCount = 0;

        subjects.forEach((sub: any) => {
            const mark = sub.mark ?? 0;
            const maxMark = getMaxMark(sub);
            total += mark;
            maxTotal += maxMark;
            if (mark >= 50) {
                passedCount++;
            } else {
                failedCount++;
            }
        });

        return { total, maxTotal, passedCount, failedCount };
    };

    const { total, maxTotal, passedCount, failedCount } = calculateTotal();

    const cellStyle = {
        verticalAlign: 'middle' as const,
        height: '48px',
        padding: '10px 16px',
    };

    return (
        <div className="w-full space-y-4" dir="rtl">
            {hasGrades ? (
                <>
                    
                    <div 
                        className="bg-white rounded-[16px] border p-4 flex items-center justify-between"
                        style={{ borderColor: '#E5E7EB' }}
                    >
                        <div className="flex items-center gap-6">
                            <div>
                                <span className="text-[13px] text-gray-500" style={{ fontFamily: 'Cairo' }}>
                                    المجموع الكلي
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[24px] font-extrabold text-[#007353]" style={{ fontFamily: 'Cairo' }}>
                                        {total}
                                    </span>
                                    <span className="text-[16px] font-bold text-gray-400" style={{ fontFamily: 'Cairo' }}>
                                        / {maxTotal}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                    </div>

                    
                    {subjects.map((sub, i) => {
                        const subject: any = sub;
                        const maxMark = getMaxMark(subject);
                        const mark = subject.mark ?? null;
                        const status = getStatus(mark);
                        const isSubjectOpen = openSubject === subject.name;
                        const examRows: ExamRow[] = buildExamRows(subject);

                        const columns: Column<any>[] = [
                            {
                                key: 'id',
                                header: '#',
                                align: 'center',
                                width: 60,
                                render: (row) => (
                                    <span className="text-gray-500 font-medium" style={cellStyle}>{String(row.id).padStart(2, '0')}</span>
                                ),
                            },
                            {
                                key: 'exam_type',
                                header: 'نوع الامتحان',
                                align: 'center',
                                width: 120,
                                render: (row) => (
                                    <span className="text-gray-600" style={cellStyle}>{row.exam_type || 'امتحان'}</span>
                                ),
                            },
                            {
                                key: 'date',
                                header: 'تاريخ التقديم',
                                align: 'center',
                                width: 130,
                                render: (row) => (
                                    <span className="text-gray-500" style={cellStyle}>{row.date || '-'}</span>
                                ),
                            },
                            {
                                key: 'teacher_name',
                                header: 'الأستاذ المصحح',
                                align: 'center',
                                width: 160,
                                minWidth: 160,
                                render: (row) => (
                                    <span className="text-gray-600" style={cellStyle}>{row.teacher_name || '-'}</span>
                                ),
                            },
                            {
                                key: 'mark',
                                header: 'العلامة',
                                align: 'center',
                                width: 110,
                                render: (row) => {
                                    const markValue = row.mark ?? '-';
                                    return (
                                        <span className={`font-bold text-[15px] ${status.isPassed ? 'text-green-600' : 'text-red-600'}`} style={cellStyle}>
                                            {markValue} / {maxMark}
                                        </span>
                                    );
                                },
                            },
                            {
                                key: 'status',
                                header: 'الحالة',
                                align: 'center',
                                width: 80,
                                render: (row) => (
                                    <span style={cellStyle}>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {status.text}
                                        </span>
                                    </span>
                                ),
                            },
                            {
                                key: 'note',
                                header: 'ملاحظات الأستاذ',
                                align: 'center',
                                width: 180,
                                minWidth: 180,
                                render: (row) => (
                                    <span className="text-gray-500" style={cellStyle}>{row.note || '-'}</span>
                                ),
                            },
                        ];

                        return (
                            <div 
                                key={i}
                                className="border rounded-[12px] overflow-hidden bg-white"
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
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {status.text}
                                        </span>
                                        <span className={`text-[22px] font-extrabold leading-none ${status.isPassed ? 'text-green-600' : 'text-red-600'}`} style={{ fontFamily: 'Cairo' }}>
                                            {mark ?? '-'}
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
                </>
            ) : (
                <div className="w-full flex flex-col items-center justify-center text-center py-16 bg-white rounded-[12px] border border-[#E5E7EB]">
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