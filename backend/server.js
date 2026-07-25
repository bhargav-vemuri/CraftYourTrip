require('dotenv').config();
const express = require('express');
const cors = require('cors');

const tripRoutes = require('./routes/tripRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Routes
app.use('/api/trips', tripRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CraftYourTrip backend is running.'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
