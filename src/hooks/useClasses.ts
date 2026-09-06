// src/hooks/useClasses.ts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getClasses } from '@/services/api/classes/getClasses';
import { getClass } from '@/services/api/classes/getClass';
import { createClass } from '@/services/api/classes/createClass';
import { updateClass } from '@/services/api/classes/updateClass';
import { deleteClass } from '@/services/api/classes/deleteClass';

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
    deleteClass: (id: number) => Promise<void>;
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
            setError('No authentication token found. Please login.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            if (singleClassMode && classId) {
                const response = await getClass(classId, token);
                
                if (response.success && response.data) {
                    setClasses([response.data]);
                } else {
                    setError(response.message || 'Class not found');
                    setClasses([]);
                }
                return;
            }

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

    const refreshClasses = useCallback(async () => {
        await fetchClasses();
    }, [fetchClasses]);

    const handleCreateClass = useCallback(async (data: { name: string; comment?: string }) => {
        const token = getToken();
        if (!token) {
            setError('No authentication token found');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            setError(null);
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
    }, [getToken]);

    const handleUpdateClass = useCallback(async (id: number, data: { name?: string; comment?: string }) => {
        const token = getToken();
        if (!token) {
            setError('No authentication token found');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            setError(null);
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
    }, [getToken]);

    const handleDeleteClass = useCallback(async (id: number): Promise<void> => {
        const token = getToken();
        if (!token) {
            setError('No authentication token found');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            setError(null);
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
    }, [getToken]);

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