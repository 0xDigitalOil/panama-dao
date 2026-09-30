import { useTheme } from "@/hooks/useTheme";
import NavigationItemComponent from "./NavigationItem";

export default function Footer() {
  const [theme] = useTheme();

  return (
    <div className="flex flex-wrap justify-around py-16">
      <div className="flex flex-wrap items-center">
        {theme.nav.secondary.map((item, i) => (
          <NavigationItemComponent
            key={i}
            item={item}
            className="mr-0 sm:mr-4 rounded-xl px-4 sm:px-6 text-sm sm:text-md h-10 flex items-center justify-around text-skin-muted hover:text-skin-base"
          />
        ))}
      </div>
      <div className="w-full text-center text-xs text-skin-muted mt-6 basis-full">
        <a href="https://adame.life" referrerPolicy="origin">Made by Adam Eisenman</a>
        {" · "}
        <a href="https://multiplai.cc" referrerPolicy="origin">Learn to build apps like this with AI</a>
      </div>
    </div>
  );
}
