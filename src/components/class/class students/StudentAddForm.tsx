'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/shared/button/button';

interface Student {
    id: number;
    full_name: string;
    residential_address?: string;
    city?: string;
    comment?: string;
    class_id?: number; 
}

interface StudentAddFormProps {
    sectionId: number;
    classId?: number; 
    onSuccess: () => void;
    onCancel: () => void;
}

export function StudentAddForm({ sectionId, classId, onSuccess, onCancel }: StudentAddFormProps) {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [sectionStudentIds, setSectionStudentIds] = useState<number[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    
    const fetchData = async () => {
        setLoadingStudents(true);
        setError(null);
        try {
            const token = localStorage.getItem('token') || '';
            
            
            const allStudentsRes = await fetch('http://localhost:8000/api/dashboard/students', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            const allStudentsResult = await allStudentsRes.json();
            
            
            const sectionStudentsRes = await fetch(
                `http://localhost:8000/api/dashboard/students/section/${sectionId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                }
            );
            const sectionStudentsResult = await sectionStudentsRes.json();
            
            if (allStudentsResult.success && allStudentsResult.data) {
                setAllStudents(allStudentsResult.data);
            }
            
            if (sectionStudentsResult.success && sectionStudentsResult.data) {
                const ids = sectionStudentsResult.data.map((s: any) => s.id);
                setSectionStudentIds(ids);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('حدث خطأ أثناء جلب البيانات');
        } finally {
            setLoadingStudents(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [sectionId]);

    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    
    const availableStudents = allStudents.filter(student => {
        
        const notInSection = !sectionStudentIds.includes(student.id);
        
        const sameClass = classId ? student.class_id === classId : true;
        return notInSection && sameClass;
    });

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const ids = selectedOptions.map(opt => Number(opt.value)).filter(id => id !== 0);
        setSelectedStudentIds(ids);
    };

    const removeSelectedStudent = (studentId: number) => {
        setSelectedStudentIds(prev => prev.filter(id => id !== studentId));
        if (selectRef.current) {
            const options = Array.from(selectRef.current.options);
            options.forEach(opt => {
                if (Number(opt.value) === studentId) {
                    opt.selected = false;
                }
            });
        }
    };

    const addStudentsToSection = async (studentIds: number[]) => {
        const token = localStorage.getItem('token') || '';
        
        const response = await fetch(
            `http://localhost:8000/api/dashboard/sections/${sectionId}/students/add`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ student_ids: studentIds }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'حدث خطأ أثناء إضافة الطلاب');
        }

        return await response.json();
    };

    const handleSubmit = async () => {
        if (selectedStudentIds.length === 0) return;
        
        setLoading(true);
        setError(null);
        try {
            await addStudentsToSection(selectedStudentIds);
            await fetchData();
            setSelectedStudentIds([]);
            
            if (selectRef.current) {
                const options = Array.from(selectRef.current.options);
                options.forEach(opt => {
                    opt.selected = false;
                });
            }
            
            onSuccess();
        } catch (error: any) {
            console.error('Error adding students:', error);
            setError(error.message || 'حدث خطأ أثناء إضافة الطلاب');
        } finally {
            setLoading(false);
        }
    };

    const selectedStudents = allStudents.filter(s => selectedStudentIds.includes(s.id));

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                padding: '20px',
            }}
            onClick={onCancel}
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: 'auto',
                    overflow: 'visible',
                    position: 'relative',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
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

                <h2 style={{ 
                    fontSize: '22px', 
                    fontWeight: 'bold',
                    marginBottom: '24px',
                    color: '#1a1a1a',
                    textAlign: 'right',
                }}>
                    إضافة طالب للشعبة
                </h2>

                <div style={{ overflow: 'visible' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', textAlign: 'right' }}>
                            عدد الطالب <span style={{ color: 'red' }}>(مطلوب)</span>
                        </label>
                        
                        <div style={{ position: 'relative' }} ref={dropdownRef}>
                            <div
                                onClick={() => setIsOpen(!isOpen)}
                                style={{
                                    width: '100%',
                                    minHeight: '45px',
                                    padding: '8px 16px',
                                    border: `1px solid ${isOpen ? '#007353' : '#ACACAC'}`,
                                    borderRadius: '12px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    boxShadow: isOpen ? '0 0 0 2px rgba(0,115,83,0.2)' : 'none',
                                }}
                            >
                                <span style={{ textAlign: 'right', fontSize: '14px', color: '#6B7280', flex: 1 }}>
                                    {selectedStudents.length > 0 
                                        ? `تم اختيار ${selectedStudents.length} طالب` 
                                        : availableStudents.length === 0 && allStudents.length > 0
                                        ? 'جميع الطلاب مضافون للشعبة'
                                        : 'Ctrl + Click (اختر الطالب)'}
                                </span>
                                <ChevronDown 
                                    size={18} 
                                    style={{ 
                                        color: '#6B7280',
                                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s',
                                        marginLeft: '8px',
                                    }} 
                                />
                            </div>
                            
                            {isOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    marginTop: '4px',
                                    background: 'white',
                                    border: '1px solid #ACACAC',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                    zIndex: 20,
                                }}>
                                    <select
                                        ref={selectRef}
                                        multiple
                                        value={selectedStudentIds.map(id => String(id))}
                                        onChange={handleSelectChange}
                                        style={{
                                            width: '100%',
                                            maxHeight: '150px',
                                            padding: '8px 12px',
                                            background: 'white',
                                            fontSize: '14px',
                                            outline: 'none',
                                            textAlign: 'right',
                                            borderRadius: '12px',
                                            border: 'none',
                                            direction: 'rtl',
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {loadingStudents ? (
                                            <option value="0" disabled style={{ color: '#9CA3AF' }}>
                                                جاري تحميل الطلاب...
                                            </option>
                                        ) : availableStudents.length === 0 ? (
                                            <option value="0" disabled style={{ color: '#9CA3AF' }}>
                                                {allStudents.length === 0 ? 'لا يوجد طلاب لعرضهم' : 
                                                    classId ? 'جميع طلاب هذا الصف مضافون بالفعل للشعبة' : 
                                                    'جميع الطلاب مضافون بالفعل للشعبة'}
                                            </option>
                                        ) : (
                                            availableStudents.map((student) => (
                                                <option key={student.id} value={student.id} style={{ padding: '8px 0', borderBottom: '1px solid #E5E7EB' }}>
                                                    {student.full_name} {student.city ? `- ${student.city}` : ''}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            )}
                        </div>
                        
                        
                        {!loadingStudents && (
                            <div style={{ marginTop: '4px', fontSize: '12px', color: '#6B7280', textAlign: 'right' }}>
                                {availableStudents.length > 0 && (
                                    <span>عدد الطلاب المتاحين: {availableStudents.length}</span>
                                )}
                            </div>
                        )}

                        {error && (
                            <div style={{ marginTop: '8px', fontSize: '14px', color: '#DC2626', textAlign: 'right', background: '#FEF2F2', padding: '8px', borderRadius: '8px' }}>
                                ⚠️ {error}
                            </div>
                        )}
                    </div>

                    {selectedStudents.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px', background: 'white', borderRadius: '12px', minHeight: '50px' }}>
                                {selectedStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0f7f5', color: '#007353', padding: '6px 12px', borderRadius: '10px', fontSize: '14px', fontWeight: '500' }}
                                    >
                                        <span>{student.full_name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeSelectedStudent(student.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex',color: '#007353', alignItems: 'center', borderRadius: '50%' }}
                                            className="hover:bg-gray-100"
                                        >
                                            <X size={14} style={{ color: '#6B7280' }} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px' }}>
                        <button
                            type="button"
                            onClick={onCancel}
                            style={{
                                padding: '10px 20px',
                                minWidth: '80px',
                                height: '40px',
                                borderRadius: '12px',
                                border: '1px solid #E5E7EB',
                                background: 'transparent',
                                color: '#4B5563',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#F9FAFB';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            إلغاء
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={selectedStudentIds.length === 0 || loading}
                            style={{
                                padding: '10px 24px',
                                minWidth: '200px',
                                height: '40px',
                                borderRadius: '12px',
                                border: 'none',
                                background: selectedStudentIds.length === 0 || loading ? '#9CA3AF' : '#007353',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: selectedStudentIds.length === 0 || loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                            onMouseEnter={(e) => {
                                if (selectedStudentIds.length > 0 && !loading) {
                                    e.currentTarget.style.background = '#005f42';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedStudentIds.length > 0 && !loading) {
                                    e.currentTarget.style.background = '#007353';
                                }
                            }}
                        >
                            {loading ? 'جاري الإضافة...' : 'تأكيد إضافة الطالب للشعبة'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}