import https from 'https';
https.get('https://docs.google.com/spreadsheets/d/1noxqmWiyGO7qAoPBhpMRCOQ-jkMoWFXyJ_cgwsQu8H8/edit?usp=sharing', (res) => { 
  let data = ''; 
  res.on('data', chunk => data += chunk); 
  res.on('end', () => { 
    const regex = /\[\"(\d+)\",\"([^\"]+)\"/g;
    let match;
    const tabs = [];
    while ((match = regex.exec(data)) !== null) {
      if (!tabs.find(t => t.gid === match[1])) {
         tabs.push({ gid: match[1], name: match[2] });
      }
    }
    console.log(tabs);
  }); 
});
