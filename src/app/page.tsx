export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b md:pb-20 pb-70 from-[#2a0a5c] to-[#6e2eb7]">
      <div className="max-w-lg mx-auto flex flex-col items-center 2">
        <img
          src="/001.png"
          alt="사회복지사 자격증 안내"
          className=" shadow-xl w-full max-w-[420px] object-cover"
        />
        <img
          src="/002.png"
          alt="사회복지사2급자격증 설명"
          className=" shadow-xl w-full max-w-[420px] object-cover"
        />
        <img
          src="/003.png"
          alt="사회복지사자격증 취득조건"
          className=" shadow-xl w-full max-w-[420px] object-cover"
        />
        <img
          src="/004.png"
          alt="1:1 밀착 학습관리 시스템"
          className=" shadow-xl w-full max-w-[420px] object-cover"
        />
        <img
          src="/005.png"
          alt="한평생교육원에서!"
          className=" shadow-xl w-full max-w-[420px] object-cover"
        />
      </div>
    </main>
  );
}
