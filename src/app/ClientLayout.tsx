'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from "@/components/shared/sidebar/sidebar";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();

    // المسارات التي لا يجب أن يظهر فيها السايد بار مطلقاً
    const hiddenPaths = ['/login'];
    const isSidebarHiddenRoute = hiddenPaths.includes(pathname || '');

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
            {/* لا يتم رندر الحاوية بأكملها إذا كان المسار ضمن hiddenPaths */}
            {!isSidebarHiddenRoute && (
                <div
                    className={`${
                        isSidebarOpen ? 'w-70' : 'w-0 overflow-hidden'
                    } flex-shrink-0 bg-gray-100 border-r border-gray-200 gap-2 transition-all duration-300`}
                >
                    <Sidebar />
                </div>
            )}

            {/* المحتوى الرئيسي */}
            <main
                className={`flex-1 min-w-0 transition-all duration-300 ${
                    isSidebarOpen || isSidebarHiddenRoute ? 'w-full' : ''
                }`}
            >
                {children}
            </main>
        </>
    );
}
