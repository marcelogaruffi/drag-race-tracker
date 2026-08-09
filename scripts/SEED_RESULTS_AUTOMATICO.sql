-- AUTO GENERATED EPISODE RESULTS BY ROBÔ CAÇADOR DE SPOILERS

INSERT INTO episode_results (episode_id, queen_id, status) VALUES
  ('can-regular-s1-e1', 'priyanka', 'winner'),
  ('us-regular-s1-e1', 'bebe-zahara-benet', 'winner'),
  ('us-regular-s1-e1', 'nina-flowers', 'runner_up'),
  ('us-regular-s2-e1', 'tyra-sanchez', 'winner'),
  ('us-regular-s2-e1', 'raven', 'runner_up'),
  ('us-all-stars-s8-e3', 'jimbo', 'winner'),
  ('us-all-stars-s8-e2', 'kandy-muse', 'runner_up'),
  ('us-all-stars-s8-e3', 'kandy-muse', 'runner_up'),
  ('uk-regular-s1-e1', 'the-vivienne', 'winner'),
  ('uk-regular-s1-e1', 'divina-de-campo', 'runner_up')
ON CONFLICT DO NOTHING;
