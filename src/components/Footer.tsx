
export const Footer = () => {
  return (
    <footer className="border-t py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/765fbca0-bc8e-4eae-b6ea-75503433f8c2.png"
              alt="EMA Mascot"
              className="w-6 h-6 rounded-full object-cover"
            />
            <p className="text-sm text-muted-foreground">
              EMA Animated Flipbook 2025
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>PDF into Flipbook</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
