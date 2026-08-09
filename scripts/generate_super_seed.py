import pandas as pd
import math
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

# 1. Mapeamento de Abas para Franchise IDs
tab_to_franchise = {
    '🇺🇸': 'us-regular',
    '🌟': 'us-all-stars',
    '🌎🌟': 'global-all-stars',
    '🇬🇧': 'uk-regular',
    '🇬🇧 v. 🌎': 'uk-vs-tw',
    '🇨🇦': 'can-regular',
    '🇨🇦 v. 🌎': 'can-all-stars',
    '🇨🇦🌟': 'can-all-stars',
    '🇪🇸': 'espana',
    '🇪🇸🌟': 'espana-all-stars',
    '🇫🇷': 'france',
    '🇫🇷🌟': 'france-all-stars',
    '🇵🇭': 'philippines',
    '🇵🇭🌟': 'philippines-all-stars', # Guess if this exists
    '🇦🇺': 'down-under',
    ' 🇦🇺 v. 🌎': 'down-under-vs-tw',
    '🇲🇽': 'mexico',
    '🇲🇽🌟': 'mexico-all-stars',
    '🇹🇭': 'thailand',
    '🇳🇱': 'holland',
    '🇮🇹': 'italia',
    '🇸🇪': 'sverige',
    '🇧🇪': 'belgique',
    '🇧🇷': 'brasil',
    '🇩🇪': 'germany'
}

def clean_id(name):
    # Regex to clean queen ID: lowercase, replace spaces with hyphens, remove special characters
    return re.sub(r'[^a-z0-9-]', '', name.strip().lower().replace(' ', '-').replace("'", "").replace('"', ''))

xl = pd.ExcelFile("C:\\DragRaceTracker\\drag-race-tracker\\Cópia de RuPaul's Drag Race.xlsx")

sql_statements = [
    "-- ==========================================",
    "-- DRAG RACE TRACKER: SUPER SEED DO EXCEL",
    "-- ==========================================",
    "BEGIN;",
    "DELETE FROM episode_results;",
    "DELETE FROM season_queens;",
    "-- NOTA: NÃO deletamos a tabela queens para preservar as imagens que já existem!",
    ""
]

valid_seasons = set()
with open("C:\\DragRaceTracker\\drag-race-tracker\\scripts\\seed_all_seasons.sql", "r", encoding="utf-8") as f:
    content = f.read()
    # Match ('season-id', ...)
    for match in re.finditer(r"\('([a-z0-9-]+)',", content):
        valid_seasons.add(match.group(1))

queens_set = set()
season_queens = []
episode_results = []

for sheet in xl.sheet_names:
    if sheet not in tab_to_franchise:
        continue
    
    franchise_id = tab_to_franchise[sheet]
    df = xl.parse(sheet)
    
    current_season = None
    season_id = None
    
    for index, row in df.iterrows():
        col0 = str(row.iloc[0]).strip()
        
        if col0.startswith('Season'):
            current_season = col0.split(' ')[1]
            season_id = f"{franchise_id}-s{current_season}"
            continue
            
        if not season_id or season_id not in valid_seasons:
            continue
            
        if pd.isna(row.iloc[0]) or col0 == 'nan' or col0 == 'None':
            continue
            
        queen_name = col0
        # Check if the queen name contains "Team " (All Stars 1 case)
        if "Team " in queen_name:
             queen_name = str(row.iloc[1]).strip() # usually the second column has the real name for AS1
             if pd.isna(row.iloc[1]) or queen_name == 'nan': continue
             
        # Sanitize queen name
        queen_name = queen_name.replace("'", "''") # SQL Escape
        q_id = clean_id(queen_name)
        
        if q_id not in queens_set:
            sql_statements.append(f"INSERT INTO queens (id, name) VALUES ('{q_id}', '{queen_name}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;")
            queens_set.add(q_id)
            
        season_queens.append(f"INSERT INTO season_queens (season_id, queen_id) VALUES ('{season_id}', '{q_id}') ON CONFLICT DO NOTHING;")
        
        elim_ep = None
        status = 'safe'
        
        # Scan columns to find status
        for col_idx in range(1, len(row)):
            val = str(row.iloc[col_idx]).strip().lower()
            if pd.isna(row.iloc[col_idx]) or val == 'nan': continue
            
            if val in ['elim', 'out', 'quit', 'disq', 'elim.', 'kneed']:
                elim_ep = col_idx
                status = 'eliminated'
                break
            if val == 'winner':
                elim_ep = col_idx
                status = 'winner'
                break
            if val == 'runner up' or val == 'runner-up':
                elim_ep = col_idx
                status = 'runner_up'
                break
                
        if elim_ep:
            # We map the Excel column index to the episode number roughly
            ep_id = f"{season_id}-e{elim_ep}"
            
            # Ensure episode exists
            sql_statements.append(f"INSERT INTO episodes (id, season_id, episode_number, title) VALUES ('{ep_id}', '{season_id}', {elim_ep}, 'Episode {elim_ep}') ON CONFLICT DO NOTHING;")
            episode_results.append(f"INSERT INTO episode_results (episode_id, queen_id, status) VALUES ('{ep_id}', '{q_id}', '{status}') ON CONFLICT DO NOTHING;")

sql_statements.append("\n-- INSERTING SEASON QUEENS")
sql_statements.extend(season_queens)
sql_statements.append("\n-- INSERTING EPISODE RESULTS")
sql_statements.extend(episode_results)
sql_statements.append("COMMIT;")

with open("C:\\DragRaceTracker\\drag-race-tracker\\SUPER_SEED.sql", "w", encoding='utf-8') as f:
    f.write("\n".join(sql_statements))

print("SUPER_SEED.sql gerado com sucesso!")
