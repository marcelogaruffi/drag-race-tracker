import Link from "next/link";
import { login, signup } from "@/app/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const resolvedParams = await searchParams;

  return (
    <main className="container flex flex-col items-center justify-center gap-8" style={{ minHeight: '100vh', padding: '3rem 4rem' }}>
      <header className="flex flex-col items-center gap-4" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="neon-text" style={{ fontSize: '3rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Área VIP
        </h1>
        <Link href="/" className="gold-text" style={{ textDecoration: 'underline' }}>
          Voltar para o Catálogo
        </Link>
      </header>

      <section style={{
        backgroundColor: '#1a0b0b',
        border: '1px solid #ff007f',
        borderRadius: '8px',
        padding: '2rem',
        width: '100%',
        maxWidth: '450px'
      }}>
        <form className="flex flex-col w-full gap-4" style={{ color: '#fff' }}>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="email" style={{ fontWeight: 'bold' }}>Email</label>
            <input
              name="email"
              placeholder="seu@email.com"
              required
              style={{
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid rgba(255, 0, 127, 0.5)',
                backgroundColor: '#2a1111',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" style={{ fontWeight: 'bold' }}>Senha</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              style={{
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid rgba(255, 0, 127, 0.5)',
                backgroundColor: '#2a1111',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          {/* Novos campos exigidos apenas para cadastro */}
          <div style={{ padding: '1rem', backgroundColor: '#331122', borderRadius: '8px', marginTop: '1rem' }}>
            <p className="gold-text" style={{ fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem' }}>
              Somente preencha os campos abaixo se for **Criar uma Conta**:
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <label htmlFor="confirmPassword" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Confirmar Senha</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                style={{
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 0, 127, 0.5)',
                  backgroundColor: '#2a1111',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="securityCode" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Código Secreto (Para Cadastro)</label>
              <input
                name="securityCode"
                placeholder="Ex: 123456"
                style={{
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 0, 127, 0.5)',
                  backgroundColor: '#2a1111',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <button
              formAction={login}
              style={{
                backgroundColor: '#ff007f',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease',
              }}
            >
              Entrar
            </button>
            <button
              formAction={signup}
              style={{
                backgroundColor: 'transparent',
                color: '#ff007f',
                border: '1px solid #ff007f',
                padding: '0.75rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease',
              }}
            >
              Cadastrar-se com Código
            </button>
          </div>

          {resolvedParams?.message && (
            <p style={{ color: '#ff3333', textAlign: 'center', marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: '4px' }}>
              {resolvedParams.message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
