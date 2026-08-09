-- UPDATE FRANCHISE COVERS
UPDATE public.franchises SET cover_image = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/96/CDRCAVSTWLogo.png/revision/latest/scale-to-width-down/400' WHERE id = 'can-vs-tw';
UPDATE public.franchises SET cover_image = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/0a/GASLogo.png/revision/latest/scale-to-width-down/400' WHERE id = 'global-all-stars';

-- UPDATE SEASON COVERS
UPDATE public.seasons SET cover_image = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/96/CDRCAVSTWLogo.png/revision/latest/scale-to-width-down/400' WHERE franchise_id = 'can-vs-tw';
UPDATE public.seasons SET cover_image = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/0a/GASLogo.png/revision/latest/scale-to-width-down/400' WHERE franchise_id = 'global-all-stars';
UPDATE public.franchises SET cover_image = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/14/UntuckedASLogo.png/revision/latest/scale-to-width-down/400' WHERE id = 'us-all-stars-untucked';
UPDATE public.seasons SET cover_image = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/14/UntuckedASLogo.png/revision/latest/scale-to-width-down/400' WHERE franchise_id = 'us-all-stars-untucked';
UPDATE public.franchises SET cover_image = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/5e/UntuckedPHLogo.webp/revision/latest/scale-to-width-down/400' WHERE id = 'philippines-untucked';
UPDATE public.seasons SET cover_image = 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/5e/UntuckedPHLogo.webp/revision/latest/scale-to-width-down/400' WHERE franchise_id = 'philippines-untucked';
