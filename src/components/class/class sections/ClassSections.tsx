'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Edit, SquarePen, Trash, X } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Table, Column, TableAction } from '@/components/shared/table/table';
import { SectionForm } from './SectionForm';
import { SectionDeleteDialog } from './SectionDeleteDialog';
import { SectionDeleteForm } from './SectionDeleteForm';

interface ClassSectionsProps {
    classId: string;
    className?: string;
    sections: Array<{
        id: number;
        name: string;
        comment: string | null;
        teachers_count: number;
        total_students?: number;          // ✅ من API
        students_count?: number;          // ✅ من API
        statistics?: {
            students_count: number;
        };
        students?: Array<{
            id: number;
            user?: {
                full_name: string;
            };
            full_name?: string;
        }>;
    }>;
    onSectionClick?: (sectionId: number) => void;
    onSectionChanged?: () => void;
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

    // ====== State Management ======
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showStudentsDialog, setShowStudentsDialog] = useState(false);
    const [selectedSection, setSelectedSection] = useState<any>(null);

    // ====== Form Handlers ======
    const openAddDialog = () => {
        setShowFormDialog(true);
    };

    const closeFormDialog = () => {
        setShowFormDialog(false);
        setSelectedSection(null);
    };

    const openEditDialog = (section: any) => {
        setSelectedSection(section);
        setShowEditDialog(true);
    };

    const closeEditDialog = () => {
        setShowEditDialog(false);
        setSelectedSection(null);
    };

    const handleFormSuccess = () => {
        setShowFormDialog(false);
        setShowEditDialog(false);
        setSelectedSection(null);
        if (onSectionChanged) {
            onSectionChanged();
        }
    };

    // ====== Delete Handlers ======
    const openDeleteDialog = (section: any) => {
        setSelectedSection(section);
        
        // ✅ حساب عدد الطلاب من جميع المصادر الممكنة
        const hasStudents = 
            (section?.total_students || 0) > 0 ||
            (section?.statistics?.students_count || 0) > 0 ||
            (section?.students_count || 0) > 0 ||
            (section?.students && section.students.length > 0);
        
        console.log('🔍 Checking section students:', {
            sectionName: section.name,
            total_students: section?.total_students,
            statistics: section?.statistics?.students_count,
            students_count: section?.students_count,
            students: section?.students?.length,
            hasStudents: hasStudents
        });
        
        if (hasStudents) {
            setShowStudentsDialog(true); // ← يظهر التحذير
        } else {
            setShowDeleteDialog(true); // ← يظهر الفورم للحذف
        }
    };

    const closeDeleteDialog = () => {
        setShowDeleteDialog(false);
        setSelectedSection(null);
    };

    const closeStudentsDialog = () => {
        setShowStudentsDialog(false);
        setSelectedSection(null);
    };

    const handleDeleteSuccess = () => {
        console.log('✅ [ClassSections] Section deleted successfully!');
        setShowDeleteDialog(false);
        setSelectedSection(null);
        if (onSectionChanged) {
            onSectionChanged();
        }
    };

    // ====== Helper Function ======
    const getStudentsCount = (section: any): number => {
        if (!section) return 0;
        return section.total_students || 
               section.statistics?.students_count || 
               section.students_count || 
               section.students?.length || 
               0;
    };

    // ====== Columns ======
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
            header: 'عدد الطلاب',
            align: 'center',
            width: 130,
            render: (row) => {
                const count = getStudentsCount(row);
                return (
                    <span className="font-medium">
                        {count}
                    </span>
                );
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

    // ====== Actions ======
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

    const isEmpty = !sections || sections.length === 0;

    return (
        <div className="w-full">
            {/* ====== Add Form Dialog ====== */}
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
                                إضافة شعبة
                            </h2>
                        </div>

                        <SectionForm
                            mode="create"
                            classId={parseInt(classId)}
                            initialData={null}
                            onSuccess={handleFormSuccess}
                            onCancel={closeFormDialog}
                        />
                    </div>
                </div>
            )}

            {/* ====== Edit Form Dialog ====== */}
            {showEditDialog && selectedSection && (
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
                                تعديل شعبة
                            </h2>
                        </div>

                        <SectionForm
                            mode="edit"
                            classId={parseInt(classId)}
                            initialData={selectedSection}
                            onSuccess={handleFormSuccess}
                            onCancel={closeEditDialog}
                        />
                    </div>
                </div>
            )}

            {/* ====== Delete Form (عند عدم وجود طلاب) ====== */}
            {showDeleteDialog && selectedSection && (
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

                        <SectionDeleteForm
                            sectionData={{
                                id: selectedSection.id,
                                name: selectedSection.name,
                                class_name: className,
                            }}
                            onSuccess={handleDeleteSuccess}
                            onCancel={closeDeleteDialog}
                        />
                    </div>
                </div>
            )}

            {/* ====== Delete Dialog (عند وجود طلاب - تحذيري) ====== */}
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

            {/* ====== Main Content ====== */}
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-12 min-h-[500px] border border-[#E0E0E0]">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">📚</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        لا شعب مضافين بعد
                    </h3>
                    <p className="text-gray-500 text-center mb-6">
                        قم بإضافة الشعب وتابعهم الآن من هنا
                    </p>
                    <Button
                        variant="primary"
                        onClick={openAddDialog}
                        leftIcon={<Plus size={16} />}
                        size="md"
                        className="px-5 py-2.5 shadow-sm"
                    >
                        إضافة شعبة
                    </Button>
                </div>
            ) : (
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
            )}
        </div>
    );
}