'use client'
import { useState, useEffect } from "react"

const KEY = "upvotes"

export default function UpvotePanel() {
    const [upvotes, setUpvotes] = useState(0)

    useEffect(() => {
        const fetchUpvotes = async () => {
            const res = await fetch(`/api/public/upvote`)
            const data = await res.json()
            setUpvotes(data.upvotes)
        }

        fetchUpvotes()
    }, [])

    const handleUpvote = async () => {
        const res = await fetch(`/api/public/upvote`, { method: "POST" })
        const data = await res.json()
        setUpvotes(data.upvotes)
    }

    return (
        <div className="flex flex-col justify-center items-center text-center gap-4">
            <button onClick={handleUpvote} className="text-xl animate-pulse font-bold bg-blue-400 text-white p-2 px-3 rounded-md">🔼 upvote</button>
            <h2 className="text-2xl font-bold text-blue-400">{upvotes || 'many'} others liked this idea</h2>
        </div>
    )
}
