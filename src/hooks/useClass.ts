// src/hooks/useClasses.ts

'use client';

import { useState, useEffect, useCallback } from 'react';

// ====== Interfaces ======
export interface Class {
    id: number;
    name: string;
    comment: string | null;
    created_at: string;
    updated_at: string;
    statistics: {
        total_students: number;
        total_sections: number;
        total_subjects: number;
        total_teachers: number;
    };
    sections: Array<{
        id: number;
        name: string;
        teachers_count: number;
    }>;
    subjects: Array<{
        id: number;
        name: string;
        full_mark: number;
        comment: string | null;
    }>;
    students: Array<{
        id: number;
        full_name: string;
        email: string;
        section_name: string | null;
    }>;
    teachers: Array<{
        id: number;
        full_name: string;
        email: string;
        gender: string;
        phone_number: string;
        role: string;
        section_name: string;
    }>;
    teachers_count: number;
}

export interface ClassListResponse {
    success: boolean;
    data: Class[];
    total: number;
    message?: string;
}

// ====== Services ======
const getClasses = async (token: string): Promise<ClassListResponse> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/dashboard/classes',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error('🔥 [getClasses] Failed:', error);
        throw error;
    }
};

const getClass = async (id: number, token: string): Promise<{ success: boolean; data: Class; message?: string }> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/classes/${id}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error('🔥 [getClass] Failed:', error);
        throw error;
    }
};

const createClass = async (
    data: { name: string; comment?: string },
    token: string
): Promise<{ success: boolean; data: Class; message?: string }> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/dashboard/classes',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            if (result.errors) {
                const errorMessages = Object.values(result.errors).flat().join(', ');
                throw new Error(errorMessages);
            }
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error('🔥 [createClass] Failed:', error);
        throw error;
    }
};

const updateClass = async (
    id: number,
    data: { name?: string; comment?: string },
    token: string
): Promise<{ success: boolean; data: Class; message?: string }> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/classes/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            if (result.errors) {
                const errorMessages = Object.values(result.errors).flat().join(', ');
                throw new Error(errorMessages);
            }
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error('🔥 [updateClass] Failed:', error);
        throw error;
    }
};

const deleteClass = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/classes/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error('🔥 [deleteClass] Failed:', error);
        throw error;
    }
};

// ====== Hook ======
interface UseClassesOptions {
    initialClasses?: Class[];
    singleClassMode?: boolean;
    classId?: number;
}

interface UseClassesReturn {
    classes: Class[];
    loading: boolean;
    error: string | null;
    refreshClasses: () => Promise<void>;
    createClass: (data: { name: string; comment?: string }) => Promise<any>;
    updateClass: (id: number, data: { name?: string; comment?: string }) => Promise<any>;
    deleteClass: (id: number) => Promise<void>;  // ✅ Promise<void>
    setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
}

export const useClasses = (options: UseClassesOptions = {}): UseClassesReturn => {
    const {
        initialClasses = [],
        singleClassMode = false,
        classId,
    } = options;

    const [classes, setClasses] = useState<Class[]>(initialClasses);
    const [loading, setLoading] = useState(!initialClasses.length);
    const [error, setError] = useState<string | null>(null);

    const getToken = useCallback(() => {
        return localStorage.getItem('token') || '';
    }, []);

    const fetchClasses = useCallback(async () => {
        const token = getToken();

        if (!token) {
            setError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            if (singleClassMode && classId) {
                console.log('📤 [useClasses] Fetching single class:', classId);
                const response = await getClass(classId, token);
                
                if (response.success && response.data) {
                    setClasses([response.data]);
                } else {
                    setError(response.message || 'Class not found');
                    setClasses([]);
                }
                return;
            }

            console.log('📤 [useClasses] Fetching all classes');
            const response = await getClasses(token);
            
            if (response.success && response.data) {
                setClasses(response.data);
            } else {
                setError(response.message || 'Failed to fetch classes');
            }
            
        } catch (err: any) {
            console.error('🔥 [useClasses] Error:', err);
            setError(err.message || 'A connection error occurred');
            setClasses([]);
        } finally {
            setLoading(false);
        }
    }, [getToken, singleClassMode, classId]);

    useEffect(() => {
        if (initialClasses.length > 0 && !classId) {
            setClasses(initialClasses);
            setLoading(false);
        } else {
            fetchClasses();
        }
    }, [initialClasses.length, classId, fetchClasses]);

    const refreshClasses = async () => {
        await fetchClasses();
    };

    const handleCreateClass = async (data: { name: string; comment?: string }) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await createClass(data, token);
            if (response.success) {
                setClasses(prev => [response.data, ...prev]);
            }
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateClass = async (id: number, data: { name?: string; comment?: string }) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await updateClass(id, data, token);
            if (response.success) {
                setClasses(prev => prev.map(c => c.id === id ? response.data : c));
            }
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    
    const handleDeleteClass = async (id: number): Promise<void> => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await deleteClass(id, token);
            if (response.success) {
                setClasses(prev => prev.filter(c => c.id !== id));
            }
            
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        classes,
        loading,
        error,
        refreshClasses,
        createClass: handleCreateClass,
        updateClass: handleUpdateClass,
        deleteClass: handleDeleteClass, 
        setClasses,
    };
};