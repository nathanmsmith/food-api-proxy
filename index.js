const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch').default
const app = express()
require('dotenv').config()

const port = process.env.PORT || 3000

app.use(cors())

app.get('/ingredient-search', async (req, res, next) => {
  try {
    const ingredient = req.query.q
    const apiResult = await fetch(
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/autocomplete?query=${ingredient}&number=10`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Mashape-Key': process.env.FOOD_API_KEY,
          'X-Mashape-Host':
            'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
        },
      }
    )
    const data = await apiResult.json()
    const dataWithImageURLs = data.map(ingredient => {
      ingredient.image = `https://spoonacular.com/cdn/ingredients_250x250/${
        ingredient.image
      }`
      return ingredient
    })
    res.json(dataWithImageURLs)
  } catch (error) {
    next(error)
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
