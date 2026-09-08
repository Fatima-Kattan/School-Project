// src/components/class/class sections/ClassSections.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, SquarePen, Trash, X } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Table, Column, TableAction } from '@/components/shared/table/table';
import { SectionForm } from './SectionForm';
import { SectionDeleteForm } from './SectionDeleteForm';
import { SectionDeleteDialog } from './SectionDeleteDialog';
import { Dialog } from '@/components/shared/dialog/dialog';

interface ClassSectionsProps {
    classId: string;
    className?: string;
    sections: Array<{
        id: number;
        name: string;
        comment: string | null;
        students_count?: number;        // ✅ تصحيح: students_count بدلاً من teachers_count
        total_students?: number;
        statistics?: { students_count: number };
        students?: Array<any>;
    }>;
    onSectionClick?: (sectionId: number) => void;
    onSectionChanged?: (type?: 'add' | 'edit' | 'delete', data?: any) => void;
    onAddSection?: () => void;
}

export default function ClassSections({
    classId,
    className,
    sections,
    onSectionClick,
    onSectionChanged,
    onAddSection,
}: ClassSectionsProps) {
    const router = useRouter();

    // ✅ حالات الديالوجات
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showStudentsDialog, setShowStudentsDialog] = useState(false);
    const [selectedSection, setSelectedSection] = useState<any>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    // ✅ فتح نافذة إضافة شعبة
    const openAddDialog = () => {
        setMode('create');
        setSelectedSection(null);
        setShowFormDialog(true);
    };

    // ✅ فتح نافذة تعديل شعبة
    const openEditDialog = (section: any) => {
        setMode('edit');
        setSelectedSection(section);
        setShowFormDialog(true);
    };

    // ✅ فتح نافذة حذف شعبة (مع التحقق من وجود طلاب)
    const openDeleteDialog = (section: any) => {
        setSelectedSection(section);
        
        const hasStudents = 
            (section?.total_students || 0) > 0 ||
            (section?.statistics?.students_count || 0) > 0 ||
            (section?.students_count || 0) > 0 ||
            (section?.students && section.students.length > 0);
        
        if (hasStudents) {
            setShowStudentsDialog(true); // ← تحذير بوجود طلاب
        } else {
            setShowDeleteDialog(true); // ← فورم الحذف
        }
    };

    // ✅ إغلاق الديالوجات
    const closeFormDialog = () => {
        setShowFormDialog(false);
        setSelectedSection(null);
    };

    const closeDeleteDialog = () => {
        setShowDeleteDialog(false);
        setSelectedSection(null);
    };

    const closeStudentsDialog = () => {
        setShowStudentsDialog(false);
        setSelectedSection(null);
    };

    // ✅ معالج نجاح النموذج (إضافة/تعديل)
    const handleFormSuccess = (newSection?: any) => {
        const wasEdit = mode === 'edit';
        const wasAdd = mode === 'create';
        
        if (wasEdit && newSection) {
            if (onSectionChanged) {
                onSectionChanged('edit', newSection);
            }
        } else if (wasAdd && newSection) {
            if (onSectionChanged) {
                onSectionChanged('add', newSection);
            }
        }
        
        setShowFormDialog(false);
        setSelectedSection(null);
    };

    // ✅ معالج نجاح الحذف
    const handleDeleteSuccess = () => {
        const deletedId = selectedSection?.id;
        console.log('✅ [ClassSections] Section deleted successfully! ID:', deletedId);
        
        setShowDeleteDialog(false);
        setSelectedSection(null);
        
        if (onSectionChanged && deletedId) {
            onSectionChanged('delete', deletedId);
        }
    };

    // ✅ دالة حساب عدد الطلاب
    const getStudentsCount = (section: any): number => {
        if (!section) return 0;
        return section.total_students || 
               section.statistics?.students_count || 
               section.students_count || 
               section.students?.length || 
               0;
    };

    // ✅ دالة إضافة شعبة (للزر)
    const handleAddSection = () => {
        if (onAddSection) {
            onAddSection();
        } else {
            openAddDialog();
        }
    };

    // ✅ إذا لم توجد شعب → عرض رسالة "لا شعب مضافين بعد"
    if (!sections || sections.length === 0) {
        return (
            <>
                <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0]">
                    <div className="flex flex-col items-center justify-center py-12">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            لا شعب مضافين بعد
                        </h3>
                        <p className="text-gray-500 text-center mb-6">
                            قم بإضافة شعب وتابعهم الآن من هنا
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleAddSection}
                            leftIcon={<Plus size={16} />}
                            size="md"
                            className="px-5 py-2.5 shadow-sm"
                        >
                            إضافة شعبة
                        </Button>
                    </div>
                </div>

                <Dialog
                    isOpen={showFormDialog}
                    onClose={closeFormDialog}
                    title="إضافة شعبة"
                    maxWidth="lg"
                    showCancel={false}
                    showConfirm={false}
                >
                    <SectionForm
                        mode="create"
                        classId={parseInt(classId)}
                        initialData={null}
                        onSuccess={handleFormSuccess}
                        onCancel={closeFormDialog}
                    />
                </Dialog>
            </>
        );
    }

    // ✅ تعريف الأعمدة
    const columns: Column<any>[] = [
        {
            key: 'name',
            header: 'الشعبة',
            align: 'center',
            width: 150,
            render: (row) => (
                <span className="font-medium">{row.name}</span>
            ),
        },
        {
            key: 'students_count',
            header: 'عدد الطلاب',  // ✅ تصحيح: students_count
            align: 'center',
            width: 130,
            render: (row) => {
                const count = getStudentsCount(row);
                return <span className="font-medium">{count}</span>;
            },
        },
        {
            key: 'comment',
            header: 'الملاحظات',
            align: 'center',
            width: 'auto',
            minWidth: 300,
            render: (row) => row.comment || '-',
        },
    ];

    // ✅ تعريف الأزرار (Actions)
    const actions: TableAction<any>[] = [
        {
            label: 'عرض',
            icon: <Eye size={16} />,
            variant: 'primary',
            onClick: (row) => router.push(`/sections/${row.id}`),
        },
        {
            label: 'تعديل',
            icon: <SquarePen size={16} />,
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

    return (
        <>
            {/* ✅ ديالوج الإضافة/التعديل */}
            <Dialog
                isOpen={showFormDialog}
                onClose={closeFormDialog}
                title={mode === 'create' ? 'إضافة شعبة' : 'تعديل شعبة'}
                maxWidth="lg"
                showCancel={false}
                showConfirm={false}
            >
                <SectionForm
                    mode={mode}
                    classId={parseInt(classId)}
                    initialData={mode === 'edit' ? selectedSection : null}
                    onSuccess={handleFormSuccess}
                    onCancel={closeFormDialog}
                />
            </Dialog>

            {/* ✅ ديالوج حذف الشعبة (عند عدم وجود طلاب) */}
            {showDeleteDialog && selectedSection && (
                <Dialog
                    isOpen={showDeleteDialog}
                    onClose={closeDeleteDialog}
                    maxWidth="md"
                    showCancel={false}
                    showConfirm={false}
                >
                    <SectionDeleteForm
                        sectionData={{
                            id: selectedSection.id,
                            name: selectedSection.name,
                            class_name: className,
                        }}
                        onSuccess={handleDeleteSuccess}
                        onCancel={closeDeleteDialog}
                    />
                </Dialog>
            )}

            {/* ✅ ديالوج تحذير (عند وجود طلاب) */}
            <SectionDeleteDialog
                isOpen={showStudentsDialog}
                sectionData={{
                    id: selectedSection?.id,
                    name: selectedSection?.name,
                    total_students: getStudentsCount(selectedSection),
                    statistics: selectedSection?.statistics,
                    students: selectedSection?.students,
                }}
                onClose={closeStudentsDialog}
            />

            {/* ✅ الجدول */}
            <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0] flex-1 min-h-[448px]">
                <Table
                    columns={columns}
                    data={sections}
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
        </>
    );
}