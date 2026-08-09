SELECT DISTINCT
    s_current.id as season_id,
    s_past.id as required_season,
    s_past.name as required_season_name,
    CAST('Ordem Cronológica' AS text) as reason
  FROM seasons s_current
  JOIN seasons s_past ON s_current.franchise_id = s_past.franchise_id
  WHERE s_current.id = 'us-regular-s2'
    AND s_past.release_year < s_current.release_year
    AND (
      SELECT count(*) FROM user_progress up 
      JOIN episodes e ON up.episode_id = e.id
      WHERE up.user_id = '37d6cdd2-65de-43d9-9095-fdb28741388a' AND e.season_id = s_past.id
    ) < (SELECT NULLIF(count(*), 0) FROM episodes WHERE episodes.season_id = s_past.id);
