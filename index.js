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
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/autocomplete?query=${ingredient}&metaInformation=true&number=10`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Mashape-Key': process.env.FOOD_API_KEY,
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

app.get('/recipe-search-by-ingredients', async (req, res, next) => {
  try {
    const ingredients = req.query.q
    const apiResult = await fetch(
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=10&ranking=2&ingredients=${ingredients}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Mashape-Key': process.env.FOOD_API_KEY,
        },
      }
    )
    const data = await apiResult.json()
    res.json(data)
  } catch (error) {
    next(error)
  }
})

app.get('/get-recipe-info', async (req, res, next) => {
  try {
    const id = req.query.q
    const apiInstructionsResult = await fetch(
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/analyzedInstructions`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Mashape-Key': process.env.FOOD_API_KEY,
        },
      }
    )
    const apiSummaryResult = await fetch(
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/summary`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Mashape-Key': process.env.FOOD_API_KEY,
        },
      }
    )
    const apiInfoResult = await fetch(
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Mashape-Key': process.env.FOOD_API_KEY,
        },
      }
    )
    const instructionsData = await apiInstructionsResult.json()
    const summaryData = await apiSummaryResult.json()
    const infoData = await apiInfoResult.json()

    const data = {
      ...summaryData,
      instructions: instructionsData,
      image: infoData.image,
      prepTime: infoData.readyInMinutes,
      servings: infoData.servings,
      cheap: infoData.cheap,
      popular: infoData.popular,
      vegetarian: infoData.vegetarian,
      vegan: infoData.vegan,
    }
    res.json(data)
  } catch (error) {
    next(error)
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
