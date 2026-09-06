// components/student/student list/StudentList.tsx

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Edit, Trash, Search, Filter } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Table, Column, TableAction } from '@/components/shared/table/table';
import { Breadcrumb } from '@/components/shared/breadcrumb/breadcrumb';
import { useStudents } from '@/hooks/useStudents';
import { useClasses } from '@/hooks/useClasses';
import { useSections } from '@/hooks/useSections';
import { deleteStudent } from '@/services/api/students/deleteStudent';
import { StudentForm } from '@/components/student/student form/StudentForm';
import { StudentEditForm } from '@/components/student/student edit form/StudentEditForm';
import { StudentDeleteForm } from '@/components/student/student delete form/StudentDeleteForm';

interface StudentListProps {
    showBreadcrumb?: boolean;
    title?: string;
    breadcrumbItems?: Array<{ label: string; href?: string }>;
    showBackButton?: boolean;
    onBack?: () => void;
    onAddClick?: () => void;
}

export const StudentList = ({ 
    showBreadcrumb = true,
    title = 'الطلاب',
    breadcrumbItems,
    showBackButton = true,
    onBack,
    onAddClick,
}: StudentListProps) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    
    const { students, loading: studentsLoading, refreshStudents, setStudents } = useStudents({});
    const { classes, loading: classesLoading } = useClasses();
    const { sections, loading: sectionsLoading } = useSections();

    useEffect(() => {
        console.log('📚 Classes:', classes);
        console.log('📚 Sections:', sections);
    }, [classes, sections]);

    const filteredSections = useMemo(() => {
        if (!selectedClass) return [];
        const selectedClassObj = classes.find(c => c.name === selectedClass);
        if (!selectedClassObj) return [];
        return sections.filter(section => section.class_id === selectedClassObj.id);
    }, [selectedClass, classes, sections]);

    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            let match = true;
            if (selectedClass && student.class_name !== selectedClass) match = false;
            if (selectedSection && student.section_name !== selectedSection) match = false;
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const fullName = (student.full_name || '').toLowerCase();
                if (!fullName.includes(term)) match = false;
            }
            return match;
        });
    }, [students, selectedClass, selectedSection, searchTerm]);

    const getStudentDetails = async (studentId: number) => {
        try {
            const token = localStorage.getItem('token') || '';
            const response = await fetch(`http://localhost:8000/api/dashboard/students/${studentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            const result = await response.json();
            if (result.success && result.data) {
                return result.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching student details:', error);
            return null;
        }
    };

    const openEditDialog = async (student: any) => {
        console.log('📝 [StudentList] Opening edit for student:', student);
        
        const fullStudentData = await getStudentDetails(student.id);
        if (fullStudentData) {
            console.log('📝 [StudentList] Full student data from API:', fullStudentData);
            setSelectedStudent(fullStudentData);
        } else {
            setSelectedStudent(student);
        }
        setShowEditDialog(true);
    };

    const closeEditDialog = () => {
        setShowEditDialog(false);
        setSelectedStudent(null);
    };

    const handleEditSuccess = () => {
        console.log('✅ [StudentList] Student updated successfully!');
        setShowEditDialog(false);
        setSelectedStudent(null);
        refreshStudents();
    };

    const openDeleteDialog = (student: any) => {
        setSelectedStudent(student);
        setShowDeleteDialog(true);
    };

    const closeDeleteDialog = () => {
        setShowDeleteDialog(false);
        setSelectedStudent(null);
    };

    const handleDeleteSuccess = () => {
        console.log('✅ [StudentList] Student deleted successfully!');
        setShowDeleteDialog(false);
        setSelectedStudent(null);
        refreshStudents();
    };

    const columns: Column<any>[] = [
        { key: 'id', header: 'الرقم', align: 'center', width: 60 },
        { key: 'full_name', header: 'الطالب', align: 'center', width: 130 },
        { key: 'gender', header: 'الجنس', align: 'center', width: 70 },
        {
            key: 'class_section',
            header: 'الصف / الشعبة',
            align: 'center',
            width: 130,
            render: (row) => (
                <div className="flex flex-col items-center">
                    <span className="text-sm font-medium">صف: {row.class_name || '-'}</span>
                    <span className="text-xs text-gray-500">شعبة: {row.section_name || '-'}</span>
                </div>
            )
        },
        {
            key: 'parents',
            header: 'أولياء الأمر',
            align: 'center',
            width: 160,
            render: (row) => (
                <div className="flex flex-col items-center text-sm">
                    <span>أب: {row.father_name || '-'}</span>
                    <span className="text-xs text-gray-500">أم: {row.mother_name || '-'}</span>
                </div>
            )
        },
        { key: 'birth_date', header: 'تاريخ الميلاد', align: 'center', width: 110 },
        { key: 'residential_address', header: 'عنوان السكن', align: 'center', width: 150 },
        {
            key: 'comment',
            header: 'الملاحظات',
            align: 'center',
            width: 200,
            render: (row) => row.comment || '-',
        },
    ];

    const actions: TableAction<any>[] = [
        {
            label: 'عرض',
            icon: <Eye size={16} />,
            variant: 'primary',
            onClick: (row) => router.push(`/students/${row.id}`),
        },
        {
            label: 'تعديل',
            icon: <Edit size={16} />,
            variant: 'warning',
            onClick: (row) => openEditDialog(row),
        },
        {
            label: 'حذف',
            icon: <Trash size={16} />,
            variant: 'danger',
            onClick: (row) => openDeleteDialog(row),
        },
    ];

    const defaultBreadcrumbItems = [{ label: title }];
    const items = breadcrumbItems || defaultBreadcrumbItems;

    const isLoading = studentsLoading || classesLoading || sectionsLoading;

    const openFormDialog = () => {
        console.log('➕ [StudentList] Opening form dialog');
        setShowFormDialog(true);
    };

    const closeFormDialog = () => {
        console.log('🔴 [StudentList] Closing form dialog');
        setShowFormDialog(false);
    };

    const handleFormSuccess = () => {
        console.log('✅ [StudentList] Student added successfully!');
        setShowFormDialog(false);
        refreshStudents();
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            {showFormDialog && (
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
                    }}
                    onClick={closeFormDialog}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '30px',
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: 'auto',
                            overflow: 'visible',
                            position: 'relative',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeFormDialog}
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

                        <h2 style={{ 
                            fontSize: '22px', 
                            fontWeight: 'bold',
                            marginBottom: '24px',
                            color: '#1a1a1a',
                            textAlign: 'right',
                        }}>
                            إضافة طالب
                        </h2>

                        <div style={{
                            overflow: 'visible',
                        }}>
                            <StudentForm
                                mode="create"
                                onSuccess={handleFormSuccess}
                                onCancel={closeFormDialog}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showEditDialog && selectedStudent && (
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
                    }}
                    onClick={closeEditDialog}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '30px',
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: 'auto',
                            overflow: 'visible',
                            position: 'relative',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeEditDialog}
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

                        <h2 style={{ 
                            fontSize: '22px', 
                            fontWeight: 'bold',
                            marginBottom: '24px',
                            color: '#1a1a1a',
                            textAlign: 'right',
                        }}>
                            تعديل طالب
                        </h2>

                        <div style={{
                            overflow: 'visible',
                        }}>
                            <StudentEditForm
                                student={selectedStudent}
                                onSuccess={handleEditSuccess}
                                onCancel={closeEditDialog}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showDeleteDialog && selectedStudent && (
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
                    }}
                    onClick={closeDeleteDialog}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '30px',
                            maxWidth: '512px',
                            width: '100%',
                            maxHeight: 'auto',
                            overflow: 'visible',
                            position: 'relative',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeDeleteDialog}
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

                        <StudentDeleteForm
                            student={{
                                id: selectedStudent.id,
                                full_name: selectedStudent.full_name,
                            }}
                            onSuccess={handleDeleteSuccess}
                            onCancel={closeDeleteDialog}
                        />
                    </div>
                </div>
            )}

            {showBreadcrumb && (
                <div className="relative">
                    <Breadcrumb
                        items={items}
                        className="mb-0"
                        showBackButton={showBackButton}
                        onBack={onBack}
                    />
                    <div className="absolute left-6 top-1/2 -translate-y-1/2">
                        <Button
                            variant="primary"
                            onClick={openFormDialog}
                            leftIcon={<Plus size={16} />}
                            size="md"
                            className="px-5 py-2.5 shadow-sm"
                        >
                            إضافة طالب
                        </Button>
                    </div>
                </div>
            )}

            <div className="px-6 py-6">
                <div className="flex items-center gap-3 mb-6 flex-wrap bg-white p-4 rounded-xl shadow-sm">
                    <div className="relative w-56">
                        <input
                            type="text"
                            placeholder="بحث  ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pr-9 pl-3 py-1.5 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                        />
                        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>

                    <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <Filter size={20} />
                    </button>

                    <div className="w-px h-6 bg-gray-300"></div>

                    <div className="relative">
                        <select
                            value={selectedClass}
                            onChange={(e) => {
                                setSelectedClass(e.target.value);
                                setSelectedSection('');
                            }}
                            className="px-3 py-1.5 border border-gray-300 rounded-[12px] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer hover:border-gray-400 transition-colors min-w-[120px]"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'left 8px center',
                                backgroundSize: '14px',
                            }}
                        >
                            <option value=""> الصف</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className="px-3 py-1.5 border border-gray-300 rounded-[12px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:border-gray-400 transition-colors min-w-[100px]"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'left 8px center',
                                backgroundSize: '14px',
                            }}
                            disabled={!selectedClass || filteredSections.length === 0}
                        >
                            <option value="">الشعبة</option>
                            {filteredSections.length > 0 ? (
                                filteredSections.map((s) => (
                                    <option key={s.id} value={s.name}>
                                        {s.name}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>
                                    {sectionsLoading ? 'جاري التحميل...' : 'لا توجد شعب لهذا الصف'}
                                </option>
                            )}
                        </select>
                    </div>
                </div>

                <div className="w-full" style={{ minHeight: '500px' }}>
                    <Table
                        columns={columns}
                        data={filteredStudents}
                        keyExtractor={(row) => row.id}
                        actions={actions}
                        isLoading={isLoading}
                        loadingRows={5}
                        emptyTitle="لا يوجد طلاب"
                        emptyDescription={selectedClass ? 'لا يوجد طلاب في هذا الصف' : 'قم بإضافة طالب جديد'}
                        emptyButtonText="إضافة طالب"
                        onEmptyButtonClick={openFormDialog}
                        headerBgColor="#F9FCFB"
                        rowBgColor="#FFFFFF"
                        borderColor="#E0E0E0"
                        radius={10}
                        hoverable={true}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
};