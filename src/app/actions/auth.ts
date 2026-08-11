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
    return redirect(`/auth?message=${encodeURIComponent(error?.message || "Credenciais inválidas")}`);
  }

  const cookieStore = await cookies();
  const sessionData = JSON.stringify({ id: userId, email });
  
  cookieStore.set(COOKIE_NAME, sessionData, {
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
    return redirect("/signup?message=As senhas não coincidem");
  }

  const { data: userId, error } = await supabase.rpc("custom_signup", {
    p_email: email,
    p_password: password,
    p_security_code: securityCode
  });

  if (error || !userId) {
    return redirect(`/signup?message=${encodeURIComponent(error?.message || "Erro ao criar usuário")}`);
  }

  // Se deu sucesso, redireciona para o login informando o sucesso
  redirect("/auth?success=true");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function getCustomUser() {
  const cookieStore = await cookies();
  const sessionString = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!sessionString) return null;

  try {
    const data = JSON.parse(sessionString);
    if (data && data.id && data.email) {
      return data;
    }
  } catch (e) {
    // Se falhar no parse, é porque é o cookie antigo que só tinha o UUID.
    // Retornamos um objeto compatível para não quebrar.
    return { id: sessionString, email: "Usuário Vip" };
  }

  return null;
}
export async function forceUnlockSeason(seasonId: string) {
  const cookieStore = await cookies();
  const unlockedCookie = cookieStore.get("unlocked_seasons");
  let unlockedSeasons: string[] = [];
  
  if (unlockedCookie?.value) {
    try {
      unlockedSeasons = JSON.parse(unlockedCookie.value);
    } catch(e) {}
  }
  
  if (!unlockedSeasons.includes(seasonId)) {
    unlockedSeasons.push(seasonId);
    cookieStore.set("unlocked_seasons", JSON.stringify(unlockedSeasons), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  
  revalidatePath("/", "layout");
}
