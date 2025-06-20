"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import * as XLSX from "xlsx";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { Input } from "@/components/ui/input";

// 데이터 인터페이스 정의
interface Consultation {
  id: number;
  name: string;
  phone_number: string;
  agreed_to_privacy_policy: boolean;
  created_at: string;
  status: "pending" | "approved" | "completed";
}

const ConsultationAdminPage = () => {
  const [data, setData] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 데이터 로딩
  useEffect(() => {
    async function fetchConsultations() {
      setLoading(true);
      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        alert("데이터 로딩 실패: " + error.message);
        setLoading(false);
        return;
      }
      // status가 null인 경우 'pending'으로 기본값 설정
      const processedData = data.map((item) => ({
        ...item,
        status: item.status || "pending",
      }));
      setData(processedData as Consultation[]);
      setLoading(false);
    }
    fetchConsultations();
  }, []);

  // 필터링 로직
  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.phone_number.includes(searchTerm);
        return matchesSearch;
      })
      .filter((item) => {
        const matchesStatus =
          statusFilter === "all" || item.status === statusFilter;
        return matchesStatus;
      });
  }, [data, searchTerm, statusFilter]);

  // 페이지네이션 로직
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 엑셀 다운로드 핸들러
  const handleExcelDownload = () => {
    const exportData = filteredData.map((item) => ({
      이름: item.name,
      연락처: item.phone_number,
      신청일: new Date(item.created_at).toLocaleString(),
      "개인정보 동의": item.agreed_to_privacy_policy ? "동의" : "비동의",
      상태: item.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "상담신청내역");
    XLSX.writeFile(workbook, "consultations.xlsx");
  };

  // 상태 변경 핸들러
  const handleStatusChange = async (
    id: number,
    newStatus: Consultation["status"]
  ) => {
    const { error } = await supabase
      .from("consultations")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) {
      setData((prev) =>
        prev.map((row) => (row.id === id ? { ...row, status: newStatus } : row))
      );
    } else {
      alert("상태 변경 실패: " + error.message);
    }
  };

  // 삭제 핸들러
  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const { error } = await supabase
      .from("consultations")
      .delete()
      .eq("id", id);
    if (!error) {
      setData((prev) => prev.filter((row) => row.id !== id));
    } else {
      alert("삭제 실패: " + error.message);
    }
  };

  if (loading) {
    return (
      <AdminAuthGuard>
        <div className="p-8 text-center text-lg">데이터 로딩 중...</div>
      </AdminAuthGuard>
    );
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                상담 신청 관리
              </h1>
              <p className="text-muted-foreground mt-1">
                총 {filteredData.length}개의 상담 신청이 있습니다.
              </p>
            </div>
            <Button className="gap-2" onClick={handleExcelDownload}>
              <Download className="w-4 h-4" />
              엑셀 다운로드
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stats Cards */}
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">대기중</p>
                  <p className="text-2xl font-bold">
                    {data.filter((item) => item.status === "pending").length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">승인됨</p>
                  <p className="text-2xl font-bold">
                    {data.filter((item) => item.status === "approved").length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">완료됨</p>
                  <p className="text-2xl font-bold">
                    {data.filter((item) => item.status === "completed").length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FilterBar */}
          <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-muted rounded-lg">
            <Input
              placeholder="이름 또는 전화번호로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 p-2 border rounded-md bg-background"
            >
              <option value="all">모든 상태</option>
              <option value="pending">대기중</option>
              <option value="approved">승인됨</option>
              <option value="completed">완료됨</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="p-3">신청일</th>
                  <th className="p-3">이름</th>
                  <th className="p-3">연락처</th>
                  <th className="p-3">상태</th>
                  <th className="p-3">관리</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="p-3">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.phone_number}</td>
                    <td className="p-3">
                      <select
                        className="border rounded px-2 py-1 text-sm bg-background"
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(
                            item.id,
                            e.target.value as Consultation["status"]
                          )
                        }
                      >
                        <option value="pending">대기중</option>
                        <option value="approved">승인됨</option>
                        <option value="completed">완료됨</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-muted-foreground">
              총 {filteredData.length}개 중{" "}
              {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredData.length)}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                이전
              </Button>
              <span>
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                다음
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
};

export default ConsultationAdminPage;
