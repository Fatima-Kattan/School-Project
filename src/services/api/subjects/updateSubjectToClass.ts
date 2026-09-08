// src/services/api/subjects/updateSubjectToClass.ts

import type { AddSubjectData, SubjectResponse } from './addSubjectToClass';

export const updateSubjectToClass = async (
    token: string,
    id: number,
    data: Partial<AddSubjectData>
): Promise<SubjectResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/subjects/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
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
        console.error('🔥 [updateSubjectToClass] Failed:', error);
        throw error;
    }
};