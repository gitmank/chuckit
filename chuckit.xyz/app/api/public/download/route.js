import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/utilities/connectToGCS";

export async function GET(req, res) {
    try {
        // get file name from request
        const url = req.url.slice();
        const fileName = url.split("?").pop().split("&").pop().split("=").pop()
        if (!fileName) {
            return NextResponse.json({ message: "No file name provided." }, { status: 400 });
        }

        // get file metadata from GCS
        const [metadata] = await bucket.file(fileName).getMetadata();
        if (!metadata) {
            return NextResponse.json({ message: "File not found." }, { status: 404 });
        }

        // download file
        const fileBuffer = await bucket.file(fileName).download();

        // send file as response
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": metadata.metadata?.contentType || 'text/plain',
                "Content-Disposition": `attachment; filename="${metadata.metadata?.originalName || `chuckit-${fileName}`}"`,
                "X-public-url": metadata.metadata?.public_url || null,
            },
        });
    } catch (error) {
        console.error("GET /download error", error);
        return NextResponse.json({ status: 500 });
    }
}