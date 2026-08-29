'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from "@/components/shared/sidebar/sidebar";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // استمع لتغييرات السايد بار من خلال حدث مخصص
    useEffect(() => {
        const handleSidebarToggle = (event: CustomEvent) => {
            setIsSidebarOpen(event.detail.isOpen);
        };

        window.addEventListener('sidebarToggle', handleSidebarToggle as EventListener);

        return () => {
            window.removeEventListener('sidebarToggle', handleSidebarToggle as EventListener);
        };
    }, []);

    return (
        <>
            {/* السايد بار */}
            <div
                className={`${isSidebarOpen ? 'w-70' : 'w-0 overflow-hidden'
                    } flex-shrink-0 bg-gray-100 border-r border-gray-200 gap-2 transition-all duration-300`}
            >
                <Sidebar />
            </div>

            {/* المحتوى الرئيسي - يأخذ كامل العرض عند غلق السايد بار */}
            <main
                className={`flex-1 min-w-0 transition-all duration-300 ${isSidebarOpen ? '' : 'w-full'
                    }`}
            >
                {children}
            </main>
        </>
    );
}