'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Edit, Trash, ArrowRight, Users, X, Save, Plus } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Table, Column, TableAction } from '@/components/shared/table/table';
import { useStudents } from '@/hooks/useStudents';
import { StudentDeleteForm } from '@/components/student/student delete form/StudentDeleteForm';
import { StudentEditForm } from '@/components/student/student edit form/StudentEditForm';
import { StudentAddForm } from '@/components/class/class students/StudentAddForm';

interface ClassStudentsProps {
    classId: string;
    sectionId: number | null;
    sectionName: string;
    onBack: () => void;
}

export default function ClassStudents({
    classId,
    sectionId,
    sectionName,
    onBack,
}: ClassStudentsProps) {
    const router = useRouter();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const { students, loading: studentsLoading, refreshStudents } = useStudents({
        sectionId: sectionId || undefined,
    });

    // ✅ الاستماع للحدث
    useEffect(() => {
        console.log('🎯 [ClassStudents] Component mounted, sectionId:', sectionId);
        
        const handleOpenAddDialog = () => {
            console.log('🎯 [ClassStudents] Event received! Opening dialog...');
            setShowAddDialog(true);
        };
        
        window.addEventListener('openAddStudentDialog', handleOpenAddDialog);
        
        return () => {
            console.log('🎯 [ClassStudents] Component unmounted, removing listener');
            window.removeEventListener('openAddStudentDialog', handleOpenAddDialog);
        };
    }, [sectionId]);

    useEffect(() => {
        if (sectionId) {
            refreshStudents();
        }
    }, [sectionId]);

    const openFormDialog = () => {
        console.log('➕ [ClassStudents] Opening form dialog');
        setShowAddDialog(true);
    };

    const closeFormDialog = () => {
        console.log('🔴 [ClassStudents] Closing form dialog');
        setShowAddDialog(false);
    };

    const handleFormSuccess = () => {
        console.log('✅ [ClassStudents] Student added successfully!');
        setShowAddDialog(false);
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
        setShowDeleteDialog(false);
        setSelectedStudent(null);
        refreshStudents();
    };

    const openEditDialog = (student: any) => {
        setSelectedStudent(student);
        setShowEditDialog(true);
    };

    const closeEditDialog = () => {
        setShowEditDialog(false);
        setSelectedStudent(null);
    };

    const handleEditSuccess = () => {
        setShowEditDialog(false);
        setSelectedStudent(null);
        refreshStudents();
    };

    
    const columns: Column<any>[] = [
        {
            key: 'id',
            header: 'الرقم',
            align: 'center',
            width: 80,
        },
        {
            key: 'full_name',
            header: 'الطالب/ة',
            align: 'center',
            width: 150,
            render: (row) => (
                <div className="flex items-center gap-2 justify-center">
                    <span className="font-medium">{row.full_name}</span>
                </div>
            ),
        },
        {
            key: 'gender',
            header: 'الجنس',
            align: 'center',
            width: 80,
            render: (row) => (
                <span className={row.gender === 'ذكر' ? 'text-blue-600' : 'text-pink-500'}>
                    {row.gender}
                </span>
            ),
        },
        {
            key: 'parents',
            header: 'أولياء الأمر',
            align: 'center',
            width: 160,
            render: (row) => (
                <div className="flex flex-col items-center text-sm">
                    <span>أب: {row.father_name || '-'}</span>
                    <span className="text-sm text-gray-500">أم: {row.mother_name || '-'}</span>
                </div>
            )
        },
        { 
            key: 'birth_date', 
            header: 'تاريخ الميلاد', 
            align: 'center', 
            width: 110,
            render: (row) => {
                if (!row.birth_date) return '-';
                const date = new Date(row.birth_date);
                return date.toLocaleDateString('en-US');
            },
        },
        {
            key: 'residential_address',
            header: 'عنوان السكن',
            align: 'center',
            width: 150,
            render: (row) => row.residential_address || '-',
        },
        {
            key: 'comment',
            header: 'الملاحظات',
            align: 'center',
            width: 150,
            render: (row) => row.comment || '-',
        },
    ];

    const actions: TableAction<any>[] = [
        {
            label: 'عرض',
            icon: <Eye size={16} />,
            variant: 'primary',
            onClick: (row) => {
                router.push(`/students/${row.id}`);
            },
        },
        {
            label: 'تعديل',
            icon: <Edit size={16} />,
            variant: 'warning',
            onClick: (row) => {
                openEditDialog(row);
            },
        },
        {
            label: 'حذف',
            icon: <Trash size={16} />,
            variant: 'danger',
            onClick: (row) => {
                openDeleteDialog(row);
            },
        },
    ];

    
    if (!sectionId) {
        return (
            <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0]">
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <ArrowRight size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">اختر شعبة أولاً</h3>
                    <p className="text-gray-500 mb-6">قم باختيار شعبة من تبويب الشعب لعرض الطلاب</p>
                    <Button
                        variant="primary"
                        type="button"
                        onClick={onBack}
                        className="bg-[#007353] hover:bg-[#005f42] text-white rounded-[12px] px-6 py-2.5 flex items-center gap-2"
                    >
                        <ArrowRight size={18} />
                        العودة إلى الشعب
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            
            {showAddDialog && sectionId && (
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
                        <StudentAddForm
                            sectionId={sectionId}
                            onSuccess={handleFormSuccess}
                            onCancel={closeFormDialog}
                        />
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

            {/* ✅ نافذة تعديل الطالب */}
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

            
            {studentsLoading ? (
                <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0] flex-1 min-h-[448px]">
                    <div className="animate-pulse space-y-4">
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                        <div className="space-y-2">
                            <div className="h-8 bg-gray-200 rounded w-full"></div>
                            <div className="h-8 bg-gray-200 rounded w-full"></div>
                            <div className="h-8 bg-gray-200 rounded w-full"></div>
                            <div className="h-8 bg-gray-200 rounded w-full"></div>
                            <div className="h-8 bg-gray-200 rounded w-full"></div>
                        </div>
                    </div>
                </div>
            ) : students.length === 0 ? (
                
                <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0]">
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-20 h-20 rounded-full bg-[#E6F4F1] flex items-center justify-center mb-4">
                            <Users size={32} className="text-[#007353]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">لا طالب في هذه الشعبة</h3>
                        <p className="text-gray-500 mb-6">قم بإضافة طالب لهذه الشعبة الآن</p>
                        <Button
                            variant="primary"
                            type="button"
                            onClick={openFormDialog}
                            leftIcon={<Plus size={16} />}
                            size="md"
                            className="px-5 py-2.5 shadow-sm"
                        >
                            إضافة طالب
                        </Button>
                    </div>
                </div>
            ) : (
                
                <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0] flex-1 min-h-[448px]">
                    <Table
                        columns={columns}
                        data={students}
                        keyExtractor={(row) => row.id}
                        actions={actions}
                        headerBgColor="#F9FCFB"
                        rowBgColor="#FFFFFF"
                        borderColor="#E0E0E0"
                        radius={10}
                        hoverable={true}
                        className="w-full"
                        headerTextColor="#47524F"
                        headerFontWeight={600}
                    />
                </div>
            )}
        </div>
    );
}