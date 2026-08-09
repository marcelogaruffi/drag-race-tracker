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
INSERT INTO public.seasons (id, franchise_id, name, release_year, cover_image, type) VALUES
('secret-celebrity-s1', 'secret-celebrity', 'Season 1', 2020, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/96/SCDR1PromoPoster.jpg/revision/latest/scale-to-width-down/400?cb=20200410174003', 'regular'),
('secret-celebrity-s2', 'secret-celebrity', 'Season 2', 2022, 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/07/SCDR2PromoPoster.jpg/revision/latest/scale-to-width-down/400?cb=20220718165039', 'regular')
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


UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/ed/S1_Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s1' AND queen_id = 'bebe-zahara-benet';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a7/ShannelS1CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s1' AND queen_id = 'shannel';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/c3/OnginaS1CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s1' AND queen_id = 'ongina';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/96/TammieBrownS1CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s1' AND queen_id = 'tammie-brown';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/4c/S2Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s2' AND queen_id = 'raven';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/06/JujubeeS2CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s2' AND queen_id = 'jujubee';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/63/TatiannaS2CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s2' AND queen_id = 'tatianna';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/4c/S2Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s2' AND queen_id = 'pandora-boxx';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/4c/S2Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s2' AND queen_id = 'jessica-wild';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/c5/NicolePaigeBrooksS2CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s2' AND queen_id = 'nicole-paige-brooks';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/6c/S3Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s3' AND queen_id = 'raja';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/6c/S3Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s3' AND queen_id = 'manila-luzon';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/ee/AlexisMateoS3CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s3' AND queen_id = 'alexis-mateo';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/6c/S3Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s3' AND queen_id = 'yara-sofia';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/6c/S3Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s3' AND queen_id = 'shangela';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/06/IndiaFerrahS3CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s3' AND queen_id = 'india-ferrah';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/44/PhoenixS3CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s3' AND queen_id = 'phoenix';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/73/Rpdr_season4.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s4' AND queen_id = 'latrice-royale';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/73/Rpdr_season4.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s4' AND queen_id = 'jiggly-caliente';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b6/S5cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s5' AND queen_id = 'jinkx-monsoon';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b6/S5cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s5' AND queen_id = 'alaska';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b6/S5cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s5' AND queen_id = 'roxxxy-andrews';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/96/DetoxS5CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s5' AND queen_id = 'detox';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/00/CocoMontreseS5CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s5' AND queen_id = 'coco-montrese';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/45/AlyssaEdwardsS5CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s5' AND queen_id = 'alyssa-edwards';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/2e/MonicaBeverlyHillzS5CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s5' AND queen_id = 'monica-beverly-hillz';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/da/SerenaChaChaS5CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s5' AND queen_id = 'serena-chacha';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/d7/S6cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s6' AND queen_id = 'adore-delano';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/61/DarienneLakeS6CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s6' AND queen_id = 'darienne-lake';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/d7/S6cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s6' AND queen_id = 'bendelacreme';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/9c/BiancaPillowFightPhotoshoot.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s6' AND queen_id = 'trinity-k-bonet';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/72/MilkS6CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s6' AND queen_id = 'milk';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/2a/GiaGunnS6CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s6' AND queen_id = 'gia-gunn';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/d8/S7cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s7' AND queen_id = 'ginger-minj';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/83/KennedyDavenportS7CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s7' AND queen_id = 'kennedy-davenport';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/d8/S7cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s7' AND queen_id = 'katya';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/6d/TrixieMattelS7CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s7' AND queen_id = 'trixie-mattel';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/19/JasmineMastersS7CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s7' AND queen_id = 'jasmine-masters';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/c1/S8cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s8' AND queen_id = 'naomi-smalls';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/aa/DerrickBarryS8CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s8' AND queen_id = 'derrick-barry';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/27/ThorgyThorS8CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s8' AND queen_id = 'thorgy-thor';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/0b/AcidBettyS8CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s8' AND queen_id = 'acid-betty';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/ac/NayshaLopezS8CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s8' AND queen_id = 'naysha-lopez';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/4c/AlexisMichelleS9CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s9' AND queen_id = 'alexis-michelle';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e5/S9banner.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s9' AND queen_id = 'valentina';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/1a/FarrahMoanS9CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s9' AND queen_id = 'farrah-moan';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/ed/AjaS9CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s9' AND queen_id = 'aja';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/53/JaymesMansfieldS9CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s9' AND queen_id = 'jaymes-mansfield';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/af/RPDR_S10_Banner.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s10' AND queen_id = 'eureka';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/dc/MizCrackerS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s10' AND queen_id = 'miz-cracker';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/fe/MoniqueHeartS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s10' AND queen_id = 'monique-heart';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/96/MayhemMillerS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s10' AND queen_id = 'mayhem-miller';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/ef/Vanessa_S10_Promo.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s10' AND queen_id = 'vanessa-vanjie-mateo';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/83/S11Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s11' AND queen_id = 'yvie-oddly';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e8/VanessaVanjieMateoS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s11' AND queen_id = 'vanessa-vanjie-mateo';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/83/S11Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s11' AND queen_id = 'nina-west';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/d5/ShugaCainS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s11' AND queen_id = 'shuga-cain';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/44/PlastiqueTiaraS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s11' AND queen_id = 'plastique-tiara';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/3b/ScarletEnvyS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s11' AND queen_id = 'rajah-ohara';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/3b/ScarletEnvyS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s11' AND queen_id = 'scarlet-envy';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/8c/KahannaMontreseS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s11' AND queen_id = 'kahanna-montrese';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/RPDRS12Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s12' AND queen_id = 'jaida-essence-hall';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/RPDRS12Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s12' AND queen_id = 'crystal-methyd';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e7/JackieCoxS12CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s12' AND queen_id = 'jackie-cox';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/RPDRS12Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s12' AND queen_id = 'heidi-n-closet';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a9/JanS12CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s12' AND queen_id = 'jan';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/1e/S13Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s13' AND queen_id = 'kandy-muse';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/bd/GottmikS13CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s13' AND queen_id = 'gottmik';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/4f/OliviaLuxS13CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s13' AND queen_id = 'olivia-lux';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/44/TinaBurnerS13CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s13' AND queen_id = 'tina-burner';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/36/DenaliS13CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s13' AND queen_id = 'denali';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/1e/S13Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s13' AND queen_id = 'lala-ri';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a7/JoeyJayS13CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s13' AND queen_id = 'joey-jay';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/5e/AngeriaParisVanMichealsS14CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s14' AND queen_id = 'angeria-paris-vanmicheals';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/56/BoscoS14CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s14' AND queen_id = 'bosco';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/69/DayaBettyS14CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s14' AND queen_id = 'daya-betty';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a4/DeJaSkyeS14CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s14' AND queen_id = 'deja-skye';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/fa/JorgeousS14CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s14' AND queen_id = 'jorgeous';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/0c/JasmineKennedieS14CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s14' AND queen_id = 'jasmine-kennedie';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/30/KerriColbyS14CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s14' AND queen_id = 'kerri-colby';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/ec/AlyssaHunterS14CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s14' AND queen_id = 'alyssa-hunter';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/3e/MistressIsabelleBrooksS15CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s15' AND queen_id = 'mistress-isabelle-brooks';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e6/S15Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s15' AND queen_id = 'salina-estitties';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/0b/AuraMayariS15CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s15' AND queen_id = 'aura-mayari';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/7c/S16Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s16' AND queen_id = 'morphine-love-dion';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/de/DawnS16CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s16' AND queen_id = 'dawn';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/08/HershiiLiqCour-Jet%C3%A9S16CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s16' AND queen_id = 'hershii-liqcour-jet';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f6/SamStarS17CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s17' AND queen_id = 'sam-star';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f2/LydiaBKollinsS17CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s17' AND queen_id = 'lydia-b-kollins';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/9a/LuckyStarzzzS17CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-regular-s17' AND queen_id = 'lucky-starzzz';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/22/AS1_Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s1' AND queen_id = 'raven';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/af/ShannelAS1CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s1' AND queen_id = 'shannel';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/97/AlexisMateoAS1CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s1' AND queen_id = 'alexis-mateo';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/2d/ManilaLuzonAS1CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s1' AND queen_id = 'manila-luzon';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/bf/TammieBrownAS1CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s1' AND queen_id = 'tammie-brown';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/22/AS1_Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s1' AND queen_id = 'pandora-boxx';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/ce/AS2CastPhoto.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s2' AND queen_id = 'alaska';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/ce/AS2CastPhoto.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s2' AND queen_id = 'detox';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/ce/AS2CastPhoto.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s2' AND queen_id = 'katya';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/5b/RoxxxyAndrewsAS2CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s2' AND queen_id = 'roxxxy-andrews';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/15/AlyssaEdwardsAS2CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s2' AND queen_id = 'alyssa-edwards';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/96/TatiannaAS2CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s2' AND queen_id = 'tatianna';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/89/GingerMinjAS2CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s2' AND queen_id = 'ginger-minj';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/fc/AdoreDelanoAS2CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s2' AND queen_id = 'adore-delano';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f8/CocoMontreseAS2CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s2' AND queen_id = 'coco-montrese';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/20/AS3Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s3' AND queen_id = 'trixie-mattel';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/20/AS3Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s3' AND queen_id = 'kennedy-davenport';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/93/BeBeZaharaBenetAS3CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s3' AND queen_id = 'bebe-zahara-benet';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/8c/ShangelaAS3CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s3' AND queen_id = 'shangela';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f5/BenDeLaCremeAS3CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s3' AND queen_id = 'bendelacreme';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/4e/AjaAS3CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s3' AND queen_id = 'aja';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/d0/MilkAS3CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s3' AND queen_id = 'milk';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/ce/ThorgyThorAS3CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s3' AND queen_id = 'thorgy-thor';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/ee/As4banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s4' AND queen_id = 'trinity-the-tuck';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/ea/MoniqueHeartAS4CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s4' AND queen_id = 'monique-heart';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/28/NaomiSmallsAS4CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s4' AND queen_id = 'naomi-smalls';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e3/LatriceRoyaleAS4CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s4' AND queen_id = 'latrice-royale';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/c3/ManilaLuzonAS4CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s4' AND queen_id = 'manila-luzon';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/43/ValentinaAS4CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s4' AND queen_id = 'valentina';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e3/GiaGunnAS4CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s4' AND queen_id = 'gia-gunn';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f8/FarrahMoanAS4CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s4' AND queen_id = 'farrah-moan';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/10/JasmineMastersAS4CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s4' AND queen_id = 'jasmine-masters';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/5f/AllStars5Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s5' AND queen_id = 'jujubee';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/5f/AllStars5Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s5' AND queen_id = 'miz-cracker';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/1d/AlexisMateoAS5CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s5' AND queen_id = 'alexis-mateo';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a9/IndiaFerrahAS5CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s5' AND queen_id = 'india-ferrah';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/34/MayhemMillerAS5CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s5' AND queen_id = 'mayhem-miller';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/48/MariahAS5Promo.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s5' AND queen_id = 'mariah-paris-balenciaga';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/c9/OnginaAS5CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s5' AND queen_id = 'ongina';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/29/DerrickBarryAS5CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s5' AND queen_id = 'derrick-barry';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/00/AS6Banner.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s6' AND queen_id = 'kylie-sonique-love';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/00/AS6Banner.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s6' AND queen_id = 'eureka';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/00/AS6Banner.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s6' AND queen_id = 'ginger-minj';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/00/AS6Banner.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s6' AND queen_id = 'rajah-ohara';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e4/PandoraBoxxAS6CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s6' AND queen_id = 'pandora-boxx';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/dc/JanAS6CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s6' AND queen_id = 'jan';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/43/ScarletEnvyAS6CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s6' AND queen_id = 'scarlet-envy';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/8b/YaraSofiaAS6CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s6' AND queen_id = 'yara-sofia';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/1d/SilkyNutmegGanacheAS6CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s6' AND queen_id = 'silky-nutmeg-ganache';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/2b/JigglyCalienteAS6CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s6' AND queen_id = 'jiggly-caliente';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a0/SerenaChaChaAS6CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s6' AND queen_id = 'serena-chacha';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/47/AS7Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s7' AND queen_id = 'jinkx-monsoon';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/bf/TrinityTheTuckAS7CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s7' AND queen_id = 'trinity-the-tuck';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/47/AS7Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s7' AND queen_id = 'raja';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/1e/YvieOddlyAS7CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s7' AND queen_id = 'yvie-oddly';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/48/JaidaEssenceHallAS7CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s7' AND queen_id = 'jaida-essence-hall';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/3d/TheVivienneAS7CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s7' AND queen_id = 'the-vivienne';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/5a/AS8Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s8' AND queen_id = 'jimbo';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/5a/AS8Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s8' AND queen_id = 'kandy-muse';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/9d/JessicaWildAS8CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s8' AND queen_id = 'jessica-wild';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/8f/AlexisMichelleAS8CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s8' AND queen_id = 'alexis-michelle';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/5a/AS8Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s8' AND queen_id = 'lala-ri';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/2e/KahannaMontreseAS8CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s8' AND queen_id = 'kahanna-montrese';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/c9/JaymesMansfieldAS8CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s8' AND queen_id = 'jaymes-mansfield';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/bf/HeidiNClosetAS8CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s8' AND queen_id = 'heidi-n-closet';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/d7/DarienneLakeAS8CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s8' AND queen_id = 'darienne-lake';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/25/NayshaLopezAS8CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s8' AND queen_id = 'naysha-lopez';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/d3/MonicaBeverlyHillzAS8CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s8' AND queen_id = 'monica-beverly-hillz';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b3/AS9Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s9' AND queen_id = 'angeria-paris-vanmicheals';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b3/AS9Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s9' AND queen_id = 'roxxxy-andrews';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/52/GottmikAS9CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s9' AND queen_id = 'gottmik';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e8/JorgeousAS9CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s9' AND queen_id = 'jorgeous';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/44/NinaWestAS9CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s9' AND queen_id = 'nina-west';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/67/PlastiqueTiaraAS9CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s9' AND queen_id = 'plastique-tiara';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/db/ShannelAS9CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s9' AND queen_id = 'shannel';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/AS10Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'ginger-minj';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/AS10Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'jorgeous';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/88/LydiaBKollinsAS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'lydia-b-kollins';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/14/BoscoAS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'bosco';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/DayaBettyAS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'daya-betty';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/7f/AjaAS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'aja';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/46/KerriColbyAS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'kerri-colby';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/cf/MistressIsabelleBrooksAS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'mistress-isabelle-brooks';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/52/AcidBettyAS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'acid-betty';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a2/AlyssaHunterAS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'alyssa-hunter';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e2/DenaliAS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'denali';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/c2/TinaBurnerAS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'tina-burner';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/09/NicolePaigeBrooksAS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'nicole-paige-brooks';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/76/DeJaSkyeAS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'deja-skye';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/fe/OliviaLuxAS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'olivia-lux';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/43/PhoenixAS10CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s10' AND queen_id = 'phoenix';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/74/AS11Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s11' AND queen_id = 'crystal-methyd';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/74/AS11Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s11' AND queen_id = 'joey-jay';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/5a/JasmineKennedieAS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s11' AND queen_id = 'jasmine-kennedie';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/61/SilkyNutmegGanacheAS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s11' AND queen_id = 'silky-nutmeg-ganache';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/cb/DawnAS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s11' AND queen_id = 'dawn';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/47/SamStarAS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s11' AND queen_id = 'sam-star';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f6/KennedyDavenportAS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s11' AND queen_id = 'kennedy-davenport';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/ca/HershiiLiqCour-Jet%C3%A9AS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s11' AND queen_id = 'hershii-liqcour-jet';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/26/ShugaCainAS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s11' AND queen_id = 'shuga-cain';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/74/AuraMayariAS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s11' AND queen_id = 'aura-mayari';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/53/SalinaEsTittiesAS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s11' AND queen_id = 'salina-estitties';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f9/LuckyStarzzzAS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s11' AND queen_id = 'lucky-starzzz';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/be/MorphineLoveDionAS11CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'us-all-stars-s11' AND queen_id = 'morphine-love-dion';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e0/GAS1.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'global-all-stars-s1' AND queen_id = 'alyssa-edwards';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/USA_Flag.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'global-all-stars-s1' AND queen_id = 'kitty-scott-claus';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/USA_Flag.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'global-all-stars-s1' AND queen_id = 'kween-kong';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/USA_Flag.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'global-all-stars-s1' AND queen_id = 'nehellenia';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/USA_Flag.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'global-all-stars-s1' AND queen_id = 'tessa-testicle';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/USA_Flag.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'global-all-stars-s1' AND queen_id = 'vanity-vain';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/USA_Flag.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'global-all-stars-s1' AND queen_id = 'pythia';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/USA_Flag.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'global-all-stars-s1' AND queen_id = 'gala-varo';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e0/GAS1.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'global-all-stars-s1' AND queen_id = 'soa-de-muse';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/USA_Flag.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'global-all-stars-s1' AND queen_id = 'eva-le-queen';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/USA_Flag.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'global-all-stars-s1' AND queen_id = 'miranda-lebro';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/4c/DRUKSeason1Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s1' AND queen_id = 'the-vivienne';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a4/BagaChipzDRUK1CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s1' AND queen_id = 'baga-chipz';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/64/CherylHoleDRUK1CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s1' AND queen_id = 'cheryl-hole';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/81/BluHydrangeaDRUK1CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s1' AND queen_id = 'blu-hydrangea';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b3/GothyKendollDRUK1CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s1' AND queen_id = 'gothy-kendoll';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/6e/TiaKofiDRUK2CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s2' AND queen_id = 'tia-kofi';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/59/VeronicaGreenDRUK2CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s2' AND queen_id = 'veronica-green';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/79/DRUK3CastPhoto.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s3' AND queen_id = 'kitty-scott-claus';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/22/VanityMilanDRUK3CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s3' AND queen_id = 'vanity-milan';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e8/ChorizaMayDRUK3CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s3' AND queen_id = 'choriza-may';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/ab/VeronicaGreenDRUK3CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s3' AND queen_id = 'veronica-green';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/3d/VictoriaSconeDRUK3CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s3' AND queen_id = 'victoria-scone';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/7f/JonbersBlondeDRUK4CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s4' AND queen_id = 'jonbers-blonde';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/ff/LeFilDRUK4CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s4' AND queen_id = 'le-fil';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/3c/SmintyDropDRUK4CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s4' AND queen_id = 'sminty-drop';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/dd/KateButchDRUK5CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s5' AND queen_id = 'kate-butch';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/17/ZahirahZapantaDRUK6CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'uk-regular-s6' AND queen_id = 'zahirah-zapanta';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f4/CDRS1Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s1' AND queen_id = 'rita-baga';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a3/JimboCDR1CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s1' AND queen_id = 'jimbo';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/ab/LemonCDR1CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s1' AND queen_id = 'lemon';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f4/CDRS1Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s1' AND queen_id = 'tynomi-banks';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a7/JuiceBoxxCDR1CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s1' AND queen_id = 'juice-boxx';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/da/CDR2Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s2' AND queen_id = 'icesis-couture';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/da/CDR2Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s2' AND queen_id = 'kendall-gender';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/da/CDR2Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s2' AND queen_id = 'pythia';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f5/StephaniePrinceCDR2CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s2' AND queen_id = 'stephanie-prince';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b1/CDR3Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s3' AND queen_id = 'jada-shada-hudson';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/72/MissFiercaliciousCDR3CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s3' AND queen_id = 'miss-fiercalicious';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e4/CDR4CastPhoto.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s4' AND queen_id = 'aurora-matrix';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/18/NearahNuffCDR4CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s4' AND queen_id = 'nearah-nuff';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/99/MelindaVergaCDR4CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s4' AND queen_id = 'melinda-verga';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f1/CDR5CastPhoto.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s5' AND queen_id = 'makayla-couture';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/21/TiffanyAnnCoCDR5CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s5' AND queen_id = 'tiffany-ann-co';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/14/CDR6CastPhoto.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'can-regular-s6' AND queen_id = 'sami-landri';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/39/DRES1Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'espana-s1' AND queen_id = 'sagittaria';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/39/DRES1Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'espana-s1' AND queen_id = 'pupi-poisson';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/df/ArantxaCastillaLaManchaDRES1CastMug.jpeg/revision/latest/scale-to-width-down/400' WHERE season_id = 'espana-s1' AND queen_id = 'arantxa-castilla-la-mancha';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/bb/DRE2CastPhoto.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'espana-s2' AND queen_id = 'juriji-der-klee';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/bb/DRE2CastPhoto.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'espana-s2' AND queen_id = 'drag-sethlas';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/bb/DRE2CastPhoto.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'espana-s2' AND queen_id = 'samantha-ballentines';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/60/HornellaG%C3%B3ngoraDRES3CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'espana-s3' AND queen_id = 'hornella-gngora';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/74/PakitaDRES3CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'espana-s3' AND queen_id = 'pakita';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/fb/PinkChadoraDRES3CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'espana-s3' AND queen_id = 'pink-chadora';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/00/DRF1Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'france-s1' AND queen_id = 'la-grande-dame';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/00/DRF1Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'france-s1' AND queen_id = 'soa-de-muse';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e0/LaKahenaDRFR1CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'france-s1' AND queen_id = 'la-kahena';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/7b/DRPH1Cast.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'philippines-s1' AND queen_id = 'marina-summers';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/7f/EvaLeQueenDRP1CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'philippines-s1' AND queen_id = 'eva-le-queen';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/68/MintyFreshDRP1CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'philippines-s1' AND queen_id = 'minty-fresh';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/91/DRDU2Cast.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'down-under-s2' AND queen_id = 'hannah-conda';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/91/DRDU2Cast.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'down-under-s2' AND queen_id = 'kween-kong';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/e6/DRMX1Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'mexico-s1' AND queen_id = 'gala-varo';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/68/SerenaMorenaDRMX1CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'mexico-s1' AND queen_id = 'serena-morena';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/82/GawdlandDRTH3CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'thailand-s3' AND queen_id = 'gawdland';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a4/DRHS1Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'holland-s1' AND queen_id = 'janey-jack';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/84/KetaMinajDRHL2CastMug.png/revision/latest/scale-to-width-down/400' WHERE season_id = 'holland-s2' AND queen_id = 'keta-minaj';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/52/DRI2CastPhoto3.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'italia-s2' AND queen_id = 'nehellenia';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/c5/DRSV1Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'sverige-s1' AND queen_id = 'fontana';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/c5/DRSV1Banner.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'sverige-s1' AND queen_id = 'vanity-vain';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/df/MirandaLebr%C3%A3oDRBR1CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'brasil-s1' AND queen_id = 'miranda-lebro';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b9/TessaTesticleDRGR1CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'germany-s1' AND queen_id = 'tessa-testicle';
UPDATE public.season_queens SET image_url = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/91/TheOnlyNaomyDRGR1CastMug.jpg/revision/latest/scale-to-width-down/400' WHERE season_id = 'germany-s1' AND queen_id = 'the-only-naomy';