// src/services/api/auth/login.ts

import { getFCMToken } from '@/lib/firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface LoginRequest {
    user_name: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
    message?: string;
}

export async function loginAPI(data: LoginRequest): Promise<LoginResponse> {
    try {
        console.log('🔐 Step 1: Logging in...');
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                user_name: data.user_name,
                password: data.password,
            }),
        });

        const responseData = await response.json();
        console.log('📦 Full Response:', responseData);

        if (!response.ok) {
            throw new Error(responseData.message || 'فشل تسجيل الدخول');
        }

        console.log('✅ Login successful');

        // ✅ البحث عن التوكن: access_token أولاً، ثم token
        const authToken = responseData.access_token || responseData.token;
        
        console.log('🔑 Token found:', authToken ? authToken.substring(0, 30) + '...' : '❌ NO TOKEN');

        if (authToken) {
            localStorage.setItem('auth_token', authToken);
            localStorage.setItem('user', JSON.stringify(
                responseData.user || responseData.data?.user || {}
            ));
            console.log('✅ Token and user saved');
        } else {
            console.error('❌ No token found in response!');
        }

        // 2️⃣ توليد FCM Token
        console.log('📱 Step 2: Generating FCM Token...');
        const fcmToken = await getFCMToken();

        // 3️⃣ حفظ FCM Token في Backend
        if (fcmToken && authToken) {
            console.log('💾 Step 3: Saving FCM Token to Backend...');
            await saveFCMToken(fcmToken, authToken);
        } else if (!authToken) {
            console.warn('⚠️ Cannot save FCM Token: No auth token available');
        } else {
            console.warn('⚠️ No FCM Token generated');
        }

        return responseData;
    } catch (error) {
        console.error('❌ Login Error:', error);
        throw error;
    }
}

async function saveFCMToken(fcmToken: string, authToken: string) {
    // ✅ تأكد من وجود التوكن
    if (!authToken) {
        console.error('❌ No auth token available!');
        return;
    }

    // ✅ تأكد من أن التوكن يبدأ بـ "Bearer "
    const token = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
    console.log('🔑 Sending token:', token.substring(0, 40) + '...');

    try {
        const response = await fetch(`${API_BASE_URL}/save-fcm-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({
                fcm_token: fcmToken,
            }),
        });

        const responseText = await response.text();
        console.log('📊 Response status:', response.status);
        console.log('📊 Response text:', responseText);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${responseText}`);
        }

        const data = JSON.parse(responseText);
        console.log('✅ FCM Token saved successfully:', data);
        return data;
    } catch (error) {
        console.error('❌ Error saving FCM Token:', error);
    }
}