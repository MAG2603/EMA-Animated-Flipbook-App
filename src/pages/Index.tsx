
import { useState } from "react";
import { Book } from "@/components/Book";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PDFUpload } from "@/components/PDFUpload";
import { usePDF } from "@/hooks/usePDF";
import { Card } from "@/components/ui/card";
import { ThemeProvider } from "@/context/ThemeContext";

const Index = () => {
  const { file, pages, totalPages, isLoading, error, loadFile, loadMorePages } = usePDF();
  
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 container px-4 py-8 flex flex-col">
          <h1 className="text-3xl font-bold text-center mb-2">
            EMA Animated Flipbook
          </h1>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Transform your PDF documents into beautiful, interactive flipbooks with realistic page-turning animations and narration features.
          </p>
          
          {!file ? (
            <Card className="max-w-xl mx-auto w-full p-6">
              <PDFUpload onFileLoad={loadFile} />
            </Card>
          ) : isLoading && pages.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10">
              <div className="relative w-16 h-16">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                  <img
                    src="/lovable-uploads/765fbca0-bc8e-4eae-b6ea-75503433f8c2.png"
                    alt="EMA Loading"
                    className="w-10 h-10 rounded-full object-cover animate-pulse"
                  />
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">Loading your PDF...</p>
            </div>
          ) : error ? (
            <Card className="max-w-xl mx-auto w-full p-6 border-destructive">
              <div className="text-center text-destructive">
                <h3 className="text-lg font-semibold mb-2">Error Loading PDF</h3>
                <p>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-primary underline"
                >
                  Try Again
                </button>
              </div>
            </Card>
          ) : (
            <div className="flex flex-col items-center">
              <Card className="w-full overflow-hidden p-2 mb-4">
                <Book
                  pages={pages}
                  totalPages={totalPages}
                  onLoadMorePages={loadMorePages}
                />
              </Card>
              
              <div className="text-center text-sm text-muted-foreground mt-2">
                <p>
                  Tip: Click the page edges to flip, or use the navigation controls below.
                </p>
              </div>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
