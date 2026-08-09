import Link from "next/link";
import { signup } from "@/app/actions/auth";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
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
        background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, rgba(0,0,0,0) 70%)',
        zIndex: -1,
        pointerEvents: 'none'
      }}></div>

      <header className="flex flex-col items-center gap-2" style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 className="gold-text" style={{ fontSize: '3rem', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
          Novo Acesso
        </h1>
        <p style={{ color: '#aaa', fontSize: '1.1rem', letterSpacing: '1px' }}>
          Insira a chave de ouro para se registrar
        </p>
      </header>

      <section style={{
        backgroundColor: 'rgba(26, 11, 11, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.05)',
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
          background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)'
        }}></div>

        <form className="flex flex-col w-full gap-4" style={{ color: '#fff' }}>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="email" style={{ fontWeight: '500', color: '#ddd', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</label>
            <input
              name="email"
              placeholder="seu@email.com"
              required
              style={{
                padding: '0.85rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                color: '#fff',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--color-gold)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255, 215, 0, 0.2)'}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" style={{ fontWeight: '500', color: '#ddd', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Senha</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              style={{
                padding: '0.85rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                color: '#fff',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--color-gold)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255, 215, 0, 0.2)'}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" style={{ fontWeight: '500', color: '#ddd', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Confirmar Senha</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              required
              style={{
                padding: '0.85rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                color: '#fff',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--color-gold)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255, 215, 0, 0.2)'}
            />
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <label htmlFor="securityCode" style={{ fontWeight: 'bold', color: 'var(--color-gold)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Código Secreto</label>
            <input
              name="securityCode"
              placeholder="Ex: 123456"
              required
              style={{
                padding: '0.85rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 215, 0, 0.5)',
                backgroundColor: 'rgba(255, 215, 0, 0.05)',
                color: 'var(--color-gold)',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontWeight: 'bold',
                letterSpacing: '3px',
                textAlign: 'center',
                fontSize: '1.2rem'
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--color-gold)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255, 215, 0, 0.5)'}
            />
          </div>

          <div className="flex flex-col mt-4">
            <button
              formAction={signup}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-gold)',
                border: '2px solid var(--color-gold)',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-gold)';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-gold)';
              }}
            >
              Criar Conta
            </button>
          </div>

          {resolvedParams?.message && (
            <div style={{ color: '#ff3366', textAlign: 'center', marginTop: '0.5rem', padding: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', borderRadius: '8px', fontWeight: '500' }}>
              {resolvedParams.message}
            </div>
          )}
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Já possui acesso?</p>
          <Link href="/login" style={{ 
            color: '#fff', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontSize: '0.9rem'
          }}>
            Fazer Login
          </Link>
        </div>
      </section>
    </main>
  );
}
