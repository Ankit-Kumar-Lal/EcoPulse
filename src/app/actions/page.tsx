import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ActionsClient } from "./ActionsClient";

export default async function ActionsPage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  return <ActionsClient user={user} />;
}
