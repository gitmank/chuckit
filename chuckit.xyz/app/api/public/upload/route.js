import { bucket } from "@/utilities/connectToGCS";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utilities/connectToFirestore";

const UPLOAD_LIMIT = 20 * 1024 * 1024; // 20MB
const words = ["pike", "bike", "cast", "rays", "cool", "blue", "sand", "oats", "wave", "hook"]

export async function POST(req, res) {
    try {
        // validate request data
        const reqData = await req.json();
        const { name, size, type, extension } = reqData;
        if (!name || !size) {
            return NextResponse.json({ error: "Missing request data." }, { status: 400 });
        }
        if (size > UPLOAD_LIMIT) {
            return NextResponse.json({ error: "File too large." }, { status: 400 });
        }

        // create filename and alias
        const uuid = uuidv4();
        const fileCode = `${words[new Date().getTime() % 10]}-${uuid.substring(0, 4)}`;
        const cleanFileName = `${name.split('.')[0].replace(/[^a-z0-9.-_+]/gi, "_")}-${uuid.substring(0, 4)}.${extension}`;

        // create upload URL for client
        const fileObject = bucket.file(`${cleanFileName}`);
        const [uploadURL] = await fileObject.getSignedUrl({
            action: "write",
            expires: Date.now() + 1 * 60 * 1000, // 1 minute
            contentType: type,
        });

        // update IP rate limit quota
        const DEFAULT_QUOTA = 8;
        const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || req.connection.remoteAddress || '0.0.0.0';
        const ipRef = db.collection("ip").doc(ip);
        const ipDoc = await ipRef.get();
        if (ipDoc.exists) {
            const data = ipDoc.data();
            if (data.blockedUntil > new Date().getTime()) {
                const timeLeft = (data.blockedUntil - new Date().getTime()) / 1000;
                return NextResponse.json({ error: "You have been rate limited." }, { status: 400, headers: { "Retry-After": timeLeft } });
            }
            if (data.quota <= 1) {
                await ipRef.update({ blockedUntil: new Date().getTime() + 4 * 60 * 60 * 1000 }); // 1 hour
                await ipRef.update({ quota: DEFAULT_QUOTA });
            }
            await ipRef.update({ count: data.count + 1, quota: data.quota - 1 });
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
            newFileName: fileCode,
            ip: ip,
            timestamp: new Date(),
            accessCount: 0,
            passcode: "",
        });

        return NextResponse.json({ uploadURL, fileCode });
    } catch (error) {
        console.error("POST /upload error");
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}