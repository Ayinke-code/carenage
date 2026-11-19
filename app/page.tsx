import { redirect } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";

export default function Home() {
  redirect("/dashboard");
}