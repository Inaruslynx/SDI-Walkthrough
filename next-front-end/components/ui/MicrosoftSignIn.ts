"use server";
import { signIn } from "@/auth";

export default async function MicrosoftSignIn() {
  await signIn("microsoft-entra-id");
}