import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { UserRepository } from "@/lib/data-access/user.repository";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const fullUser = await UserRepository.findById(user.id);

  return <SettingsClient user={user} fullUser={fullUser} />;
}
