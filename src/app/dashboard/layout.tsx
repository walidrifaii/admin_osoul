// app/dashboard/layout.tsx
import Sidebar from "../../(component)/sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen flex flex-row-reverse">
      <Sidebar />
      {children}
    </main>
  );
}
