import sys
import pandas as pd
sys.stdout.reconfigure(encoding='utf-8')

# Load the spreadsheet
xl = pd.ExcelFile("C:\\DragRaceTracker\\drag-race-tracker\\Cópia de RuPaul's Drag Race.xlsx")

# Print all sheet names
print("Available sheets:", xl.sheet_names)

# Inspect the first few sheets to see the format
for sheet in xl.sheet_names[:5]:
    print(f"\n--- Sheet: {sheet} ---")
    df = xl.parse(sheet)
    print(df.head(10))
