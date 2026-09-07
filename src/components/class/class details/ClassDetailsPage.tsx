'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Users, BookOpen, Layers, User, ArrowRight, X, ChevronRight, School, GraduationCap } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Breadcrumb } from '@/components/shared/breadcrumb/breadcrumb';
import { useClasses } from '@/hooks/useClasses';
import { useSections } from '@/hooks/useSections';
import ClassSections from '../class sections/ClassSections';
import ClassStudents from '../class students/ClassStudents';

interface ClassDetailsPageProps {
    classId?: string;
}

export const ClassDetailsPage = ({ classId: propClassId }: ClassDetailsPageProps) => {
    const router = useRouter();
    const params = useParams();
    const classId = propClassId || params?.id as string;
    
    const [activeTab, setActiveTab] = useState<'sections' | 'students'>('sections');
    const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
    const [selectedSectionName, setSelectedSectionName] = useState<string>('');

    const { classes, loading, refreshClasses } = useClasses({
        singleClassMode: true,
        classId: classId ? parseInt(classId) : undefined,
    });

    const { sections, loading: sectionsLoading, refreshSections } = useSections({
        classId: classId ? parseInt(classId) : undefined,
    });

    const classData = classes[0];

    useEffect(() => {
        if (activeTab === 'students' && !selectedSectionId && sections.length > 0) {
            setSelectedSectionId(sections[0].id);
            setSelectedSectionName(sections[0].name);
        }
    }, [activeTab, sections, selectedSectionId]);

    const handleSectionClick = (sectionId: number) => {
        const section = sections.find(s => s.id === sectionId);
        setSelectedSectionId(sectionId);
        setSelectedSectionName(section?.name || '');
        setActiveTab('students');
    };

    // إحصائيات الصف
    const statistics = classData?.statistics || {
        total_students: 0,
        total_sections: 0,
        total_subjects: 0,
        total_teachers: 0,
    };

    const statsCards = [
        {
            id: 'sections',
            label: 'عدد الشعب',
            value: statistics.total_sections,
            icon: <School size={25} className="text-white" />,
            bgColor: '#2563EB',
        },
        {
            id: 'subjects',
            label: 'عدد المواد الكلي',
            value: statistics.total_subjects,
            icon: <BookOpen size={25} className="text-white" />,
            bgColor: '#FA8022',
        },
        {
            id: 'students',
            label: 'عدد الطلاب الكلي',
            value: statistics.total_students,
            icon: <GraduationCap size={25} className="text-white" />,
            bgColor: '#7C3AED',
        },
        {
            id: 'teachers',
            label: 'عدد المدرسين المكلفين',
            value: statistics.total_teachers,
            icon: <Users size={25} className="text-white" />,
            bgColor: '#14B8A6',
        },
    ];

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007353]"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-[#E0E0E0] px-6 py-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center rounded-[8px] border border-[#ACACAC] bg-white transition-colors hover:bg-gray-50 w-7 h-7"
                    >
                        <ChevronRight size={16} className="text-gray-500" />
                    </button>
                    <h1 className="text-base font-bold text-[#47524F]">
                        الصفوف والشعب / <span className="text-[#000F0B]">{classData?.name || '...'}</span>
                    </h1>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="px-6 py-4">
                <div className="grid grid-cols-4 gap-4">
                    {statsCards.map((stat) => (
                        <div
                            key={stat.id}
                            className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] relative flex justify-between items-center shadow-sm"
                        >
                            <div className="flex flex-col items-start justify-center gap-1">
                                <span className="text-sm font-normal text-[#1F2937]">
                                    {stat.label}
                                </span>
                                <span className="text-2xl font-bold text-black">
                                    {stat.value}
                                </span>
                            </div>
                            <div className="w-10 h-10 rounded-[17px] flex items-center justify-center" style={{ backgroundColor: stat.bgColor }}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs - فقط شعب وطلاب */}
            <div className="px-6">
                <div className="flex gap-2 bg-white rounded-[20px] border border-[#E0E0E0] p-3 w-fit">
                    <button
                        onClick={() => setActiveTab('sections')}
                        className={`
                            px-4 py-1.5 rounded-[13px] text-sm font-semibold transition-all
                            ${activeTab === 'sections' 
                                ? 'bg-[#007353] text-white' 
                                : 'text-gray-500 hover:text-gray-700 border border-[#E0E0E0]'
                            }
                        `}
                    >
                        الشعب
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('students');
                            if (!selectedSectionId && sections.length > 0) {
                                setSelectedSectionId(sections[0].id);
                                setSelectedSectionName(sections[0].name);
                            }
                        }}
                        className={`
                            px-4 py-1.5 rounded-[13px] text-sm font-semibold transition-all
                            ${activeTab === 'students' 
                                ? 'bg-[#007353] text-white' 
                                : 'text-gray-500 hover:text-gray-700 border border-[#E0E0E0]'
                            }
                        `}
                    >
                        الطلاب
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
                {activeTab === 'sections' && (
                    <ClassSections
                        classId={classId}
                        sections={sections}
                        onSectionClick={handleSectionClick}
                    />
                )}

                {activeTab === 'students' && (
                    <ClassStudents
                        classId={classId}
                        sectionId={selectedSectionId}
                        sectionName={selectedSectionName}
                        onBack={() => setActiveTab('sections')}
                    />
                )}
            </div>
        </div>
    );
};