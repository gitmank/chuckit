import Image from "next/image";

export default function Home() {
  return (
    <main id="home-main" className="flex min-h-screen w-screen flex-col items-center justify-between p-8">
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
        <h1 className="text-2xl font-bold text-blue-400">v0.0.0</h1>
      </nav>
      <section className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-4xl font-bold text-blue-400">chuck files across devices and continents!</h2>
        <p className="text-xl text-gray-400">v0.1.0 coming soon</p>
      </section>
      {/* <section className="flex flex-col items-center gap-8">
        <button className="text-xl font-bold bg-blue-400 text-white p-4 rounded-md">get notified!</button>
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-sm text-gray-400">get exactly one email when we release our public beta,</p>
          <p className="text-sm text-gray-400">after which we'll delete your contact permanently</p>
        </div>
      </section> */}
      <section className="flex flex-row items-center text-base text-gray-400">
        <p>idea by&nbsp;</p>
        <a target="_blank" className="underline" href="https://manomay.co">mank</a>
        <p>&nbsp;for&nbsp;</p>
        <a target="_blank" className="underline" href="https://buildspace.so">n&w s5</a>
      </section>
    </main>
  );
}
