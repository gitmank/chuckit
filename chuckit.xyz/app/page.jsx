"use client";
import useAuth from "@/hooks/useAuth";
import NavBar from "@/components/NavBar";
import UploadPanel from "@/components/UploadPanel";
import AuthPanel from "@/components/AuthPanel";
import ProfilePanel from "@/components/ProfilePanel";

const HomePage = () => {
  // const [user, status] = useAuth();

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
      <NavBar />
      <main className="w-full mt-14 h-screen md:grid md:min-h-[600px] md:grid-cols-2 xl:min-h-[800px] bg-[url('/hero.png')]">
        <UploadPanel />
        <AuthPanel />
      </main>
      {/* {status !== "success" && (
        <main className="w-full h-screen md:grid md:min-h-[600px] md:grid-cols-2 xl:min-h-[800px] bg-[url('/hero.png')]">
          <UploadPanel />
          <AuthPanel />
        </main>
      )} */}
      {/* {status === "success" && (
        <main className="w-full h-screen md:grid md:min-h-[600px] md:grid-cols-2 xl:min-h-[800px] bg-[url('/hero.png')]">
          <UploadPanel />
          <ProfilePanel user={user} />
        </main>
      )} */}
    </div>
  );
};

export default HomePage;
