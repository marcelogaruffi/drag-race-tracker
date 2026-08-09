-- Seed Queens from Wikipedia

-- Insert Queens
INSERT INTO queens (id, name) VALUES ('1', '1') ON CONFLICT DO NOTHING;
INSERT INTO queens (id, name) VALUES ('2', '2') ON CONFLICT DO NOTHING;
INSERT INTO queens (id, name) VALUES ('3', '3') ON CONFLICT DO NOTHING;
INSERT INTO queens (id, name) VALUES ('4', '4') ON CONFLICT DO NOTHING;
INSERT INTO queens (id, name) VALUES ('5', '5') ON CONFLICT DO NOTHING;
INSERT INTO queens (id, name) VALUES ('6', '6') ON CONFLICT DO NOTHING;
INSERT INTO queens (id, name) VALUES ('7', '7') ON CONFLICT DO NOTHING;
INSERT INTO queens (id, name) VALUES ('8', '8') ON CONFLICT DO NOTHING;
INSERT INTO queens (id, name) VALUES ('9', '9') ON CONFLICT DO NOTHING;
INSERT INTO queens (id, name) VALUES ('10', '10') ON CONFLICT DO NOTHING;
INSERT INTO queens (id, name) VALUES ('11', '11') ON CONFLICT DO NOTHING;

-- Insert Appearances
INSERT INTO season_queens (season_id, queen_id, placement) VALUES ('us-all-stars-s41', '1', 'San Diego, California') ON CONFLICT DO NOTHING;
INSERT INTO season_queens (season_id, queen_id, placement) VALUES ('us-all-stars-s30', '2', 'Los Angeles, California') ON CONFLICT DO NOTHING;
INSERT INTO season_queens (season_id, queen_id, placement) VALUES ('us-all-stars-s28', '3', 'Los Angeles, California') ON CONFLICT DO NOTHING;
INSERT INTO season_queens (season_id, queen_id, placement) VALUES ('us-all-stars-s28', '4', 'New York City, New York') ON CONFLICT DO NOTHING;
INSERT INTO season_queens (season_id, queen_id, placement) VALUES ('us-all-stars-s30', '5', 'Chicago, Illinois') ON CONFLICT DO NOTHING;
INSERT INTO season_queens (season_id, queen_id, placement) VALUES ('us-all-stars-s37', '6', 'Los Angeles, California') ON CONFLICT DO NOTHING;
INSERT INTO season_queens (season_id, queen_id, placement) VALUES ('us-all-stars-s33', '7', 'Portland, Oregon') ON CONFLICT DO NOTHING;
INSERT INTO season_queens (season_id, queen_id, placement) VALUES ('us-all-stars-s39', '8', 'Victoria, Canada') ON CONFLICT DO NOTHING;
INSERT INTO season_queens (season_id, queen_id, placement) VALUES ('us-all-stars-s29', '9', 'Atlanta, Georgia') ON CONFLICT DO NOTHING;
INSERT INTO season_queens (season_id, queen_id, placement) VALUES ('us-all-stars-s39', '10', 'Orlando, Florida') ON CONFLICT DO NOTHING;
INSERT INTO season_queens (season_id, queen_id, placement) VALUES ('us-all-stars-s35', '11', 'Los Angeles, California') ON CONFLICT DO NOTHING;
