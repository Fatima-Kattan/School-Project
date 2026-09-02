// app/dashboard/parents/components/EditParentDialog.tsx

'use client';

import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parentService, Parent } from '@/services/api/parents/parentService';
import {
    ChevronDown,
    User2,
    LockKeyhole,
    UserPen,
    X,
    Save,
    Copy,
    Check,
    RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/shared/button/button';
import { Dialog } from '@/components/shared/dialog/dialog';
import { Input } from '@/components/shared/input/inpute';

interface EditParentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    token: string;
    parent: Parent | null;
}

export default function EditParentDialog({ isOpen, onClose, onSuccess, token, parent }: EditParentDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    // حالات النموذج
    const [fatherName, setFatherName] = useState('');
    const [fatherJob, setFatherJob] = useState('');
    const [fatherPhone, setFatherPhone] = useState('');
    const [motherName, setMotherName] = useState('');
    const [motherJob, setMotherJob] = useState('');
    const [motherPhone, setMotherPhone] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');

    // حالات الحساب
    const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
    const [copiedCredential, setCopiedCredential] = useState<string | null>(null);

    // تعبئة الحقول عند فتح الديالوغ
    useEffect(() => {
        if (isOpen && parent) {
            setFatherName(parent.full_name_father || '');
            setFatherJob(parent.job_father || '');
            setFatherPhone(parent.phone_number_father?.replace(/^\+/, '') || '');
            setMotherName(parent.full_name_mother || '');
            setMotherJob(parent.job_mother || '');
            setMotherPhone(parent.phone_number_mother?.replace(/^\+/, '') || '');
            setEmail(parent.email || '');
            setUserName(parent.user_name || '');
            setGeneratedPassword(parent.decrypted_password || null);
        }
    }, [isOpen, parent]);

    // ====== دالة إعادة تعيين كلمة المرور من الباكند ======
    const handleResetPassword = async () => {
        if (!parent) {
            toast.error('لا يوجد ولي أمر للتعديل');
            return;
        }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';


        setIsResettingPassword(true);
        try {
            const response = await fetch(`${API_URL}/dashboard/parents/${parent.id}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'فشل في إعادة تعيين كلمة المرور');
            }

            if (data.success) {
                setGeneratedPassword(data.data.password);
                toast.success('تم إعادة تعيين كلمة المرور بنجاح!');
            } else {
                throw new Error(data.message || 'فشل في إعادة تعيين كلمة المرور');
            }
        } catch (error: any) {
            console.error('Error resetting password:', error);
            toast.error(error.message || 'تعذر إعادة تعيين كلمة المرور');
        } finally {
            setIsResettingPassword(false);
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

    // ====== دالة التحديث ======
    const handleUpdate = async () => {
        if (!parent) return;

        if (!fatherName || !fatherJob || !fatherPhone || !motherName || !motherJob || !motherPhone || !email) {
            toast.error('يرجى تعبئة جميع الحقول المطلوبة');
            return;
        }

        setIsSubmitting(true);
        try {
            const dataToSend = {
                full_name_father: fatherName,
                job_father: fatherJob,
                phone_number_father: fatherPhone.startsWith('+') ? fatherPhone : `+${fatherPhone}`,
                full_name_mother: motherName,
                job_mother: motherJob,
                phone_number_mother: motherPhone.startsWith('+') ? motherPhone : `+${motherPhone}`,
                email: email,
                user_name: userName,
            };

            const response = await fetch(`http://localhost:8000/api/dashboard/parents/${parent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat().join('\n');
                    toast.error(errorMessages);
                } else {
                    throw new Error(result.message || 'حدث خطأ أثناء التعديل');
                }
                return;
            }

            toast.success('تم تعديل ولي الأمر بنجاح!');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error updating parent:', error);
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
            title="تعديل أولياء أمر"
            confirmText="تأكيد التعديل"
            cancelText="إلغاء"
            confirmVariant="primary"
            showCancel={true}
            showConfirm={true}
            maxWidth="2xl"
            onConfirm={handleUpdate}
            isLoading={isSubmitting}
            leftIcon={<Save size={16} />}
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
                        country={'iq'}
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
                            const input = document.querySelector('.phone-input-field-father-edit') as HTMLInputElement;
                            if (input) {
                                input.style.borderColor = '#007353';
                                input.style.boxShadow = '0 0 0 2px rgba(0, 115, 83, 0.2)';
                            }
                        }}
                        onBlur={() => {
                            const input = document.querySelector('.phone-input-field-father-edit') as HTMLInputElement;
                            if (input) {
                                input.style.borderColor = '#ACACAC';
                                input.style.boxShadow = 'none';
                            }
                        }}
                        inputClass="phone-input-field-father-edit"
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
                        country={'iq'}
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
                            const input = document.querySelector('.phone-input-field-mother-edit') as HTMLInputElement;
                            if (input) {
                                input.style.borderColor = '#007353';
                                input.style.boxShadow = '0 0 0 2px rgba(0, 115, 83, 0.2)';
                            }
                        }}
                        onBlur={() => {
                            const input = document.querySelector('.phone-input-field-mother-edit') as HTMLInputElement;
                            if (input) {
                                input.style.borderColor = '#ACACAC';
                                input.style.boxShadow = 'none';
                            }
                        }}
                        inputClass="phone-input-field-mother-edit"
                    />
                </div>

                {/* البريد الإلكتروني */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:col-span-3">
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

            {/* قسم بيانات الحساب */}
            <div className='bg-[#F8FCFB] border border-gray-200 rounded-lg p-3 mt-2'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* حقل اسم المستخدم - قابل للتعديل يدوياً */}
                    <div>
                        <p className="text-sm font-medium text-[#000f0b] mb-1.5">اسم المستخدم</p>
                        <div className="flex items-center gap-2">
                            <input
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full h-[35px] px-3 rounded-lg border border-[#ACACAC] bg-white text-sm text-[#000f0b] focus:outline-none focus:border-[#007353] focus:ring-2 focus:ring-[#007353]/20"
                                placeholder="أدخل اسم المستخدم"
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
                        <p className="text-xs text-gray-500 mt-1">يمكنك تعديل اسم المستخدم يدوياً</p>
                    </div>

                    {/* حقل كلمة المرور - للعرض فقط مع زر إعادة تعيين */}
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
                        <p className="text-xs text-gray-500 mt-1">كلمة المرور مشفرة، يمكنك إعادة تعيينها فقط</p>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}