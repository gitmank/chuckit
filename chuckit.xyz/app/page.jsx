import Image from "next/image";
import UpvotePanel from "@/components/UpvotePanel";

export default function Home() {
  return (
    <main
      id="home-main"
      className="flex min-h-screen w-screen flex-col items-center justify-between p-8"
    >
      <nav className="flex flex-row w-full h-max p-4 justify-between items-center self-start">
        <div className="flex flex-row items-center gap-4">
          <Image
            src="/logo.png"
            alt="Chuckit"
            width={36}
            height={36}
            className="h-full rounded-lg"
          />
          <h1 className="text-2xl font-bold text-blue-400">chuckit.xyz</h1>
        </div>
        <a href="/demo" className="text-2xl font-bold text-blue-400">
          try v0.1.0
        </a>
      </nav>
      <section className="flex flex-col items-center text-center gap-16">
        <h2 className="text-4xl font-bold text-blue-400">
          chuck files across devices and continents!
        </h2>
        <UpvotePanel />
      </section>
      <section className="flex flex-row items-center text-base text-gray-400">
        <p>idea by&nbsp;</p>
        <a target="_blank" className="underline" href="https://manomay.co">
          mank
        </a>
        <p>&nbsp;for&nbsp;</p>
        <a target="_blank" className="underline" href="https://buildspace.so">
          n&w s5
        </a>
      </section>
    </main>
  );
}
