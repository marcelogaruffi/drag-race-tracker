import fs from 'fs';
let sql = fs.readFileSync('FINAL_PERFECT_SEED.sql', 'utf8');
sql = "DELETE FROM public.franchises WHERE id IN ('ruvealed-us', 'mexico-el-recuento');\n\n" + sql;
fs.writeFileSync('FINAL_PERFECT_SEED.sql', sql);
