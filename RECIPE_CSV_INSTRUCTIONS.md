# Recipe CSV Template - Instructions

## Overview
This CSV template allows you to add multiple recipes to the platform at once. Download the template, fill it out, and upload it back to the website.

## Required Fields
- **name**: The name of the recipe (e.g., "Shakshuka")
- **diet**: The dietary category (e.g., Vegetarian, Vegan, Gluten-Free, Meat-Based)
- **ingredients**: List of ingredients with quantities and units
- **instructions**: Step-by-step cooking instructions
- **image_path**: Path to the recipe image

## Optional Fields
- **video_url**: YouTube or video link (include full URL with timestamp if desired)
- **cost**: Estimated cost per portion (decimal number)
- **portions**: Number of servings this recipe makes

## How to Fill Out the Template

### Ingredients Format
List all ingredients separated by semicolons (;), with each ingredient including quantity and unit:
```
Basil (5g); Eggs (2 units); Garlic (13g); Tomato (385g)
```

Format: `Ingredient Name (quantity unit)`
- Common units: g (grams), ml (milliliters), units, cups, tbsp (tablespoon), tsp (teaspoon)

### Instructions Format
Each step on a new line, starting with the step number:
```
1. Prepare all ingredients by dicing them finely
2. Heat olive oil in a large pan
3. Sauté the aromatics until fragrant
4. Add tomatoes and simmer for 15 minutes
```

### Image Path
Provide the path where the image will be stored:
```
/uploads/images/shakshuka.webp
```
*Note: Make sure the image file is uploaded separately to the server*

### Video URL
Include the full YouTube URL with optional timestamp:
```
https://youtu.be/SjCkW-oAFQ8?si=v9Qbr-baRJAgQBK1&t=31
```

## Tips
- Use quotes ("") around fields that contain commas
- Keep ingredient names consistent across recipes for better organization
- Be descriptive in instructions for user clarity
- Use decimal format for cost (e.g., 2.40, not 2,40)
- Portions should be a whole number

## Example Recipe
See the Shakshuka example row in the template CSV for a complete reference.

## Support
If you have any issues uploading the CSV, check that:
1. All required fields are filled out
2. Ingredient quantities follow the format: `Name (quantity unit)`
3. Image paths are valid and images are uploaded
4. All text is properly enclosed in quotes if it contains special characters
