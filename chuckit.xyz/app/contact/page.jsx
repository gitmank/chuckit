export default function ContactPage() {
    return (
        <main className="flex flex-col h-screen w-screen gap-8 justify-start p-10 lg:p-24 items-center">
            <h1 className="text-2xl font-bold">Contact</h1>
            <h3 className="italic text-sm">
                last updated on 13-10-2024 23:29:57
            </h3>
            <p className="text-left">
                You may contact the developer using the information below:
            </p>
            <div className="flex flex-col h-max gap-2">
                <p>Legal entity name: MANOMAY ARUN KAGALKAR</p>
                <p>
                    Registered Address: [REDACTED FOR PRIVACY], ISRO Layout,
                    Bangalore, Karnataka, PIN: 560078
                </p>
                <p>
                    Email:{" "}
                    <a
                        href="mailto:support@chuckit.xyz"
                        className="text-blue-500"
                    >
                        support@chuckit.xyz
                    </a>
                </p>
            </div>
        </main>
    );
}
