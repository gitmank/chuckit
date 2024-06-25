import { client } from "@/utilities/connectToRedis";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    try {
        const upvotes = await client.get("upvotes");
        return NextResponse.json({ upvotes }, { status: 200 });
    } catch (error) {
        console.error("GET /upvotes error");
        return NextResponse.error({ status: 500 });
    }
}

export async function POST(req, res) {
    try {
        await client.incr("upvotes");
        const upvotes = await client.get("upvotes");
        return NextResponse.json({ upvotes }, { status: 200 });
    } catch (error) {
        console.error('POST /upvotes error');
        return NextResponse.error({ status: 500 });
    }
}