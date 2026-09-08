// src/services/api/sections/deleteSection.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const deleteSection = async (id: number, token: string) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/dashboard/sections/${id}`,
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
        console.error('🔥 [deleteSection] Failed:', error);
        throw error;
    }
};