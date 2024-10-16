import { bucket } from "@/utilities/connectToGCS";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utilities/connectToFirestore";

const UPLOAD_LIMIT = 900 * 1024 * 1024; // 900MB
const words = ["desk", "bike", "cast", "rays", "cool", "blue", "sand", "oats", "wave", "hook", "ball", "taps", "road", "fish", "chip", "rust", "pool", "lake", "boat", "ship"]
const DEFAULT_QUOTA = 10;
const URL_EXPIRY = 2 * 60 * 1000; // 2 minutes
const DOWNLOAD_LIMIT = 50;

export async function POST(req, res) {
    try {
        // validate request data
        const reqData = await req.json();
        const { name, size, type, extension, iv } = reqData;
        if (!name || !size || !type || !extension || !iv) {
            return NextResponse.json({ error: "Missing request data." }, { status: 400 });
        }
        if (size > UPLOAD_LIMIT) {
            return NextResponse.json({ error: "File too large." }, { status: 400 });
        }

        // create filename and alias
        const uuid = uuidv4();
        const fileCode = `${words[new Date().getTime() % 20]}-${uuid.slice(0, 4)}`;
        const cleanFileName = `${name.split('.')[0].replace(/[^a-z0-9.-_+]/gi, "_")}-${uuid.slice(-8)}.${extension}`;

        // create upload URL for client
        const fileObject = bucket.file(`${cleanFileName}`);
        const [uploadURL] = await fileObject.getSignedUrl({
            version: "v4",
            action: "write",
            expires: new Date().getTime() + URL_EXPIRY,
            contentType: 'application/octet-stream',
            extensionHeaders: {
                "x-upload-content-length": size,
            },
        });

        // update IP rate limit quota
        const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || req.connection?.remoteAddress || '0.0.0.0';
        const ipRef = db.collection("ip").doc(ip);
        const ipDoc = await ipRef.get();
        if (ipDoc.exists) {
            const data = ipDoc.data();
            if (data.blockedUntil > new Date().getTime()) {
                const timeLeft = (data.blockedUntil - new Date().getTime()) / 1000;
                return NextResponse.json({ error: `rate limit: try after ${(timeLeft / 60).toFixed(0)} mins` }, { status: 429, headers: { "Retry-After": timeLeft } });
            }
            if (data.quota <= 1) {
                await ipRef.update({ blockedUntil: new Date().getTime() + 4 * 60 * 60 * 1000 }); // 4 hour
                await ipRef.update({ quota: DEFAULT_QUOTA });
            } else {
                await ipRef.update({ count: data.count + 1, quota: data.quota - 1 });
            }
        } else {
            await ipRef.set({
                count: 1,
                quota: DEFAULT_QUOTA,
                blockedUntil: new Date().getTime(),
            });
        }

        // update file metadata in db
        const fileRef = db.collection("files").doc(fileCode);
        await fileRef.set({
            name: cleanFileName,
            size: size,
            type: type,
            extension: extension,
            iv: iv,
            code: fileCode,
            ip: ip,
            timestamp: new Date(),
            downloads: DOWNLOAD_LIMIT,
            passcode: "",
        });

        return NextResponse.json({ uploadURL, fileCode });
    } catch (error) {
        console.error("POST /upload error", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}