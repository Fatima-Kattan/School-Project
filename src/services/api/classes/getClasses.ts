// src/services/classes/getClasses.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const getClasses = async (token: string) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/dashboard/classes`,
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