// components/teacher/CreateTeacherDialog.tsx

'use client';

import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { teacherService } from '@/services/api/teachers/teacherService';
import {
    Save,
    Copy,
    Check,
    UserPen,
    User2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/shared/button/button';
import { Dialog } from '@/components/shared/dialog/dialog';
import { Input } from '@/components/shared/input/inpute';

interface CreateTeacherDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    token: string;
}

export default function CreateTeacherDialog({ isOpen, onClose, onSuccess, token }: CreateTeacherDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Form states
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState<'ذكر' | 'أنثى'>('ذكر');
    const [phoneNumber, setPhoneNumber] = useState('963');
    const [comment, setComment] = useState('');

    // Generated credentials
    const [generatedCredentials, setGeneratedCredentials] = useState<{ user_name: string, password: string } | null>(null);
    const [copiedCredential, setCopiedCredential] = useState<string | null>(null);

    const resetForm = () => {
        setFullName('');
        setEmail('');
        setGender('ذكر');
        setPhoneNumber('963');
        setComment('');
        setGeneratedCredentials(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleGenerateAccount = async () => {
        if (!fullName || !email || !phoneNumber) {
            toast.error('يرجى تعبئة جميع الحقول المطلوبة');
            return;
        }

        setIsGenerating(true);
        try {
            const dataToSend = {
                full_name: fullName,
                email: email,
                gender: gender,
                phone_number: `+${phoneNumber}`,
                comment: comment,
            };

            const response = await teacherService.create(dataToSend, token);
            
            if (response.data && response.data.teacher) {
                const { user_name, password } = response.data.teacher;
                setGeneratedCredentials({ user_name, password });
                toast.success('تم توليد الحساب بنجاح!');
            }
        } catch (error: any) {
            toast.error('تعذر توليد الحساب، يرجى التأكد من عدم تكرار البيانات');
        } finally {
            setIsGenerating(false);
        }
    };

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

    const handleConfirm = async () => {
        if (!generatedCredentials) {
            toast.error('يرجى توليد الحساب أولاً');
            return;
        }

        setIsSubmitting(true);
        try {
            toast.success(`تم إضافة المدرس بنجاح!\nاسم المستخدم: ${generatedCredentials.user_name}\nكلمة المرور: ${generatedCredentials.password}`);
            resetForm();
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'حدث خطأ');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            className='h-fit overflow-y-auto'
            isOpen={isOpen}
            onClose={handleClose}
            title="إضافة مدرس"
            confirmText="تأكيد الإضافة"
            cancelText="إلغاء"
            confirmVariant="primary"
            showCancel={true}
            showConfirm={true}
            maxWidth="lg"
            onConfirm={handleConfirm}
            isLoading={isSubmitting}
            leftIcon={<Save size={16} />}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Full Name */}
                <Input
                    className='h-[33px]'
                    label="الاسم الكامل"
                    required
                    placeholder="مثال: أحمد محمد"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium text-[#000f0b] mb-1.5 after:content-['(مطلوب)'] after:text-red-500 after:mr-1">
                        الجنس
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                value="ذكر"
                                checked={gender === 'ذكر'}
                                onChange={() => setGender('ذكر')}
                                className="w-4 h-4 text-[#007353]"
                            />
                            ذكر
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                value="أنثى"
                                checked={gender === 'أنثى'}
                                onChange={() => setGender('أنثى')}
                                className="w-4 h-4 text-[#007353]"
                            />
                            أنثى
                        </label>
                    </div>
                </div>

                {/* Phone Number */}
                <div>
                    <label className="block text-sm font-medium text-[#000f0b] mb-1.5 after:content-['(مطلوب)'] after:text-red-500 after:mr-1">
                        رقم الهاتف
                    </label>
                    <PhoneInput
                        country={'sy'}
                        value={phoneNumber}
                        onChange={(phone) => setPhoneNumber(phone)}
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
                    />
                </div>

                {/* Email */}
                <Input
                    className='h-[33px]'
                    label="البريد الإلكتروني"
                    required
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Comment - full width */}
                <div className="md:col-span-2">
                    <Input
                        label="ملاحظات"
                        inputClassName="h-20 resize-none"
                        placeholder="أي ملاحظات إضافية..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
            </div>

            {/* Generate Account Section */}
            <div className='bg-[#F8FCFB] border border-gray-200 rounded-lg p-1 mt-2'>
                <div className="mt-1.5 flex items-start justify-between gap-4 w-full">
                    {generatedCredentials ? (
                        <>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#000f0b] mb-1.5">اسم المستخدم</p>
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

                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#000f0b] mb-1.5">كلمة المرور</p>
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