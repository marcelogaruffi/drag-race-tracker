import pandas as pd
import json

xl = pd.ExcelFile("C:\\DragRaceTracker\\drag-race-tracker\\Cópia de RuPaul's Drag Race.xlsx")
df = xl.parse('🇺🇸')

db_excel = {}

current_season = None
for index, row in df.iterrows():
    col0 = str(row.iloc[0]).strip()
    
    if col0.startswith('Season'):
        current_season = col0.split(' ')[1]
        db_excel[current_season] = []
        continue
    
    if pd.isna(row.iloc[0]) or col0 == 'nan' or col0 == 'None':
        continue
        
    queen_name = col0
    elim_ep = None
    status_label = 'safe'
    
    for col_idx in range(1, len(row)):
        val = str(row.iloc[col_idx]).strip().lower()
        if val in ['elim', 'out', 'quit', 'disq', 'elim.']:
            elim_ep = col_idx
            status_label = 'eliminated'
            break
        if val == 'winner':
            elim_ep = col_idx
            status_label = 'winner'
            break
        if val == 'runner up':
            elim_ep = col_idx
            status_label = 'runner_up'
            break
            
    db_excel[current_season].append({
        'queen': queen_name,
        'elim_ep': elim_ep,
        'status': status_label
    })

with open("C:\\DragRaceTracker\\drag-race-tracker\\scripts\\parsed_excel.json", "w", encoding='utf-8') as f:
    json.dump(db_excel, f, ensure_ascii=False, indent=2)

print("Parsed Excel saved to parsed_excel.json")
