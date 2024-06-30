import NavBar from "@/components/NavBar";
import UploadPanel from "@/components/UploadPanel";
import AuthPanel from "@/components/AuthPanel";

const HomePage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <NavBar />
      <main className="w-full h-screen md:grid md:min-h-[600px] md:grid-cols-2 xl:min-h-[800px] bg-[url('/hero.png')]">
        <UploadPanel />
        <AuthPanel />
      </main>
    </div>
  );
};

export default HomePage;
