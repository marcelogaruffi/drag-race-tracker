import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { logout } from "@/app/actions/auth";

export default async function AuthButton() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff' }}>
        <span style={{ fontSize: '0.9rem', color: '#aaa' }}>{user.email}</span>
        <form action={logout}>
          <button style={{
            backgroundColor: 'transparent',
            color: '#ff007f',
            border: '1px solid #ff007f',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            Sair
          </button>
        </form>
      </div>
    );
  }

  return (
    <Link href="/login" style={{
      backgroundColor: '#ff007f',
      color: '#fff',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      textDecoration: 'none'
    }}>
      Entrar
    </Link>
  );
}
