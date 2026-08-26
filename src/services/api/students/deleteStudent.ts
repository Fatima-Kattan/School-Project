// src/services/api/students/deleteStudent.ts

export const deleteStudent = async (
    id: number,
    token: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/v1/dashboard/students/${id}`,
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
        console.error('🔥 [deleteStudent] Failed:', error);
        throw error;
    }
};