CREATE OR REPLACE FUNCTION get_locked_seasons(p_user_id uuid, p_season_ids text[])
RETURNS TABLE (season_id text, required_season text, required_season_name text, queen_name text) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT 
    sq_current.season_id,
    s_past.id as required_season,
    s_past.name as required_season_name,
    q.name as queen_name
  FROM season_queens sq_current
  JOIN season_queens sq_past ON sq_current.queen_id = sq_past.queen_id
  JOIN seasons s_current ON sq_current.season_id = s_current.id
  JOIN seasons s_past ON sq_past.season_id = s_past.id
  JOIN queens q ON sq_current.queen_id = q.id
  WHERE sq_current.season_id = ANY(p_season_ids)
    -- s_past was released before s_current
    AND s_past.release_year < s_current.release_year
    -- user has not watched ANY episodes of s_past (or we can require ALL, but for now ANY is safer)
    AND NOT EXISTS (
      SELECT 1 FROM user_progress up 
      JOIN episodes e ON up.episode_id = e.id
      WHERE up.user_id = p_user_id AND e.season_id = s_past.id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
