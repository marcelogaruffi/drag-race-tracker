const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const seasons = [
  { id: 'us-s1', name: 'US Season 1', franchise: 'US', release_date: '2009-02-02', cover_image: null, type: 'regular', prerequisites: [] },
  { id: 'us-s2', name: 'US Season 2', franchise: 'US', release_date: '2010-02-01', cover_image: null, type: 'regular', prerequisites: [] },
  { id: 'us-s3', name: 'US Season 3', franchise: 'US', release_date: '2011-01-24', cover_image: null, type: 'regular', prerequisites: [] },
  { id: 'us-s4', name: 'US Season 4', franchise: 'US', release_date: '2012-01-30', cover_image: null, type: 'regular', prerequisites: [] },
  { id: 'as-s1', name: 'All Stars 1', franchise: 'US', release_date: '2012-10-22', cover_image: null, type: 'all_stars', prerequisites: ['us-s1', 'us-s2', 'us-s3', 'us-s4'] },
  { id: 'uk-s1', name: 'UK Season 1', franchise: 'UK', release_date: '2019-10-03', cover_image: null, type: 'regular', prerequisites: [] },
  { id: 'uk-vs-tw-s1', name: 'UK vs The World', franchise: 'UK', release_date: '2022-02-01', cover_image: null, type: 'vs_the_world', prerequisites: ['us-s10', 'uk-s1', 'holland-s1', 'canada-s1'] }
];

async function seed() {
  console.log('Seeding data...');
  const { data, error } = await supabase.from('seasons').upsert(seasons);
  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log('Data seeded successfully!');
  }
}

seed();
