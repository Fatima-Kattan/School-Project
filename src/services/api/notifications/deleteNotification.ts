// src/services/api/notifications/delete-notification.ts

export interface DeleteNotificationResponse {
    status: string;
    message: string;
}

export const deleteNotification = async (
    token: string,
    id: number
): Promise<DeleteNotificationResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/notifications/${id}`,
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
        console.error(' [deleteNotification] Failed:', error);
        throw error;
    }
};