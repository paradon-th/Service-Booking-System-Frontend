import { generateMeta } from "@/lib/utils";
import { LoginForm } from "@/components/features/auth/login-form";
import Image from "next/image";
import authBg from "@/public/images/backgrounds/auth_img.png";

export function generateMetadata() {
  return generateMeta({
    title: "Sign In",
    description: "Access the iCube Server management console.",
    canonical: "/login"
  });
}

export default function Page() {
  return (
        <div className="!bg-gray-100 relative flex items-center justify-center h-screen overflow-hidden">
      <Image
          src={authBg}
          alt="shadcn/ui register page"
          className="h-full w-full object-cover absolute top-0 left-0 pointer-events-none"
          unoptimized
        />
      <div className="bg-[#8C2424A8]/66 rounded-full w-[437px] h-[437px] blur-[100px] absolute top-[-314px] left-[-184px]"></div>
      <div className="bg-black/66 rounded-full w-[437px] h-[437px] blur-[100px] absolute left-[-86px] top-[96%]"></div>
      {/* <div className="bg-black/66 rounded-full w-[300px] h-[300px] blur-3xl absolute left-[45%] top-[20%]"></div> */}
      <div className="bg-[#8C2424A8]/66 rounded-full w-[265px] h-[265px] blur-[100px] absolute top-[96%] left-[60%]"></div>
      <div className="bg-[#8C2424A8]/66 rounded-full w-[265px] h-[265px] blur-[100px] absolute top-[50%] left-[96%]"></div>
      <LoginForm />
    </div>

  );
}
