-- Cria as tabelas do Sistema Cross-Season
CREATE TABLE IF NOT EXISTS queens (
  id varchar PRIMARY KEY,
  name varchar NOT NULL,
  image_url varchar
);

CREATE TABLE IF NOT EXISTS season_queens (
  season_id varchar REFERENCES seasons(id),
  queen_id varchar REFERENCES queens(id),
  placement varchar,
  PRIMARY KEY (season_id, queen_id)
);

-- Políticas RLS
ALTER TABLE queens ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_queens ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Leitura Publica Queens" ON queens FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Leitura Publica Season Queens" ON season_queens FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Limpar dados se existirem
TRUNCATE TABLE season_queens CASCADE;
TRUNCATE TABLE queens CASCADE;

-- Inserir Queens Famosas do Multiverso
INSERT INTO queens (id, name) VALUES 
  ('jujubee', 'Jujubee'),
  ('mo-heart', 'Mo Heart'),
  ('monet-x-change', 'Monét X Change'),
  ('shea-coulee', 'Shea Couleé'),
  ('jimbo', 'Jimbo'),
  ('janey-jacke', 'Janey Jacké'),
  ('baga-chipz', 'Baga Chipz'),
  ('rajah-ohara', 'Ra''Jah O''Hara'),
  ('silky-nutmeg-ganache', 'Silky Nutmeg Ganache'),
  ('victoria-scone', 'Victoria Scone'),
  ('rita-baga', 'Rita Baga'),
  ('icesis-couture', 'Icesis Couture'),
  ('anita-wiglit', 'Anita Wigl''it')
ON CONFLICT DO NOTHING;

-- Inserir Participações
INSERT INTO season_queens (season_id, queen_id) VALUES 
  -- Jujubee
  ('us-regular-s2', 'jujubee'),
  ('us-all-stars-s1', 'jujubee'),
  ('us-all-stars-s5', 'jujubee'),
  ('uk-vs-tw-s1', 'jujubee'),

  -- Mo Heart (S8, AS4, UKvsTW)
  ('us-regular-s8', 'mo-heart'),
  ('us-all-stars-s4', 'mo-heart'),
  ('uk-vs-tw-s1', 'mo-heart'),

  -- Monét X Change
  ('us-regular-s10', 'monet-x-change'),
  ('us-all-stars-s4', 'monet-x-change'),
  ('us-all-stars-s7', 'monet-x-change'),

  -- Shea Couleé
  ('us-regular-s9', 'shea-coulee'),
  ('us-all-stars-s5', 'shea-coulee'),
  ('us-all-stars-s7', 'shea-coulee'),

  -- Jimbo
  ('can-regular-s1', 'jimbo'),
  ('uk-vs-tw-s1', 'jimbo'),
  ('us-all-stars-s8', 'jimbo'),

  -- Janey Jacké
  ('holland-s1', 'janey-jacke'),
  ('uk-vs-tw-s1', 'janey-jacke'),

  -- Baga Chipz
  ('uk-regular-s1', 'baga-chipz'),
  ('uk-vs-tw-s1', 'baga-chipz'),

  -- Ra'Jah O'Hara
  ('us-regular-s11', 'rajah-ohara'),
  ('us-all-stars-s6', 'rajah-ohara'),
  ('can-vs-tw-s1', 'rajah-ohara'),

  -- Silky Nutmeg Ganache
  ('us-regular-s11', 'silky-nutmeg-ganache'),
  ('us-all-stars-s6', 'silky-nutmeg-ganache'),
  ('can-vs-tw-s1', 'silky-nutmeg-ganache'),

  -- Victoria Scone
  ('uk-regular-s3', 'victoria-scone'),
  ('can-vs-tw-s1', 'victoria-scone'),

  -- Rita Baga
  ('can-regular-s1', 'rita-baga'),
  ('can-vs-tw-s1', 'rita-baga'),

  -- Icesis Couture
  ('can-regular-s2', 'icesis-couture'),
  ('can-vs-tw-s1', 'icesis-couture'),

  -- Anita Wigl'it
  ('down-under-s1', 'anita-wiglit'),
  ('can-vs-tw-s1', 'anita-wiglit')
ON CONFLICT DO NOTHING;
