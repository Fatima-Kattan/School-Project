// components/student/student details/StudentDetails.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Edit, Trash2, RefreshCw, User, Hash, BookOpen, Users, Mail } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { getStudent } from '@/services/api/students/getStudent';
import type { Student as StudentType } from '@/services/api/students/getStudent';
import { StudentInfo } from '../student info/StudentInfo';
import { StudentParentInfo } from '../student parent info/StudentParentInfo';
import { StudentGrades } from '../student grades/StudentGrades';
import { Empty } from '@/components/shared/empty/empty';

interface StudentDetailsProps {
    studentId: number;
    onDelete?: (student: StudentType) => void;
}

export const StudentDetails = ({ studentId, onDelete }: StudentDetailsProps) => {
    const router = useRouter();
    const [student, setStudent] = useState<StudentType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStudent = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token') || '';
            const response = await getStudent(studentId, token);
            
            if (response.success) {
                setStudent(response.data);
            } else {
                setError(response.message || 'فشل في جلب بيانات الطالب');
            }
        } catch (err: any) {
            setError(err.message || 'حدث خطأ');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudent();
    }, [studentId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500">⏳ جاري التحميل...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <Empty
                    title="حدث خطأ"
                    description={error}
                    buttonText="إعادة المحاولة"
                    onButtonClick={fetchStudent}
                    icon={<RefreshCw size={48} className="text-red-400" />}
                />
            </div>
        );
    }

    if (!student) {
        return (
            <div className="text-center py-12">
                <Empty
                    title="الطالب غير موجود"
                    description="لم نتمكن من العثور على الطالب المطلوب"
                    buttonText="العودة للقائمة"
                    onButtonClick={() => router.push('/students')}
                    icon={<User size={48} className="text-gray-300" />}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ====== العنوان ====== */}
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
                    <Button variant="ghost" onClick={() => router.push('/students')}>
                        <ArrowRight size={16} className="ml-2" />
                        رجوع
                    </Button>
                    <Button variant="primary" onClick={() => router.push(`/students/${studentId}/edit`)}>
                        <Edit size={16} className="ml-2" />
                        تعديل
                    </Button>
                    {onDelete && (
                        <Button variant="danger" onClick={() => onDelete(student)}>
                            <Trash2 size={16} className="ml-2" />
                            حذف
                        </Button>
                    )}
                    <Button variant="ghost" onClick={fetchStudent} title="تحديث">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </Button>
                </div>
            </div>

            
            <StudentInfo student={student} />

            
            <StudentParentInfo student={student} />

            
            <StudentGrades student={student} />
        </div>
    );
};