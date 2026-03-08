import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* CONTENT */}
      <main className="md:ml-64 pt-6 px-6 md:px-10 pb-10 transition-all">
        {children}
      </main>

    </div>
  );
}