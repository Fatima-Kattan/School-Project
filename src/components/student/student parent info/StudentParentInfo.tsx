// components/student/student parent info/StudentParentInfo.tsx

'use client';

import type { Student as StudentType } from '@/services/api/students/getStudent';
import { Users, Phone, User } from 'lucide-react';

interface StudentParentInfoProps {
    student: StudentType;
}

export const StudentParentInfo = ({ student }: StudentParentInfoProps) => {
    const parent = student.parent;
    const hasParentInfo = parent && (parent.father_name || parent.mother_name || 
                            parent.father_phone || parent.mother_phone);

    if (!hasParentInfo) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <Users size={20} className="text-green-500" />
                معلومات الأهل
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                    <p className="text-sm text-gray-500">اسم الأب</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1">
                        <User size={14} className="text-gray-400" />
                        {parent?.father_name || '-'}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">اسم الأم</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1">
                        <User size={14} className="text-gray-400" />
                        {parent?.mother_name || '-'}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">هاتف الأب</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1">
                        <Phone size={14} className="text-gray-400" />
                        {parent?.father_phone || '-'}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">هاتف الأم</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1">
                        <Phone size={14} className="text-gray-400" />
                        {parent?.mother_phone || '-'}
                    </p>
                </div>
            </div>
        </div>
    );
};