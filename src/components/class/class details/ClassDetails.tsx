// src/components/class/class details/ClassDetails.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, BookOpen, User, GraduationCap, School, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Breadcrumb } from '@/components/shared/breadcrumb/breadcrumb';
import { Dialog } from '@/components/shared/dialog/dialog';
import { SectionForm } from '../class sections/SectionForm';
import { SubjectForm } from '../class subjects/SubjectForm';
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
        students?: any[];
        statistics?: {
            total_students: number;
            total_sections: number;
            total_subjects: number;
            total_teachers: number;
        };
    };
    onRefresh?: () => void;
}

type TabType = 'subjects' | 'sections';

export const ClassDetails = ({ classData: initialClassData, onRefresh }: ClassDetailsProps) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('sections');
    const [classData, setClassData] = useState<any>(initialClassData);
    const [showSectionFormDialog, setShowSectionFormDialog] = useState(false);
    const [showSubjectFormDialog, setShowSubjectFormDialog] = useState(false);
    const [editingSubject, setEditingSubject] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setClassData(initialClassData);
    }, [initialClassData]);

    // ✅ دالة لحساب الإحصائيات من البيانات الفعلية
    const calculateStatistics = (data: any) => {
        return {
            total_students: data.statistics?.total_students || 0,
            total_sections: data.sections?.length || 0,
            total_subjects: data.subjects?.length || 0,  // ✅ نحسب من الـ subjects الفعلية
            total_teachers: data.statistics?.total_teachers || 0,
        };
    };

    const getSectionsWithStudentsCount = () => {
        if (!classData.sections) return [];

        const studentsBySection: { [key: number]: number } = {};
        
        if (classData.students) {
            classData.students.forEach((student: any) => {
                const sectionId = student.section_id;
                if (sectionId) {
                    studentsBySection[sectionId] = (studentsBySection[sectionId] || 0) + 1;
                }
            });
        }

        return classData.sections.map((section: any) => ({
            ...section,
            total_students: studentsBySection[section.id] || 0,
            students_count: studentsBySection[section.id] || 0,
        }));
    };

    const handleSectionFormSuccess = (newSection?: any) => {
        setShowSectionFormDialog(false);
        
        if (newSection) {
            setClassData((prev: any) => ({
                ...prev,
                sections: [...(prev.sections || []), newSection],
            }));
        } else {
            if (onRefresh) {
                onRefresh();
            }
        }
        
        setRefreshKey(prev => prev + 1);
    };

    const handleSectionUpdate = (updatedSection: any) => {
        if (!updatedSection) return;
        
        setClassData((prev: any) => ({
            ...prev,
            sections: (prev.sections || []).map((section: any) => 
                section.id === updatedSection.id ? updatedSection : section
            )
        }));
        
        setRefreshKey(prev => prev + 1);
    };

    const handleSectionDelete = (sectionId: number) => {
        setClassData((prev: any) => ({
            ...prev,
            sections: (prev.sections || []).filter((section: any) => section.id !== sectionId),
        }));
        
        setRefreshKey(prev => prev + 1);
    };

    const handleSectionChanged = (type?: 'add' | 'edit' | 'delete', data?: any) => {
        if (type === 'add' && data) {
            handleSectionFormSuccess(data);
        } else if (type === 'edit' && data) {
            handleSectionUpdate(data);
        } else if (type === 'delete' && data) {
            handleSectionDelete(data);
        } else {
            if (onRefresh) {
                onRefresh();
            }
            setRefreshKey(prev => prev + 1);
        }
    };

    const openAddSectionDialog = () => {
        setShowSectionFormDialog(true);
    };

    const closeAddSectionDialog = () => {
        setShowSectionFormDialog(false);
    };

    const handleSubjectFormSuccess = (newSubject?: any) => {
        setShowSubjectFormDialog(false);
        setEditingSubject(null);
        
        if (newSubject) {
            const isEdit = classData.subjects?.some((s: any) => s.id === newSubject.id);
            
            if (isEdit) {
                setClassData((prev: any) => ({
                    ...prev,
                    subjects: (prev.subjects || []).map((subject: any) => 
                        subject.id === newSubject.id ? newSubject : subject
                    )
                }));
            } else {
                setClassData((prev: any) => ({
                    ...prev,
                    subjects: [...(prev.subjects || []), newSubject],
                }));
            }
        } else {
            if (onRefresh) {
                onRefresh();
            }
        }
        
        setRefreshKey(prev => prev + 1);
    };

    const handleSubjectUpdate = (updatedSubject: any) => {
        if (!updatedSubject) return;
        
        setClassData((prev: any) => ({
            ...prev,
            subjects: (prev.subjects || []).map((subject: any) => 
                subject.id === updatedSubject.id ? updatedSubject : subject
            )
        }));
        
        setRefreshKey(prev => prev + 1);
    };

    const handleSubjectDelete = (subjectId: number) => {
        setClassData((prev: any) => ({
            ...prev,
            subjects: (prev.subjects || []).filter((subject: any) => subject.id !== subjectId),
        }));
        
        setRefreshKey(prev => prev + 1);
    };

    const handleSubjectChanged = (type?: 'add' | 'edit' | 'delete', data?: any) => {
        if (type === 'add' && data) {
            handleSubjectFormSuccess(data);
        } else if (type === 'edit' && data) {
            setEditingSubject(data);
            setShowSubjectFormDialog(true);
        } else if (type === 'delete' && data) {
            handleSubjectDelete(data);
        } else {
            if (onRefresh) {
                onRefresh();
            }
            setRefreshKey(prev => prev + 1);
        }
    };

    const openAddSubjectDialog = () => {
        setEditingSubject(null);
        setShowSubjectFormDialog(true);
    };

    const closeAddSubjectDialog = () => {
        setShowSubjectFormDialog(false);
        setEditingSubject(null);
    };

    const isSectionsTab = activeTab === 'sections';
    const sectionsWithStudents = getSectionsWithStudentsCount();
    const hasSections = sectionsWithStudents.length > 0;
    const hasSubjects = (classData.subjects || []).length > 0;

    const breadcrumbItems = [
        { label: 'الصفوف والشعب', href: '/classes' },
        { label: classData.name }
    ];

    const handleSectionClick = (sectionId: number) => {
        router.push(`/classes/${classData.id}/sections/${sectionId}`);
    };

    const handleSubjectClick = (subjectId: number) => {
        console.log('📖 Subject clicked:', subjectId);
    };

    // ✅ استخدام دالة حساب الإحصائيات
    const statistics = calculateStatistics(classData);

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

    if (!isMounted) {
        return (
            <div className="w-full" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
                <div className="container mx-auto px-4 py-6">
                    <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-lg shadow-sm p-4 h-24 animate-pulse">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                        <div className="h-8 bg-gray-200 rounded w-12"></div>
                                    </div>
                                    <div className="h-6 w-6 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 h-64 animate-pulse">
                        <div className="flex space-x-8 space-x-reverse mb-4">
                            <div className="h-8 bg-gray-200 rounded w-20"></div>
                            <div className="h-8 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-12 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold text-red-500">⚠️ لا توجد بيانات</h2>
            </div>
        );
    }

    return (
        <div className="w-full" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
            {/* Breadcrumb مع زر الإضافة */}
            <div className="relative">
                <Breadcrumb
                    items={breadcrumbItems}
                    className="mb-0 [&_button]:!w-6 [&_button]:!h-6 [&_button]:!p-0 [&_button]:!rounded-[6px] [&_button]:!flex [&_button]:!items-center [&_button]:!justify-center [&_button]:!border [&_button]:!border-[#ACACAC] [&_button]:!bg-white [&_button]:!hover:bg-gray-50 [&_button_svg]:!w-3 [&_button_svg]:!h-3"
                    showBackButton={true}
                    onBack={() => router.back()}
                />
                {/* زر الإضافة حسب التبويب النشط */}
                {(isSectionsTab && hasSections) || (activeTab === 'subjects' && hasSubjects) ? (
                    <div className="absolute left-6 top-1/2 -translate-y-1/2">
                        {isSectionsTab && hasSections && (
                            <Button
                                variant="primary"
                                onClick={openAddSectionDialog}
                                leftIcon={<Plus size={16} />}
                                size="md"
                                className="px-5 py-2.5 shadow-sm"
                            >
                                إضافة شعبة
                            </Button>
                        )}
                        {activeTab === 'subjects' && hasSubjects && (
                            <Button
                                variant="primary"
                                onClick={openAddSubjectDialog}
                                leftIcon={<Plus size={16} />}
                                size="md"
                                className="px-5 py-2.5 shadow-sm"
                            >
                                إضافة مادة
                            </Button>
                        )}
                    </div>
                ) : null}
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

            {/* قسم الإحصائيات */}
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
                            <div className="absolute top-3 left-3 w-10 h-10 rounded-[17px] flex items-center justify-center text-white" style={{ backgroundColor: stat.bgColor }}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-2"></div>

            {/* استخدام المكونات المنفصلة */}
            <div className="px-4 pb-6">
                {activeTab === 'subjects' && (
                    <ClassSubjects
                        key={refreshKey}
                        classId={classData.id}
                        subjects={classData.subjects || []}
                        onSubjectClick={handleSubjectClick}
                        onSubjectChanged={handleSubjectChanged}
                        onAddSubject={openAddSubjectDialog}
                    />
                )}

                {activeTab === 'sections' && (
                    <ClassSections
                        key={refreshKey}
                        classId={classData.id}
                        className={classData.name}
                        sections={sectionsWithStudents}
                        onSectionClick={handleSectionClick}
                        onSectionChanged={handleSectionChanged}
                        onAddSection={openAddSectionDialog}
                    />
                )}
            </div>

            {/* ديالوج إضافة شعبة */}
            <Dialog
                isOpen={showSectionFormDialog}
                onClose={closeAddSectionDialog}
                maxWidth="lg"
                showCancel={false}
                showConfirm={false}
                hideCloseButton={false}
            >
                <SectionForm
                    mode="create"
                    classId={parseInt(classData.id)}
                    initialData={null}
                    onSuccess={handleSectionFormSuccess}
                    onCancel={closeAddSectionDialog}
                />
            </Dialog>

            {/* ديالوج إضافة/تعديل مادة */}
            <Dialog
                isOpen={showSubjectFormDialog}
                onClose={() => {
                    closeAddSubjectDialog();
                    setEditingSubject(null);
                }}
                maxWidth="lg"
                showCancel={false}
                showConfirm={false}
                hideCloseButton={false}
            >
                <SubjectForm
                    mode={editingSubject ? 'edit' : 'create'}
                    classId={parseInt(classData.id)}
                    initialData={editingSubject}
                    onSuccess={handleSubjectFormSuccess}
                    onCancel={() => {
                        closeAddSubjectDialog();
                        setEditingSubject(null);
                    }}
                />
            </Dialog>
        </div>
    );
};

export default ClassDetails;