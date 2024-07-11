import { NextResponse } from "next/server";
import { db } from "@/utilities/connectToFirestore";

const TOKEN_SIZE = 16;
const TOKEN_EXPIRY = 10 * 60 * 1000; // 10 minutes

export async function POST(req, res) {
    try {
        return NextResponse.json({ error: "not implemented" }, { status: 501 });
        // validate email
        const { email } = await req.json();
        const emailRef = await db.collection("users").where("email", "==", email).get();
        if (!email || !emailRef.docs.length) {
            return NextResponse.json({ error: "invalid details" }, { status: 400 });
        }
        // create token and user, save to db
        const username = emailRef.docs[0].id;
        const token = await generateToken(username, email);
        // send email
        await sendMail(username, email, token);
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error) {
        console.error("POST /login error");
        return NextResponse.json({ error: "internal error" }, { status: 500 });
    }
}

const generateToken = async (username, email) => {
    const crypto = require("crypto");
    const token = crypto.randomBytes(TOKEN_SIZE).toString("hex");
    const tokenRef = await db.collection("tokens").doc(token);
    await tokenRef.set({
        email,
        username,
        token,
        expiry: new Date().getTime() + TOKEN_EXPIRY,
    });
    return token;
}

const MAIL_PROVIDER = "gmail";
const MAIL_FROM = "chuckit.xyz";

const sendMail = async (username, email, token) => {
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
        service: MAIL_PROVIDER,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });
    const mailOptions = {
        from: MAIL_FROM,
        to: email,
        subject: `${username}, confirm your email`,
        html: generateEmailBody(username, token),
    };
    await transporter.sendMail(mailOptions);
}

const generateEmailBody = (username, token) => {
    return `<html>
        <body>
            <p style="font-weight: 700;">Hey ${username} 👋,</p>
            <br>
            <p>Use the link below to login with your email:</p>
            <br>
            <p><a href="https://chuckit.xyz/verify?token=${token}">Click here</a> or paste the link below into a browser.</p>
            <p>https://chuckit.xyz/verify?token=${token}</p>
            <br>
            <p>happy sharing!</p>
            <p style="color: dodgerblue;">chuckit.xyz 📁📤</p>
            <br>
            <p>P.S. You can safely ignore this message if the request wasn't initiated by you. The link will expire in the next 15 minutes.</p>
        </body>
    </html>`
}