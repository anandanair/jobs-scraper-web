import { NextResponse } from "next/server";
import {
  getActiveResumeStyle,
  saveActiveResumeStyle,
  getAllResumeStyles,
  activateResumeStyleById,
  deleteResumeStyleById,
} from "@/lib/supabase/queries";
import { ResumeThemeConfig } from "@/types";

export async function GET() {
  try {
    const [activeStyle, allPresets] = await Promise.all([
      getActiveResumeStyle(),
      getAllResumeStyles(),
    ]);
    return NextResponse.json(
      { success: true, themeConfig: activeStyle, presets: allPresets },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching active resume style:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume style", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, themeConfig, name } = body as {
      action?: "save" | "activate" | "delete";
      id?: string;
      themeConfig?: ResumeThemeConfig;
      name?: string;
    };

    if (action === "activate" && id) {
      const updated = await activateResumeStyleById(id);
      return NextResponse.json(
        { success: true, record: updated, themeConfig: updated.theme_config },
        { status: 200 }
      );
    }

    if (action === "delete" && id) {
      await deleteResumeStyleById(id);
      return NextResponse.json({ success: true, deletedId: id }, { status: 200 });
    }

    // Default: Save new style / persona
    if (!themeConfig || !themeConfig.colors || !themeConfig.typography) {
      return NextResponse.json(
        { error: "Invalid themeConfig payload provided" },
        { status: 400 }
      );
    }

    const savedRecord = await saveActiveResumeStyle(themeConfig, name);
    return NextResponse.json(
      { success: true, record: savedRecord },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error managing resume style:", error);
    return NextResponse.json(
      { error: "Failed to manage resume style", details: error.message },
      { status: 500 }
    );
  }
}
