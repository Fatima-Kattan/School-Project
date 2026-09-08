'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/shared/button/button';

interface ClassDeleteDialogProps {
    isOpen: boolean;
    classData: {
        id: number;
        name: string;
        statistics?: {
            total_students: number;
            total_sections?: number;
        };
        students?: Array<{
            id: number;
            full_name: string;
        }>;
        sections?: Array<{
            id: number;
            name: string;
        }>;
        sections_count?: number; 
    } | null;
    onClose: () => void;
}

export const ClassDeleteDialog = ({
    isOpen,
    classData,
    onClose,
}: ClassDeleteDialogProps) => {
    const [sectionsList, setSectionsList] = useState<Array<{ id: number; name: string }>>([]);
    const [loadingSections, setLoadingSections] = useState(false);
    const [totalSections, setTotalSections] = useState(0);

    
    const fetchSections = async () => {
        if (!classData?.id) return;

        setLoadingSections(true);
        try {
            const token = localStorage.getItem('token') || '';
            const response = await fetch(
                `http://localhost:8000/api/dashboard/sections?class_id=${classData.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                }
            );

            const result = await response.json();

            if (result.success && result.data) {
                let sections = [];
                if (Array.isArray(result.data)) {
                    sections = result.data;
                } else if (result.data.data) {
                    sections = result.data.data;
                } else {
                    sections = [];
                }

                const sectionsList = sections.map((section: any) => ({
                    id: section.id,
                    name: section.name,
                }));

                const firstThree = sectionsList.slice(0, 3);
                setSectionsList(firstThree);
                setTotalSections(sectionsList.length);
            } else {
                
                const sections = classData.sections || [];
                if (sections.length > 0) {
                    const sectionsList = sections.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                    }));
                    const firstThree = sectionsList.slice(0, 3);
                    setSectionsList(firstThree);
                    setTotalSections(sectionsList.length);
                } else {
                    setSectionsList([]);
                    setTotalSections(0);
                }
            }
        } catch (error) {
            console.error('Error fetching sections:', error);
            
            
            const sections = classData.sections || [];
            if (sections.length > 0) {
                const sectionsList = sections.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                }));
                const firstThree = sectionsList.slice(0, 3);
                setSectionsList(firstThree);
                setTotalSections(sectionsList.length);
            } else {
                setSectionsList([]);
                setTotalSections(0);
            }
        } finally {
            setLoadingSections(false);
        }
    };

    
    useEffect(() => {
        if (isOpen && classData) {
            
            if (classData.sections_count !== undefined && classData.sections_count > 0) {
                setTotalSections(classData.sections_count);
                
                if (classData.sections && classData.sections.length > 0) {
                    const sections = classData.sections.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                    }));
                    const firstThree = sections.slice(0, 3);
                    setSectionsList(firstThree);
                }
                setLoadingSections(false);
                return;
            }

            
            if (classData.statistics?.total_sections !== undefined && classData.statistics.total_sections > 0) {
                setTotalSections(classData.statistics.total_sections);
                if (classData.sections && classData.sections.length > 0) {
                    const sections = classData.sections.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                    }));
                    const firstThree = sections.slice(0, 3);
                    setSectionsList(firstThree);
                }
                setLoadingSections(false);
                return;
            }

            
            if (classData.sections && classData.sections.length > 0) {
                const sections = classData.sections.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                }));
                const firstThree = sections.slice(0, 3);
                setSectionsList(firstThree);
                setTotalSections(sections.length);
                setLoadingSections(false);
            } else {
                // ✅ 4. جلب من الـ API
                fetchSections();
            }
        }
    }, [isOpen, classData]);

    
    if (!isOpen) return null;

    
    if (totalSections === 0 && !loadingSections) {
        return null; 
    }

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ====== Header ====== */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">حذف صف</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-red-50 active:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 rounded-full transition-colors cursor-pointer"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* ====== Body ====== */}
                <div className="px-6 py-4">
                    
                    <p className="text-red-600 text-base mb-3">
                        لا يمكن حذف الصف لأنه يحتوي على {totalSections} شعبة
                        {totalSections > 1 ? '' : ''}
                    </p>

                    
                    {loadingSections ? (
                        <div className="flex justify-center py-3">
                            <Loader2 className="animate-spin text-gray-400" size={24} />
                        </div>
                    ) : (
                        <>
                            
                            {sectionsList.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {sectionsList.map((section) => (
                                        <span
                                            key={section.id}
                                            className="flex items-center justify-center flex-shrink-1 bg-[#fae5e5] text-red-600 text-md font-bold min-w-[60px] h-[30px] p-2 rounded-xl"
                                        >
                                            {section.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                            
                            
                            {totalSections > 3 && (
                                <p className="text-gray-500 text-sm mr-2">
                                    و {totalSections - 3} شعبة
                                    {totalSections - 3 > 1 ? '' : ''}
                                </p>
                            )}
                        </>
                    )}

                    
                    <p className="text-red-600 text-sm font-medium mt-3">
                        قم بحذف الشعب أولاً ثم احذف الصف
                    </p>
                </div>

                {/* ====== Footer ====== */}
                <div className="flex justify-end px-6 py-4 border-t border-gray-200">
                    <Button
                        variant="ghost-outline"
                        onClick={onClose}
                        size="md"
                        className="h-[36px] rounded-[12px] text-sm "
                        minWidth="80px"
                    >
                        إغلاق
                    </Button>
                </div>
            </div>
        </div>
    );
};