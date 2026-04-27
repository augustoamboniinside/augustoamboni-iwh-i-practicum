const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.PRIVATE_APP_ACCESS_TOKEN;
const CUSTOM_OBJECT_ID = process.env.CUSTOM_OBJECT_ID;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}?properties=name,species,age`,
      { headers }
    );

    res.render('homepage', {
      title: 'Pets Table | Integrating With HubSpot I Practicum',
      pets: response.data.results
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Error loading custom object records.');
  }
});

app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

app.post('/update-cobj', async (req, res) => {
  try {
    await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`,
      {
        properties: {
          name: req.body.name,
          species: req.body.species,
          age: req.body.age
        }
      },
      { headers }
    );

    res.redirect('/');

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Error creating custom object record.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});