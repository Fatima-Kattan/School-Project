// components/student/student info/StudentInfo.tsx

'use client';

import type { Student as StudentType } from '@/services/api/students/getStudent';
import { User, Mail, MapPin, Calendar, BookOpen, Users, Hash } from 'lucide-react';

interface StudentInfoProps {
    student: StudentType;
}

export const StudentInfo = ({ student }: StudentInfoProps) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <User size={20} className="text-blue-500" />
                معلومات الطالب
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                    <p className="text-sm text-gray-500">اسم الطالب</p>
                    <p className="font-medium text-gray-800">{student.full_name}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1">
                        <Mail size={14} className="text-gray-400" />
                        {student.email}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">الجنس</p>
                    <p className="font-medium text-gray-800">
                        {student.gender === 'ذكر' ? '♂ ذكر' : '♀ أنثى'}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">تاريخ الميلاد</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {student.birth_date}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">المدينة</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1">
                        <MapPin size={14} className="text-gray-400" />
                        {student.city}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">عنوان السكن</p>
                    <p className="font-medium text-gray-800">{student.residential_address}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">الصف</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1">
                        <BookOpen size={14} className="text-gray-400" />
                        {student.class?.name || 'غير محدد'}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">الشعبة</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1">
                        <Users size={14} className="text-gray-400" />
                        {student.section?.name || 'غير محدد'}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">رقم الطالب</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1">
                        <Hash size={14} className="text-gray-400" />
                        #{student.id}
                    </p>
                </div>
            </div>
        </div>
    );
};