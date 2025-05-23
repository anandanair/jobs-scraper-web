"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useRouter } from "next/navigation";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface CustomPdfViewerProps {
  fileUrl: string;
}

export default function CustomPdfViewer({ fileUrl }: CustomPdfViewerProps) {
  const router = useRouter();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.1);
  const [thumbnails, setThumbnails] = useState<number[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const viewerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const [effectiveFileUrl, setEffectiveFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (fileUrl) {
      const urlWithTimestamp = `${fileUrl}?t=${Date.now()}`;
      setEffectiveFileUrl(urlWithTimestamp);
      setIsLoading(true);
      setNumPages(null);
      setPageNumber(1);
      setPdfError(null);
      setThumbnails([]);
    } else {
      setEffectiveFileUrl(null);
      setIsLoading(false);
    }
  }, [fileUrl]);

  useEffect(() => {
    if (numPages) {
      setThumbnails(Array.from({ length: numPages }, (_, i) => i + 1));
    }
  }, [numPages]);

  useEffect(() => {
    console.log("PDF loading state:", {
      isLoading,
      numPages,
      pageNumber,
      pdfError,
      currentUrl: effectiveFileUrl,
    });
  }, [isLoading, numPages, pageNumber, pdfError, effectiveFileUrl]);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages: nextNumPages }: { numPages: number }) => {
      console.log("PDF loaded successfully with", nextNumPages, "pages");
      setNumPages(nextNumPages);
      setIsLoading(false);
      setPdfError(null);
    },
    []
  );

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("Failed to load PDF:", error);
    setPdfError(
      `Failed to load PDF document. Please ensure the link is correct and the file is accessible. ${error.message}`
    );
    setIsLoading(false);
    setNumPages(null);
  }, []);

  const goToPage = (page: number) => {
    setPageNumber(page);
    if (viewerRef.current) {
      viewerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 3));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  const resetZoom = () => {
    setScale(1);
  };

  const handleEditClick = () => {
    router.push(`${window.location.pathname}/edit`);
  };

  const onClose = () => {
    router.back();
  };

  const handleDownload = () => {
    if (effectiveFileUrl) {
      let fileName = fileUrl.split("/").pop() || "document.pdf";
      fileName = fileName.replace(/\.[^/.]+$/, "") + ".pdf";

      fetch(effectiveFileUrl.split("?")[0])
        .then((response) => response.blob())
        .then((blob) => {
          const pdfBlob = new Blob([blob], {
            type: "application/pdf",
          });

          const blobUrl = window.URL.createObjectURL(pdfBlob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = fileName;
          link.setAttribute("type", "application/pdf");

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
          }, 100);
        })
        .catch((error) => {
          console.error("Error downloading PDF:", error);
        });
    }
  };

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (pageRef.current && viewerRef.current) {
        const pageHeight = pageRef.current.scrollHeight;
        const viewerHeight = viewerRef.current.clientHeight;

        const isAtTop = viewerRef.current.scrollTop === 0;
        const isAtBottom =
          viewerRef.current.scrollTop + viewerHeight >=
          viewerRef.current.scrollHeight - 10;

        if (
          pageHeight <= viewerHeight ||
          (e.deltaY > 0 && isAtBottom) ||
          (e.deltaY < 0 && isAtTop)
        ) {
          e.preventDefault();

          if (e.deltaY > 0 && pageNumber < (numPages || 1)) {
            goToPage(pageNumber + 1);
          } else if (e.deltaY < 0 && pageNumber > 1) {
            goToPage(pageNumber - 1);
          }
        }
      }
    };

    const viewer = viewerRef.current;
    if (viewer) {
      viewer.addEventListener("wheel", handleScroll, { passive: false });
    }

    return () => {
      if (viewer) {
        viewer.removeEventListener("wheel", handleScroll);
      }
    };
  }, [pageNumber, numPages]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!fileUrl) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 text-center max-w-md">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium">
            No PDF file URL provided.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!effectiveFileUrl && isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
            Loading PDF...
          </p>
        </div>
      </div>
    );
  }

  if (!effectiveFileUrl && !isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 text-center max-w-md">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium">
            PDF URL is invalid or could not be processed.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Modern Top Toolbar */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 py-3 px-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Page Navigation */}
            <div className="flex items-center space-x-2 bg-gray-100/50 dark:bg-gray-700/30 rounded-xl px-3 py-2 backdrop-blur-sm">
              <button
                onClick={() => goToPage(Math.max(1, pageNumber - 1))}
                disabled={pageNumber <= 1 || isLoading}
                className="p-1.5 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="flex items-center min-w-[120px] justify-center">
                <input
                  type="number"
                  min={1}
                  max={numPages || 1}
                  value={pageNumber}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page && page >= 1 && page <= (numPages || 1)) {
                      goToPage(page);
                    }
                  }}
                  className="w-12 p-1 text-center border-0 bg-white/80 dark:bg-gray-600/50 rounded-lg text-sm font-medium text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:outline-none backdrop-blur-sm"
                />
                <span className="mx-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                  of
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {numPages || "--"}
                </span>
              </div>

              <button
                onClick={() =>
                  goToPage(Math.min(numPages || 1, pageNumber + 1))
                }
                disabled={pageNumber >= (numPages || 0) || isLoading}
                className="p-1.5 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 bg-gray-100/50 dark:bg-gray-700/30 rounded-xl px-3 py-2 backdrop-blur-sm">
              <button
                onClick={zoomOut}
                disabled={scale <= 0.5}
                className="p-1.5 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>

              <button
                onClick={resetZoom}
                className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/50 rounded-lg transition-all duration-200 min-w-[50px]"
              >
                {Math.round(scale * 100)}%
              </button>

              <button
                onClick={zoomIn}
                disabled={scale >= 3}
                className="p-1.5 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={!effectiveFileUrl || isLoading}
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download PDF"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleEditClick}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              Edit
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-200/80 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300/80 dark:hover:bg-gray-600/50 transition-all duration-200 font-medium backdrop-blur-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Modern Sidebar */}
        {showSidebar && (
          <div className="w-56 lg:w-64 flex-shrink-0 overflow-y-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/50 shadow-xl">
            {(isLoading || (!numPages && !pdfError)) && effectiveFileUrl ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-3 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
              </div>
            ) : pdfError ? (
              <div className="p-4 text-xs text-red-500 dark:text-red-400 text-center">
                Error loading thumbnails.
              </div>
            ) : (
              numPages &&
              effectiveFileUrl &&
              thumbnails.length > 0 && (
                <div className="p-3 space-y-3">
                  {thumbnails.map((pageIdx) => (
                    <div
                      key={`thumb-${pageIdx}`}
                      onClick={() => goToPage(pageIdx)}
                      className={`cursor-pointer p-3 rounded-xl transition-all duration-200 group ${
                        pageNumber === pageIdx
                          ? "ring-2 ring-blue-500/50 bg-blue-50/80 dark:bg-blue-900/20 shadow-lg backdrop-blur-sm"
                          : "hover:bg-gray-100/60 dark:hover:bg-gray-700/30 hover:shadow-md backdrop-blur-sm"
                      }`}
                    >
                      <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-200">
                        <Document
                          file={effectiveFileUrl}
                          className="thumbnail-document"
                          loading={
                            <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 animate-pulse rounded-lg"></div>
                          }
                        >
                          <Page
                            pageNumber={pageIdx}
                            width={160}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                          />
                        </Document>
                        <div className="mt-2 text-center text-xs text-gray-600 dark:text-gray-300 font-medium">
                          Page {pageIdx}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {/* PDF Document Area */}
        <div
          ref={viewerRef}
          className="flex-1 overflow-auto p-6 flex justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
        >
          {pdfError && (
            <div className="flex items-center justify-center h-full p-4">
              <div className="max-w-lg p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50">
                <div className="text-red-600 dark:text-red-400 text-center mb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-800 dark:text-gray-200 text-center font-medium">
                  {pdfError}
                </p>
              </div>
            </div>
          )}

          {!pdfError && effectiveFileUrl && (
            <div
              className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-2 border border-white/20 dark:border-gray-700/50 ${
                isLoading &&
                "flex justify-center items-center w-full min-h-[600px]"
              }`}
              ref={pageRef}
            >
              <Document
                file={effectiveFileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
              >
                {isLoading && !pdfError ? (
                  <div className="text-center p-12">
                    <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">
                      Loading PDF...
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                      Please wait while we prepare your document
                    </p>
                  </div>
                ) : !isLoading && !pdfError && numPages ? (
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Page
                      key={`page_${pageNumber}_${scale}`}
                      pageNumber={pageNumber}
                      scale={scale}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="pdf-page"
                    />
                  </div>
                ) : null}
              </Document>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
