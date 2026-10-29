import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ChallengesClient } from "./ChallengesClient";

export default async function ChallengesPage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  return <ChallengesClient user={user} />;
}
