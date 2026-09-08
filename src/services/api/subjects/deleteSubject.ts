// src/services/api/subjects/deleteSubject.ts

export const deleteSubject = async (token: string, id: number) => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/subjects/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error('🔥 [deleteSubject] Failed:', error);
        throw error;
    }
};