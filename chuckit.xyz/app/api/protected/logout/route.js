import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const EMAIL_HEADER = "x-csrf-email";
const COOKIE_NAME = "bruh";

export async function POST(req, res) {
    try {
        const csrf_email = req.headers.get(EMAIL_HEADER);
        const { csrf_username } = await req.json();
        // validate token
        const token = cookies().get(COOKIE_NAME)?.value;
        if (!token || !csrf_email || !csrf_username) {
            return NextResponse.json({ error: "invalid token" }, { status: 400 });
        }
        // get user data
        const { username, email } = verify(token, process.env.JWT_SECRET);
        if (username !== csrf_username || email !== csrf_email) {
            return NextResponse.json({ error: "invalid request" }, { status: 400 });
        }
        // delete cookie
        cookies().delete(COOKIE_NAME);
        return NextResponse.json({ message: "logged out" }, { status: 200 });
    } catch (error) {
        console.error("POST /logout error");
        return NextResponse.json({ error: "internal error" }, { status: 500 });
    }
}