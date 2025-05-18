
import { useState, useRef, useEffect } from 'react';
import { pdfjs } from 'react-pdf';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export interface PageData {
  pageNumber: number;
  renderWidth: number;
  renderHeight: number;
  url: string;
}

export const usePDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pdfDocRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadFile = async (file: File) => {
    setFile(file);
    setIsLoading(true);
    setError(null);
    
    try {
      // Load the PDF file
      const fileURL = URL.createObjectURL(file);
      const loadingTask = pdfjs.getDocument(fileURL);
      pdfDocRef.current = await loadingTask.promise;
      setTotalPages(pdfDocRef.current.numPages);

      // Create canvas element for rendering pages
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }

      // Render first 10 pages initially (can load more on demand)
      const pagesData: PageData[] = [];
      const pagesToRender = Math.min(pdfDocRef.current.numPages, 10);

      for (let i = 1; i <= pagesToRender; i++) {
        const pageData = await renderPage(i);
        if (pageData) pagesData.push(pageData);
      }

      setPages(pagesData);
    } catch (err) {
      console.error("Error loading PDF:", err);
      setError("Could not load PDF file. Please try another file.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPage = async (pageNumber: number): Promise<PageData | null> => {
    if (!pdfDocRef.current) return null;
    
    try {
      const page = await pdfDocRef.current.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 }); // Higher scale for better quality
      
      const canvas = canvasRef.current!;
      const context = canvas.getContext('2d')!;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      return {
        pageNumber,
        renderWidth: viewport.width,
        renderHeight: viewport.height,
        url: canvas.toDataURL('image/png')
      };
    } catch (err) {
      console.error(`Error rendering page ${pageNumber}:`, err);
      return null;
    }
  };

  const loadMorePages = async (startPageNumber: number, count: number = 5) => {
    if (!pdfDocRef.current) return;
    
    setIsLoading(true);
    
    const pagesData: PageData[] = [];
    const endPage = Math.min(startPageNumber + count - 1, pdfDocRef.current.numPages);
    
    for (let i = startPageNumber; i <= endPage; i++) {
      // Skip already rendered pages
      if (pages.find(p => p.pageNumber === i)) continue;
      
      const pageData = await renderPage(i);
      if (pageData) pagesData.push(pageData);
    }
    
    setPages(prevPages => [...prevPages, ...pagesData]);
    setIsLoading(false);
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(URL.createObjectURL(file));
      }
    };
  }, [file]);

  return {
    file,
    pages,
    totalPages,
    isLoading,
    error,
    loadFile,
    loadMorePages
  };
};
