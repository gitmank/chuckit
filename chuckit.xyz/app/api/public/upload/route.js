import { bucket } from "@/utilities/connectToGCS";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
const stream = require("stream");

export async function POST(req, res) {
    try {
        // get request data
        const reqData = await req.formData();
        const file = reqData.get("file") || null;
        if (!file) {
            return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
        }
        if (file.size > (100 * 1024 * 1024)) {
            return NextResponse.json({ message: "File size over limit." }, { status: 400 });
        }

        // assign uuid as filename
        const uuid = uuidv4();
        const newFileName = `${uuid.substring(0, 3)}-${uuid.substring(3, 6)}`;
        // clean file name
        const originalName = file.name.replace(/[^a-zA-Z0-9.]/gi, "_");

        // upload file to GCS
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileObject = bucket.file(newFileName);

        const bufferStream = new stream.PassThrough();
        bufferStream.write(fileBuffer);
        bufferStream.end();

        const uploadFile = async () => {
            return new Promise((resolve, reject) => {
                bufferStream.pipe(fileObject.createWriteStream({
                    metadata: {
                        cacheControl: "private",
                        metadata: {
                            extension: file.name.split(".").pop(),
                            originalName: originalName,
                            contentType: file.type,
                        },
                    },
                }).on("finish", () => {
                    console.log("File uploaded.");
                    resolve();
                }));
            });
        }

        await uploadFile().then(() => {
            console.log("File uploaded.");
        }).catch((error) => {
            console.error("File upload error", error);
            return NextResponse.error({ status: 500 });
        });

        return NextResponse.json({ message: "File uploaded.", link: `${process.env.NEXT_PUBLIC_SITE_URL}/${newFileName}` }, { status: 200 });
    } catch (error) {
        console.error("POST /upload error", error);
        return NextResponse.error({ status: 500 });
    }
}