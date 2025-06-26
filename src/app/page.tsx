export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2a0a5c] mb-15 to-[#6e2eb7] py-8">
      <div className="max-w-lg mx-auto flex flex-col items-center">
        <img
          src="/001.png"
          alt="사회복지사 자격증 안내"
          className="shadow-xl w-full object-cover"
        />
        <img
          src="/002.png"
          alt="사회복지사2급자격증 설명"
          className="r shadow-xl w-full object-cover"
        />
        <img
          src="/003.png"
          alt="사회복지사자격증 취득조건"
          className=" shadow-xl w-full object-cover"
        />
        <img
          src="/004.png"
          alt="1:1 밀착 학습관리 시스템"
          className="shadow-xl w-full object-cover"
        />
        <img
          src="/005.png"
          alt="한평생교육원에서!"
          className=" shadow-xl w-full object-cover"
        />
      </div>
    </main>
  );
}
