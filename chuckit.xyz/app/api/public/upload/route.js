import { bucket } from "@/utilities/connectToGCS";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req, res) {
    try {
        // get request data
        const reqData = await req.formData();
        const file = reqData.get("file") || null;
        if (!file) {
            return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
        }
        if (file.size > (10 * 1024 * 1024)) {
            return NextResponse.json({ message: "File size over limit." }, { status: 400 });
        }

        // assign uuid as filename
        const uuid = uuidv4();
        const newFileName = `${uuid.substring(0, 3)}-${uuid.substring(3, 6)}`;
        // clean file name
        const originalName = file.name.replace(/[^a-zA-Z0-9.]/gi, "_");

        // upload file to GCS
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        await bucket.file(newFileName).save(fileBuffer, {
            metadata: {
                cacheControl: "private",
                metadata: {
                    extension: file.name.split(".").pop(),
                    originalName: originalName,
                    contentType: file.type,
                },
            },
        });

        // create pre-signed URL
        const [url] = await bucket.file(newFileName).getSignedUrl({
            action: "read",
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });

        // save url to metadata
        await bucket.file(newFileName).setMetadata({
            metadata: {
                public_url: url,
            },
        });

        return NextResponse.json({ message: "File uploaded.", link: `${process.env.NEXT_PUBLIC_SITE_URL}/${newFileName}` }, { status: 200 });
    } catch (error) {
        console.error("POST /upload error", error);
        return NextResponse.error({ status: 500 });
    }
}