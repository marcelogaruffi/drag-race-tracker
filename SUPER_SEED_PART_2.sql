-- INSERT FRANCHISES
INSERT INTO public.franchises (id, name, country) VALUES
('us-all-stars-untucked', 'RuPaul''s Drag Race All Stars: Untucked', 'US'),
('down-under-vs-tw', 'Drag Race Down Under vs. The World', 'AU'),
('espana-all-stars', 'Drag Race España All Stars', 'ES'),
('france-all-stars', 'Drag Race France All Stars', 'FR'),
('mexico-latina-royale', 'Drag Race México: Latina Royale', 'MX'),
('philippines-slaysian', 'Drag Race Philippines: Slaysian Royale', 'PH'),
('philippines-untucked', 'Drag Race Philippines: Untucked!', 'PH'),
('global-all-stars', 'RuPaul''s Drag Race Global All Stars', 'US')
ON CONFLICT (id) DO NOTHING;

-- INSERT SEASONS
INSERT INTO public.seasons (id, franchise_id, name, release_year, type) VALUES
('down-under-vs-tw-s1', 'down-under-vs-tw', 'Season 1', 2026, 'vs-the-world'),
('espana-all-stars-s1', 'espana-all-stars', 'Season 1', 2024, 'all-stars'),
('france-s4', 'france', 'Season 4', 2026, 'regular'),
('france-all-stars-s1', 'france-all-stars', 'Season 1', 2025, 'all-stars'),
('mexico-latina-royale-s1', 'mexico-latina-royale', 'Season 1', 2026, 'regular'),
('philippines-slaysian-s1', 'philippines-slaysian', 'Season 1', 2026, 'regular'),
('global-all-stars-s1', 'global-all-stars', 'Season 1', 2024, 'all-stars'),
('down-under-s4', 'down-under', 'Season 4', 2024, 'regular'),
('philippines-untucked-s1', 'philippines-untucked', 'Season 1', 2022, 'untucked'),
('philippines-untucked-s2', 'philippines-untucked', 'Season 2', 2023, 'untucked'),
('philippines-untucked-s3', 'philippines-untucked', 'Season 3', 2024, 'untucked'),
('us-all-stars-untucked-s1', 'us-all-stars-untucked', 'Season 1', 2012, 'all-stars'),
('us-all-stars-untucked-s5', 'us-all-stars-untucked', 'Season 5', 2020, 'all-stars'),
('us-all-stars-untucked-s6', 'us-all-stars-untucked', 'Season 6', 2021, 'all-stars'),
('us-all-stars-untucked-s7', 'us-all-stars-untucked', 'Season 7', 2022, 'all-stars'),
('us-all-stars-untucked-s8', 'us-all-stars-untucked', 'Season 8', 2023, 'all-stars'),
('us-all-stars-untucked-s9', 'us-all-stars-untucked', 'Season 9', 2024, 'all-stars')
ON CONFLICT (id) DO NOTHING;

