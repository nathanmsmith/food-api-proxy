const express = require('express');
const fetch = require('node-fetch');
const app = express();
require('dotenv').config();

const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/ingredient-search', async (req, res) => {
  const ingredient = req.query.q;
  const apiResult = await fetch(
    `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/autocomplete?query=${ingredient}&number=10`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Mashape-Key': process.env.FOOD_API_KEY,
        'X-Mashape-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
      },
    }
  );
  const data = await apiResult.json();
  return res.send(data);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
