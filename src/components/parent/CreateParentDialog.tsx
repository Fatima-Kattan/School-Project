// app/dashboard/parents/components/CreateParentDialog.tsx

'use client';

import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parentService } from '@/services/api/parents/parentService';
import {
    ChevronDown,
    User2,
    LockKeyhole,
    UserPen,
    X,
    Save,
    SaveAll,
    Copy,
    Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/shared/button/button';
import { Dialog } from '@/components/shared/dialog/dialog';
import { Input } from '@/components/shared/input/inpute';

interface Student {
    id: number;
    student_name: string;
    class_name: string;
}

interface CreateParentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // تستدعى عند إعادة تحميل الجدول
    token: string;
}

export default function CreateParentDialog({ isOpen, onClose, onSuccess, token }: CreateParentDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // حالات النموذج
    const [fatherName, setFatherName] = useState('');
    const [fatherJob, setFatherJob] = useState('');
    const [fatherPhone, setFatherPhone] = useState('');
    const [motherName, setMotherName] = useState('');
    const [motherJob, setMotherJob] = useState('');
    const [motherPhone, setMotherPhone] = useState('');
    const [email, setEmail] = useState('');
    const [notes, setNotes] = useState('');

    // حالات الحساب المولد
    const [generatedCredentials, setGeneratedCredentials] = useState<{ user_name: string, password: string } | null>(null);

    // حالة تتبع أي حقل تم نسخه
    const [copiedCredential, setCopiedCredential] = useState<string | null>(null);

    // ====== حالات قائمة الطلاب ======
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // عند فتح الديالوغ، جلب الطلاب
    useEffect(() => {
        if (isOpen && token) {
            fetchStudents();
        }
    }, [isOpen, token]);

    const fetchStudents = async () => {
        try {
            const response = await parentService.getAllStudents(token);
            if (response.data && Array.isArray(response.data)) {
                // تطبيع أسماء الحقول
                const students = response.data.map((s: any) => ({
                    id: s.id,
                    student_name: s.student_name || s.name || s.full_name || 'طالب',
                    class_name: s.class_name || s.grade || s.classroom || s.section || 'بدون صف'
                }));
                setAllStudents(students);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    // عند فتح الديالوغ من جديد، تصفير الحقول
    const resetForm = () => {
        setFatherName('');
        setFatherJob('');
        setFatherPhone('');
        setMotherName('');
        setMotherJob('');
        setMotherPhone('');
        setEmail('');
        setNotes('');
        setGeneratedCredentials(null);
        setSelectedStudents([]);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // ====== دالة توليد الحساب (محمية من إظهار أخطاء السيرفر) ======
    // ====== دالة توليد الحساب (محمية من إظهار أخطاء السيرفر) ======
    const handleGenerateAccount = async () => {
        if (!fatherName || !fatherJob || !fatherPhone || !motherName || !motherJob || !motherPhone || !email) {
            toast.error('يرجى تعبئة جميع الحقول المطلوبة قبل توليد الحساب');
            return;
        }

        setIsGenerating(true);
        try {
            const dataToSend = {
                full_name_father: fatherName,
                job_father: fatherJob,
                phone_number_father: `+${fatherPhone}`,
                full_name_mother: motherName,
                job_mother: motherJob,
                phone_number_mother: `+${motherPhone}`,
                email: email,
                notes: notes,
                // ✅ إضافة الأبناء المختارين
                student_ids: selectedStudents.map((student) => student.id) 
            };

            const response = await parentService.create(dataToSend, token);
            
            if (response.data && response.data.parent) {
                const { user_name, password } = response.data.parent;
                setGeneratedCredentials({ user_name, password });
                toast.success('تم توليد الحساب بنجاح!');
            }
        } catch (error: any) {
            // لا تعرض أي خطأ من السيرفر، فقط أبلغ المستخدم بشكل عام
            toast.error('تعذر توليد الحساب، يرجى التأكد من عدم تكرار البيانات المدخلة أو المحاولة لاحقاً');
        } finally {
            setIsGenerating(false);
        }
    };

    // ====== دالة النسخ ======
    const copyCredential = (type: string, text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedCredential(type);
            toast.success('تم النسخ بنجاح!');
            setTimeout(() => setCopiedCredential(null), 2000);
        }).catch(() => {
            toast.error('تعذر النسخ');
        });
    };

    // ====== دالة التأكيد النهائية ======
    const handleConfirm = async () => {
        if (!generatedCredentials) {
            toast.error('يرجى توليد الحساب أولاً بالضغط على زر "توليد الحساب"');
            return;
        }

        setIsSubmitting(true);
        try {
            toast.success(`تم إضافة ولي الأمر بنجاح!\nاسم المستخدم: ${generatedCredentials.user_name}\nكلمة المرور: ${generatedCredentials.password}`);
            resetForm();
            onSuccess(); // لإعادة تحميل الجدول
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'حدث خطأ');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ====== اختيار الطالب ======
    const selectStudent = (student: Student) => {
        if (!selectedStudents.find(s => s.id === student.id)) {
            setSelectedStudents(prev => [...prev, student]);
        }
    };

    // ====== إزالة طالب ======
    const removeStudent = (studentId: number) => {
        setSelectedStudents(prev => prev.filter(s => s.id !== studentId));
    };

    return (
        <Dialog
            className='h-fit overflow-y-auto'
            isOpen={isOpen}
            onClose={handleClose}
            title="إضافة أولياء أمر"
            confirmText="تأكيد إضافة أولياء أمر"
            cancelText="إلغاء"
            confirmVariant="primary"
            showCancel={true}
            showConfirm={true}
            maxWidth="2xl"
            onConfirm={handleConfirm}
            isLoading={isSubmitting}
            leftIcon={<Save size={16}/>}
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

                {/* رقم الهاتف */}
                <div>
                    <label className="block text-sm font-medium text-[#000f0b] mb-1.5 after:content-['(مطلوب)'] after:text-red-500 after:mr-1">
                        رقم الهاتف
                    </label>
                    <PhoneInput
                        country={'sy'}
                        value={fatherPhone}
                        onChange={(phone) => setFatherPhone(phone)}
                        inputStyle={{
                            width: '100%', height: '33px', borderRadius: '8px', border: '1px solid #ACACAC',
                            fontSize: '14px', fontFamily: 'Cairo, sans-serif', backgroundColor: '#fff',
                            paddingLeft: '47px', color: '#000f0b', transition: 'all 0.2s', outline: 'none'
                        }}
                        buttonStyle={{
                            border: 'none', background: 'transparent', borderLeft: '1px solid #e5e7eb',
                            borderRadius: '0', height: '31px', padding: '0 10px', top: '1px', left: '1px'
                        }}
                        containerStyle={{ direction: 'ltr', width: '100%' }}
                        dropdownStyle={{ textAlign: 'right', fontFamily: 'Cairo, sans-serif' }}
                        onFocus={() => {
                            const input = document.querySelector('.phone-input-field-father') as HTMLInputElement;
                            if (input) {
                                input.style.borderColor = '#007353';
                                input.style.boxShadow = '0 0 0 2px rgba(0, 115, 83, 0.2)';
                            }
                        }}
                        onBlur={() => {
                            const input = document.querySelector('.phone-input-field-father') as HTMLInputElement;
                            if (input) {
                                input.style.borderColor = '#ACACAC';
                                input.style.boxShadow = 'none';
                            }
                        }}
                        inputClass="phone-input-field-father"
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

                {/* رقم هاتف الأم */}
                <div>
                    <label className="block text-sm font-medium text-[#000f0b] mb-1.5 after:content-['(مطلوب)'] after:text-red-500 after:mr-1">
                        رقم الهاتف
                    </label>
                    <PhoneInput
                        country={'sy'}
                        value={motherPhone}
                        onChange={(phone) => setMotherPhone(phone)}
                        inputStyle={{
                            width: '100%', height: '33px', borderRadius: '8px', border: '1px solid #ACACAC',
                            fontSize: '14px', fontFamily: 'Cairo, sans-serif', backgroundColor: '#fff',
                            paddingLeft: '47px', color: '#000f0b', transition: 'all 0.2s', outline: 'none'
                        }}
                        buttonStyle={{
                            border: 'none', background: 'transparent', borderLeft: '1px solid #e5e7eb',
                            borderRadius: '0', height: '31px', padding: '0 10px', top: '1px', left: '1px'
                        }}
                        containerStyle={{ direction: 'ltr', width: '100%' }}
                        dropdownStyle={{ textAlign: 'right', fontFamily: 'Cairo, sans-serif' }}
                        onFocus={() => {
                            const input = document.querySelector('.phone-input-field-mother') as HTMLInputElement;
                            if (input) {
                                input.style.borderColor = '#007353';
                                input.style.boxShadow = '0 0 0 2px rgba(0, 115, 83, 0.2)';
                            }
                        }}
                        onBlur={() => {
                            const input = document.querySelector('.phone-input-field-mother') as HTMLInputElement;
                            if (input) {
                                input.style.borderColor = '#ACACAC';
                                input.style.boxShadow = 'none';
                            }
                        }}
                        inputClass="phone-input-field-mother"
                    />
                </div>

                {/* البريد الإلكتروني + قسم الأبناء جنب بعض */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:col-span-3">
                    {/* البريد الإلكتروني */}
                    <div>
                        <Input
                            className='h-[39px]'
                            label="البريد الإلكتروني"
                            required
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* قسم توليد الحساب */}
            <div className='bg-[#F8FCFB] border border-gray-200 rounded-lg p-1 mt-2'>
                <div className="mt-1.5 flex items-start justify-between gap-4 w-full">
                    {generatedCredentials ? (
                        <>
                            {/* حقل اسم المستخدم */}
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#000f0b] mb-1.5">اسم المستخدم (تم توليده تلقائياً)</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        readOnly
                                        value={generatedCredentials.user_name}
                                        className="w-full h-[35px] px-3 rounded-lg border border-[#ACACAC] bg-white text-sm text-[#000f0b] focus:outline-none focus:border-[#007353] focus:ring-2 focus:ring-[#007353]/20"
                                    
                                    />
                                    <button
                                        type="button"
                                        onClick={() => copyCredential('username', generatedCredentials.user_name)}
                                        className="shrink-0 h-[35px] w-[45px] bg-white border border-[#ACACAC] rounded-lg flex items-center justify-center hover:border-[#007353] hover:bg-gray-50 transition-all"
                                    >
                                        {copiedCredential === 'username' ? (
                                            <Check size={16} className="text-green-600" />
                                        ) : (
                                            <Copy size={16} className="text-gray-500" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* حقل كلمة المرور */}
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#000f0b] mb-1.5">كلمة المرور (تم توليدها تلقائياً)</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        readOnly
                                        value={generatedCredentials.password}
                                        type="text"
                                        className="w-full h-[35px] px-3 rounded-lg border border-[#ACACAC] bg-white text-sm text-[#000f0b] focus:outline-none focus:border-[#007353] focus:ring-2 focus:ring-[#007353]/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => copyCredential('password', generatedCredentials.password)}
                                        className="shrink-0 h-[35px] w-[45px] bg-white border border-[#ACACAC] rounded-lg flex items-center justify-center hover:border-[#007353] hover:bg-gray-50 transition-all"
                                    >
                                        {copiedCredential === 'password' ? (
                                            <Check size={16} className="text-green-600" />
                                        ) : (
                                            <Copy size={16} className="text-gray-500" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full text-sm text-gray-500 flex items-center justify-center py-3">
                            قم بتوليد اسم المستخدم وكلمة المرور تلقائياً
                        </div>
                    )}
                </div>

                {/* زر توليد الحساب */}
                <div className="mt-2 flex justify-start">
                    <Button 
                        variant="primary" 
                        size="sm" 
                        className="px-4 py-2" 
                        leftIcon={<UserPen size={16} />}
                        onClick={handleGenerateAccount}
                        isLoading={isGenerating}
                    >
                        {generatedCredentials ? 'إعادة توليد الحساب' : 'توليد الحساب'}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}