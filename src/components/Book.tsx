
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import HTMLFlipBook from "react-pageflip";
import { PageData } from "@/hooks/usePDF";
import { NarrationControls } from "@/components/NarrationControls";
import { ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Define HTMLFlipBook props type for TypeScript
declare module "react-pageflip" {
  interface HTMLFlipBookProps {
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    onFlip?: (e: any) => void;
    className?: string;
    ref?: React.RefObject<any>;
    startPage?: number;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
    style?: React.CSSProperties;
  }
}

interface BookProps {
  pages: PageData[];
  totalPages: number;
  onLoadMorePages?: (startPageNumber: number, count: number) => Promise<void>;
}

// Create a stable component for book pages with proper memo pattern
const BookPage = React.memo(
  React.forwardRef<HTMLDivElement, { pageData: PageData; pageNumber: number }>(
    (props, ref) => {
      const { pageData, pageNumber } = props;
      
      return (
        <div
          ref={ref}
          className="page relative overflow-hidden bg-white"
          style={{
            width: "100%", 
            height: "100%"
          }}
        >
          <div className="page-content">
            <div className="page-image">
              <img
                src={pageData.url}
                alt={`Page ${pageNumber}`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {pageNumber}
            </div>
          </div>
        </div>
      );
    }
  )
);

BookPage.displayName = "BookPage";

// EMA Mascot Character component
const EmaMascot = React.memo(() => {
  const [mood, setMood] = useState<'default' | 'happy' | 'thinking'>('default');
  const [speech, setSpeech] = useState("");
  
  // Change mascot mood randomly
  useEffect(() => {
    const moods: ('default' | 'happy' | 'thinking')[] = ['default', 'happy', 'thinking'];
    const speeches = [
      "Need any help?",
      "Keep reading!",
      "I'm here with you!",
      "Learning is fun!",
      "Turn the page when ready!"
    ];
    
    const moodInterval = setInterval(() => {
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      const randomSpeech = speeches[Math.floor(Math.random() * speeches.length)];
      setMood(randomMood);
      setSpeech(randomSpeech);
    }, 8000);
    
    // Show initial speech after a short delay
    setTimeout(() => {
      setSpeech("Hi there! I'll keep you company while you read!");
    }, 1000);
    
    return () => clearInterval(moodInterval);
  }, []);
  
  return (
    <div className="ema-mascot flex flex-col items-center">
      <div className="speech-bubble relative bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg mb-3 animate-fade-in">
        <p className="text-sm">{speech}</p>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 rotate-45"></div>
      </div>
      
      <div className={`mascot-container relative w-32 h-32 transition-all duration-300 ${
        mood === 'happy' ? 'animate-bounce' : 
        mood === 'thinking' ? 'rotate-6' : ''
      }`}>
        <img
          src="/lovable-uploads/765fbca0-bc8e-4eae-b6ea-75503433f8c2.png"
          alt="EMA Mascot"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>
    </div>
  );
});

EmaMascot.displayName = "EmaMascot";

export const Book = ({ pages, totalPages, onLoadMorePages }: BookProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [bookSize, setBookSize] = useState({ width: 600, height: 800 });
  const [bookKey, setBookKey] = useState(0);
  const isMobile = useIsMobile();
  
  const flipBookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Extract text for narration
  useEffect(() => {
    // Simulating text extraction
    if (currentPage >= 0 && currentPage < pages.length) {
      setDisplayText(
        `This is page ${currentPage + 1} of the document. ` +
        "In a real implementation, this text would be extracted from the PDF content. " +
        "The EMA animated flipbook can narrate the actual content of your documents."
      );
    } else {
      setDisplayText("");
    }
  }, [currentPage, pages]);
  
  // Adjust book size based on container with improved visibility
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = window.innerHeight * 0.7; // Use viewport height for better sizing
        
        // Improved ratio for better visibility
        // Mobile devices need different calculations
        const widthFactor = isMobile ? 0.95 : 0.85;
        const bookWidth = Math.min(containerWidth * widthFactor, 1000);
        
        // Ensure height is appropriate for content
        // Use aspect ratio that shows more of the book
        const heightRatio = isMobile ? 1.2 : 1.3;
        const bookHeight = Math.min(containerHeight * 0.9, bookWidth * heightRatio);
        
        setBookSize({
          width: bookWidth,
          height: bookHeight,
        });
      }
    };
    
    // Initial size update
    updateSize();
    
    // Handle window resize
    const handleResize = () => {
      requestAnimationFrame(updateSize);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isFullscreen, isMobile]);
  
  // Handle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Force re-render of the book component
      setBookKey(prev => prev + 1);
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);
  
  // React hook to reinitialize book when pages change significantly
  useEffect(() => {
    if (pages.length > 0) {
      setBookKey(prev => prev + 1);
    }
  }, [pages.length]);
  
  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
  };
  
  // Navigation
  const handlePrevPage = () => {
    if (flipBookRef.current?.pageFlip()) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };
  
  const handleNextPage = () => {
    if (flipBookRef.current?.pageFlip()) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };
  
  // Load more pages when needed
  const handleFlip = (e: any) => {
    if (!e || !e.data) return; // Add null check
    const newPage = e.data;
    setCurrentPage(newPage);
    
    // If we're close to the end of the loaded pages, load more
    if (onLoadMorePages && newPage >= pages.length - 3 && pages.length < totalPages) {
      onLoadMorePages(pages.length + 1, 5);
    }
  };
  
  // If no pages, show placeholder
  if (pages.length === 0) {
    return (
      <div className="flex flex-col md:flex-row items-center justify-center w-full">
        <div className="md:order-1 order-2 md:self-center">
          <EmaMascot />
        </div>
        <div className="text-center p-10 order-1 md:order-2">
          Please upload a PDF to view
        </div>
      </div>
    );
  }
  
  // Memoize content pages to prevent unnecessary re-renders
  const contentPages = React.useMemo(() => {
    return pages.map(pageData => (
      <BookPage 
        key={`page_${pageData.pageNumber}_${bookKey}`}
        pageData={pageData}
        pageNumber={pageData.pageNumber}
      />
    ));
  }, [pages, bookKey]);
  
  // Create cover and back cover
  const coverPage = React.useMemo(() => (
    <div className="page cover bg-ema-blue" key={`cover_${bookKey}`}>
      <div className="flex flex-col items-center justify-center h-full p-4">
        <img
          src="/lovable-uploads/765fbca0-bc8e-4eae-b6ea-75503433f8c2.png"
          alt="EMA Mascot"
          className="w-24 h-24 object-contain mb-6"
        />
        <h1 className="text-white text-3xl font-bold mb-2">EMA</h1>
        <h2 className="text-white text-xl">Animated Flipbook</h2>
        <p className="text-white text-sm mt-4">Begin reading &gt;</p>
      </div>
    </div>
  ), [bookKey]);
  
  const backCoverPage = React.useMemo(() => (
    <div className="page cover bg-ema-blue" key={`backcover_${bookKey}`}>
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-white text-lg">End of Document</p>
        <div className="mt-6">
          <img
            src="/lovable-uploads/765fbca0-bc8e-4eae-b6ea-75503433f8c2.png"
            alt="EMA Mascot"
            className="w-16 h-16 object-contain"
          />
        </div>
      </div>
    </div>
  ), [bookKey]);
  
  return (
    <div 
      ref={containerRef}
      className={`flex flex-col items-center justify-center w-full transition-all duration-300 ${
        isFullscreen ? "h-screen fixed inset-0 bg-background z-50 p-4" : "min-h-[80vh]"
      }`}
    >
      <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-4">
        {/* EMA Mascot - Positioned beside the book */}
        <div className="md:order-1 order-2 md:self-center flex-shrink-0">
          <EmaMascot />
        </div>
        
        {/* The Book Container - Improved sizing for better visibility */}
        <div 
          className="book-container bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out order-1 md:order-2 flex-grow flex justify-center items-center p-4 max-w-full overflow-visible"
          style={{ 
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center center",
            height: isMobile ? `${bookSize.height + 20}px` : `${bookSize.height + 40}px`,
          }}
        >
          <HTMLFlipBook
            key={bookKey}
            width={bookSize.width / 2} // Two-page spread
            height={bookSize.height}
            size="fixed"
            minWidth={250}
            maxWidth={1000}
            minHeight={300}
            maxHeight={1200}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={handleFlip}
            className="mx-auto"
            ref={flipBookRef}
            startPage={0}
            drawShadow={true}
            flippingTime={1000}
            usePortrait={false}
            startZIndex={0}
            autoSize={false} // Set to false for more control
            clickEventForward={false}
            useMouseEvents={true}
            swipeDistance={0}
            showPageCorners={true}
            disableFlipByClick={false}
            style={{}} // Required empty style prop
          >
            {coverPage}
            {contentPages}
            {backCoverPage}
          </HTMLFlipBook>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevPage}
            disabled={currentPage <= 0}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          
          <span className="text-sm mx-2">
            {currentPage + 1} / {Math.max(totalPages, pages.length)}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage >= pages.length - 1}
            className="rounded-full"
          >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.6}
            className="rounded-full"
          >
            <ZoomOut className="h-4 w-4" />
            <span className="sr-only">Zoom out</span>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 2}
            className="rounded-full"
          >
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">Zoom in</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="ml-1"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
        </div>
        
        <div className="mt-2 md:mt-0">
          <NarrationControls text={displayText} />
        </div>
      </div>
    </div>
  );
};
