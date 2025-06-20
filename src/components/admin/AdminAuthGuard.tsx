"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const { data: adminUser } = await supabase
        .from("admins")
        .select("email")
        .eq("email", session.user.email)
        .single();

      if (adminUser) {
        setIsAuthorized(true);
      } else {
        router.replace("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthorized) {
    return <div className="p-8 text-center text-lg">권한 확인 중...</div>;
  }

  return <>{children}</>;
}
