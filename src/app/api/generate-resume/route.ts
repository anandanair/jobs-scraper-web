import { NextRequest, NextResponse } from "next/server";
import { buildPdfBuffer, ResumeInput } from "@/lib/pdf";

export async function POST(request: NextRequest) {
  try {
    const resumeData: ResumeInput = await request.json();
    const pdfBuffer = await buildPdfBuffer(resumeData);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
  } catch (error) {
    console.error("Error generating resume PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
