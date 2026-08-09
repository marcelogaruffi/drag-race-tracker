import Link from "next/link";
import { login } from "@/app/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; success?: string }>;
}) {
  const resolvedParams = await searchParams;

  return (
    <main className="container flex flex-col items-center justify-center gap-8" style={{ minHeight: '100vh', padding: '2rem' }}>
      
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, rgba(255,0,127,0.15) 0%, rgba(0,0,0,0) 70%)',
        zIndex: -1,
        pointerEvents: 'none'
      }}></div>

      <header className="flex flex-col items-center gap-2" style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 className="neon-text" style={{ fontSize: '3.5rem', letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>
          VIP ROOM
        </h1>
        <p style={{ color: '#aaa', fontSize: '1.1rem', letterSpacing: '1px' }}>
          Identifique-se para acessar o catálogo
        </p>
      </header>

      <section style={{
        backgroundColor: 'rgba(26, 11, 11, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 0, 127, 0.3)',
        boxShadow: '0 8px 32px rgba(255, 0, 127, 0.1)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Top Accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(90deg, transparent, var(--color-neon-pink), transparent)'
        }}></div>

        <form action={login} className="flex flex-col w-full gap-5" style={{ color: '#fff' }}>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="email" style={{ fontWeight: '500', color: '#ddd', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</label>
            <input
              name="email"
              placeholder="seu@email.com"
              required
              style={{
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 0, 127, 0.2)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                color: '#fff',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontSize: '1rem'
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--color-neon-pink)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255, 0, 127, 0.2)'}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" style={{ fontWeight: '500', color: '#ddd', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Senha</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              style={{
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 0, 127, 0.2)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                color: '#fff',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontSize: '1rem'
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--color-neon-pink)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255, 0, 127, 0.2)'}
            />
          </div>

          <div className="flex flex-col mt-4">
            <button
              type="submit"
              style={{
                backgroundColor: 'var(--color-neon-pink)',
                color: '#fff',
                border: 'none',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 20px rgba(255, 0, 127, 0.4)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Entrar
            </button>
          </div>

          {resolvedParams?.success && (
            <div style={{ color: '#00ffaa', textAlign: 'center', marginTop: '0.5rem', padding: '1rem', backgroundColor: 'rgba(0,255,170,0.1)', border: '1px solid rgba(0,255,170,0.3)', borderRadius: '8px', fontWeight: '500' }}>
              Cadastro realizado com sucesso! Faça seu login.
            </div>
          )}

          {resolvedParams?.message && (
            <div style={{ color: '#ff3366', textAlign: 'center', marginTop: '0.5rem', padding: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', borderRadius: '8px', fontWeight: '500' }}>
              {resolvedParams.message}
            </div>
          )}
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Ainda não tem a chave?</p>
          <Link href="/signup" style={{ 
            color: 'var(--color-neon-pink)', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontSize: '0.9rem'
          }}>
            Cadastre-se aqui
          </Link>
        </div>
      </section>
    </main>
  );
}
