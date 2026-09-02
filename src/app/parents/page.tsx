// app/dashboard/parents/page.tsx

'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { parentService, Parent } from '@/services/api/parents/parentService';
import {
    Plus,
    Loader2,
    Check,
    Copy,
    Trash2,
    AlertTriangle,
    User2,
    Trash
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/shared/button/button';
import { Dialog } from '@/components/shared/dialog/dialog';
import ParentCard from '@/components/parent/ParentCard';
import CreateParentDialog from '@/components/parent/CreateParentDialog';
import EditParentDialog from '@/components/parent/EditParentDialog';

interface Child {
    id: number;
    student_name: string;
    class_name: string;
}

// ====== Get token ======
const getToken = () => {
    return localStorage.getItem('token') || '';
};

export default function ParentsPage() {
    const router = useRouter();

    // ====== General states ======
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [parents, setParents] = useState<Parent[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedParentId, setExpandedParentId] = useState<number | null>(null);
    const [childrenData, setChildrenData] = useState<Record<number, Child[]>>({});
    const [childrenLoading, setChildrenLoading] = useState<Record<number, boolean>>({});
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    
    // Confirmation Dialog states
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [parentToDelete, setParentToDelete] = useState<Parent | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [parentChildren, setParentChildren] = useState<Child[]>([]);
    const [loadingChildren, setLoadingChildren] = useState(false);

    const token = getToken();

    // ====== Fetch parents ======
    const fetchParents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await parentService.getAll(token);
            if (response.data) {
                setParents(response.data);
            }
        } catch (error: any) {
            console.error('Error fetching parents:', error);
            toast.error(error.message || 'حدث خطأ أثناء جلب البيانات');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchParents();
    }, [fetchParents]);

    // ====== Expand row to fetch children ======
    const toggleExpand = async (parentId: number) => {
        if (expandedParentId === parentId) {
            setExpandedParentId(null);
            return;
        }

        setExpandedParentId(parentId);
        setChildrenLoading(prev => ({ ...prev, [parentId]: true }));

        try {
            const response = await parentService.getChildren(parentId, token);
            let fetchedChildren: Child[] = [];

            if (response && response.data) {
                if (Array.isArray(response.data)) {
                    fetchedChildren = response.data;
                } else if (typeof response.data === 'object') {
                    if (Array.isArray(response.data.children)) {
                        fetchedChildren = response.data.children;
                    } else if (Array.isArray(response.data.students)) {
                        fetchedChildren = response.data.students;
                    } else if (response.data.id) {
                        fetchedChildren = [response.data];
                    }
                }
            }

            const normalizedChildren = fetchedChildren.map((child: any) => ({
                id: child.id,
                student_name: child.student_name || child.name || child.full_name || 'طالب',
                class_name: child.class_name || child.grade || child.classroom || child.section || 'بدون صف'
            }));

            setChildrenData(prev => ({ ...prev, [parentId]: normalizedChildren }));

            if (normalizedChildren.length === 0) {
                console.warn(`No children found for parent ID ${parentId}. Please check the API.`);
            }

        } catch (error: any) {
            console.error('Error fetching children:', error);
            setChildrenData(prev => ({ ...prev, [parentId]: [] }));
        } finally {
            setChildrenLoading(prev => ({ ...prev, [parentId]: false }));
        }
    };

    // ====== Open delete confirmation dialog ======
    const handleDeleteClick = async (parent: Parent) => {
        setParentToDelete(parent);
        setIsDeleteDialogOpen(true);
        setLoadingChildren(true);
        
        // Fetch parent's children
        try {
            const response = await parentService.getChildren(parent.id, token);
            let fetchedChildren: Child[] = [];
            
            if (response && response.data) {
                if (Array.isArray(response.data)) {
                    fetchedChildren = response.data;
                } else if (typeof response.data === 'object') {
                    if (Array.isArray(response.data.children)) {
                        fetchedChildren = response.data.children;
                    } else if (Array.isArray(response.data.students)) {
                        fetchedChildren = response.data.students;
                    }
                }
            }
            
            const normalizedChildren = fetchedChildren.map((child: any) => ({
                id: child.id,
                student_name: child.student_name || child.name || child.full_name || 'طالب',
                class_name: child.class_name || child.grade || child.classroom || child.section || 'بدون صف'
            }));
            
            setParentChildren(normalizedChildren);
        } catch (error) {
            console.error('Error fetching children for deletion:', error);
            setParentChildren([]);
        } finally {
            setLoadingChildren(false);
        }
    };

    // ====== Execute delete ======
    const handleConfirmDelete = async () => {
        if (!parentToDelete) return;

        setIsDeleting(true);
        try {
            await parentService.delete(parentToDelete.id, token);
            toast.success(`Parent "${parentToDelete.full_name_father}" deleted successfully`);
            setIsDeleteDialogOpen(false);
            setParentToDelete(null);
            setParentChildren([]);
            fetchParents();
        } catch (error: any) {
            console.error('Error deleting parent:', error);
            toast.error(error.message || 'حدث خطأ أثناء الحذف');
        } finally {
            setIsDeleting(false);
        }
    };

    // ====== General copy function ======
    const handleCopy = (e: React.MouseEvent, parentId: number, field: string, text: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(`${parentId}-${field}`);
            toast.success('تم النسخ بنجاح!');
            setTimeout(() => setCopiedField(null), 2000);
        }).catch(() => {
            toast.error('تعذر النسخ');
        });
    };

    // ====== Render copy icon ======
    const renderCopyIcon = (parentId: number, field: string, size: number, color: string, value: string) => {
        if (copiedField === `${parentId}-${field}`) {
            return <Check size={size} className="text-green-600" />;
        }
        return (
            <Copy
                size={size}
                className={`${color} cursor-pointer hover:opacity-70`}
                onClick={(e) => handleCopy(e, parentId, field, value)}
            />
        );
    };

    return (
        <div className="min-h-screen bg-[#f4f6f9] p-6" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">أولياء الأمور</h1>

                <Button
                    variant="primary"
                    onClick={() => setIsDialogOpen(true)}
                    leftIcon={<Plus size={16} />}
                    size="md"
                    className="px-5 py-2.5"
                >
                    إضافة ولي أمر
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#f8f9fa] text-gray-600 font-bold border-b border-gray-200 text-xs">
                                <th className="px-3 py-3">الأب</th>
                                <th className="px-3 py-3">هاتف الأب</th>
                                <th className="px-3 py-3">مهنة الأب</th>
                                <th className="px-3 py-3">الأم</th>
                                <th className="px-3 py-3">هاتف الأم</th>
                                <th className="px-3 py-3">مهنة الأم</th>
                                <th className="px-3 py-3">البريد الإلكتروني</th>
                                <th className="px-3 py-3">اسم المستخدم</th>
                                <th className="px-3 py-3">تاريخ التسجيل</th>
                                <th className="px-3 py-3">خيارات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-10">
                                        <Loader2 className="animate-spin mx-auto text-gray-400" size={32} />
                                    </td>
                                </tr>
                            ) : parents.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-10 text-gray-500">
                                        لا يوجد أولياء أمور
                                    </td>
                                </tr>
                            ) : (
                                parents.map((parent) => {
                                    const isExpanded = expandedParentId === parent.id;
                                    const children = childrenData[parent.id] || [];
                                    const isChildrenLoading = childrenLoading[parent.id];

                                    return (
                                        <ParentCard
                                            key={parent.id}
                                            parent={parent}
                                            isExpanded={isExpanded}
                                            children={children}
                                            childrenLoading={isChildrenLoading}
                                            onToggle={() => toggleExpand(parent.id)}
                                            onDelete={() => handleDeleteClick(parent)}
                                            onEdit={() => {
                                                setSelectedParent(parent);
                                                setIsEditDialogOpen(true);
                                            }}
                                            renderCopyIcon={renderCopyIcon}
                                        />
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Components */}
            <CreateParentDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={fetchParents}
                token={token}
            />
            <EditParentDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onSuccess={fetchParents}
                token={token}
                parent={selectedParent}
            />
            
            {/* Delete Confirmation Dialog */}
            <Dialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setParentToDelete(null);
                    setParentChildren([]);
                }}
                onConfirm={handleConfirmDelete}
                title="حذف أولياء أمر"
                description={
                    <div className="">
                        {/* Confirmation question */}
                        <p className="text-gray-800 text-base mb-3">
                            هل أنت متأكد من حذف ولي الأمر: <span className="text-red-600 font-bold text-base mb-4">
                            {parentToDelete?.full_name_father} و {parentToDelete?.full_name_mother}
                        </span>
                        </p>

                        {/* Warning message about deleting children */}
                        {parentChildren.length > 0 && (
                            <>
                                <p className="text-sm font-medium mb-3">
                                    سيؤدي ذلك إلى حذف حسابات أبنائهم أيضاً:
                                </p>

                                {/* Children list */}
                                {loadingChildren ? (
                                    <div className="flex justify-center py-3">
                                        <Loader2 className="animate-spin text-gray-400" size={24} />
                                    </div>
                                ) : (
                                    <ul className="flex flex-wrap gap-3 list-inside space-y-1.5 pr-4 mb-2 ">
                                        {parentChildren.map((child) => (
                                            <span key={child.id} className="flex items-center justify-center flex-shrink-1  bg-[#fae5e5] text-red-600 text-md font-bold w-min-[100px] h-[30px] p-2 rounded-xl">
                                                {child.student_name}
                                            </span>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}

                        {!loadingChildren && parentChildren.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-2  bg-[#fae5e5] rounded-lg">
                                لا يوجد أبناء مسجلين لهذا ولي الأمر
                            </p>
                        )}
                    </div>
                }
                confirmText="تأكيد الحذف"
                cancelText="إلغاء"
                confirmVariant="danger"
                isLoading={isDeleting}
                leftIcon={<Trash size={16} />}
                maxWidth="md"
                closeOnOverlayClick={false}
            />
        </div>
    );
}