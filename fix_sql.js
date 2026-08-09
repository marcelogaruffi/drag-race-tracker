const fs = require('fs');
const file = 'C:/DragRaceTracker/drag-race-tracker/UPDATE_QUEENS_IMAGES.sql';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\\n/g, '\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed!');
