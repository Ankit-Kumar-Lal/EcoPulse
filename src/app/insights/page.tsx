import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { InsightsClient } from "./InsightsClient";

export default async function InsightsPage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  return <InsightsClient user={user} />;
}
