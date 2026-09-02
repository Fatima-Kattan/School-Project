// components/student/student info/StudentInfo.tsx

'use client';

interface StudentInfoProps {
    student: any;
}

export const StudentInfo = ({ student }: StudentInfoProps) => {
    return (
        <div className="bg-white rounded-[12px] border p-3" style={{ border: '0.5px solid #E0E0E0' }}>
            <h3 
                className="mb-3"
                style={{
                    fontFamily: 'Cairo',
                    fontWeight: 500,
                    fontSize: '15px',
                    lineHeight: '16px',
                    color: '#000F0B',
                }}
            >
                بيانات الطالب الأساسية
            </h3>
            
            <div className="grid grid-cols-5 gap-7">
                
                <div 
                    className="rounded-[12px] border p-2"
                    style={{ border: '0.5px solid #E0E0E0' }}
                >
                    <p 
                        className="text-gray-500 text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '15px',
                            lineHeight: '16px',
                        }}
                    >
                        رقم الطالب
                    </p>
                    <p 
                        className="font-medium text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: '#000F0B',
                        }}
                    >
                        {student.id}
                    </p>
                </div>
                <div 
                    className="rounded-[12px] border p-2"
                    style={{ border: '0.5px solid #E0E0E0' }}
                >
                    <p 
                        className="text-gray-500 text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '15px',
                            lineHeight: '16px',
                        }}
                    >
                        اسم الطالب
                    </p>
                    <p 
                        className="font-medium text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: '#000F0B',
                        }}
                    >
                        {student.full_name}
                    </p>
                </div>
                <div 
                    className="rounded-[12px] border p-2"
                    style={{ border: '0.5px solid #E0E0E0' }}
                >
                    <p 
                        className="text-gray-500 text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '15px',
                            lineHeight: '16px',
                        }}
                    >
                        الجنس
                    </p>
                    <p 
                        className="font-medium text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: '#000F0B',
                        }}
                    >
                        {student.gender}
                    </p>
                </div>
                <div 
                    className="rounded-[12px] border p-2"
                    style={{ border: '0.5px solid #E0E0E0' }}
                >
                    <p 
                        className="text-gray-500 text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '15px',
                            lineHeight: '16px',
                        }}
                    >
                        تاريخ الميلاد
                    </p>
                    <p 
                        className="font-medium text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: '#000F0B',
                        }}
                    >
                        {student.birth_date}
                    </p>
                </div>
                <div 
                    className="rounded-[12px] border p-2"
                    style={{ border: '0.5px solid #E0E0E0' }}
                >
                    <p 
                        className="text-gray-500 text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '15px',
                            lineHeight: '16px',
                        }}
                    >
                        عنوان السكن
                    </p>
                    <p 
                        className="font-medium text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: '#000F0B',
                        }}
                    >
                        {student.residential_address || '-'}
                    </p>
                </div>

            
                <div 
                    className="rounded-[12px] border p-2"
                    style={{ border: '0.5px solid #E0E0E0' }}
                >
                    <p 
                        className="text-gray-500 text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '15px',
                            lineHeight: '16px',
                        }}
                    >
                        تاريخ التسجيل
                    </p>
                    <p 
                        className="font-medium text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: '#000F0B',
                        }}
                    >
                        {student.created_at ? new Date(student.created_at).toLocaleDateString('ar-SA') : '-'}
                    </p>
                </div>
                <div 
                    className="rounded-[12px] border p-2"
                    style={{ border: '0.5px solid #E0E0E0' }}
                >
                    <p 
                        className="text-gray-500 text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '15px',
                            lineHeight: '16px',
                        }}
                    >
                        الصف
                    </p>
                    <p 
                        className="font-medium text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: '#000F0B',
                        }}
                    >
                        {student.class?.name || '-'}
                    </p>
                </div>
                <div 
                    className="rounded-[12px] border p-2"
                    style={{ border: '0.5px solid #E0E0E0' }}
                >
                    <p 
                        className="text-gray-500 text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '15px',
                            lineHeight: '16px',
                        }}
                    >
                        الشعبة
                    </p>
                    <p 
                        className="font-medium text-right"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: '#000F0B',
                        }}
                    >
                        {student.section?.name || '-'}
                    </p>
                </div>
            </div>
        </div>
    );
};