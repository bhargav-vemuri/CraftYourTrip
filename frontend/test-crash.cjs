const puppeteer = require('puppeteer');  
(async () => {  
  const browser = await puppeteer.launch();  
  const page = await browser.newPage();  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));  
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.toString()));  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });  
  await page.evaluate(() => {  
    window.localStorage.setItem('craftyourtrip-itinerary', JSON.stringify({tripTitle:'T',summary:'S',days:[{day:1,title:'T',stops:[{id:'s1',name:'T',coordinates:{lat:0,lng:0}}]}]}));  
  });  
  await page.reload({ waitUntil: 'networkidle2' });  
  await new Promise(r => setTimeout(r, 2000));  
  await browser.close();  
})(); 
