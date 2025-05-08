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
      // Generate a new URL with timestamp when fileUrl changes or on initial mount
      const urlWithTimestamp = `${fileUrl}?t=${Date.now()}`;
      setEffectiveFileUrl(urlWithTimestamp);

      // Reset states for the new PDF
      setIsLoading(true);
      setNumPages(null);
      setPageNumber(1); // Go to first page for new/reloaded PDF
      setPdfError(null);
      setThumbnails([]); // Clear old thumbnails
    } else {
      setEffectiveFileUrl(null); // Handle cases where fileUrl might be initially null/undefined
      setIsLoading(false); // Not loading if no URL
    }
  }, [fileUrl]); // Re-run ONLY when the fileUrl prop changes (and on initial mount)

  // Generate thumbnail array when numPages is set
  useEffect(() => {
    if (numPages) {
      setThumbnails(Array.from({ length: numPages }, (_, i) => i + 1));
    }
  }, [numPages]);

  // Debug log to track loading state
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
    setNumPages(null); // Clear numPages on error
  }, []);

  const goToPage = (page: number) => {
    setPageNumber(page);
    // Smooth scroll to the top of the viewer when changing pages
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

  // Download PDF function
  const handleDownload = () => {
    if (effectiveFileUrl) {
      // Extract filename from URL or use a default name
      let fileName = fileUrl.split("/").pop() || "document.pdf";

      // Ensure the filename ends with .pdf (remove any existing extension first)
      fileName = fileName.replace(/\.[^/.]+$/, "") + ".pdf";

      // Fetch the PDF as a blob
      fetch(effectiveFileUrl.split("?")[0])
        .then((response) => response.blob())
        .then((blob) => {
          // Create a blob URL with explicit PDF MIME type
          const pdfBlob = new Blob([blob], {
            type: "application/pdf",
          });

          const blobUrl = window.URL.createObjectURL(pdfBlob);

          // Create download link with forced PDF extension
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = fileName;

          // Set additional attributes to force download
          link.setAttribute("type", "application/pdf");

          // Trigger download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up
          setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
          }, 100);
        })
        .catch((error) => {
          console.error("Error downloading PDF:", error);
        });
    }
  };

  // Handle scroll-based page navigation
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      // Only handle scroll navigation if the page isn't tall enough to scroll
      if (pageRef.current && viewerRef.current) {
        const pageHeight = pageRef.current.scrollHeight; // Use scrollHeight instead of clientHeight
        const viewerHeight = viewerRef.current.clientHeight;

        // If the page is taller than the viewer (needs scrolling), check if we're at boundaries
        const isAtTop = viewerRef.current.scrollTop === 0;
        const isAtBottom =
          viewerRef.current.scrollTop + viewerHeight >=
          viewerRef.current.scrollHeight - 10;

        // Only navigate pages if:
        // 1. The page fits entirely in the viewer (no scrolling needed) OR
        // 2. We're at the top/bottom of the scrollable area AND scrolling in that direction
        if (
          pageHeight <= viewerHeight || // Page fits entirely (no scrolling needed)
          (e.deltaY > 0 && isAtBottom) || // Scrolling down at bottom
          (e.deltaY < 0 && isAtTop) // Scrolling up at top
        ) {
          // Only prevent default and change pages if we're at a boundary
          e.preventDefault();

          // Scroll down - go to next page
          if (e.deltaY > 0 && pageNumber < (numPages || 1)) {
            goToPage(pageNumber + 1);
          }
          // Scroll up - go to previous page
          else if (e.deltaY < 0 && pageNumber > 1) {
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

  // ESC key handler
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

  // Initial check if the base fileUrl is provided
  if (!fileUrl) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center">
          <p className="text-red-600">No PDF file URL provided.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Now, ensure effectiveFileUrl is ready before rendering the Document components
  if (!effectiveFileUrl && isLoading) {
    // Show a general loading indicator if effectiveFileUrl is not yet set
    // (e.g. fileUrl was just provided and useEffect is about to run)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (!effectiveFileUrl && !isLoading) {
    // This case might happen if fileUrl was initially null and then provided,
    // but something went wrong, or if fileUrl is an empty string.
    // Or, if fileUrl was valid, then became invalid.
    // Essentially, if we're not loading and don't have a URL to use.
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center">
          <p className="text-red-600">
            PDF URL is invalid or could not be processed.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Top toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-2 px-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-2">
          {/* Sidebar toggle */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Page navigation */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => goToPage(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1 || isLoading}
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center min-w-[100px]">
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
                className="w-12 p-1 text-center border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-200"
              />
              <span className="mx-1 text-gray-700 dark:text-gray-200">of</span>
              <span className="text-gray-700 dark:text-gray-200">
                {numPages || "--"}
              </span>
            </div>

            <button
              onClick={() => goToPage(Math.min(numPages || 1, pageNumber + 1))}
              disabled={pageNumber >= (numPages || 0) || isLoading}
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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

          {/* Zoom controls */}
          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
              className="px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              {Math.round(scale * 100)}%
            </button>

            <button
              onClick={zoomIn}
              disabled={scale >= 3}
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={!effectiveFileUrl || isLoading}
            className="ml-4 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download PDF"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        <div className="flex items-center space-x-2">
          <button
            onClick={handleEditClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <div className="w-48 lg:w-56 flex-shrink-0 overflow-y-auto bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {/* Show spinner for thumbnails if main doc is loading, or if no pages yet and no error */}
            {(isLoading || (!numPages && !pdfError)) && effectiveFileUrl ? (
              <div className="flex items-center justify-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
              </div>
            ) : pdfError ? (
              <div className="p-4 text-xs text-red-500 text-center">
                Error loading thumbnails.
              </div>
            ) : (
              numPages &&
              effectiveFileUrl &&
              thumbnails.length > 0 && ( // Ensure thumbnails are ready
                <div className="p-2">
                  {thumbnails.map((pageIdx) => (
                    <div
                      key={`thumb-${pageIdx}`}
                      onClick={() => goToPage(pageIdx)}
                      className={`cursor-pointer p-2 mb-2 rounded-md transition-colors ${
                        pageNumber === pageIdx
                          ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="bg-white dark:bg-gray-700 p-1 rounded shadow-sm">
                        <Document
                          file={effectiveFileUrl} // USE effectiveFileUrl
                          className="thumbnail-document"
                          loading={
                            <div className="h-32 bg-gray-200 dark:bg-gray-600 animate-pulse rounded"></div>
                          }
                        >
                          <Page
                            pageNumber={pageIdx}
                            width={150}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                          />
                        </Document>
                        <div className="mt-1 text-center text-xs text-gray-600 dark:text-gray-300">
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

        {/* PDF document area */}
        <div
          ref={viewerRef}
          className="flex-1 overflow-auto p-4 flex justify-center bg-gray-100 dark:bg-gray-900"
        >
          {pdfError && (
            <div className="flex items-center justify-center h-full p-4">
              <div className="max-w-lg p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="text-red-600 dark:text-red-400 text-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className="text-gray-800 dark:text-gray-200 text-center">
                  {pdfError}
                </p>
              </div>
            </div>
          )}

          {!pdfError && effectiveFileUrl && (
            <div
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 ${
                isLoading && "flex justify-center items-center w-full" // This class applies during loading
              }`}
              ref={pageRef}
            >
              <Document
                file={effectiveFileUrl} // USE effectiveFileUrl
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
              >
                {
                  isLoading && !pdfError ? ( // If still loading and no error, show spinner
                    <div className="text-center p-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600 dark:text-gray-300">
                        Loading PDF...
                      </p>
                    </div>
                  ) : !isLoading && !pdfError && numPages ? ( // If loaded, no error, and have pages
                    <Page
                      key={`page_${pageNumber}_${scale}`} // Key change on scale might help re-render if zoom has issues
                      pageNumber={pageNumber}
                      scale={scale}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="pdf-page"
                    />
                  ) : null /* No page content if error or not loaded */
                }
              </Document>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
