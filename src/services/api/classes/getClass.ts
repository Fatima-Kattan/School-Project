// src/services/classes/getClass.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const getClass = async (id: number, token: string) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/dashboard/classes/${id}`,
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