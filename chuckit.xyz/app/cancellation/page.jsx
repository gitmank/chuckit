export default function RefundPage() {
    return (
        <main className="flex flex-col h-screen w-screen gap-8 justify-start p-10 lg:p-24 items-center">
            <h1 className="text-2xl font-bold">Cancellation & Refund Policy</h1>
            <h3 className="italic text-sm">
                last updated on 13-10-2024 23:29:57
            </h3>
            <p className="text-left">
                The developer, MANOMAY ARUN KAGALKAR, believes in helping its
                customers as far as possible, and therefore has a liberal
                cancellation policy. Under this policy:
            </p>
            <ul className="flex flex-col h-max w-3/4 gap-4 items-center justify-center text-sm">
                <li>
                    • Cancellations can be made at any time when a subscription
                    is active. Users will have access to the features until
                    their current billing cycle ends.
                </li>
                <li>
                    • In case you are dissatisfied with the subscription, please
                    contact us at{" "}
                    <a
                        className="text-blue-500"
                        href="mailto:support@chuckit.xyz"
                    >
                        support@chuckit.xyz
                    </a>{" "}
                    to request a refund within 7 days of your purchase.
                </li>
            </ul>
            <p>
                💙 We would also love to hear your feedback at{" "}
                <a className="text-blue-500" href="hello@chuckit.xyz">
                    hello@chuckit.xyz
                </a>
            </p>
        </main>
    );
}
