// app/sections/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, Users, User, ClipboardList, Plus } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Breadcrumb } from '@/components/shared/breadcrumb/breadcrumb';
import ClassStudents from '@/components/class/class students/ClassStudents';
import { Empty } from '@/components/shared/empty/empty';

interface SectionData {
    id: number;
    name: string;
    comment: string | null;
    class_id: number;
    class?: {
        id: number;
        name: string;
    };
    total_teachers: number;
    total_students: number;
}

export default function SectionDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const sectionId = params?.id as string;

    const [section, setSection] = useState<SectionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'students' | 'exams'>('students');

    useEffect(() => {
        const fetchSection = async () => {
            if (!sectionId) return;

            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem('token') || '';
                if (!token) {
                    router.push('/login');
                    return;
                }

                const response = await fetch(
                    `http://localhost:8000/api/dashboard/sections/${sectionId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                        },
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'حدث خطأ أثناء جلب البيانات');
                }

                setSection(result.data);
            } catch (err: any) {
                console.error('Error fetching section:', err);
                setError(err.message || 'حدث خطأ أثناء جلب بيانات الشعبة');
            } finally {
                setLoading(false);
            }
        };

        fetchSection();
    }, [sectionId, router]);

    
    const openAddStudentDialog = () => {
        window.dispatchEvent(new CustomEvent('openAddStudentDialog'));
    };

    // Breadcrumb items
    const breadcrumbItems = [
        { label: 'الصفوف والشعب', href: '/classes' },
        { label: section?.class?.name || '...' },
        { label: section?.name || '...' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error || !section) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white rounded-xl p-8 shadow-sm max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">⚠️ خطأ</h2>
                    <p className="text-gray-600">{error || 'لم يتم العثور على الشعبة'}</p>
                    <Button
                        variant="primary"
                        onClick={() => router.back()}
                        className="mt-4"
                    >
                        العودة
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="relative">
                <Breadcrumb
                    items={breadcrumbItems}
                    className="mb-0"
                    showBackButton={true}
                    onBack={() => router.back()}
                />
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                    <Button
                        variant="primary"
                        onClick={openAddStudentDialog}
                        leftIcon={<Plus size={16} />}
                        size="md"
                        className="px-5 py-2.5 shadow-sm"
                        type="button"
                    >
                        إضافة طالب
                    </Button>
                </div>
            </div>

            <div className="px-6 pt-4">
                <div className="flex items-center justify-between bg-white rounded-[20px] border border-[#E0E0E0] p-3">
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setActiveTab('students')}
                            variant={activeTab === 'students' ? 'primary' : 'ghost-outline'}
                            size="md"
                            minWidth={activeTab === 'students' ? '80px' : '76px'}
                            className={`!h-[32px] !rounded-[13px] text-sm font-semibold !border !border-[#E0E0E0] ${activeTab !== 'students' ? 'text-gray-500 hover:text-gray-700' : ''
                                }`}
                        >
                            الطلاب
                        </Button>
                        <Button
                            onClick={() => setActiveTab('exams')}
                            variant={activeTab === 'exams' ? 'primary' : 'ghost-outline'}
                            size="md"
                            minWidth={activeTab === 'exams' ? '80px' : '76px'}
                            className={`!h-[32px] !rounded-[13px] text-sm font-semibold !border !border-[#E0E0E0] ${activeTab !== 'exams' ? 'text-gray-500 hover:text-gray-700' : ''
                                }`}
                        >
                            الاختبارات
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
                {activeTab === 'students' && (
                    <ClassStudents
                        classId={String(section.class_id)}
                        sectionId={section.id}
                        sectionName={section.name}
                        onBack={() => router.push(`/classes/${section.class_id}`)}
                    />
                )}

                {activeTab === 'exams' && (
                    <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0] flex-1 min-h-[448px]">
                        <Empty
                            title="لا توجد اختبارات"
                            description="قم بإضافة اختبار لهذه الشعبة الآن"
                            buttonText="إضافة اختبار"
                            onButtonClick={() => router.push(`/sections/${section.id}/exams`)}
                            icon={<ClipboardList size={32} />}
                        />
                    </div>
                )}
            </div>
        </div>

    );
}