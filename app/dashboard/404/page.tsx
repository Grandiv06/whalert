import { redirect } from "next/navigation";

export default function Dashboard404Redirect() {
  redirect("/404");
}
