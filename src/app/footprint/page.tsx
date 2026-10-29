import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { FootprintClient } from "./FootprintClient";

export default async function FootprintPage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  return <FootprintClient user={user} />;
}
