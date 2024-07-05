import { NextResponse } from "next/server";
import { db } from "@/utilities/connectToFirestore";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "bruh";
const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    priority: "High",
};
const SESSION_EXPIRY = '30d';

export async function POST(req, res) {
    try {
        // validate token
        const { token } = await req.json();
        const tokenRef = await db.collection("tokens").doc(token);
        let tokenData = await tokenRef.get();
        tokenData = await tokenData.data();
        if (!tokenData || !tokenData.username || !tokenData.email || !tokenData.expiry || tokenData.expiry < new Date().getTime()) {
            await tokenRef.delete();
            return NextResponse.json({ error: "invalid token" }, { status: 400 });
        }
        // set cookie
        const cookie = sign({ username: tokenData.username, email: tokenData.email }, process.env.JWT_SECRET, {
            expiresIn: SESSION_EXPIRY,
        });
        cookies().set(COOKIE_NAME, cookie, COOKIE_OPTIONS);
        // update user data
        const userRef = await db.collection("users").doc(tokenData.username);
        await userRef.update({
            verified: true,
            lastLogin: new Date().getTime(),
        });
        await tokenRef.delete();
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error) {
        console.error("POST /verify error");
        return NextResponse.json({ error: "internal error" }, { status: 500 });
    }
}