require('dotenv').config();
const { generateTrip } = require('./controllers/tripController');

async function test() {
  const req = {
    body: {
      prompt: '3 days in Tokyo',
      budget: '1000',
      duration: '3 days',
      travelStyle: 'Solo',
      interests: ['Food']
    }
  };
  const res = {
    status: (code) => ({
      json: (data) => console.log('STATUS:', code, 'DATA:', JSON.stringify(data, null, 2))
    })
  };
  await generateTrip(req, res);
}

test();
