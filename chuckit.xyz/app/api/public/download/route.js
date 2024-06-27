import { NextResponse } from "next/server";
import { bucket } from "@/utilities/connectToGCS";

export async function GET(req, res) {
    try {
        // get file name from request
        const url = new URL(req.url.slice())
        const fileName = url.searchParams.get("file");
        if (!fileName) {
            return NextResponse.json({ message: "No file name provided." }, { status: 400 });
        }
        if (!fileName) {
            return NextResponse.json({ message: "No file name provided." }, { status: 400 });
        }

        // get file metadata from GCS
        const [metadata] = await bucket.file(fileName).getMetadata();
        if (!metadata) {
            return NextResponse.json({ message: "File not found." }, { status: 404 });
        }

        // download file
        const [fileBuffer] = await bucket.file(fileName).download({
            validation: "md5",
        });

        // send file as response
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": metadata.metadata.contentType,
                "Content-Disposition": `attachment; filename=${metadata.metadata?.originalName || `chuckit-${fileName}`}`,
                "X-public-url": metadata.metadata?.public_url || "",
            },
        });
    } catch (error) {
        console.error("GET /download error");
        return NextResponse.json({ status: 500 });
    }
}