// src/components/class/ClassDetails.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Users, BookOpen, User, GraduationCap, School } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import ClassSubjects from '../class subjects/ClassSubjects';
import ClassSections from '../class sections/ClassSections';

interface ClassDetailsProps {
    classData: {
        id: string;
        name: string;
        grade: string;
        level: string;
        comment?: string;
        sections?: any[];
        subjects?: any[];
        statistics?: {
            total_students: number;
            total_sections: number;
            total_subjects: number;
            total_teachers: number;
        };
    };
}

type TabType = 'subjects' | 'sections';

export const ClassDetails = ({ classData }: ClassDetailsProps) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('sections');

    if (!classData) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold text-red-500">⚠️ لا توجد بيانات</h2>
            </div>
        );
    }

    // ✅ معالجة الضغط على مادة
    const handleSubjectClick = (subjectId: number) => {
        console.log('📖 Subject clicked:', subjectId);
        // router.push(`/subjects/${subjectId}`);
    };

    // ✅ معالجة الضغط على شعبة
    const handleSectionClick = (sectionId: number) => {
        console.log('📚 Section clicked:', sectionId);
        // router.push(`/sections/${sectionId}`);
    };

    // ✅ إحصائيات الصف
    const statistics = classData.statistics || {
        total_students: 0,
        total_sections: 0,
        total_subjects: 0,
        total_teachers: 0,
    };

    // ✅ بطاقات الإحصائيات
        const statsCards = [
        {
            id: 'sections',
            label: 'عدد الشعب',
            value: statistics.total_sections,
            icon: <School size={25} className="text-white" />,
            bgColor: '#2563EB', // أزرق
            iconColor: '#1A56DB'
        },
        {
            id: 'subjects',
            label: 'عدد المواد الكلي',
            value: statistics.total_subjects,
            icon: <BookOpen size={25} className="text-white" />,
            bgColor: '#FA8022', // أخضر
            iconColor: '#059669'
        },
        {
            id: 'students',
            label: 'عدد الطلاب الكلي',
            value: statistics.total_students,
            icon: <GraduationCap size={25} className="text-white" />,
            bgColor: '#7C3AED', // بنفسجي
            iconColor: '#7C3AED'
        },
        {
            id: 'teachers',
            label: 'عدد المدرسين المكلفين',
            value: statistics.total_teachers,
            icon: <Users size={25} className="text-white" />,
            bgColor: '#14B8A6', // أحمر
            iconColor: '#DC2626'
        },
    ];

    return (
        <div className="w-full" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
            {/* الهيدر */}
            <div
                className="w-full bg-white border-b border-[#E0E0E0] px-6 py-10"
                style={{ borderBottom: '0.5px solid #E0E0E0' }}
            >
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center rounded-[8px] border border-[#ACACAC] bg-white transition-colors hover:bg-gray-50"
                        style={{ width: '28px', height: '28px', border: '0.5px solid #ACACAC' }}
                    >
                        <ChevronRight size={16} className="text-gray-500" />
                    </button>

                    <h1 className="text-[16px] font-bold" style={{ fontFamily: 'Cairo', fontWeight: 700, fontSize: '16px', lineHeight: '28px', color: '#47524F' }}>
                        الصفوف والشعب / <span style={{ color: '#000F0B' }}>{classData.name}</span>
                    </h1>
                </div>
            </div>
            {/* التبويبات */}
            <div className="px-4 mt-3">
                <div className="flex gap-2 bg-white rounded-[20px]" style={{ border: '0.5px solid #E0E0E0', padding: '18px' }}>
                    <Button
                        onClick={() => setActiveTab('sections')}
                        variant={activeTab === 'sections' ? 'primary' : 'ghost-outline'}
                        size="md"
                        minWidth={activeTab === 'sections' ? '108px' : '104px'}
                        className={`!h-[30px] !rounded-[13px] text-sm font-semibold !border !border-[#E0E0E0] ${activeTab !== 'sections' ? 'text-gray-500 hover:text-gray-700' : ''
                            }`}
                    >
                        الشعب
                    </Button>
                    <Button
                        onClick={() => setActiveTab('subjects')}
                        variant={activeTab === 'subjects' ? 'primary' : 'ghost-outline'}
                        size="md"
                        minWidth={activeTab === 'subjects' ? '108px' : '104px'}
                        className={`!h-[30px] !rounded-[13px] text-sm font-semibold !border !border-[#E0E0E0] ${activeTab !== 'subjects' ? 'text-gray-500 hover:text-gray-700' : ''
                            }`}
                    >
                        المواد
                    </Button>
                </div>
            </div>

            {/* ✅ قسم الإحصائيات */}
            <div className="px-4 py-3" dir="rtl">
                <div className="grid grid-cols-4 gap-4">
                    {statsCards.map((stat) => (
                        <div
                            key={stat.id}
                            className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] relative flex justify-between items-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                            style={{ fontFamily: 'Cairo, sans-serif' }}
                        >
                            <div className="flex flex-col items-start justify-center gap-1">
                                <span className="text-xl font-normal text-[#1F2937]">
                                    {stat.label}
                                </span>
                                <span className="text-2xl font-bold text-black">
                                    {stat.value}
                                </span>
                            </div>
                            {/* الأيقونة في جهة اليسار */}
                            <div className="absolute top-3 left-3 w-10 h-10 rounded-[17px]   flex items-center justify-center text-white " style={{ backgroundColor: stat.bgColor }}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>
            </div>



            <div className="h-2"></div>

            {/* ✅ استخدام المكونات المنفصلة */}
            <div className="px-4 pb-6 ">
                {activeTab === 'subjects' && (
                    <ClassSubjects
                        classId={classData.id}
                        subjects={classData.subjects || []}
                        onSubjectClick={handleSubjectClick}
                    />
                )}

                {activeTab === 'sections' && (
                    <ClassSections
                        classId={classData.id}
                        sections={classData.sections || []}
                        onSectionClick={handleSectionClick}
                    />
                )}
            </div>
        </div>
    );
};

export default ClassDetails;