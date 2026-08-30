// components/student/student parent info/StudentParentInfo.tsx

'use client';

interface StudentParentInfoProps {
    student: any;
}

export const StudentParentInfo = ({ student }: StudentParentInfoProps) => {
    return (
        <div className="bg-white rounded-[12px] border border-gray-200 p-6">
            <h3 
                className="text-[16px] font-bold mb-4"
                style={{
                    fontFamily: 'Cairo',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '28px',
                    color: '#47524F',
                }}
            >
                معلومات الأهل
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Cairo' }}>الأب</h4>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500 text-sm" style={{ fontFamily: 'Cairo' }}>الاسم</span>
                        <span className="font-medium text-[#000F0B]" style={{ fontFamily: 'Cairo' }}>{student.parent?.father_name || student.father_name || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500 text-sm" style={{ fontFamily: 'Cairo' }}>رقم الهاتف</span>
                        <span className="font-medium text-[#000F0B]" style={{ fontFamily: 'Cairo' }}>{student.parent?.father_phone || student.father_phone || '-'}</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Cairo' }}>الأم</h4>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500 text-sm" style={{ fontFamily: 'Cairo' }}>الاسم</span>
                        <span className="font-medium text-[#000F0B]" style={{ fontFamily: 'Cairo' }}>{student.parent?.mother_name || student.mother_name || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500 text-sm" style={{ fontFamily: 'Cairo' }}>رقم الهاتف</span>
                        <span className="font-medium text-[#000F0B]" style={{ fontFamily: 'Cairo' }}>{student.parent?.mother_phone || student.mother_phone || '-'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};