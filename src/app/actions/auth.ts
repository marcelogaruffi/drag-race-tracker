"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const COOKIE_NAME = "drag_race_user_id";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data: userId, error } = await supabase.rpc("custom_login", {
    p_email: email,
    p_password: password
  });

  if (error || !userId) {
    return redirect(`/login?message=${encodeURIComponent(error?.message || "Credenciais inválidas")}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 ano
  });

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const securityCode = formData.get("securityCode") as string;

  if (password !== confirmPassword) {
    return redirect("/login?message=As senhas não coincidem");
  }

  const { data: userId, error } = await supabase.rpc("custom_signup", {
    p_email: email,
    p_password: password,
    p_security_code: securityCode
  });

  if (error || !userId) {
    return redirect(`/login?message=${encodeURIComponent(error?.message || "Erro ao criar usuário")}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function getCustomUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!userId) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("custom_users")
    .select("id, email")
    .eq("id", userId)
    .single();

  return data;
}
