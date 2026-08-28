// src/services/api/students/get-students-count.ts

export interface StudentStatistics {
    total: number;
    male: number;
    female: number;
}

export const getStudentsStatistics = async (
    token: string
): Promise<{
    success: boolean;
    data: StudentStatistics;
}> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/dashboard/students/statistics',
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
        console.error('🔥 [getStudentsStatistics] Failed:', error);
        throw error;
    }
};