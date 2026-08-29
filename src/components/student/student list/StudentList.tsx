// components/student/student list/StudentList.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Edit, Trash2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Table, Column, TableAction } from '@/components/shared/table/table';
import { Breadcrumb } from '@/components/shared/breadcrumb/breadcrumb';
import { useStudents } from '@/hooks/useStudents';
import { useClasses } from '@/hooks/useClass';
import { useSections } from '@/hooks/useSections';
import { deleteStudent } from '@/services/api/students/deleteStudent';

interface StudentListProps {
    showBreadcrumb?: boolean;
    title?: string;
    breadcrumbItems?: Array<{ label: string; href?: string }>;
    showBackButton?: boolean;
    onBack?: () => void;
}

export const StudentList = ({ 
    showBreadcrumb = true,
    title = 'الطلاب',
    breadcrumbItems,
    showBackButton = true,
    onBack,
}: StudentListProps) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');
    
    const { students, loading, refreshStudents, setStudents } = useStudents({});
    const { classes } = useClasses();
    const { sections } = useSections();

    
    const filteredStudents = students.filter((student) => {
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

    const handleDelete = async (row: any) => {
        if (!confirm(`🗑️ هل أنت متأكد من حذف ${row.full_name}؟`)) return;
        
        try {
            const token = localStorage.getItem('token') || '';
            await deleteStudent(row.id, token);
            setStudents(prev => prev.filter(s => s.id !== row.id));
            alert('✅ تم حذف الطالب بنجاح');
        } catch (err: any) {
            alert('❌ فشل الحذف: ' + err.message);
        }
    };

    // تصفية الشعب حسب الصف المختار
    const filteredSections = sections.filter((s) => {
        if (selectedClass) {
            const classObj = classes.find((c) => c.name === selectedClass);
            return classObj ? s.class_id === classObj.id : true;
        }
        return true;
    });

    // ====== أعمدة الجدول ======
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
            onClick: (row) => router.push(`/students/${row.id}/edit`),
        },
        {
            label: 'حذف',
            icon: <Trash2 size={16} />,
            variant: 'danger',
            onClick: handleDelete,
        },
    ];

    // ====== Breadcrumb Items ======
    
    const defaultBreadcrumbItems = [
        { label: title },
    ];

    const items = breadcrumbItems || defaultBreadcrumbItems;

    
    const addButton = (
        <Button
            variant="primary"
            onClick={() => router.push('/students/create')}
            leftIcon={<Plus size={16} />}
            size="md"
            className="px-5 py-2.5"
        >
            إضافة طالب
        </Button>
    );

    return (
        <div className="w-full">
            
            {showBreadcrumb && (
                <Breadcrumb
                    items={items}
                    className="mb-0"
                    showBackButton={showBackButton}
                    onBack={onBack}
                    actionButton={addButton}
                />
            )}

            
            <div className="px-6 py-6">
                {/* Filters */}
                <div className="flex items-center gap-3 mb-6">
                    
                    <div className="relative w-56">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="بحث ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                        />
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
                            className="px-3 py-1.5  border border-gray-300 rounded-[12px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:border-gray-400 transition-colors"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'left 8px center',
                                backgroundSize: '14px',
                            }}
                        >
                            <option value="">الصف</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Select الشعبة */}
                    <div className="relative">
                        <select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className="px-6 py-1.5  border border-gray-300 rounded-[12px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:border-gray-400 transition-colors"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'left 8px center',
                                backgroundSize: '14px',
                            }}
                            disabled={!selectedClass}
                        >
                            <option value="">الشعبة</option>
                            {filteredSections.map((s) => (
                                <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    data={filteredStudents}
                    keyExtractor={(row) => row.id}
                    actions={actions}
                    isLoading={loading}
                    loadingRows={5}
                    emptyTitle="لا يوجد طلاب"
                    emptyDescription="قم بإضافة طالب جديد"
                    emptyButtonText="إضافة طالب"
                    onEmptyButtonClick={() => router.push('/students/create')}
                    headerBgColor="#F9FCFB"
                    rowBgColor="#FFFFFF"
                    borderColor="#E0E0E0"
                    radius={10}
                    hoverable={true}
                />
            </div>
        </div>
    );
};