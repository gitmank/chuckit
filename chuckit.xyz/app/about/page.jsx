import UpvotePanel from "@/components/UpvotePanel";
import NavBar from "@/components/NavBar";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <NavBar />
      <main className="container h-screen mx-auto p-4 flex flex-col justify-center gap-8 bg-[url('/hero.png')]">
        <section className="flex flex-col items-center text-center gap-16">
          <h2 className="text-3xl w-11/12 md:text-4xl font-bold text-blue-400">
            chuck files across devices and continents!
          </h2>
          <a
            href="/"
            className="text-2xl font-bold text-white bg-blue-500 px-2 p-1 hover:bg-blue-600"
          >
            try v0.2.1 now
          </a>
          <UpvotePanel />
        </section>
        <section className="flex flex-row items-center text-base text-gray-400 mx-auto">
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
    </div>
  );
}
