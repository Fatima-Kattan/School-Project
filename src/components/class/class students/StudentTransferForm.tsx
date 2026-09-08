// components/class/class students/StudentTransferForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/shared/button/button';

interface StudentTransferFormProps {
    student: {
        id: number;
        full_name: string;
        class_name?: string; 
    };
    sectionId: number;
    onSuccess: () => void;
    onCancel: () => void;
}

interface Section {
    id: number;
    name: string;
    class_name: string;
}

export function StudentTransferForm({
    student,
    sectionId,
    onSuccess,
    onCancel,
}: StudentTransferFormProps) {
    const [loading, setLoading] = useState(false);
    const [loadingSections, setLoadingSections] = useState(true);
    const [sections, setSections] = useState<Section[]>([]);
    const [selectedSectionId, setSelectedSectionId] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [studentClass, setStudentClass] = useState<string>(student.class_name || '');

    
    useEffect(() => {
        const fetchSections = async () => {
            setLoadingSections(true);
            setError(null);
            try {
                const token = localStorage.getItem('token') || '';
                const response = await fetch(
                    `http://localhost:8000/api/dashboard/students/${student.id}/available-sections`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('حدث خطأ أثناء جلب الشعب');
                }

                const result = await response.json();
                if (result.success) {
                    setSections(result.data);
                    
                    if (result.data.length > 0 && result.data[0].class_name) {
                        setStudentClass(result.data[0].class_name);
                    }
                }
            } catch (error: any) {
                console.error('Error fetching sections:', error);
                setError(error.message || 'حدث خطأ أثناء جلب الشعب');
            } finally {
                setLoadingSections(false);
            }
        };

        fetchSections();
    }, [student.id]);

    
    const handleTransfer = async () => {
        if (!selectedSectionId) {
            setError('الرجاء اختيار الشعبة الجديدة');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token') || '';
            const response = await fetch(
                `http://localhost:8000/api/dashboard/students/${student.id}/transfer-section`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ new_section_id: selectedSectionId }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'حدث خطأ أثناء نقل الطالب');
            }

            onSuccess();
        } catch (error: any) {
            console.error('Error transferring student:', error);
            setError(error.message || 'حدث خطأ أثناء نقل الطالب');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            
            <button
                onClick={onCancel}
                style={{
                    position: 'absolute',
                    top: '15px',
                    left: '20px',
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#999',
                    zIndex: 10,
                }}
            >
                ✕
            </button>

            <h2 className="text-xl font-bold text-right mb-4">
                نقل طالب إلى شعبة أخرى
            </h2>

            

            

            
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                    الشعبة الجديدة <span className="text-red-500">(مطلوب)</span>
                </label>

                {loadingSections ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="animate-spin text-[#007353]" size={24} />
                    </div>
                ) : error ? (
                    <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-[8px]">
                        ⚠️ {error}
                    </div>
                ) : sections.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm py-4 bg-gray-50 rounded-[12px] border border-[#E0E0E0]">
                        <p className="font-medium">لا توجد شعب متاحة</p>
                        <p className="text-xs mt-1">لا يوجد شعب أخرى في نفس الصف لنقل الطالب إليها</p>
                    </div>
                ) : (
                    <select
                        value={selectedSectionId}
                        onChange={(e) => setSelectedSectionId(Number(e.target.value))}
                        className="w-full h-[45px] px-4 border border-[#ACACAC] rounded-[12px] focus:border-[#007353] focus:ring-0 bg-white text-sm outline-none transition-all appearance-none text-right"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'left 12px center',
                            backgroundSize: '14px',
                            paddingRight: '12px',
                            paddingLeft: '32px',
                        }}
                    >
                        <option value={0}>اختر الشعبة</option>
                        {sections.map((section) => (
                            <option key={section.id} value={section.id}>
                                {section.name}
                            </option>
                        ))}
                    </select>
                )}
                
                
                {!loadingSections && sections.length > 0 && (
                    <p className="text-xs text-gray-400 text-right mt-1">
                        عدد الشعب المتاحة: {sections.length}
                    </p>
                )}
            </div>

            
            {error && (
                <div className="mb-4 text-sm text-red-600 text-right bg-red-50 p-2 rounded-[8px]">
                    ⚠️ {error}
                </div>
            )}

            
            <div className="flex justify-end gap-3">
                <Button
                    variant="ghost-outline"
                    onClick={onCancel}
                    size="md"
                    className="h-[40px] rounded-[12px]"
                    minWidth="80px"
                >
                    إلغاء
                </Button>
                <Button
                    variant="primary"
                    onClick={handleTransfer}
                    isLoading={loading}
                    disabled={!selectedSectionId || loadingSections || sections.length === 0}
                    size="md"
                    className="h-[40px] rounded-[12px] bg-[#007353] hover:bg-[#005f42] text-white"
                    minWidth="160px"
                    leftIcon={<ArrowRight size={16} />}
                >
                    نقل الطالب
                </Button>
            </div>
        </div>
    );
}