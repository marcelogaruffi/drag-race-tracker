-- Fix Canada Franchises
-- Rename the existing vs The World franchise (currently using the id 'can-all-stars')
UPDATE public.franchises 
SET name = 'Canada''s Drag Race: Canada vs The World' 
WHERE id = 'can-all-stars';

-- Insert the brand new Canada All Stars franchise
INSERT INTO public.franchises (id, name, release_year, is_all_stars, sort_order)
VALUES ('can-as', 'Canada''s Drag Race: All Stars', 2026, true, 25)
ON CONFLICT (id) DO UPDATE SET name = 'Canada''s Drag Race: All Stars';
