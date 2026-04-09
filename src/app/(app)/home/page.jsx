"use client";
import { useUser } from "@/_lib/context/UserContext";

const Page = () => {
  const { profile } = useUser();

  console.log(profile);
  

  return <div>Bem Vindo de volta {profile?.nickname || ""}</div>;
};

export default Page;
