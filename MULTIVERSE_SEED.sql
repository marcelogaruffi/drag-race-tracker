-- MULTIVERSO DRAG RACE - SEED FINAL

-- 1. Inserindo Queens com Fotos
INSERT INTO queens (id, name, image_url) VALUES
('talent-show', 'Talent Show', ''),
('onya-nurvegroup-2', 'Onya Nurve(Group 2)', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/11/OnyaNurveS17MiniPromo.jpg'),
('jewels-sparklesgroup-1', 'Jewels Sparkles(Group 1)', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/70/JewelsSparklesS17MiniPromo.jpg'),
('lexigroup-2', 'Lexi(Group 2)', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/d8/LexiS17MiniPromo.jpg'),
('sam-stargroup-2', 'Sam Star(Group 2)', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a2/SamStarS17MiniPromo.jpg'),
('suzie-tootgroup-1', 'Suzie Toot(Group 1)', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/bc/SuzieTootS17MiniPromo.jpg'),
('lana-jaraegroup-2', 'Lana Ja''Rae(Group 2)', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/8b/LanaJa%27RaeS17MiniPromo.jpg'),
('lydia-b-kollinsgroup-1', 'Lydia B Kollins(Group 1)', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/79/LydiaBKollinsS17MiniPromo.jpg'),
('arriettygroup-1', 'Arrietty(Group 1)', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/ce/ArriettyS17MiniPromo.jpg'),
('kori-kinggroup-2', 'Kori King(Group 2)', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/3e/KoriKingS17MiniPromo.jpg'),
('acacia-forgotgroup-1', 'Acacia Forgot(Group 1)', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/3/3a/AcaciaForgotS17MiniPromo.jpg'),
('crystal-envygroup-2', 'Crystal Envy(Group 2)', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/62/CrystalEnvyS17MiniPromo.jpg'),
('hormona-lisagroup-2', 'Hormona Lisa(Group 2)', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/60/HormonaLisaS17MiniPromo.jpg'),
('joellagroup-1', 'Joella(Group 1)', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/27/JoellaS17MiniPromo.jpg'),
('lucky-starzzzgroup-1', 'Lucky Starzzz(Group 1)', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/19/LuckyStarzzzS17MiniPromo.jpg'),
('design', 'Design', ''),
('myki-meeks', 'Myki Meeks', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/69/MykiMeeksS18MiniPromo.jpg'),
('nini-coco', 'Nini Coco', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/63/NiniCocoS18MiniPromo.jpg'),
('darlene-mitchell', 'Darlene Mitchell', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/2f/DarleneMitchellS18MiniPromo.jpg'),
('juicy-love-dion', 'Juicy Love Dion', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/54/JuicyLoveDionS18MiniPromo.jpg'),
('jane-dont', 'Jane Don''t', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/02/JaneDon%27tS18MiniPromo.jpg'),
('discord-addams', 'Discord Addams', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/8a/DiscordAddamsS18MiniPromo.jpg'),
('kenya-pleaser', 'Kenya Pleaser', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/99/KenyaPleaserS18MiniPromo.jpg'),
('athena-dion', 'Athena Dion', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/2e/AthenaDionS18MiniPromo.jpg'),
('mia-starr', 'Mia Starr', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b3/MiaStarrS18MiniPromo.jpg'),
('vita-vontesse-starr', 'Vita VonTesse Starr', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/c5/VitaVonTesseStarrS18MiniPromo.jpg'),
('ciara-myst', 'Ciara Myst', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b2/CiaraMystS18MiniPromo.jpg'),
('briar-blush', 'Briar Blush', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/a/a4/BriarBlushS18MiniPromo.jpg'),
('mandy-mango', 'Mandy Mango', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/5e/MandyMangoS18MiniPromo.jpg'),
('dd-fuego', 'DD Fuego', 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/11/DDFuegoS18MiniPromo.jpg')
ON CONFLICT (id) DO UPDATE SET image_url = COALESCE(NULLIF(EXCLUDED.image_url, ''), queens.image_url);

-- 2. Vinculando Queens às Temporadas
INSERT INTO season_queens (season_id, queen_id) VALUES
('us-regular-s17', 'talent-show'),
('us-regular-s17', 'onya-nurvegroup-2'),
('us-regular-s17', 'jewels-sparklesgroup-1'),
('us-regular-s17', 'lexigroup-2'),
('us-regular-s17', 'sam-stargroup-2'),
('us-regular-s17', 'suzie-tootgroup-1'),
('us-regular-s17', 'lana-jaraegroup-2'),
('us-regular-s17', 'lydia-b-kollinsgroup-1'),
('us-regular-s17', 'arriettygroup-1'),
('us-regular-s17', 'kori-kinggroup-2'),
('us-regular-s17', 'acacia-forgotgroup-1'),
('us-regular-s17', 'crystal-envygroup-2'),
('us-regular-s17', 'hormona-lisagroup-2'),
('us-regular-s17', 'joellagroup-1'),
('us-regular-s17', 'lucky-starzzzgroup-1'),
('us-regular-s18', 'design'),
('us-regular-s18', 'myki-meeks'),
('us-regular-s18', 'nini-coco'),
('us-regular-s18', 'darlene-mitchell'),
('us-regular-s18', 'juicy-love-dion'),
('us-regular-s18', 'jane-dont'),
('us-regular-s18', 'discord-addams'),
('us-regular-s18', 'kenya-pleaser'),
('us-regular-s18', 'athena-dion'),
('us-regular-s18', 'mia-starr'),
('us-regular-s18', 'vita-vontesse-starr'),
('us-regular-s18', 'ciara-myst'),
('us-regular-s18', 'briar-blush'),
('us-regular-s18', 'mandy-mango'),
('us-regular-s18', 'dd-fuego')
ON CONFLICT DO NOTHING;

-- 3. Cadastrando Resultados dos Episódios
INSERT INTO episode_results (episode_id, queen_id, status)
SELECT v.episode_id, v.queen_id, v.status
FROM (VALUES
('us-regular-s17-e16', 'onya-nurvegroup-2', 'winner'),
('us-regular-s17-e16', 'lexigroup-2', 'eliminated'),
('us-regular-s17-e15', 'sam-stargroup-2', 'eliminated'),
('us-regular-s17-e14', 'suzie-tootgroup-1', 'eliminated'),
('us-regular-s17-e15', 'suzie-tootgroup-1', 'winner'),
('us-regular-s17-e12', 'lana-jaraegroup-2', 'eliminated'),
('us-regular-s17-e11', 'lydia-b-kollinsgroup-1', 'eliminated'),
('us-regular-s17-e10', 'arriettygroup-1', 'eliminated'),
('us-regular-s17-e9', 'kori-kinggroup-2', 'eliminated'),
('us-regular-s17-e8', 'acacia-forgotgroup-1', 'eliminated'),
('us-regular-s17-e7', 'crystal-envygroup-2', 'eliminated'),
('us-regular-s17-e6', 'hormona-lisagroup-2', 'eliminated'),
('us-regular-s17-e4', 'joellagroup-1', 'eliminated'),
('us-regular-s17-e3', 'lucky-starzzzgroup-1', 'eliminated'),
('us-regular-s18-e16', 'myki-meeks', 'winner'),
('us-regular-s18-e16', 'darlene-mitchell', 'eliminated'),
('us-regular-s18-e14', 'juicy-love-dion', 'eliminated'),
('us-regular-s18-e15', 'juicy-love-dion', 'winner'),
('us-regular-s18-e13', 'jane-dont', 'eliminated'),
('us-regular-s18-e11', 'kenya-pleaser', 'eliminated'),
('us-regular-s18-e9', 'athena-dion', 'eliminated'),
('us-regular-s18-e8', 'mia-starr', 'eliminated'),
('us-regular-s18-e7', 'vita-vontesse-starr', 'eliminated'),
('us-regular-s18-e6', 'ciara-myst', 'eliminated'),
('us-regular-s18-e4', 'briar-blush', 'eliminated'),
('us-regular-s18-e3', 'mandy-mango', 'eliminated'),
('us-regular-s18-e2', 'dd-fuego', 'eliminated')
) AS v(episode_id, queen_id, status)
WHERE EXISTS (SELECT 1 FROM episodes e WHERE e.id = v.episode_id)
ON CONFLICT (episode_id, queen_id) DO UPDATE SET status = EXCLUDED.status;

