import pandas as pd

# Load the spreadsheet
xl = pd.ExcelFile('drag_race_data.xlsx')

# Print all sheet names
print("Available sheets:", xl.sheet_names)

# Inspect the first sheet that isn't 'Winners'
for sheet in xl.sheet_names:
    print(f"\n--- Sheet: {sheet} ---")
    df = xl.parse(sheet)
    print(df.head(5))
