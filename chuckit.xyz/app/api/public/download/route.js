import { NextResponse } from "next/server";
import { bucket } from "@/utilities/connectToGCS";
import { db } from "@/utilities/connectToFirestore";

const URL_EXPIRY = 2 * 60 * 1000; // 2 minutes

export async function GET(req, res) {
    try {
        // get file name from request
        const url = new URL(req.url.slice())
        const fileCode = url.searchParams.get("code");
        if (!fileCode) {
            return NextResponse.json({ error: "No file name provided." }, { status: 400 });
        }

        // get file metadata from db
        const doc = await db.collection("files").doc(fileCode).get();
        const metadata = doc?.data() || null;
        if (!metadata) {
            return NextResponse.json({ error: "File not found." }, { status: 404 });
        }
        await db.collection("files").doc(fileCode).update({ downloads: (metadata.downloads || 50) - 1 });

        // rate limit downloads
        if (metadata.downloads < 1) {
            return NextResponse.json({ error: "File access blocked." }, { status: 429 });
        }

        // create download URL for client
        const fileObject = bucket.file(`${metadata.name}`);
        const [downloadURL] = await fileObject.getSignedUrl({
            action: "read",
            expires: new Date().getTime() + URL_EXPIRY,
        });

        return NextResponse.json({ downloadURL, metadata });
    } catch (error) {
        console.error("GET /download error");
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}