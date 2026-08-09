-- 1. ADICIONAR COLUNA EM SEASON_QUEENS
ALTER TABLE public.season_queens ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. CORRIGIR CAPA DE UK VS THE WORLD SEASON 2
UPDATE public.seasons 
SET cover_image = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/ca/RuPaul%27s_Drag_Race_UK_vs_the_World_Season_2_Poster.jpg/revision/latest?cb=20240113150532'
WHERE id = 'uk-vs-tw-s2';

-- 3. INSERIR SECRET CELEBRITY DRAG RACE
-- Garantir que a franquia existe
INSERT INTO public.franchises (id, name, country, cover_image, sort_order)
VALUES ('secret-celebrity', 'RuPaul''s Secret Celebrity Drag Race', 'US', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/25/Secret_Celebrity_Drag_Race_Logo.png/revision/latest?cb=20200425022138', 99)
ON CONFLICT (id) DO NOTHING;

-- Inserir as Temporadas 1 e 2
INSERT INTO public.seasons (id, franchise_id, name, release_year, cover_image) VALUES
('secret-celebrity-s1', 'secret-celebrity', 'Season 1', 2020, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/96/SCDR1PromoPoster.jpg/revision/latest?cb=20200410174003'),
('secret-celebrity-s2', 'secret-celebrity', 'Season 2', 2022, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/07/SCDR2PromoPoster.jpg/revision/latest?cb=20220718165039')
ON CONFLICT (id) DO NOTHING;

-- Inserir as Queens (Celebridades)
INSERT INTO public.queens (id, name, image_url) VALUES 
('jordan-connor', 'Jordan Connor', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/77/JordanConnorSCDR.png/revision/latest?cb=20200425022510'),
('jermaine-fowler', 'Jermaine Fowler', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/96/JermaineFowlerSCDR.png/revision/latest?cb=20200425022533'),
('nico-tortorella', 'Nico Tortorella', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/87/NicoTortorellaSCDR.png/revision/latest?cb=20200425022557'),
('vanessa-williams', 'Vanessa Williams', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/4f/VanessaWilliamsSCDR.png/revision/latest?cb=20200502022416'),
('loni-love', 'Loni Love', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/6c/LoniLoveSCDR.png/revision/latest?cb=20200502022432'),
('tami-roman', 'Tami Roman', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/27/TamiRomanSCDR.png/revision/latest?cb=20200502022449'),
('alex-newell', 'Alex Newell', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/61/AlexNewellSCDR.png/revision/latest?cb=20200509022630'),
('dustin-milligan', 'Dustin Milligan', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/74/DustinMilliganSCDR.png/revision/latest?cb=20200509022649'),
('matt-iseman', 'Matt Iseman', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/4b/MattIsemanSCDR.png/revision/latest?cb=20200509022710'),
('hayley-kiyoko', 'Hayley Kiyoko', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/52/HayleyKiyokoSCDR.png/revision/latest?cb=20200516022830'),
('madison-beer', 'Madison Beer', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/63/MadisonBeerSCDR.png/revision/latest?cb=20200516022851'),
('phoebe-robinson', 'Phoebe Robinson', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/4b/PhoebeRobinsonSCDR.png/revision/latest?cb=20200516022909'),
('aj-mclean', 'AJ McLean', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/69/PoppyLoveSCDR2.jpg/revision/latest?cb=20220813032545'),
('tatyana-ali', 'Tatyana Ali', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/90/Chakra7SCDR2.jpg/revision/latest?cb=20220813032514'),
('mark-indelicato', 'Mark Indelicato', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/7c/ThirstyVonTrapSCDR2.jpg/revision/latest?cb=20220813032609'),
('thom-filicia', 'Thom Filicia', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/ed/JackieTailsSCDR2.jpg/revision/latest?cb=20220813032535'),
('jenna-ushkowitz', 'Jenna Ushkowitz', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/65/MilliVonSunshineSCDR2.jpg/revision/latest?cb=20220813032557'),
('taylor-dayne', 'Taylor Dayne', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a9/ElectraOwlSCDR2.jpg/revision/latest?cb=20220813032525'),
('kevin-mchale', 'Kevin McHale', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b7/Chic-Li-FaySCDR2.jpg/revision/latest?cb=20220820015507'),
('daniel-franzese', 'Daniel Franzese', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/df/DonnaBellissimaSCDR2.jpg/revision/latest?cb=20220827014631'),
('loretta-devine', 'Loretta Devine', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/be/FabulositySCDR2.jpg/revision/latest?cb=20220813032158')
ON CONFLICT (id) DO NOTHING;

-- Ligar as Queens às Temporadas
INSERT INTO public.season_queens (season_id, queen_id, placement, image_url) VALUES
('secret-celebrity-s1', 'jordan-connor', 1, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/77/JordanConnorSCDR.png/revision/latest?cb=20200425022510'),
('secret-celebrity-s1', 'jermaine-fowler', 2, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/96/JermaineFowlerSCDR.png/revision/latest?cb=20200425022533'),
('secret-celebrity-s1', 'nico-tortorella', 2, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/87/NicoTortorellaSCDR.png/revision/latest?cb=20200425022557'),
('secret-celebrity-s1', 'vanessa-williams', 1, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/4f/VanessaWilliamsSCDR.png/revision/latest?cb=20200502022416'),
('secret-celebrity-s1', 'loni-love', 2, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/6c/LoniLoveSCDR.png/revision/latest?cb=20200502022432'),
('secret-celebrity-s1', 'tami-roman', 2, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/27/TamiRomanSCDR.png/revision/latest?cb=20200502022449'),
('secret-celebrity-s1', 'alex-newell', 1, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/61/AlexNewellSCDR.png/revision/latest?cb=20200509022630'),
('secret-celebrity-s1', 'dustin-milligan', 2, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/74/DustinMilliganSCDR.png/revision/latest?cb=20200509022649'),
('secret-celebrity-s1', 'matt-iseman', 2, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/4b/MattIsemanSCDR.png/revision/latest?cb=20200509022710'),
('secret-celebrity-s1', 'hayley-kiyoko', 1, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/52/HayleyKiyokoSCDR.png/revision/latest?cb=20200516022830'),
('secret-celebrity-s1', 'madison-beer', 2, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/63/MadisonBeerSCDR.png/revision/latest?cb=20200516022851'),
('secret-celebrity-s1', 'phoebe-robinson', 2, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/4b/PhoebeRobinsonSCDR.png/revision/latest?cb=20200516022909'),
('secret-celebrity-s2', 'aj-mclean', 1, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/69/PoppyLoveSCDR2.jpg/revision/latest?cb=20220813032545'),
('secret-celebrity-s2', 'tatyana-ali', 2, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/90/Chakra7SCDR2.jpg/revision/latest?cb=20220813032514'),
('secret-celebrity-s2', 'mark-indelicato', 2, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/7c/ThirstyVonTrapSCDR2.jpg/revision/latest?cb=20220813032609'),
('secret-celebrity-s2', 'thom-filicia', 4, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/ed/JackieTailsSCDR2.jpg/revision/latest?cb=20220813032535'),
('secret-celebrity-s2', 'jenna-ushkowitz', 5, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/65/MilliVonSunshineSCDR2.jpg/revision/latest?cb=20220813032557'),
('secret-celebrity-s2', 'taylor-dayne', 6, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a9/ElectraOwlSCDR2.jpg/revision/latest?cb=20220813032525'),
('secret-celebrity-s2', 'kevin-mchale', 7, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b7/Chic-Li-FaySCDR2.jpg/revision/latest?cb=20220820015507'),
('secret-celebrity-s2', 'daniel-franzese', 8, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/df/DonnaBellissimaSCDR2.jpg/revision/latest?cb=20220827014631'),
('secret-celebrity-s2', 'loretta-devine', 9, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/be/FabulositySCDR2.jpg/revision/latest?cb=20220813032158')
ON CONFLICT (season_id, queen_id) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Inserir Episódios (S1)
INSERT INTO public.episodes (id, season_id, title, episode_number) VALUES
('scdr-s1-e1', 'secret-celebrity-s1', 'Secret Celebrity Edition 101', 1),
('scdr-s1-e2', 'secret-celebrity-s1', 'Secret Celebrity Edition 102', 2),
('scdr-s1-e3', 'secret-celebrity-s1', 'Secret Celebrity Edition 103', 3),
('scdr-s1-e4', 'secret-celebrity-s1', 'Secret Celebrity Edition 104', 4),
('scdr-s2-e1', 'secret-celebrity-s2', 'I''m Coming Out', 1),
('scdr-s2-e2', 'secret-celebrity-s2', 'Dance Your Life Away', 2),
('scdr-s2-e3', 'secret-celebrity-s2', 'Money, Honey', 3),
('scdr-s2-e4', 'secret-celebrity-s2', 'Dragapella', 4),
('scdr-s2-e5', 'secret-celebrity-s2', 'I Love the 90s', 5),
('scdr-s2-e6', 'secret-celebrity-s2', 'Grand Finale', 6)
ON CONFLICT (id) DO NOTHING;

-- Inserir Resultados (S1 e S2)
INSERT INTO public.episode_results (episode_id, queen_id, status) VALUES
-- S1E1
('scdr-s1-e1', 'jordan-connor', 'winner'),
('scdr-s1-e1', 'jermaine-fowler', 'eliminated'),
('scdr-s1-e1', 'nico-tortorella', 'eliminated'),
-- S1E2
('scdr-s1-e2', 'vanessa-williams', 'winner'),
('scdr-s1-e2', 'loni-love', 'eliminated'),
('scdr-s1-e2', 'tami-roman', 'eliminated'),
-- S1E3
('scdr-s1-e3', 'alex-newell', 'winner'),
('scdr-s1-e3', 'dustin-milligan', 'eliminated'),
('scdr-s1-e3', 'matt-iseman', 'eliminated'),
-- S1E4
('scdr-s1-e4', 'hayley-kiyoko', 'winner'),
('scdr-s1-e4', 'madison-beer', 'eliminated'),
('scdr-s1-e4', 'phoebe-robinson', 'eliminated'),
-- S2 Finale (simplificado)
('scdr-s2-e6', 'aj-mclean', 'winner'),
('scdr-s2-e6', 'tatyana-ali', 'runner_up'),
('scdr-s2-e6', 'mark-indelicato', 'runner_up'),
('scdr-s2-e5', 'thom-filicia', 'eliminated'),
('scdr-s2-e5', 'jenna-ushkowitz', 'eliminated'),
('scdr-s2-e4', 'taylor-dayne', 'eliminated'),
('scdr-s2-e3', 'kevin-mchale', 'eliminated'),
('scdr-s2-e2', 'daniel-franzese', 'eliminated'),
('scdr-s2-e1', 'loretta-devine', 'eliminated')
ON CONFLICT DO NOTHING;
