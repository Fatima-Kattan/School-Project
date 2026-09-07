// app/dashboard/teachers/page.tsx

'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { teacherService, Teacher, TeacherClass, TeacherSubject, TeacherWithDetails } from '@/services/api/teachers/teacherService';
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
import TeacherCard from '@/components/teacher/TeacherCard';
import CreateTeacherDialog from '@/components/teacher/CreateTeacherDialog';
import EditTeacherDialog from '@/components/teacher/EditTeacherDialog ';

// ====== Get token ======
const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || '';
    }
    return '';
};

export default function TeachersPage() {
    const router = useRouter();

    // ====== General states ======
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [teachers, setTeachers] = useState<TeacherWithDetails[]>([]); // ✅ تغيير إلى TeacherWithDetails
    const [loading, setLoading] = useState(true);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<TeacherWithDetails | null>(null); // ✅ تغيير
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Expand states
    const [expandedTeacherId, setExpandedTeacherId] = useState<number | null>(null);
    const [teacherClasses, setTeacherClasses] = useState<Record<number, TeacherClass[]>>({});
    const [teacherSubjects, setTeacherSubjects] = useState<Record<number, TeacherSubject[]>>({});
    const [loadingDetails, setLoadingDetails] = useState<Record<number, boolean>>({});

    // Confirmation Dialog states
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState<TeacherWithDetails | null>(null); // ✅ تغيير
    const [isDeleting, setIsDeleting] = useState(false);

    // ====== Fetch teachers with details ======
    const fetchTeachers = useCallback(async () => {
        const token = getToken();
        if (!token) {
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            // ✅ استخدام الدالة الجديدة التي تجلب كل شيء دفعة واحدة
            const response = await teacherService.getAllWithDetails(token);
            console.log('✅ Teachers with details:', response); // للتحقق
            
            if (response.success && response.data) {
                setTeachers(response.data);
                
                // ✅ تخزين البيانات في الـ states المناسبة للتوسيع
                response.data.forEach((teacher: TeacherWithDetails) => {
                    // تحويل بيانات الصفوف إلى TeacherClass[]
                    if (teacher.classes && teacher.classes.length > 0) {
                        const formattedClasses: TeacherClass[] = teacher.classes.map((cls) => ({
                            id: cls.class_id,
                            class_name: cls.class_name,
                            sections: cls.sections.map((s) => s.section_name)
                        }));
                        setTeacherClasses(prev => ({ ...prev, [teacher.id]: formattedClasses }));
                    }
                    
                    // تحويل بيانات المواد إلى TeacherSubject[]
                    if (teacher.subjects && teacher.subjects.length > 0) {
                        const formattedSubjects: TeacherSubject[] = teacher.subjects.map((subject, index) => ({
                            id: index,
                            subject_name: subject,
                            class_name: teacher.classes.map(c => c.class_name).join('، ') || 'جميع الصفوف',
                            section_name: teacher.classes.flatMap(c => c.sections.map(s => s.section_name)).join('، ') || 'جميع الشعب'
                        }));
                        setTeacherSubjects(prev => ({ ...prev, [teacher.id]: formattedSubjects }));
                    }
                });
            }
        } catch (error: any) {
            console.error('Error fetching teachers:', error);
            toast.error(error.message || 'حدث خطأ أثناء جلب البيانات');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    // ====== Toggle expand - الآن البيانات موجودة مسبقاً ======
    const toggleExpand = async (teacherId: number) => {
        if (expandedTeacherId === teacherId) {
            setExpandedTeacherId(null);
            return;
        }

        // ✅ البيانات موجودة مسبقاً في teacherClasses و teacherSubjects
        // فقط نعرضها بدون جلب جديد
        setExpandedTeacherId(teacherId);
    };

    // ====== Open delete confirmation dialog ======
    const handleDeleteClick = (teacher: TeacherWithDetails) => {
        setTeacherToDelete(teacher);
        setIsDeleteDialogOpen(true);
    };

    // ====== Execute delete ======
    const handleConfirmDelete = async () => {
        if (!teacherToDelete) return;

        setIsDeleting(true);
        try {
            const token = getToken();
            await teacherService.delete(teacherToDelete.id, token);
            toast.success(`تم حذف المدرس "${teacherToDelete.full_name}" بنجاح`);
            setIsDeleteDialogOpen(false);
            setTeacherToDelete(null);
            fetchTeachers(); // تحديث القائمة
        } catch (error: any) {
            console.error('Error deleting teacher:', error);
            toast.error(error.message || 'حدث خطأ أثناء الحذف');
        } finally {
            setIsDeleting(false);
        }
    };

    // ====== General copy function ======
    const handleCopy = (e: React.MouseEvent, teacherId: number, field: string, text: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(`${teacherId}-${field}`);
            toast.success('تم النسخ بنجاح!');
            setTimeout(() => setCopiedField(null), 2000);
        }).catch(() => {
            toast.error('تعذر النسخ');
        });
    };

    // ====== Render copy icon ======
    const renderCopyIcon = (teacherId: number, field: string, size: number, color: string, value: string) => {
        if (copiedField === `${teacherId}-${field}`) {
            return <Check size={size} className="text-green-600" />;
        }
        return (
            <Copy
                size={size}
                className={`${color} cursor-pointer hover:opacity-70`}
                onClick={(e) => handleCopy(e, teacherId, field, value)}
            />
        );
    };

    return (
        <div className="min-h-screen bg-[#f4f6f9] p-6" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">المدرسين</h1>

                <Button
                    variant="primary"
                    onClick={() => setIsDialogOpen(true)}
                    leftIcon={<Plus size={16} />}
                    size="md"
                    className="px-5 py-2.5"
                >
                    إضافة مدرس
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#f8f9fa] text-gray-600 font-bold border-b border-gray-200 text-xs">
                                <th className="px-3 py-3 text-right">اسم الأستاذ</th>
                                <th className="px-3 py-3 text-right">الجنس</th>
                                <th className="px-3 py-3 text-right">البريد الإلكتروني</th>
                                <th className="px-3 py-3 text-right">اسم المستخدم</th>
                                <th className="px-3 py-3 text-right">رقم الهاتف</th>
                                <th className="px-3 py-3 text-right">تاريخ التسجيل</th>
                                <th className="px-3 py-3 text-right">ملاحظات</th>
                                <th className="px-3 py-3 text-right">خيارات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-10">
                                        <Loader2 className="animate-spin mx-auto text-gray-400" size={32} />
                                    </td>
                                </tr>
                            ) : teachers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-10 text-gray-500">
                                        لا يوجد مدرسين
                                    </td>
                                </tr>
                            ) : (
                                teachers.map((teacher) => {
                                    const isExpanded = expandedTeacherId === teacher.id;
                                    const classes = teacherClasses[teacher.id] || [];
                                    const subjects = teacherSubjects[teacher.id] || [];
                                    const isLoadingDetails = loadingDetails[teacher.id] || false;

                                    return (
                                        <TeacherCard
                                            key={teacher.id}
                                            teacher={teacher}
                                            onDelete={() => handleDeleteClick(teacher)}
                                            onEdit={() => {
                                                setSelectedTeacher(teacher);
                                                setIsEditDialogOpen(true);
                                            }}
                                            renderCopyIcon={renderCopyIcon}
                                            isExpanded={isExpanded}
                                            onToggle={() => toggleExpand(teacher.id)}
                                            teacherClasses={classes}
                                            teacherSubjects={subjects}
                                            loadingDetails={isLoadingDetails}
                                        />
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Components */}
            <CreateTeacherDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={fetchTeachers}
                token={getToken()}
            />
            <EditTeacherDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onSuccess={fetchTeachers}
                token={getToken()}
                teacher={selectedTeacher}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setTeacherToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="حذف مدرس"
                description={
                    <div className="py-3">
                        <p className="text-gray-800 text-base mb-3">
                            هل أنت متأكد من حذف المدرس: <span className="text-red-600 font-bold text-base mb-4">
                                {teacherToDelete?.full_name}
                            </span>
                        </p>
                    </div>
                }
                confirmText="تأكيد الحذف"
                cancelText="إلغاء"
                confirmVariant="danger"
                isLoading={isDeleting}
                leftIcon={<Trash size={16} />}
                maxWidth="lg"
                closeOnOverlayClick={false}
            />
        </div>
    );
}