import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Get the absolute path to the init.sql file
    const filePath = path.join(
      process.cwd(),
      "src",
      "lib",
      "supabase",
      "init.sql"
    );

    // Read the file content
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Return the SQL content as JSON
    return NextResponse.json({ sql: fileContent });
  } catch (error) {
    console.error("Error reading init.sql file:", error);
    return NextResponse.json(
      { error: "Failed to read SQL file" },
      { status: 500 }
    );
  }
}
