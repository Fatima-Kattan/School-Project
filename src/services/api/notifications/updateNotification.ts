// src/services/api/notifications/update-notification.ts

export interface UpdateNotificationData {
    title: string;
    message: string;
}

export interface UpdateNotificationResponse {
    status: string;
    message: string;
    data: {
        id: number;
        title: string;
        message: string;
        created_at: string;
        updated_at: string;
    };
}

export const updateNotification = async (
    token: string,
    id: number,
    data: UpdateNotificationData
): Promise<UpdateNotificationResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/notifications/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error(' [updateNotification] Failed:', error);
        throw error;
    }
};