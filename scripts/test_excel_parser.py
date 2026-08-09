import pandas as pd
import math

xl = pd.ExcelFile("C:\\DragRaceTracker\\drag-race-tracker\\Cópia de RuPaul's Drag Race.xlsx")
df = xl.parse('🇺🇸')

current_season = None
for index, row in df.iterrows():
    col0 = str(row.iloc[0]).strip()
    
    if col0.startswith('Season'):
        current_season = col0.split(' ')[1]
        print(f"\n--- Found Season {current_season} ---")
        continue
    
    if pd.isna(row.iloc[0]) or col0 == 'nan' or col0 == 'None':
        continue
        
    queen_name = col0
    # Scan columns for 'Elim'
    elim_ep = None
    winner = False
    for col_idx in range(1, len(row)):
        val = str(row.iloc[col_idx]).strip().lower()
        if val in ['elim', 'out', 'quit', 'disq', 'elim.']:
            elim_ep = col_idx
            break
        if val == 'winner':
            winner = True
            elim_ep = col_idx
            break
            
    if winner:
        print(f"Winner: {queen_name} in Ep {elim_ep}")
    elif elim_ep:
        print(f"Eliminated: {queen_name} in Ep {elim_ep}")
    else:
        print(f"Unknown status: {queen_name}")
