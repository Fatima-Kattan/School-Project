// components/student/student parent info/StudentParentInfo.tsx

'use client';

import { useState } from 'react';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';

interface StudentParentInfoProps {
    student: any;
}

export const StudentParentInfo = ({ student }: StudentParentInfoProps) => {
    const [copiedFather, setCopiedFather] = useState(false);
    const [copiedMother, setCopiedMother] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [copiedUsername, setCopiedUsername] = useState(false);
    const [copiedPassword, setCopiedPassword] = useState(false);

    
    const [showPassword, setShowPassword] = useState(false);

    const copyToClipboard = (text: string, type: 'father' | 'mother' | 'email' | 'username' | 'password') => {
        
        const textToCopy = text || '••••••••';
        navigator.clipboard.writeText(textToCopy);
        
        if (type === 'father') {
            setCopiedFather(true);
            setTimeout(() => setCopiedFather(false), 2000);
        } else if (type === 'mother') {
            setCopiedMother(true);
            setTimeout(() => setCopiedMother(false), 2000);
        } else if (type === 'email') {
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
        } else if (type === 'username') {
            setCopiedUsername(true);
            setTimeout(() => setCopiedUsername(false), 2000);
        } else if (type === 'password') {
            setCopiedPassword(true);
            setTimeout(() => setCopiedPassword(false), 2000);
        }
    };

    return (
        <div className="bg-white rounded-[12px] border p-3" style={{ border: '0.5px solid #E0E0E0' }}>
            <h3 
                className="mb-3 text-right"
                style={{
                    fontFamily: 'Cairo',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#000F0B',
                }}
            >
                معلومات الأهل
            </h3>
            
            <div className="space-y-4">
                
                <div className="space-y-2">
                    <h4 
                        className="text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 600,
                            fontSize: '13px',
                            lineHeight: '20px',
                            color: '#47524F',
                        }}
                    >
                        بيانات ولي الأمر (الأب)
                    </h4>

                    
                    <div className="grid grid-cols-3 gap-3">
                        <div 
                            className="rounded-[12px] border p-2 flex flex-col"
                            style={{ border: '0.5px solid #E0E0E0', direction: 'rtl' }}
                        >
                            <p className="text-gray-500"
                                style={{ fontFamily: 'Cairo', fontWeight: 400, fontSize: '11px', lineHeight: '16px', textAlign: 'right' }}
                            >
                                الاسم
                            </p>
                            <p className="font-medium"
                                style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', lineHeight: '22px', color: '#000F0B', textAlign: 'right' }}
                            >
                                {student.parent?.father_name || student.father_name || '-'}
                            </p>
                        </div>

                        <div 
                            className="rounded-[12px] border p-2 flex flex-col"
                            style={{ border: '0.5px solid #E0E0E0', direction: 'rtl' }}
                        >
                            <p className="text-gray-500"
                                style={{ fontFamily: 'Cairo', fontWeight: 400, fontSize: '11px', lineHeight: '16px', textAlign: 'right' }}
                            >
                                المهنة
                            </p>
                            <p className="font-medium"
                                style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', lineHeight: '22px', color: '#000F0B', textAlign: 'right' }}
                            >
                                {student.parent?.job_father || student.job_father || '-'}
                            </p>
                        </div>

                        <div 
                            className="rounded-[12px] border p-2 flex flex-col items-start"
                            style={{ border: '0.5px solid #E0E0E0', direction: 'rtl' }}
                        >
                            <p className="text-gray-500"
                                style={{ fontFamily: 'Cairo', fontWeight: 400, fontSize: '11px', lineHeight: '16px', textAlign: 'right' }}
                            >
                                هاتف الأب
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="font-medium"
                                    style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', lineHeight: '22px', color: '#007353' }}
                                >
                                    {student.parent?.father_phone || student.father_phone || '-'}
                                </p>
                                {(student.parent?.father_phone || student.father_phone) && (
                                    <button onClick={() => copyToClipboard(student.parent?.father_phone || student.father_phone, 'father')}
                                        className="text-gray-400 hover:text-[#007353] transition-colors">
                                        {copiedFather ? <Check size={16} className="text-[#007353]" /> : <Copy size={16} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="space-y-2">
                    <h4 
                        className="text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 600,
                            fontSize: '13px',
                            lineHeight: '20px',
                            color: '#47524F',
                        }}
                    >
                        بيانات ولية الأمر (الأم)
                    </h4>

                    
                    <div className="grid grid-cols-3 gap-3">
                        <div 
                            className="rounded-[12px] border p-2 flex flex-col"
                            style={{ border: '0.5px solid #E0E0E0', direction: 'rtl' }}
                        >
                            <p className="text-gray-500"
                                style={{ fontFamily: 'Cairo', fontWeight: 400, fontSize: '11px', lineHeight: '16px', textAlign: 'right' }}
                            >
                                الاسم
                            </p>
                            <p className="font-medium"
                                style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', lineHeight: '22px', color: '#000F0B', textAlign: 'right' }}
                            >
                                {student.parent?.mother_name || student.mother_name || '-'}
                            </p>
                        </div>

                        <div 
                            className="rounded-[12px] border p-2 flex flex-col"
                            style={{ border: '0.5px solid #E0E0E0', direction: 'rtl' }}
                        >
                            <p className="text-gray-500"
                                style={{ fontFamily: 'Cairo', fontWeight: 400, fontSize: '11px', lineHeight: '16px', textAlign: 'right' }}
                            >
                                المهنة
                            </p>
                            <p className="font-medium"
                                style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', lineHeight: '22px', color: '#000F0B', textAlign: 'right' }}
                            >
                                {student.parent?.job_mother || student.job_mother || '-'}
                            </p>
                        </div>

                        <div 
                            className="rounded-[12px] border p-2 flex flex-col items-start"
                            style={{ border: '0.5px solid #E0E0E0', direction: 'rtl' }}
                        >
                            <p className="text-gray-500"
                                style={{ fontFamily: 'Cairo', fontWeight: 400, fontSize: '11px', lineHeight: '16px', textAlign: 'right' }}
                            >
                                هاتف الأم
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="font-medium"
                                    style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', lineHeight: '22px', color: '#007353' }}
                                >
                                    {student.parent?.mother_phone || student.mother_phone || '-'}
                                </p>
                                {(student.parent?.mother_phone || student.mother_phone) && (
                                    <button onClick={() => copyToClipboard(student.parent?.mother_phone || student.mother_phone, 'mother')}
                                        className="text-gray-400 hover:text-[#007353] transition-colors">
                                        {copiedMother ? <Check size={16} className="text-[#007353]" /> : <Copy size={16} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="space-y-2">
                    <h4 
                        className="text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 600,
                            fontSize: '13px',
                            lineHeight: '20px',
                            color: '#47524F',
                        }}
                    >
                        حساب الأهل
                    </h4>

                    
                    <div className="grid grid-cols-3 gap-3">
                        
                        <div 
                            className="rounded-[12px] border p-2 flex flex-col items-start"
                            style={{ border: '0.5px solid #E0E0E0', direction: 'rtl' }}
                        >
                            <p className="text-gray-500"
                                style={{ fontFamily: 'Cairo', fontWeight: 400, fontSize: '11px', lineHeight: '16px', textAlign: 'right' }}
                            >
                                البريد الإلكتروني
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="font-medium"
                                    style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', lineHeight: '22px', color: '#2563eb', textAlign: 'right' }}
                                >
                                    {student.parent?.email || student.email || '-'}
                                </p>
                                {(student.parent?.email || student.email) && (
                                    <button onClick={() => copyToClipboard(student.parent?.email || student.email, 'email')}
                                        className="transition-colors" style={{ color: '#2563eb' }}>
                                        {copiedEmail ? <Check size={16} style={{ color: '#2563eb' }} /> : <Copy size={16} />}
                                    </button>
                                )}
                            </div>
                        </div>

                        
                        <div 
                            className="rounded-[12px] border p-2 flex flex-col items-start"
                            style={{ border: '0.5px solid #E0E0E0', direction: 'rtl' }}
                        >
                            <p className="text-gray-500"
                                style={{ fontFamily: 'Cairo', fontWeight: 400, fontSize: '11px', lineHeight: '16px', textAlign: 'right' }}
                            >
                                اسم المستخدم
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="font-medium"
                                    style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', lineHeight: '22px', color: '#fa8022', textAlign: 'right' }}
                                >
                                    {student.parent?.user_name || student.user_name || '-'}
                                </p>
                                {(student.parent?.user_name || student.user_name) && (
                                    <button onClick={() => copyToClipboard(student.parent?.user_name || student.user_name, 'username')}
                                        className="transition-colors" style={{ color: '#fa8022' }}>
                                        {copiedUsername ? <Check size={16} style={{ color: '#fa8022' }} /> : <Copy size={16} />}
                                    </button>
                                )}
                            </div>
                        </div>

                        
                        <div 
                            className="rounded-[12px] border p-2 flex flex-col items-start"
                            style={{ border: '0.5px solid #E0E0E0', direction: 'rtl' }}
                        >
                            <p className="text-gray-500"
                                style={{ fontFamily: 'Cairo', fontWeight: 400, fontSize: '11px', lineHeight: '16px', textAlign: 'right' }}
                            >
                                كلمة المرور
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                
                                <p className="font-medium"
                                    style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', lineHeight: '22px', color: '#000F0B' }}
                                >
                                    {showPassword ? (student.parent?.password || student.password || 'Password123') : '••••••••'}
                                </p>
                                
                                
                                <button onClick={() => setShowPassword(!showPassword)}
                                    className="transition-colors" style={{ color: '#000F0B' }}>
                                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>

                                
                                <button onClick={() => copyToClipboard(student.parent?.password || student.password || 'Password123', 'password')}
                                    className="transition-colors" style={{ color: '#fa8022' }}>
                                    {copiedPassword ? <Check size={16} style={{ color: '#fa8022' }} /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};