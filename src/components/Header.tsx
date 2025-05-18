
import { ThemeSwitcher } from "./ThemeSwitcher";

export const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img
            src="/lovable-uploads/765fbca0-bc8e-4eae-b6ea-75503433f8c2.png"
            alt="EMA Mascot"
            className="w-10 h-10 rounded-full object-cover border border-primary"
          />
          <div>
            <h1 className="text-xl font-semibold tracking-tight">EMA</h1>
            <p className="text-xs text-muted-foreground">Animated Flipbook</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
