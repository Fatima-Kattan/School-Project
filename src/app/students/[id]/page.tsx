// app/students/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StudentDetails } from '@/components/student/student details/StudentDetails';
import { getStudent } from '@/services/api/students/getStudent';

export default function StudentDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const token = localStorage.getItem('token') || '';
                if (!token) {
                    setError('الرجاء تسجيل الدخول');
                    setLoading(false);
                    return;
                }

                const response = await getStudent(Number(params.id), token);
                if (response.success && response.data) {
                    setStudent(response.data);
                } else {
                    setError(response.message || 'لم يتم العثور على الطالب');
                }
            } catch (err: any) {
                setError(err.message || 'حدث خطأ أثناء جلب البيانات');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchStudent();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007353] mx-auto"></div>
                    <p className="mt-4 text-gray-500">جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center bg-white p-8 rounded-[12px] shadow-sm">
                    <p className="text-red-500 text-lg">{error || 'لم يتم العثور على الطالب'}</p>
                    <button
                        onClick={() => router.push('/students')}
                        className="mt-4 text-[#007353] hover:underline"
                    >
                        العودة للقائمة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <StudentDetails
                student={student}
                onBack={() => router.push('/students')}
            />
        </div>
    );
}