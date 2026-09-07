'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Edit, Trash, BookOpen, School, Users, X } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Table, Column, TableAction } from '@/components/shared/table/table';
import { Breadcrumb } from '@/components/shared/breadcrumb/breadcrumb';
import { useClasses } from '@/hooks/useClasses';
import { ClassForm } from '../class form/ClassForm';
import { ClassEditForm } from '../class edit form/ClassEditForm';
import { ClassDeleteForm } from '../class delete form/ClassDeleteForm';
import { ClassDeleteDialog } from '../class delete form/ClassDeleteDialog';

interface ClassesListProps {
    showBreadcrumb?: boolean;
    title?: string;
    breadcrumbItems?: Array<{ label: string; href?: string }>;
    showBackButton?: boolean;
    onBack?: () => void;
}

export const ClassesList = ({
    showBreadcrumb = true,
    title = 'الصفوف والشعب',
    breadcrumbItems,
    showBackButton = true,
    onBack,
}: ClassesListProps) => {
    const router = useRouter();
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showStudentsDialog, setShowStudentsDialog] = useState(false);
    const [selectedClass, setSelectedClass] = useState<any>(null);

    const { classes, loading, refreshClasses, deleteClass, setClasses } = useClasses({});

    const openEditDialog = (cls: any) => {
        setSelectedClass(cls);
        setShowEditDialog(true);
    };

    const closeEditDialog = () => {
        setShowEditDialog(false);
        setSelectedClass(null);
    };

    const handleEditSuccess = () => {
        setShowEditDialog(false);
        setSelectedClass(null);
        refreshClasses();
    };

    const openDeleteDialog = (cls: any) => {
        setSelectedClass(cls);
        
        const hasStudents = cls.statistics?.total_students > 0 || (cls.students && cls.students.length > 0);
        
        if (hasStudents) {
            setShowStudentsDialog(true);
        } else {
            setShowDeleteDialog(true);
        }
    };

    const closeDeleteDialog = () => {
        setShowDeleteDialog(false);
        setSelectedClass(null);
    };

    const closeStudentsDialog = () => {
        setShowStudentsDialog(false);
        setSelectedClass(null);
    };

    const handleDeleteSuccess = () => {
        console.log('✅ [ClassesList] Class deleted successfully!');
        setShowDeleteDialog(false);
        setSelectedClass(null);
        refreshClasses();
    };

    const columns: Column<any>[] = [
        {
            key: 'name',
            header: 'الصف',
            align: 'center',
            width: 150,
            render: (row) => (
                <div className="flex items-center gap-2 justify-center">
                    <BookOpen size={16} className="text-[#007353]" />
                    <span className="font-medium">{row.name}</span>
                </div>
            ),
        },
        {
            key: 'sections',
            header: 'الشعب',
            align: 'center',
            width: 250,
            render: (row) => (
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {row.sections && row.sections.length > 0 ? (
                        row.sections.map((section: any) => (
                            <span
                                key={section.id}
                                className="px-3 py-1 border border-[#007353] rounded-[8px] text-xs text-[#007353] font-medium bg-white"
                            >
                                {section.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-gray-400">-</span>
                    )}
                </div>
            ),
        },
        {
            key: 'teachers_count',
            header: 'عدد الأساتذة',
            align: 'center',
            width: 130,
            render: (row) => (
                <div className="flex items-center justify-center gap-2">
                    <Users size={16} className="text-green-500" />
                    <span className="font-medium">{row.teachers_count || 0}</span>
                </div>
            ),
        },
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
            onClick: (row) => router.push(`/classes/${row.id}`),
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

    const openFormDialog = () => {
        setShowFormDialog(true);
    };

    const closeFormDialog = () => {
        setShowFormDialog(false);
    };

    const handleFormSuccess = () => {
        setShowFormDialog(false);
        refreshClasses();
    };

    const isEmpty = !loading && classes.length === 0;

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
                        <div className="relative">
                            <button
                                type="button"
                                onClick={closeFormDialog}
                                className="absolute top-0 left-0 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 cursor-pointer"
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                            <h2 className="text-xl font-bold text-right mb-4">
                                إضافة صف
                            </h2>
                        </div>

                        <ClassForm
                            onSuccess={handleFormSuccess}
                            onCancel={closeFormDialog}
                        />
                    </div>
                </div>
            )}

            {showEditDialog && selectedClass && (
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
                        <div className="relative">
                            <button
                                type="button"
                                onClick={closeEditDialog}
                                className="absolute top-0 left-0 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 cursor-pointer"
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                            <h2 className="text-xl font-bold text-right mb-4">
                                تعديل صف
                            </h2>
                        </div>

                        <ClassEditForm
                            classData={selectedClass}
                            onSuccess={handleEditSuccess}
                            onCancel={closeEditDialog}
                        />
                    </div>
                </div>
            )}

            {showDeleteDialog && selectedClass && (
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
                        <div className="relative">
                            <button
                                type="button"
                                onClick={closeDeleteDialog}
                                className="absolute top-0 left-0 p-2 hover:bg-red-50 active:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 rounded-full transition-colors z-10 cursor-pointer"
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                            
                        </div>

                        <ClassDeleteForm
                            classData={{
                                id: selectedClass.id,
                                name: selectedClass.name,
                            }}
                            onSuccess={handleDeleteSuccess}
                            onCancel={closeDeleteDialog}
                        />
                    </div>
                </div>
            )}

            
            <ClassDeleteDialog
                isOpen={showStudentsDialog}
                classData={{
                    id: selectedClass?.id,
                    name: selectedClass?.name,
                    statistics: selectedClass?.statistics,
                    students: selectedClass?.students,
                }}
                onClose={closeStudentsDialog}
            />

            {showBreadcrumb && (
                <div className="relative">
                    <Breadcrumb
                        items={items}
                        className="mb-0"
                        showBackButton={showBackButton}
                        onBack={onBack}
                        actionButton={
                            !isEmpty && (
                                <Button
                                    variant="primary"
                                    onClick={openFormDialog}
                                    leftIcon={<Plus size={16} />}
                                    size="md"
                                    className="px-5 py-2.5 shadow-sm"
                                >
                                    إضافة صف
                                </Button>
                            )
                        }
                    />
                </div>
            )}

            <div className="px-6 py-6">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-12 min-h-[500px]">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <School size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            لا صفوف مضافين بعد
                        </h3>
                        <p className="text-gray-500 text-center mb-6">
                            قم بإضافة الصفوف وتابعهم الآن من هنا
                        </p>
                        <Button
                            variant="primary"
                            onClick={openFormDialog}
                            leftIcon={<Plus size={16} />}
                            size="md"
                            className="px-5 py-2.5 shadow-sm"
                        >
                            إضافة صف
                        </Button>
                    </div>
                ) : (
                    <div className="w-full" style={{ minHeight: '500px' }}>
                        <Table
                            columns={columns}
                            data={classes}
                            keyExtractor={(row) => row.id}
                            actions={actions}
                            isLoading={loading}
                            loadingRows={5}
                            emptyTitle="لا توجد صفوف"
                            emptyDescription="قم بإضافة صف جديد"
                            emptyButtonText="إضافة صف"
                            onEmptyButtonClick={openFormDialog}
                            headerBgColor="#F9FCFB"
                            rowBgColor="#FFFFFF"
                            borderColor="#E0E0E0"
                            radius={10}
                            hoverable={true}
                            className="w-full"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};