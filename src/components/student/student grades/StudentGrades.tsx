// components/student/student grades/StudentGrades.tsx

'use client';

import type { Student as StudentType } from '@/services/api/students/getStudent';
import { BookOpen, CheckCircle, XCircle, Award } from 'lucide-react';
import { Empty } from '@/components/shared/empty/empty';

interface StudentGradesProps {
    student: StudentType;
}

export const StudentGrades = ({ student }: StudentGradesProps) => {
    const subjects = student.subjects || [];
    const hasGrades = subjects.length > 0;

    const totalSubjects = subjects.length;
    const passedSubjects = subjects.filter((s) => s.mark !== null && s.mark >= 50).length || 0;
    const failedSubjects = totalSubjects - passedSubjects;
    const average = totalSubjects > 0 
        ? subjects.reduce((acc, s) => acc + (s.mark || 0), 0) / totalSubjects 
        : 0;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <BookOpen size={20} className="text-orange-500" />
                    سجل العلامات
                    {hasGrades && (
                        <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                            {totalSubjects} مادة
                        </span>
                    )}
                </h2>
                
                {hasGrades && (
                    <div className="flex gap-4 text-sm flex-wrap">
                        <span className="flex items-center gap-1">
                            <CheckCircle size={14} className="text-green-500" />
                            <span className="text-gray-600">ناجح: {passedSubjects}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <XCircle size={14} className="text-red-500" />
                            <span className="text-gray-600">راسب: {failedSubjects}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <Award size={14} className="text-purple-500" />
                            <span className="text-gray-600">المعدل: {average > 0 ? average.toFixed(1) : '-'}</span>
                        </span>
                    </div>
                )}
            </div>
            
            {hasGrades ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">المادة</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">العلامة</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">نوع الامتحان</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">التاريخ</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الملاحظات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((sub, i) => {
                                const isPassed = sub.mark !== null && sub.mark >= 50;
                                return (
                                    <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-gray-800">{sub.name}</td>
                                        <td className="py-3 px-4">
                                            <span className={`
                                                font-semibold
                                                ${isPassed ? 'text-green-600' : 'text-red-600'}
                                            `}>
                                                {sub.mark ?? '-'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                                                {sub.exam_type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{sub.date}</td>
                                        <td className="py-3 px-4 text-gray-500">{sub.note || '-'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <Empty
                    title="لا سجل علامات بعد"
                    description="ستظهر علامات الطالب هنا بمجرد خضوعه إلى اختبار وتصحيح نتائجها"
                    icon={<BookOpen size={48} className="text-gray-300" />}
                    showButton={false}
                />
            )}
        </div>
    );
};