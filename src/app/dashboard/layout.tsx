// app/dashboard/layout.tsx
import Sidebar from "../../(component)/sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen flex-row-reverse overflow-hidden">
      <Sidebar />
      <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
    </main>
  );
}
