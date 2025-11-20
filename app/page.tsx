import Image from "next/image";
import Login from "./Components/Login/LoginForm";

export default function Home() {
  return (
    <div className="bg-linear-to-br from-[#233876] to-[#4168DC] min-h-screen">
      <main className="flex flex-col md:flex-row">
        
        <div className="w-full md:w-auto md:shrink-0 bg-white rounded-tl-[200px] md:rounded-tl-[350px] 
        min-h-screen flex items-start justify-center md:min-w-[500px] lg:min-w-[600px] xl:min-w-[700px]">
          <div className="flex flex-col mt-40 md:mt-20 lg:mt-28 xl:mt-32 w-full px-8 md:px-16">
            <div className="flex w-full items-center justify-center gap-4 pb-14">
              <Image 
                src="/images/itmMoreliaLogo.png" 
                alt="Logo" 
                width={90} 
                height={90} 
              />
              <Image 
                src="/images/tecnmLogo.png" 
                alt="Logo" 
                width={180} 
                height={180} 
              />
            </div>

            <Login />
          </div>
        </div>
        <div className="hidden md:flex flex-1 justify-center items-center opacity-10 relative">
          <Image 
            src="/images/bgLogo.png" 
            alt="Background Logo" 
            fill
            className="object-contain"
          />
        </div>

      </main>
    </div>
  );
}
