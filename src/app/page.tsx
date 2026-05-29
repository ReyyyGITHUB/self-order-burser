import { redirect } from "next/navigation";

// Base route otomatis me-redirect ke meja pertama (T-1) untuk kelancaran fase demo
export default function Home() {
  redirect("/table/T-1");
}
