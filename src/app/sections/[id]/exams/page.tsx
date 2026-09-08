// app/sections/[id]/exams/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ExamForm from '@/components/exam/ExamForm';

interface Subject {
    id: number;
    name: string;
    full_mark: number;
}

interface Section {
    id: number;
    name: string;
}

export default function ExamsPage() {
    const router = useRouter();
    const params = useParams();
    const sectionId = params?.id as string;

    const [token, setToken] = useState<string>('');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token') || '';
        if (!storedToken) {
            router.push('/login');
            return;
        }
        setToken(storedToken);

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. جلب المواد الدراسية
                const subjectsRes = await fetch(
                    'http://localhost:8000/api/dashboard/subjects',
                    {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`,
                            'Accept': 'application/json',
                        },
                    }
                );
                const subjectsResult = await subjectsRes.json();
                if (!subjectsRes.ok) {
                    throw new Error(subjectsResult.message || 'فشل في جلب المواد');
                }
                setSubjects(subjectsResult.data || []);

                // 2. جلب الشعبة الحالية
                const sectionRes = await fetch(
                    `http://localhost:8000/api/dashboard/sections/${sectionId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`,
                            'Accept': 'application/json',
                        },
                    }
                );
                const sectionResult = await sectionRes.json();
                if (!sectionRes.ok) {
                    throw new Error(sectionResult.message || 'فشل في جلب الشعبة');
                }

                const currentSection = sectionResult.data;
                setSections([{
                    id: currentSection.id,
                    name: currentSection.name
                }]);

            } catch (err: any) {
                console.error('Error:', err);
                setError(err.message || 'حدث خطأ أثناء تحميل البيانات');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sectionId, router]);

    const handleSuccess = (data: any) => {
        console.log('✅ Exam created:', data);
        // العودة إلى صفحة تفاصيل الشعبة
        router.push(`/sections/${sectionId}`);
    };

    const handleError = (error: string) => {
        console.error('❌ Exam creation failed:', error);
    };

    const handleClose = () => {
        router.back(); // أو router.push(`/sections/${sectionId}`)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white rounded-xl p-8 shadow-sm max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">⚠️ خطأ</h2>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={handleClose}
                        className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        العودة
                    </button>
                </div>
            </div>
        );
    }

    return (
        // ✅ خلفية شفافة (مثل الديالوج)
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                padding: '20px',
                overflowY: 'auto',
            }}
            onClick={handleClose}
        >
            {/* ✅ محتوى الديالوج */}
            <div
                style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    maxWidth: '800px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* زر الإغلاق */}
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        left: '20px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#999',
                        zIndex: 10,
                    }}
                >
                    ✕
                </button>

                {/* نموذج إضافة الامتحان */}
                <ExamForm
                    token={token}
                    subjects={subjects}
                    sections={sections}
                    onSuccess={handleSuccess}
                    onError={handleError}
                />
            </div>
        </div>
    );
}