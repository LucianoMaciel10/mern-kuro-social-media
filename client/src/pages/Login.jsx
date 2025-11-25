import { Star } from "lucide-react";
import { assets } from "../assets/assets.js";
import { SignIn } from "@clerk/clerk-react";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

const Login = () => {
  const { systemTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <img
        src={assets.bgImage}
        className={`absolute top-0 left-0 -z-1 w-full h-full object-cover ${systemTheme === 'dark' ? 'bg-[#08093f]' : 'bg-[#19506440]'}`}
      />

      <div className="flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40">
        <img
          src={systemTheme === "dark" ? assets.logoL : assets.logoD}
          className="h-12 object-contain"
        />
        <div>
          <div className="flex items-center gap-3 mb-4 max-md:mt-10">
            <img src={assets.group_users} className="h-8 md:h-10" />
            <div>
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 md:size-4.5 text-transparent fill-amber-500"
                    />
                  ))}
              </div>
              <p className={`${systemTheme === 'dark' && 'text-neutral-300'}`}>Used by 12+ developers</p>
            </div>
          </div>
          <h1 className={`text-3xl md:text-6xl md:pb-2 font-bold bg-linear-to-r ${systemTheme === 'dark' ? 'from-neutral-300' : 'from-sky-500'} to-blue-800 bg-clip-text text-transparent`}>
            Mora than just friends truly connect
          </h1>
          <p className={`text-xl md:text-3xl ${systemTheme === 'dark' ? 'text-blue-400' : 'text-sky-700'}`}>
            connect with global community on Kuro
          </p>
        </div>
        <span className="md:h-10"></span>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <SignIn
          appearance={{
            theme: systemTheme === "dark" ? dark : undefined,
            variables: systemTheme === 'dark' && { colorBackground: "#26345e", colorInput: "#242832", colorPrimary: '#284DBD' },
          }}
        />
      </div>
    </div>
  );
};

export default Login;
