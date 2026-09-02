// src/services/api/auth/logout.ts

export interface LogoutResponse {
    success: boolean;
    message?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';


export async function logoutAPI(): Promise<LogoutResponse> {
    try {
        console.log('🚪 Step 1: Starting logout process...');

        //  جلب التوكن من localStorage
        const authToken = localStorage.getItem('token');
        console.log('🔑 Auth token found:', authToken ? '✅ Yes' : '❌ No');

        //  حذف FCM Token من الـ Backend إذا كان هناك توكن
        if (authToken) {
            console.log('📱 Step 2: Removing FCM Token from Backend...');
            await removeFCMToken(authToken);
        } else {
            console.warn('⚠️ No auth token found, skipping FCM token removal');
        }

        //  حذف Session من الـ Backend
        if (authToken) {
            console.log('🗑️ Step 3: Logging out from backend...');
            await logoutFromBackend(authToken);
        }

        //  تنظيف localStorage
        console.log('🧹 Step 4: Clearing local storage...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        console.log('✅ Logout successful - Local storage cleaned');

        //  إعادة التوجيه إلى صفحة تسجيل الدخول
        console.log('🔀 Step 5: Redirecting to login page...');
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }

        return {
            success: true,
            message: 'تم تسجيل الخروج بنجاح',
        };
    } catch (error) {
        console.error(' Logout Error:', error);

        // حتى في حالة الخطأ، نقوم بتنظيف localStorage وإعادة التوجيه
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.log('🧹 Local storage cleaned despite error');

            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        } catch (cleanupError) {
            console.error(' Error during cleanup:', cleanupError);
        }

        throw error;
    }
}

/**
 * حذف FCM Token من الـ Backend
 */
async function removeFCMToken(authToken: string): Promise<void> {
    const token = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
    console.log('🔑 Sending FCM removal request...');

    try {
        const response = await fetch(`${API_BASE_URL}/remove-fcm-token`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': token,
            },
        });

        const responseText = await response.text();
        console.log('📊 FCM Response status:', response.status);
        console.log('📊 FCM Response text:', responseText);

        if (!response.ok) {
            console.warn(`⚠️ FCM token removal failed with status ${response.status}`);
            return;
        }

        const data = responseText ? JSON.parse(responseText) : {};
        console.log(' FCM Token removed successfully:', data);
    } catch (error) {
        console.warn('⚠️ Error removing FCM Token (non-critical):', error);
    }
}

/**
 * تسجيل الخروج من الـ Backend
 */
async function logoutFromBackend(authToken: string): Promise<void> {
    const token = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
    console.log('🔑 Sending logout request to backend...');

    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': token,
            },
        });

        const responseText = await response.text();
        console.log('📊 Logout Response status:', response.status);
        console.log('📊 Logout Response text:', responseText);

        if (!response.ok) {
            console.warn(` Backend logout failed with status ${response.status}`);
            return;
        }

        const data = responseText ? JSON.parse(responseText) : {};
        console.log(' Backend logout successful:', data);
    } catch (error) {
        console.warn(' Error during backend logout (non-critical):', error);
    }
}