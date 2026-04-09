"use client";
import { useUser } from "@/_lib/context/UserContext";

const Page = () => {
  const { profile } = useUser();

  // NÃO DEIXAR CONSOLE.LOG() NO CÓDIGO :)

  return <div>Bem Vindo de volta {profile?.nickname || ""}</div>;
};

export default Page;
