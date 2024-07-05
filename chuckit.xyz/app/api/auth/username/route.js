import { NextResponse } from "next/server";
import { db } from "@/utilities/connectToFirestore";

export async function GET(req, res) {
    try {
        // get username from request
        const url = new URL(req.url.slice())
        const username = url.searchParams.get("username");
        if (!username) {
            return NextResponse.json({ error: "invalid request" }, { status: 400 });
        }
        // check if username is taken
        const userRef = await db.collection("users").doc(username).get();
        if (userRef.exists) {
            return NextResponse.json({ error: "invalid username" }, { status: 404 });
        }
        return NextResponse.json({ status: 200 });
    }
    catch (error) {
        console.error("GET /username error");
        return NextResponse.json({ error: 'internal error' }, { status: 500 });
    }
}