// components/student/student details/StudentDetails.tsx

'use client';

import { ArrowRight, Edit, Trash2, User, Hash, BookOpen, Users, Mail } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { StudentInfo } from '../student info/StudentInfo';
import { StudentParentInfo } from '../student parent info/StudentParentInfo';
import { StudentGrades } from '../student grades/StudentGrades';

interface StudentDetailsProps {
    student: any;
    onEdit?: () => void;
    onDelete?: () => void;
    onBack?: () => void;
}

export const StudentDetails = ({ student, onEdit, onDelete, onBack }: StudentDetailsProps) => {
    if (!student) return null;

    return (
        <div className="space-y-6">
            {/* العنوان */}
            <div className="flex justify-between items-center flex-wrap gap-3 bg-white rounded-xl border border-gray-200 p-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <User size={24} className="text-blue-500" />
                        {student.full_name}
                    </h1>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Hash size={14} /> #{student.id}
                        </span>
                        <span className="flex items-center gap-1">
                            <BookOpen size={14} /> {student.class?.name || 'غير محدد'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Users size={14} /> {student.section?.name || 'غير محدد'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Mail size={14} /> {student.email}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <Button variant="ghost" onClick={onBack}>
                        <ArrowRight size={16} className="ml-2" />
                        رجوع
                    </Button>
                    <Button variant="primary" onClick={onEdit}>
                        <Edit size={16} className="ml-2" />
                        تعديل
                    </Button>
                    {onDelete && (
                        <Button variant="danger" onClick={onDelete}>
                            <Trash2 size={16} className="ml-2" />
                            حذف
                        </Button>
                    )}
                </div>
            </div>

            <StudentInfo student={student} />
            <StudentParentInfo student={student} />
            <StudentGrades student={student} />
        </div>
    );
};