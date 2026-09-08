// src/app/classes/[id]/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ClassDetails from '@/components/class/class details/ClassDetails';
import { getClass } from '@/services/api/classes/getClass';

export default function ClassDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            
            const token = localStorage.getItem('token') ||
                            localStorage.getItem('auth_token') ||
                            localStorage.getItem('access_token');

            if (!token) {
                router.push('/login');
                return;
            }

            const response = await getClass(Number(params.id), token);
            
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Class not found');
            }

            const { class: classData, statistics } = response.data;

            const formattedData = {
                id: classData.id.toString(),
                name: classData.name,
                grade: classData.name,
                level: 'أساسي',
                comment: classData.comment || '',
                sections: classData.sections || [],
                subjects: classData.subjects || [],
                students: classData.students || [],
                statistics: {
                    total_students: statistics?.total_students || 0,
                    total_sections: statistics?.total_sections || 0,
                    total_subjects: statistics?.total_subjects || 0,
                    total_teachers: statistics?.total_teachers || 0,
                },
            };

            setClassData(formattedData);
            setError(null);

        } catch (err: any) {
            console.error('❌ Error:', err);
            
            if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
                router.push('/login');
                return;
            }
            
            if (err.message?.includes('404')) {
                setError('الصف غير موجود');
            } else {
                setError(err.message || 'حدث خطأ');
            }
        } finally {
            setLoading(false);
        }
    }, [params.id, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshTrigger]);

    const handleRefresh = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007353] mx-auto"></div>
                    <p className="mt-4 text-gray-500">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px] p-10">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-2">⚠️ {error}</h2>
                    <button
                        onClick={handleRefresh}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        إعادة المحاولة
                    </button>
                    <br />
                    <a href="/classes" className="mt-2 inline-block text-blue-500 hover:underline">
                        ← العودة للقائمة
                    </a>
                </div>
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="flex items-center justify-center min-h-[400px] p-10">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-orange-500 mb-2">🔍 لا توجد بيانات</h2>
                    <a href="/classes" className="text-blue-500 hover:underline">
                        ← العودة للقائمة
                    </a>
                </div>
            </div>
        );
    }

    return (
        <ClassDetails 
            key={refreshTrigger}
            classData={classData} 
            onRefresh={handleRefresh} 
        />
    );
}