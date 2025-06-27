import AdminHeader from "@/components/admin/AdminHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  // 어드민 권한 체크
  const { data: adminUser } = await supabase
    .from("admins")
    .select("email")
    .eq("email", session.user.email)
    .single();

  if (!adminUser) {
    redirect("/admin/login");
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminHeader />
      <main>{children}</main>
    </div>
  );
}
