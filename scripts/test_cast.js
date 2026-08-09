const fs = require('fs');

async function testTVMazeCast() {
  // RuPaul's Drag Race All Stars is show ID 12134
  // Let's get the cast for All Stars
  const res = await fetch(`https://api.tvmaze.com/shows/12134/cast`);
  const data = await res.json();
  console.log("All Stars Cast count:", data.length);
  if (data.length > 0) {
    console.log("Sample:", data.slice(0, 5).map(d => d.person.name));
  }
}

testTVMazeCast();
