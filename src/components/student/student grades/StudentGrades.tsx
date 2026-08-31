// components/student/student grades/StudentGrades.tsx

'use client';

import type { Student as StudentType } from '@/services/api/students/getStudent';
import { CheckCircle, XCircle, Award } from 'lucide-react';
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
        <div className="w-full">
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
                    description="ستظهر علامات الطالب هنا بمجرد خضوعه إلى اختبار وتصحيح نتائجه"
                    icon={null}
                    showButton={false}
                    className="bg-transparent border-0 shadow-none p-0 py-16"
                />
            )}
        </div>
    );
};