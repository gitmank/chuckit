import { NextResponse } from "next/server";
import { db } from "@/utilities/connectToFirestore";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "bruh";

export async function GET(req, res) {
    try {
        // validate token
        const token = cookies().get(COOKIE_NAME)?.value;
        if (!token) {
            return NextResponse.json({ error: "Invalid token." }, { status: 400 });
        }
        // get user data
        const { username, email } = verify(token, process.env.JWT_SECRET);
        const userRef = await db.collection("users").doc(username);
        const userData = await userRef.get().then((doc) => doc.data());
        const user = {
            username: userData.username,
            email: userData.email,
            lastLogin: userData.lastLogin,
        }
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error("GET /user error");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}