import { client } from "@/utilities/connectToRedis";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    try {
        const url = new URL(req.url.slice())
        const key = url.searchParams.get("key");
        if (!key) {
            return NextResponse.json({ error: "No key provided." }, { status: 400 });
        }
        const upvotes = await client.get(key);
        return NextResponse.json({ upvotes }, { status: 200 });
    } catch (error) {
        console.error("GET /upvotes error");
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

export async function POST(req, res) {
    try {
        const url = new URL(req.url.slice())
        const key = url.searchParams.get("key");
        if (!key) {
            return NextResponse.json({ error: "No key provided." }, { status: 400 });
        }
        await client.incr(key);
        const upvotes = await client.get(key);
        return NextResponse.json({ upvotes }, { status: 200 });
    } catch (error) {
        console.error('POST /upvotes error');
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

export async function PUT(req, res) {
    try {
        const url = new URL(req.url.slice())
        const key = url.searchParams.get("key");
        if (!key) {
            return NextResponse.json({ error: "No key provided." }, { status: 400 });
        }
        const { upvotes } = await req.json();
        await client.set(key, upvotes);
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error('POST /upvotes error');
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}