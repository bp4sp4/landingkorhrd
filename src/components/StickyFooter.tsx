"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { usePathname } from "next/navigation";

export default function StickyFooter() {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    agreed: false,
  });
  const [phoneError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9-]/g, "");
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreed: checked as boolean }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneError) {
      alert(phoneError);
      return;
    }
    if (!formData.agreed) {
      alert("개인정보처리방침에 동의해주세요.");
      return;
    }

    const { error } = await supabase.from("consultations").insert([
      {
        name: formData.name,
        phone_number: formData.phoneNumber,
        agreed_to_privacy_policy: formData.agreed,
      },
    ]);

    if (error) {
      console.error("Error inserting data:", error);
      alert("상담 신청에 실패했습니다. 다시 시도해주세요.");
    } else {
      alert("상담 신청이 완료되었습니다.");
      setFormData({
        name: "",
        phoneNumber: "",
        agreed: false,
      });
    }
  };

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="w-full">
      <div className="w-full  bg-white mx-auto flex flex-col items-center justify-center gap-4 py-3 px-4 md:flex-row md:py-4 fixed bottom-0 left-0 right-0 z-50 md:fixed md:bottom-0 md:left-0 md:right-0 md:z-50">
        {/* Contact Information */}
        <div className="flex items-center flex-col md:flex-row md:gap-6">
          <div className="relative text-center">
            <p className="text-sm font-medium text-muted-foreground">
              학습상담문의
            </p>
            <p className="text-xl md:text-2xl hidden md:block font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              010-8484-7933
            </p>
          </div>

          <div className="hidden md:block text-center md:text-left">
            <p className="text-base md:text-lg font-bold">
              상담받고 <span className="text-primary">최대장학 혜택</span> 받기
            </p>
          </div>
        </div>

        {/* Consultation Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 md:flex-row md:gap-3  items-center w-full md:w-auto"
        >
          <div className="flex flex-col gap-2 md:flex-row md:gap-2 w-full md:w-auto">
            <Input
              type="text"
              name="name"
              placeholder="이름"
              value={formData.name}
              onChange={handleChange}
              className="bg-background border-input h-9 w-full md:w-24"
            />
            <Input
              type="tel"
              name="phoneNumber"
              placeholder="-없이 숫자만 입력"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              className="bg-background border-input h-9 w-full md:w-48"
            />
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:gap-2 w-full md:w-auto">
            <div className="flex flex-row items-center gap-2 w-full md:w-auto">
              <Checkbox
                id="terms"
                checked={formData.agreed}
                onCheckedChange={handleCheckboxChange}
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-xs md:text-sm text-muted-foreground underline cursor-pointer hover:text-foreground transition-colors whitespace-nowrap"
                  >
                    개인정보처리방침 동의
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>개인정보 수집 및 이용동의</DialogTitle>
                  </DialogHeader>
                  <div className="text-sm space-y-4 py-4">
                    <p>
                      수집하는 개인정보의 항목은 빠른 학습상담 신청을 위해
                      아래와 같은 개인정보를 수집하고 있습니다.
                    </p>
                    <ul className="list-disc list-inside bg-gray-50 p-3 rounded-md">
                      <li>
                        <strong>수집항목 :</strong> 이름, 연락처, 상담내용
                      </li>
                      <li>
                        <strong>개인정보 수집방법 :</strong> 홈페이지 (문의하기)
                      </li>
                    </ul>
                    <p>
                      개인정보의 수집 및 이용목적회사는 수집한 개인정보를 다음의
                      목적을 위해 활용합니다.
                    </p>
                    <ul className="list-disc list-inside bg-gray-50 p-3 rounded-md">
                      <li>
                        <strong>회원 관리 :</strong> 회원제 서비스 이용에 따른
                        본인확인, 개인 식별, 가입 의사 확인, 불만처리 등
                        민원처리, 고지사항 전달
                      </li>
                      <li>
                        <strong>마케팅 및 광고에 활용 :</strong> 신규
                        서비스(제품) 개발 및 특화, 이벤트 등 광고성 정보 전달
                      </li>
                    </ul>
                    <p>
                      <strong>개인정보의 보유 및 이용기간 : 2년</strong>
                      <br />
                      회사는 개인정보 수집 및 이용목적이 달성된 후에는 예외 없이
                      해당 정보를 지체 없이 파기합니다.
                    </p>
                    <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
                      <p>
                        귀하께서는 개인정보 제공 및 활용에 거부할 권리가
                        있습니다.
                      </p>
                      <p className="font-semibold">
                        거부에 따른 불이익 : 위 제공사항은 상담에 반드시 필요한
                        사항으로 거부하실 경우 상담이 불가능함을 알려드립니다.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button">닫기</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium w-full md:w-auto transition-all duration-300 h-9"
            >
              무료상담신청
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </footer>
  );
}
