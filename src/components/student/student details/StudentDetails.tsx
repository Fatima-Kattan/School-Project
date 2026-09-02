// components/student/student details/StudentDetails.tsx

'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { StudentInfo } from '../student info/StudentInfo';
import { StudentParentInfo } from '../student parent info/StudentParentInfo';
import { StudentGrades } from '../student grades/StudentGrades';
import { Button } from '../../shared/button/button'; 

interface StudentDetailsProps {
    student: any;
    onBack?: () => void;
}

type TabType = 'info' | 'parents' | 'grades';

export const StudentDetails = ({ student, onBack }: StudentDetailsProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('info');

    if (!student) return null;

    return (
        <div className="w-full">
            
            <div 
                className="w-full bg-white border-b border-[#E0E0E0] px-6 py-10"
                style={{
                    borderBottom: '0.5px solid #E0E0E0',
                }}
            >
                <div className="flex items-center gap-2">
                    
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center rounded-[8px] border border-[#ACACAC] bg-white transition-colors hover:bg-gray-50"
                        style={{
                            width: '28px',
                            height: '28px',
                            border: '0.5px solid #ACACAC',
                        }}
                    >
                        <ChevronRight size={16} className="text-gray-500" />
                    </button>
                    <h1 
                        className="text-[16px] font-bold"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 700,
                            fontSize: '16px',
                            lineHeight: '28px',
                            color: '#47524F',
                        }}
                    >
                        الطالب / <span style={{ color: '#000F0B' }}>{student.full_name}</span>
                    </h1>
                </div>
            </div>

            
            <div className="h-4"></div>

            
            <div className="px-6">
                <div 
                    className="flex gap-2 bg-white rounded-[15px]"
                    style={{
                        border: '0.5px solid #E0E0E0',
                        padding: '18px', 
                    }}
                >
                    <Button
                        onClick={() => setActiveTab('info')}
                        
                        variant={activeTab === 'info' ? 'primary' : 'ghost-outline'}
                        size="md"
                        minWidth={activeTab === 'info' ? '108px' : '104px'}
                        className={`!h-[28px] !rounded-[10px] text-sm font-semibold !border !border-[#E0E0E0] ${
                            activeTab !== 'info' ? 'text-gray-500 hover:text-gray-700' : ''
                        }`}
                    >
                        معلومات الطالب
                    </Button>

                    <Button
                        onClick={() => setActiveTab('parents')}
                        variant={activeTab === 'parents' ? 'primary' : 'ghost-outline'}
                        size="md"
                        minWidth={activeTab === 'parents' ? '108px' : '104px'}
                        className={`!h-[28px] !rounded-[10px] text-sm font-semibold !border !border-[#E0E0E0] ${
                            activeTab !== 'parents' ? 'text-gray-500 hover:text-gray-700' : ''
                        }`}
                    >
                        معلومات الأهل
                    </Button>

                    <Button
                        onClick={() => setActiveTab('grades')}
                        variant={activeTab === 'grades' ? 'primary' : 'ghost-outline'}
                        size="md"
                        minWidth={activeTab === 'grades' ? '108px' : '104px'}
                        className={`!h-[28px] !rounded-[10px] text-sm font-semibold !border !border-[#E0E0E0] ${
                            activeTab !== 'grades' ? 'text-gray-500 hover:text-gray-700' : ''
                        }`}
                    >
                        سجل العلامات
                    </Button>
                </div>
            </div>

            
            <div className="h-4"></div>

            
            <div className="px-6 pb-6 space-y-4">
                {activeTab === 'info' && <StudentInfo student={student} />}
                {activeTab === 'parents' && <StudentParentInfo student={student} />}
                {activeTab === 'grades' && <StudentGrades student={student} />}
            </div>
        </div>
    );
};