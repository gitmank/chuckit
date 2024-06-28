import { NextResponse } from "next/server";
import { bucket } from "@/utilities/connectToGCS";
import { db } from "@/utilities/connectToFirestore";

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
        await db.collection("files").doc(fileCode).update({ accessCount: metadata.accessCount || 0 + 1 });

        // create download URL for client
        const fileObject = bucket.file(`${metadata.name}`);
        const [downloadURL] = await fileObject.getSignedUrl({
            action: "read",
            expires: Date.now() + 1 * 60 * 60 * 1000, // 1 hours
        });

        return NextResponse.json({ downloadURL, metadata });
    } catch (error) {
        console.error("GET /download error");
        return NextResponse.json({ status: 500 });
    }
}