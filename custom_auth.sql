-- Habilitar a extensão pgcrypto se não existir
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Criar a nova tabela de usuários customizados
CREATE TABLE IF NOT EXISTS custom_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Limpar a tabela de progresso antigo e alterar a chave estrangeira
TRUNCATE TABLE user_progress;

ALTER TABLE user_progress
  DROP CONSTRAINT IF EXISTS user_progress_user_id_fkey;

ALTER TABLE user_progress
  ADD CONSTRAINT user_progress_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES custom_users(id)
  ON DELETE CASCADE;

-- 3. Criar a RPC de Login Customizado
CREATE OR REPLACE FUNCTION custom_login(p_email TEXT, p_password TEXT)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM custom_users
  WHERE email = p_email AND password_hash = crypt(p_password, password_hash);
  
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Criar a RPC de Cadastro Customizado
CREATE OR REPLACE FUNCTION custom_signup(p_email TEXT, p_password TEXT, p_security_code TEXT)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Verifica o código de segurança
  IF p_security_code != '818345' THEN
    RAISE EXCEPTION 'Código de segurança inválido';
  END IF;

  INSERT INTO custom_users (email, password_hash)
  VALUES (p_email, crypt(p_password, gen_salt('bf')))
  RETURNING id INTO v_user_id;
  
  RETURN v_user_id;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Email já cadastrado';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Recriar a RPC get_locked_seasons sem depender de auth.uid() explicitamente, apenas confiando no parâmetro p_user_id
CREATE OR REPLACE FUNCTION get_locked_seasons(p_user_id UUID, p_season_ids UUID[])
RETURNS TABLE (
    season_id UUID,
    required_season_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH season_reqs AS (
        SELECT 
            sr.season_id as target_season,
            sr.required_season_id,
            s_req.name as req_name,
            -- Verifica se todos os episódios da temporada requerida foram assistidos
            COALESCE(
                (SELECT bool_and(up.id IS NOT NULL)
                 FROM episodes e
                 LEFT JOIN user_progress up ON e.id = up.episode_id AND up.user_id = p_user_id
                 WHERE e.season_id = sr.required_season_id), 
                false
            ) as is_watched
        FROM season_requirements sr
        JOIN seasons s_req ON sr.required_season_id = s_req.id
        WHERE sr.season_id = ANY(p_season_ids)
    )
    SELECT 
        target_season,
        req_name
    FROM season_reqs
    WHERE is_watched = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
