// app/dashboard/parents/page.tsx

'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parentService, Parent } from '@/services/api/parents/parentService';
import {
    Plus,
    Loader2,
    Check,
    Copy,
    ChevronDown,
    X,
    User2,
    LockKeyhole,
    UserPen
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/shared/button/button';
import { Dialog } from '@/components/shared/dialog/dialog';
import { Input } from '@/components/shared/input/inpute';
import ParentCard from '@/components/parent/ParentCard';

// أنواع البيانات للابن
interface Child {
    id: number;
    student_name: string;
    class_name: string;
}

// ====== الحصول على التوكن ======
const getToken = () => {
    return localStorage.getItem('token') || '';
};

export default function ParentsPage() {
    const router = useRouter(); 
    
    // ====== الحالات العامة ======
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [parents, setParents] = useState<Parent[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedParentId, setExpandedParentId] = useState<number | null>(null);
    const [childrenData, setChildrenData] = useState<Record<number, Child[]>>({});
    const [childrenLoading, setChildrenLoading] = useState<Record<number, boolean>>({});
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // ====== حالات نموذج الإضافة ======
    const [fatherName, setFatherName] = useState('');
    const [fatherJob, setFatherJob] = useState('');
    const [fatherPhone, setFatherPhone] = useState('');
    const [motherName, setMotherName] = useState('');
    const [motherJob, setMotherJob] = useState('');
    const [motherPhone, setMotherPhone] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [notes, setNotes] = useState('');

    const token = getToken();

    // ====== جلب أولياء الأمور ======
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

    // ====== توسيع الصف لجلب الأبناء ======
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
                console.warn(`لا يوجد أبناء مرسلين من السيرفر لولي الأمر رقم ${parentId}. تأكد من الـ API.`);
            }

        } catch (error: any) {
            console.error('Error fetching children:', error);
            setChildrenData(prev => ({ ...prev, [parentId]: [] }));
        } finally {
            setChildrenLoading(prev => ({ ...prev, [parentId]: false }));
        }
    };

    // ====== حذف ولي الأمر ======
    const handleDelete = async (parent: Parent) => {
        if (!confirm(`هل أنت متأكد من حذف ولي الأمر "${parent.full_name_father}"؟`)) return;

        try {
            await parentService.delete(parent.id, token);
            toast.success('تم الحذف بنجاح');
            fetchParents();
        } catch (error: any) {
            console.error('Error deleting parent:', error);
            toast.error(error.message || 'حدث خطأ أثناء الحذف');
        }
    };

    // ====== دالة النسخ العامة ======
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

    // ====== دالة عرض أيقونة النسخ ======
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

    // ====== دالة إرسال النموذج الفعلية ======
    const handleCreateParent = async () => {
        // تحقق بسيط من الحقول المطلوبة
        if (!fatherName || !fatherJob || !fatherPhone || !motherName || !motherJob || !motherPhone || !email || !username || !password) {
            toast.error('يرجى تعبئة جميع الحقول المطلوبة');
            return;
        }

        setIsSubmitting(true);
        try {
            const dataToSend = {
                full_name_father: fatherName,
                job_father: fatherJob,
                phone_number_father: `+${fatherPhone}`, // إضافة + للرمز
                full_name_mother: motherName,
                job_mother: motherJob,
                phone_number_mother: `+${motherPhone}`,
                email: email,
                user_name: username,
                password: password,
                notes: notes,
            };

            await parentService.create(dataToSend, token);
            toast.success('تم إضافة ولي الأمر بنجاح');
            setIsDialogOpen(false);
            
            // تصفير الحقول
            setFatherName('');
            setFatherJob('');
            setFatherPhone('');
            setMotherName('');
            setMotherJob('');
            setMotherPhone('');
            setEmail('');
            setUsername('');
            setPassword('');
            setNotes('');
            
            fetchParents(); // إعادة تحميل الجدول
        } catch (error: any) {
            console.error('Error creating parent:', error);
            toast.error(error.message || 'حدث خطأ أثناء إضافة ولي الأمر');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f6f9] p-6" dir="rtl">
            {/* الهيدر العلوي */}
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

            {/* الجدول */}
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
                                <th className="px-3 py-3">الملاحظات</th>
                                <th className="px-3 py-3">خيارات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-10">
                                        <Loader2 className="animate-spin mx-auto text-gray-400" size={32} />
                                    </td>
                                </tr>
                            ) : parents.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-10 text-gray-500">
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
                                            onDelete={() => handleDelete(parent)}
                                            renderCopyIcon={renderCopyIcon}
                                        />
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ====== المنبثقة (Dialog) الخاصة بإضافة ولي أمر ====== */}
            <Dialog
                className='h-fit overflow-y-auto'
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="إضافة أولياء أمر"
                confirmText="تأكيد إضافة أولياء أمر"
                cancelText="إلغاء"
                confirmVariant="primary"
                showCancel={true}
                showConfirm={true}
                maxWidth="2xl"
                onConfirm={handleCreateParent}
                isLoading={isSubmitting}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {/* اسم الأب */}
                    <Input
                        className='h-[33px]'
                        label="اسم الأب الكامل"
                        required
                        placeholder="مثال: محمد حسن"
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                    />

                    {/* المهنة */}
                    <Input
                        className='h-[33px]'
                        label="المهنة"
                        required
                        placeholder="مثال: مهندس"
                        value={fatherJob}
                        onChange={(e) => setFatherJob(e.target.value)}
                    />

                    {/* رقم الهاتف - PhoneInput مُهيأ بالكامل ليطابق الـ Input */}
                    <div>
                        <label className="block text-sm font-medium text-[#000f0b] mb-1.5 after:content-['(مطلوب)'] after:text-red-500 after:mr-1">
                            رقم الهاتف
                        </label>
                        <PhoneInput
                            country={'iq'}
                            value={fatherPhone}
                            onChange={(phone) => setFatherPhone(phone)}
                            inputStyle={{
                                width: '100%',
                                height: '33px',
                                borderRadius: '8px',
                                border: '1px solid #ACACAC',
                                fontSize: '14px',
                                fontFamily: 'Cairo, sans-serif',
                                backgroundColor: '#fff',
                                paddingLeft: '48px',
                                textAlign: 'right',
                                color: '#000f0b'
                            }}
                            buttonStyle={{
                                border: 'none',
                                background: 'transparent',
                                borderLeft: '1px solid #e5e7eb',
                                borderRadius: '0',
                                height: '31px',
                                padding: '0 10px',
                                top: '1px',
                                left: '1px',
                            }}
                            containerStyle={{
                                direction: 'ltr',
                                width: '100%'
                            }}
                            dropdownStyle={{
                                textAlign: 'right',
                                fontFamily: 'Cairo, sans-serif'
                            }}
                        />
                    </div>

                    {/* اسم الأم */}
                    <Input
                        className='h-[33px]'
                        label="اسم الأم الكامل"
                        required
                        placeholder="مثال: فاطمة علي"
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                    />

                    {/* مهنة الأم */}
                    <Input
                        className='h-[33px]'
                        label="المهنة"
                        required
                        placeholder="مثال: معلمة"
                        value={motherJob}
                        onChange={(e) => setMotherJob(e.target.value)}
                    />

                    {/* رقم هاتف الأم - PhoneInput مُهيأ بالكامل */}
                    <div>
                        <label className="block text-sm font-medium text-[#000f0b] mb-1.5 after:content-['(مطلوب)'] after:text-red-500 after:mr-1">
                            رقم الهاتف
                        </label>
                        <PhoneInput
                            country={'iq'}
                            value={motherPhone}
                            onChange={(phone) => setMotherPhone(phone)}
                            inputStyle={{
                                width: '100%',
                                height: '33px',
                                borderRadius: '8px',
                                border: '1px solid #ACACAC',
                                fontSize: '14px',
                                fontFamily: 'Cairo, sans-serif',
                                backgroundColor: '#fff',
                                paddingLeft: '48px',
                                textAlign: 'right',
                                color: '#000f0b'
                            }}
                            buttonStyle={{
                                border: 'none',
                                background: 'transparent',
                                borderLeft: '1px solid #e5e7eb',
                                borderRadius: '0',
                                height: '31px',
                                padding: '0 10px',
                                top: '1px',
                                left: '1px',
                            }}
                            containerStyle={{
                                direction: 'ltr',
                                width: '100%'
                            }}
                            dropdownStyle={{
                                textAlign: 'right',
                                fontFamily: 'Cairo, sans-serif'
                            }}
                        />
                    </div>

                    {/* البريد الإلكتروني */}
                    <div className="md:col-span-3">
                        <Input
                            className='h-[36px]'
                            label="البريد الإلكتروني"
                            required
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                {/* قسم أبناءهم من الطلاب */}
                <div className="mt-1.5">
                    <p className="text-sm font-medium text-[#000f0b] mb-2">أبناءهم من الطلاب</p>
                    <div className="relative w-full">
                        <Input
                            className='h-[36px]'
                            placeholder="اختر الطلاب..."
                            icon={<ChevronDown size={16} className="text-gray-500" />}
                            iconPosition="left"
                        />
                    </div>
                </div>

                {/* قسم المستخدم وكلمة المرور */}
                <div className='bg-[#F8FCFB] border border-gray-200 rounded-lg p-1 mt-2'>
                    <div className="mt-1.5 grid grid-cols-1 md:grid-cols-2 gap-4 ">
                        <Input
                            className='h-[35px]'
                            label="اسم المستخدم"
                            required
                            placeholder="username"
                            icon={<User2 size={16} className="text-gray-400" />}
                            iconPosition="left"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            className='h-[35px]'
                            label="كلمة المرور"
                            required
                            type="password"
                            placeholder="********"
                            icon={<LockKeyhole size={16} className="text-gray-400" />}
                            iconPosition="left"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* زر توليد الحساب */}
                    <div className="mt-1.5 flex justify-start ">
                        <Button variant="primary" size="sm" className="px-4 py-2" leftIcon={<UserPen size={16} />}>
                            توليد الحساب
                        </Button>
                    </div>
                </div>
                

                {/* الملاحظات */}
                <div className="">
                    <Input
                        label="الملاحظات"
                        inputClassName="h-20 resize-none"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
            </Dialog>
        </div>
    );
}