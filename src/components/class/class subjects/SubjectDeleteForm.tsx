// src/components/class/class subjects/SubjectDeleteForm.tsx

'use client';

import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/shared/button/button';

interface SubjectDeleteFormProps {
    isOpen: boolean;
    subjectData?: {
        id: number;
        name: string;
        total_students?: number;
        teachers_count?: number;
    };
    onClose: () => void;
}

export const SubjectDeleteForm = ({
    isOpen,
    subjectData,
    onClose,
}: SubjectDeleteFormProps) => {
    if (!isOpen) return null;

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
            onClick={onClose}
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    maxWidth: '512px',
                    width: '100%',
                    maxHeight: 'auto',
                    overflow: 'visible',
                    position: 'relative',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-0 left-0 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 cursor-pointer"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                            <AlertTriangle size={32} className="text-yellow-600" />
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        لا يمكن حذف المادة
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                        لا يمكن حذف المادة <strong>"{subjectData?.name}"</strong> لأنها تحتوي على:
                    </p>

                    <ul className="text-right space-y-2 mb-6">
                        {(subjectData?.total_students ?? 0) > 0 && (
                            <li className="flex items-center justify-center gap-2 text-gray-700">
                                <span className="font-bold text-red-500">
                                    {subjectData?.total_students}
                                </span>
                                طالب مسجلين في هذه المادة
                            </li>
                        )}
                        {(subjectData?.teachers_count ?? 0) > 0 && (
                            <li className="flex items-center justify-center gap-2 text-gray-700">
                                <span className="font-bold text-red-500">
                                    {subjectData?.teachers_count}
                                </span>
                                مدرسين مرتبطين بهذه المادة
                            </li>
                        )}
                    </ul>

                    <div className="flex justify-center">
                        <Button
                            variant="primary"
                            onClick={onClose}
                            size="md"
                            className="h-[40px] rounded-[12px]"
                            minWidth="120px"
                        >
                            فهمت
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectDeleteForm;