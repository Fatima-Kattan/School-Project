// app/(dashboard)/layout.tsx
import { Sidebar } from "@/components/shared/sidebar/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}