// components/teacher/EditTeacherDialog.tsx

'use client';

import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { teacherService, Teacher } from '@/services/api/teachers/teacherService';
import {
    Save,
    Copy,
    Check,
    RefreshCw,
    UserPen
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/shared/button/button';
import { Dialog } from '@/components/shared/dialog/dialog';
import { Input } from '@/components/shared/input/inpute';

interface EditTeacherDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    token: string;
    teacher: Teacher | null;
}

export default function EditTeacherDialog({ isOpen, onClose, onSuccess, token, teacher }: EditTeacherDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    // Form states
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState<'ذكر' | 'أنثى'>('ذكر');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [comment, setComment] = useState('');
    const [userName, setUserName] = useState('');

    // Password state
    const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
    const [copiedCredential, setCopiedCredential] = useState<string | null>(null);

    // Load data when dialog opens
    useEffect(() => {
        if (isOpen && teacher) {
            setFullName(teacher.full_name || '');
            setEmail(teacher.email || '');
            setGender(teacher.gender || 'ذكر');
            setPhoneNumber(teacher.phone_number?.replace(/^\+/, '') || '');
            setComment(teacher.comment || '');
            setUserName(teacher.user_name || '');
            setGeneratedPassword(teacher.decrypted_password || null);
        }
    }, [isOpen, teacher]);

    const handleResetPassword = async () => {
        if (!teacher) return;

        setIsResettingPassword(true);
        try {
            const response = await teacherService.resetPassword(teacher.id, token);
            if (response.success) {
                setGeneratedPassword(response.data.password);
                toast.success('تم إعادة تعيين كلمة المرور بنجاح!');
            }
        } catch (error: any) {
            toast.error(error.message || 'تعذر إعادة تعيين كلمة المرور');
        } finally {
            setIsResettingPassword(false);
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

    const handleUpdate = async () => {
        if (!teacher) return;

        if (!fullName || !email || !phoneNumber) {
            toast.error('يرجى تعبئة جميع الحقول المطلوبة');
            return;
        }

        setIsSubmitting(true);
        try {
            const dataToSend = {
                full_name: fullName,
                gender: gender,
                phone_number: phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`,
                comment: comment,
            };

            await teacherService.update(teacher.id, dataToSend, token);
            toast.success('تم تعديل المدرس بنجاح!');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'حدث خطأ أثناء التعديل');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            className='h-fit overflow-y-auto'
            isOpen={isOpen}
            onClose={onClose}
            title="تعديل مدرس"
            confirmText="تأكيد التعديل"
            cancelText="إلغاء"
            confirmVariant="primary"
            showCancel={true}
            showConfirm={true}
            maxWidth="lg"
            onConfirm={handleUpdate}
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

            {/* Account Section */}
            <div className='bg-[#F8FCFB] border border-gray-200 rounded-lg p-3 mt-2'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Username */}
                    <div>
                        <p className="text-sm font-medium text-[#000f0b] mb-1.5">اسم المستخدم</p>
                        <div className="flex items-center gap-2">
                            <input
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full h-[35px] px-3 rounded-lg border border-[#ACACAC] bg-white text-sm text-[#000f0b] focus:outline-none focus:border-[#007353] focus:ring-2 focus:ring-[#007353]/20"
                                placeholder="اسم المستخدم"
                            />
                            <button
                                type="button"
                                onClick={() => copyCredential('username', userName)}
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

                    {/* Password */}
                    <div>
                        <p className="text-sm font-medium text-[#000f0b] mb-1.5">كلمة المرور</p>
                        <div className="flex items-center gap-2">
                            <input
                                readOnly
                                value={generatedPassword || ''}
                                type="text"
                                className="w-full h-[35px] px-3 rounded-lg border border-[#ACACAC] bg-gray-50 text-sm text-[#000f0b] focus:outline-none"
                                placeholder="كلمة المرور الحالية"
                            />
                            <button
                                type="button"
                                onClick={() => copyCredential('password', generatedPassword || '')}
                                className="shrink-0 h-[35px] w-[45px] bg-white border border-[#ACACAC] rounded-lg flex items-center justify-center hover:border-[#007353] hover:bg-gray-50 transition-all"
                            >
                                {copiedCredential === 'password' ? (
                                    <Check size={16} className="text-green-600" />
                                ) : (
                                    <Copy size={16} className="text-gray-500" />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleResetPassword}
                                disabled={isResettingPassword}
                                className="shrink-0 h-[35px] px-3 bg-[#007353] text-white rounded-lg flex items-center gap-2 hover:bg-[#005c44] transition-all disabled:opacity-50"
                            >
                                <RefreshCw size={16} className={isResettingPassword ? 'animate-spin' : ''} />
                                <span className="text-sm whitespace-nowrap">إعادة تعيين</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}