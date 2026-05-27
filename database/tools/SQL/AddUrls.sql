/* UPDATE dev_dba.all_recipes
SET 
    instructions = $$**Prepare ingredients**:
    - Finely dice all ingredients, really small cuts
    **Sauté aromatics**:
    - Heat olive oil in a large pan
    - Brown the garlic, onion and the pepper
    - Add the tomato and season, let it in low heat until the sauce is thickened

    **Add tomatoes and spices**:
    - Add the tomato and season
    - Salt to taste
    - Simmer for 15-20 minutes until thickened

    **Add eggs**:
    - Make wells in the sauce and crack eggs
    - Cover and cook until eggs are set (5-7 minutes)

    **Serve**:
    - Serve hot with Saloia bread (100g) on the side
    - Garnish with fresh herbs if desired$$,
    image = '/uploads/images/shakshuka.webp',
    url = 'https://youtu.be/SjCkW-oAFQ8?si=v9Qbr-baRJAgQBK1&t=31'
WHERE name = 'Shakshuka';


UPDATE dev_dba.all_recipes
SET url = 'https://youtu.be/W8df3s3xo70?si=H-kxbmssehU9wO1O&t=18'
WHERE name = 'Eggs Benedict';

UPDATE dev_dba.all_recipes
SET url = 'https://youtu.be/HWel1iwYfQ8?si=9g06PDvar25NScZx'
WHERE name = 'Beetroot Ginger Soup';

UPDATE dev_dba.all_recipes
SET url = 'https://www.youtube.com/watch?v=W4XVyB7dw6Q'
WHERE name = 'Brigadeiro';

UPDATE dev_dba.all_recipes
SET url = 'https://youtu.be/A6qTZy5U8sc?si=SfVqRcrVBMQATsqW'
WHERE name = 'Clafoutis';

UPDATE dev_dba.all_recipes
SET url = 'https://youtu.be/Z9JEIIQDdEg?si=wZkMxHar9Nk4tmNs'
WHERE name LIKE '%Toast%';

UPDATE dev_dba.all_recipes
SET url = 'https://youtu.be/l1YNOx-X0ps?si=Gadp7HCd1NrRGmOg'
WHERE name = 'Guacamole';

UPDATE dev_dba.all_recipes
SET url = 'https://youtu.be/CdAp1nlwVC0?si=XB1Qztpm_CAtIVYQ'
WHERE name = 'Salted Caramel';

UPDATE dev_dba.all_recipes
SET url = 'https://youtu.be/-oaqAwaLgvw?si=81Y23lK_u5MQ3D_i'
WHERE name = 'Pate Sucree';

UPDATE dev_dba.all_recipes
SET url = 'https://youtu.be/PvYv3y7TYtI?si=y5pM2Ily8Xy2sya_'
WHERE name = 'Hummus';

UPDATE dev_dba.all_recipes
SET url = 'https://youtu.be/9oGASwMjZ88?si=bD8Q-kTtgoWVu_Wb'
WHERE name = 'Mornay Sauce';

UPDATE dev_dba.all_recipes
SET url = 'https://youtu.be/zzLKoP1SPvU?si=XOR6HaBFaiuwvUIb',
    name = 'Lemon Curd'
WHERE name = 'Tropical Curd';

UPDATE dev_dba.all_recipes
SET url = 'https://youtu.be/mgorDuLFk3I?si=eMD4WOkI6MF9d9Z-'
WHERE name = 'Granola';

UPDATE dev_dba.all_recipes
SET url = 'https://youtu.be/dRa0mm58c9s?si=OGHSaWli-1LJaCRF'
WHERE name = 'Meringues';

UPDATE dev_dba.all_recipes
SET url = 'https://youtu.be/OOjb1H5H3_0?si=yjzysOkLYK2Frm9n'
WHERE name = 'Caramelized Onion';

 */

 -- ============================================================
-- Shakshuka
-- ============================================================
UPDATE dev_dba.all_recipes
SET 
    instructions = $$**Prepare ingredients**:
- Finely dice the onion (70g), red bell pepper (80g), garlic (13g) and chili pepper (10g)
- Roughly chop the tomatoes (385g) or use canned crushed tomatoes

**Sauté aromatics**:
- Heat olive oil in a large cast iron pan over medium heat
- Add the onion and red bell pepper, cook for 5–7 minutes until softened
- Add the garlic, chili pepper, rosemary (2g), thyme (3g) and basil (5g), stir for 1 minute

**Build the sauce**:
- Stir in the sweet paprika (10g) and cumin (4g), cook 30 seconds until fragrant
- Add the tomatoes (385g) and tomato paste (50g), stir to combine
- Season with salt, reduce heat to low and simmer for 15–20 minutes until the sauce thickens

**Add eggs**:
- Make 2 wells in the sauce with the back of a spoon
- Crack 1 egg into each well
- Cover the pan and cook for 5–7 minutes until egg whites are set but yolks are still runny

**Serve**:
- Serve hot directly from the pan
- Pair with Saloia bread (100g) on the side
- Garnish with fresh basil or herbs if desired$$,
    image = '/uploads/images/shakshuka.webp',
    url = 'https://youtu.be/SjCkW-oAFQ8?si=v9Qbr-baRJAgQBK1&t=31'
WHERE name = 'Shakshuka';


-- ============================================================
-- Eggs Benedict
-- ============================================================
UPDATE dev_dba.all_recipes
SET 
    instructions = $$**Prepare the hollandaise**:
- Warm the pre-made hollandaise sauce (50g) in a small saucepan over very low heat, stirring occasionally
- Keep warm until ready to serve

**Toast the bread**:
- Slice the brioche bread (60g) and toast in a dry pan or toaster until golden
- Set aside on serving plates

**Cook the bacon**:
- In a skillet over medium heat, cook the bacon (20g) for 2–3 minutes per side until lightly browned
- Place on top of the toasted brioche

**Poach the eggs**:
- Bring a saucepan of water to a gentle simmer; add a splash of white vinegar
- Crack each egg (2 total) individually into a small cup
- Stir the water gently to create a slow swirl, then slide each egg in
- Poach for 3–4 minutes until whites are set and yolks remain soft
- Remove with a slotted spoon and drain on a paper towel

**Assemble and serve**:
- Place poached eggs on top of the bacon-loaded brioche
- Spoon hollandaise sauce generously over the eggs
- Finish with finely chopped chives (3g) and serve immediately$$,
    image = '/uploads/images/eggsbenedict.webp',
    url = 'https://youtu.be/W8df3s3xo70?si=H-kxbmssehU9wO1O&t=18'
WHERE name = 'Eggs Benedict';


-- ============================================================
-- Beetroot Ginger Soup
-- ============================================================
UPDATE dev_dba.all_recipes
SET 
    instructions = $$**Prepare ingredients**:
- Peel and chop the beetroot (3000g) into bite-sized chunks
- Finely slice the onion (1500g) and mince the garlic (100g)
- Peel and grate or finely slice the ginger (300g)

**Sauté aromatics**:
- Heat olive oil (500g) in a large pot over medium heat
- Add the onion and garlic, sauté for 8–10 minutes until softened and starting to caramelise
- Add the ginger, stir and cook for another 2–3 minutes

**Build the soup**:
- Add the white wine (250ml) and let it reduce for 2 minutes
- Add the beetroot chunks and enough water or vegetable stock to cover
- Stir in the brown sugar (75g) and season with salt (150g, adjust to taste)
- Bring to a boil, then reduce heat and simmer for 25–30 minutes until the beetroot is completely tender

**Blend**:
- Remove from heat and let cool for 10 minutes
- Blend the soup in batches (or with a hand blender) until completely smooth
- Adjust seasoning and add water to loosen if needed

**Serve**:
- Ladle into bowls
- Finish with a spoonful of crème fraîche (100g) and garnish with fresh herbs if desired$$,
    image = '/uploads/images/beetrootgingersoup.webp',
    url = 'https://youtu.be/HWel1iwYfQ8?si=9g06PDvar25NScZx'
WHERE name = 'Beetroot Ginger Soup';


-- ============================================================
-- Brigadeiro
-- ============================================================
UPDATE dev_dba.all_recipes
SET 
    instructions = $$**Prepare the base**:
- Combine condensed milk (400g), cocoa powder (50g) and butter (20g) in a heavy-bottomed saucepan
- Stir together until the cocoa is fully dissolved before turning on the heat

**Cook**:
- Place the pan over low-medium heat and stir constantly with a wooden spoon or spatula
- Cook for 10–15 minutes, scraping the bottom and sides, until the mixture thickens and starts pulling away from the pan
- The brigadeiro is ready when you drag a spoon across the bottom and it holds a clear line for a few seconds

**Cool and shape**:
- Pour the mixture onto a buttered plate and let it cool to room temperature (about 30 minutes)
- Once cool enough to handle, butter your hands lightly and roll into small balls (about 15g each)

**Coat and serve**:
- Roll each ball in chocolate sprinkles or cocoa powder to coat
- Place in petit-four cups
- Serve at room temperature$$,
    image = '/uploads/images/brigadeiro.webp',
    url = 'https://www.youtube.com/watch?v=W4XVyB7dw6Q'
WHERE name = 'Brigadeiro';


-- ============================================================
-- Clafoutis
-- ============================================================
UPDATE dev_dba.all_recipes
SET 
    instructions = $$**Preheat and prepare the dish**:
- Preheat the oven to 175°C (350°F)
- Generously grease a round baking dish (approx. 23cm) with butter (from the 200g)
- Slice the strawberries (120g) and arrange them evenly across the bottom of the dish

**Make the batter**:
- In a large bowl, whisk the eggs (5 units) with the brown sugar (100g) until smooth and slightly frothy
- Sift in the flour (40g) and a pinch of salt (1g) and whisk until lump-free
- Add the vanilla extract (1.2g) and pour in the whole milk (50g), whisking continuously until the batter is silky and uniform

**Bake**:
- Pour the batter slowly over the strawberries
- Add small pieces of the remaining butter (200g) dotted across the top
- Bake for 40–45 minutes until puffed and golden, and a skewer inserted in the centre comes out clean

**Finish and serve**:
- Let the clafoutis cool for 5–10 minutes (it will deflate slightly — this is normal)
- Spread or spoon the strawberry jam (65g) on top while still warm
- Dust generously with powdered sugar (4g)
- Serve warm or at room temperature$$,
    image = '/uploads/images/clafoutis.webp',
    url = 'https://youtu.be/A6qTZy5U8sc?si=SfVqRcrVBMQATsqW'
WHERE name = 'Clafoutis';


-- ============================================================
-- French Toast (LIKE '%Toast%')
-- ============================================================
UPDATE dev_dba.all_recipes
SET 
    instructions = $$**Prepare the milk mixture**:
- In a shallow bowl, whisk together the French toast milk (30g), which is pre-made from milk, brown sugar, cinnamon and egg
- Make sure the mixture is well combined and smooth

**Soak and cook the bread**:
- Slice the brioche bread (60g) into thick slices
- Dip each slice into the milk mixture, letting it soak for about 30 seconds per side
- Heat butter (25g) and oil (50g) together in a non-stick pan over medium heat
- Cook each soaked slice for 2–3 minutes per side until deeply golden and caramelised

**Prepare toppings**:
- Warm the brigadeiro (80g) gently until slightly runny, or use it as-is
- Hull and slice the strawberries (18.6g)
- Toast the coconut flakes (8g) in a dry pan for 1–2 minutes until golden

**Assemble and serve**:
- Place the French toast on the plate
- Spoon or pour brigadeiro generously over the top
- Arrange the strawberries alongside
- Scatter toasted coconut flakes over everything
- Serve immediately while hot$$,
    image = '/uploads/images/frenchtoast.webp',
    url = 'https://youtu.be/Z9JEIIQDdEg?si=wZkMxHar9Nk4tmNs'
WHERE name LIKE '%Toast%';


-- ============================================================
-- Guacamole
-- ============================================================
UPDATE dev_dba.all_recipes
SET 
    instructions = $$**Prepare ingredients**:
- Halve and pit the avocados (300g); scoop the flesh into a bowl
- Finely dice the red onion (82g), tomato (86g) and chili pepper (11g)
- Finely chop the cilantro (6g)
- Squeeze the lime juice (34g) and set aside

**Mash the avocado**:
- Using a fork or potato masher, mash the avocado to your preferred texture — chunky or smooth
- Season immediately with salt (1g) to prevent browning

**Mix and season**:
- Fold in the diced red onion, tomato, chili pepper and cilantro
- Drizzle in the olive oil (20g) and add the lime juice
- Stir gently to combine; taste and adjust salt and lime as needed

**Serve**:
- Transfer to a serving bowl
- Press a piece of cling film directly against the surface if not serving immediately to prevent browning
- Serve with tortilla chips, bread, or as a side$$,
    image = '/uploads/images/guacamole.webp',
    url = 'https://youtu.be/l1YNOx-X0ps?si=Gadp7HCd1NrRGmOg'
WHERE name = 'Guacamole';


-- ============================================================
-- Salted Caramel
-- ============================================================
UPDATE dev_dba.all_recipes
SET 
    instructions = $$**Make the dry caramel**:
- Place the brown sugar (240g) in a heavy-bottomed saucepan over medium heat
- Do not stir — swirl the pan occasionally as the sugar melts
- Cook until it turns deep amber, watching closely to avoid burning

**Add the water and cream**:
- Carefully add the water (110g) to the caramel — it will bubble vigorously, stand back
- Then slowly pour in the cream (180g) while stirring constantly
- Keep stirring over low heat until fully combined and smooth

**Finish with butter and salt**:
- Remove from heat and add the butter (80g) in pieces, stirring until melted and incorporated
- Add the vanilla extract (20g) and the salt (3g)
- Stir well and taste; adjust salt if needed for a more pronounced flavour

**Cool and store**:
- Pour into a clean jar or container
- Let cool to room temperature before sealing
- Refrigerate for up to 2 weeks; warm gently before using$$,
    image = '/uploads/images/saltedcaramel.webp',
    url = 'https://youtu.be/CdAp1nlwVC0?si=XB1Qztpm_CAtIVYQ'
WHERE name = 'Salted Caramel';


-- ============================================================
-- Pate Sucree
-- ============================================================
UPDATE dev_dba.all_recipes
SET 
    instructions = $$**Make the dough**:
- Cut the cold butter (60g) into small cubes
- In a large bowl, combine the flour (100g), brown sugar (40g) and salt (1g)
- Rub the butter into the flour mixture with your fingertips until it resembles coarse breadcrumbs
- Add the egg (1 unit) and mix gently with a fork until the dough just comes together — do not overwork

**Chill**:
- Shape the dough into a flat disc, wrap in cling film and refrigerate for at least 30 minutes (or up to 24 hours)

**Roll and line**:
- On a lightly floured surface, roll the dough out to about 3mm thickness
- Carefully transfer to a tart tin (approx. 20cm) and press gently into the edges
- Trim excess dough from the rim and prick the base all over with a fork
- Chill in the fridge for another 15 minutes

**Blind bake**:
- Preheat the oven to 180°C (355°F)
- Line the tart shell with baking paper and fill with baking weights or dry rice
- Bake for 15 minutes, then remove the weights and paper and bake for a further 8–10 minutes until golden and dry
- Let cool completely before filling$$,
    image = '/uploads/images/patesucree.webp',
    url = 'https://youtu.be/-oaqAwaLgvw?si=81Y23lK_u5MQ3D_i'
WHERE name = 'Pate Sucree';


-- ============================================================
-- Hummus
-- ============================================================
UPDATE dev_dba.all_recipes
SET 
    instructions = $$**Prepare the chickpeas**:
- If using canned chickpeas (206g), drain and rinse well
- For extra smooth hummus, remove the skins by rubbing the chickpeas between your hands and discarding the loose shells

**Blend**:
- Place the chickpeas in a food processor with the tahini (10g), lemon juice (47g), salt (3g) and black pepper (3g)
- Blend for 2–3 minutes, scraping down the sides as needed, until very smooth
- With the processor running, slowly drizzle in the olive oil (50g) until creamy and well incorporated
- Add 1–2 tablespoons of cold water if the hummus is too thick and blend again

**Beetroot variation**:
- Separately blend the cooked beetroot (150g) with the second measure of olive oil (40g) until smooth
- Swirl or layer the beetroot mixture into the plain hummus for a vibrant colour and earthy sweetness

**Serve**:
- Spread the hummus into a wide bowl, creating a well in the centre with the back of a spoon
- Drizzle with olive oil and sprinkle with paprika or fresh herbs
- Serve with warm flatbread or vegetable crudités$$,
    image = '/uploads/images/hummus.webp',
    url = 'https://youtu.be/PvYv3y7TYtI?si=y5pM2Ily8Xy2sya_'
WHERE name = 'Hummus';


-- ============================================================
-- Mornay Sauce
-- ============================================================
UPDATE dev_dba.all_recipes
SET 
    instructions = $$**Make the béchamel**:
- Melt the butter (25g) in a medium saucepan over medium heat
- Add the flour (25g) all at once and stir vigorously with a wooden spoon for 1–2 minutes to cook out the raw flour taste (do not let it brown)
- Gradually pour in the whole milk (500g), whisking constantly to prevent lumps
- Continue stirring over medium heat for 8–10 minutes until the sauce thickens and coats the back of a spoon

**Add the cheeses**:
- Remove from heat and stir in the grated Emmental (300g) and Parmesan (200g) until fully melted and smooth
- Season with salt (10g) and black pepper (25g)
- If the sauce is too thick, add a splash of warm milk to loosen

**Taste and adjust**:
- Taste the sauce and adjust salt and pepper as needed
- A pinch of nutmeg can be added for a classic touch

**Use immediately or store**:
- Use hot over pasta, gratins, vegetables or eggs
- If storing, press cling film directly onto the surface of the sauce to prevent a skin from forming
- Refrigerate for up to 3 days; reheat gently, stirring in a little milk$$,
    image = '/uploads/images/mornayssauce.webp',
    url = 'https://youtu.be/9oGASwMjZ88?si=bD8Q-kTtgoWVu_Wb'
WHERE name = 'Mornay Sauce';


-- ============================================================
-- Lemon Curd (formerly Tropical Curd)
-- ============================================================
UPDATE dev_dba.all_recipes
SET 
    url = 'https://youtu.be/zzLKoP1SPvU?si=XOR6HaBFaiuwvUIb',
    name = 'Lemon Curd',
    instructions = $$**Prepare the base**:
- In a medium saucepan, combine the brown sugar (200g), lemon juice (390g) and water (360g)
- Whisk in the starch (15g) until fully dissolved with no lumps

**Cook the curd**:
- Place the pan over medium heat and stir constantly
- In a separate bowl, lightly beat the eggs (3 units)
- Once the lemon mixture begins to steam (not boil), slowly ladle some of it into the eggs to temper them, whisking constantly
- Pour the tempered egg mixture back into the saucepan while stirring
- Continue cooking over medium-low heat, stirring constantly, until the curd thickens enough to coat the back of a spoon (about 8–10 minutes)

**Finish**:
- Remove from heat and stir in the butter (15g) until melted and glossy
- Strain through a fine mesh sieve for an ultra-smooth texture

**Cool and store**:
- Pour into sterilised jars
- Let cool to room temperature, then refrigerate
- The curd will continue to thicken as it cools
- Keeps in the fridge for up to 2 weeks$$,
    image = '/uploads/images/lemoncurd.webp'
WHERE name = 'Tropical Curd';


-- ============================================================
-- Granola
-- ============================================================
UPDATE dev_dba.all_recipes
SET 
    instructions = $$**Preheat and prepare**:
- Preheat the oven to 160°C (320°F)
- Line a large baking tray with baking paper

**Mix the wet and dry ingredients**:
- In a large bowl, combine the oats (200g), puffed rice (150g), mixed nuts (100g), pumpkin seeds (50g), sunflower seeds (50g), coconut flakes (50g) and cinnamon (5g)
- Warm the honey (200g) gently until runny, then pour over the dry mixture
- Stir thoroughly until every piece is evenly coated

**Bake**:
- Spread the mixture in a single, even layer on the prepared tray
- Bake for 25–30 minutes, stirring once halfway through, until deep golden and fragrant
- Watch closely in the last 5 minutes — it can burn quickly

**Add dried fruits**:
- Remove from the oven and immediately stir in the goji berries (25g) and cranberries (25g)
- The residual heat will soften them slightly

**Cool and store**:
- Spread flat and leave to cool completely on the tray without stirring — this helps clusters form
- Once fully cooled, break into pieces and store in an airtight jar for up to 3 weeks$$,
    image = '/uploads/images/granola.webp',
    url = 'https://youtu.be/mgorDuLFk3I?si=eMD4WOkI6MF9d9Z-'
WHERE name = 'Granola';


-- ============================================================
-- Meringues
-- ============================================================
UPDATE dev_dba.all_recipes
SET 
    instructions = $$**Prepare**:
- Preheat the oven to 100°C (212°F) — low and slow is key for meringues
- Line two baking trays with baking paper
- Make sure your bowl and whisk are completely clean and grease-free (any fat will prevent the whites from whipping)

**Whip the egg whites**:
- Add the egg whites (70g) to your bowl and whip on medium speed until soft peaks form
- Increase speed to high and begin adding the brown sugar (210g) one tablespoon at a time, waiting about 20 seconds between additions
- Continue whipping until the meringue is very stiff, glossy and holds firm peaks
- The sugar is fully dissolved when you rub a little between your fingers and feel no grittiness

**Shape**:
- Spoon or pipe the meringue onto the prepared trays in your desired shapes — rounds, nests or swirls
- Leave space between them as they may spread slightly

**Bake**:
- Bake for 1.5–2 hours until the meringues lift cleanly off the paper and sound hollow when tapped
- Turn off the oven and leave the door ajar to let the meringues cool completely inside — this prevents cracking

**Serve**:
- Serve as-is, or fill with whipped cream and fresh berries$$,
    image = '/uploads/images/meringues.webp',
    url = 'https://youtu.be/dRa0mm58c9s?si=OGHSaWli-1LJaCRF'
WHERE name = 'Meringues';


-- ============================================================
-- Caramelized Onion
-- ============================================================
UPDATE dev_dba.all_recipes
SET 
    instructions = $$**Prepare the onions**:
- Peel and thinly slice all the onions (3280g) — use a mandoline for consistency if available

**Slow cook**:
- Heat the olive oil (150g) in a very large, heavy-bottomed pan over medium-low heat
- Add all the sliced onions with a pinch of salt
- Cook for 30–40 minutes, stirring every 5–10 minutes, until the onions are deeply golden and completely soft
- Be patient — do not rush this step or increase the heat significantly

**Deglaze and sweeten**:
- Pour in the white wine (150g) and stir to lift any caramelised bits from the bottom of the pan
- Add the vinegar (250g), brown sugar (250g) and Worcestershire sauce (100g)
- Stir well to combine and continue cooking over medium-low heat

**Reduce**:
- Cook for another 20–30 minutes, stirring occasionally, until the liquid is fully absorbed and the onions are jammy, sticky and very dark

**Cool and store**:
- Remove from heat and let cool
- Store in sterilised jars in the fridge for up to 2 weeks
- Use as a topping for burgers, sandwiches or toasted bread$$,
    image = '/uploads/images/caramelizedonion.webp',
    url = 'https://youtu.be/OOjb1H5H3_0?si=yjzysOkLYK2Frm9n'
WHERE name = 'Caramelized Onion';

-- ============================================================
-- Avocado
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the base**:
- Scoop the avocado flesh (90g) into a bowl and mash lightly with a fork — keep it slightly chunky

**Make the coconut cream mixture**:
- In a small saucepan, gently warm the coconut milk (150ml) and coconut cream (20g) together with the brown sugar (40g) over low heat, stirring until the sugar dissolves
- Remove from heat and let cool to room temperature

**Assemble the bowl**:
- Pour the coconut mixture over the mashed avocado and fold gently to combine
- Add the grapes (40g), chia seeds (7g) and oats (15g)
- Top with fresh basil leaves (2g) for aroma and colour

**Serve**:
- Serve immediately as a breakfast bowl or chilled dessert
- Optionally drizzle with a little extra coconut cream$$,
    image = '/uploads/images/avocado.webp'
WHERE name = 'Avocado';


-- ============================================================
-- Avocado and Feta
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Toast the bread**:
- Slice the Saloia bread (100g) and toast in a pan or toaster until golden and crispy
- Set aside on the serving plate

**Poach the eggs**:
- Bring a saucepan of water to a gentle simmer and add a splash of white vinegar
- Crack each egg (2 units) into a small cup and slide gently into the water
- Poach for 3–4 minutes until whites are set and yolks are still runny
- Remove with a slotted spoon and drain on a paper towel

**Assemble**:
- Spread the guacamole (100g) generously over the toasted bread
- Add the iberian salad leaves (20g) and cherry tomatoes (15g, halved)
- Cook the bacon (20g) in a dry pan over medium heat for 2–3 minutes until crispy, then place on top
- Set the poached eggs on top of the bacon

**Finish and serve**:
- Crumble the feta cheese (20g) over everything
- Season with black pepper and serve immediately$$,
    image = '/uploads/images/avocadoandfeta.webp'
WHERE name = 'Avocado and Feta';


-- ============================================================
-- BART
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the bread**:
- Slice the Bolo do Caco bread (100g) in half and butter the cut sides with the butter (5g)
- Toast in a pan or grill until golden and fragrant

**Cook the bacon**:
- In a skillet over medium heat, cook the bacon (40g) for 2–3 minutes per side until crispy
- Set aside

**Prepare the fillings**:
- Slice the tomato (40g) and halve the cherry tomatoes (15g)
- Slice or mash the avocado (30g) and season lightly with salt

**Assemble**:
- Spread the lemon mayonnaise (40g) on the bottom half of the toasted bread
- Layer the arugula (15g), avocado, tomato and cherry tomatoes
- Place the crispy bacon on top
- Close with the top half of the bread

**Serve**:
- Slice in half and serve immediately$$,
    image = '/uploads/images/bart.webp'
WHERE name = 'BART';


-- ============================================================
-- Banana Cake
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Preheat and prepare**:
- Preheat the oven to 175°C (350°F)
- Grease and flour a loaf or bundt tin

**Mash and mix wet ingredients**:
- Mash the ripe bananas (540g) well in a large bowl until smooth
- Add the brown sugar (150g), coconut milk (150g) and oil (150g), and whisk to combine

**Mix dry ingredients**:
- In a separate bowl, sift together the flour (200g), baking powder (6g), cinnamon (3g), nutmeg (2g) and grated ginger (5.45g)
- Fold the dry ingredients into the wet mixture until just combined — do not overmix
- Fold in the chopped walnuts (50g)

**Bake**:
- Pour into the prepared tin and bake for 50–60 minutes, until a skewer inserted in the centre comes out clean
- If the top browns too quickly, cover loosely with foil

**Finish and serve**:
- Let cool in the tin for 10 minutes, then turn out onto a rack
- Top with caramelized mixed nuts (7g) and drizzle with salted caramel (30g) just before serving$$,
    image = '/uploads/images/bananacake.webp'
WHERE name = 'Banana Cake';


-- ============================================================
-- Banana Nutella Pancake
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the toppings**:
- Peel and slice the banana (135g) into rounds or diagonal slices
- Warm the Nutella (60g) gently in a small bowl set over hot water or in the microwave for 20 seconds until slightly runny

**Cook the pancakes**:
- Use your pre-made traditional pancake batter and cook pancakes on a lightly buttered non-stick pan over medium heat
- Pour a ladle of batter and cook for 2 minutes until bubbles appear on the surface, then flip and cook 1 more minute
- Repeat for the remaining batter

**Assemble**:
- Stack the warm pancakes on a plate
- Drizzle or spread the warm Nutella generously over the top
- Arrange the banana slices over the Nutella

**Finish**:
- Scatter the caramelized mixed nuts (25g) over the top for crunch
- Serve immediately$$,
    image = '/uploads/images/banananutellapancake.webp'
WHERE name = 'Banana Nutella Pancake';


-- ============================================================
-- Brazilian
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the bowl base**:
- Keep the açaí (150g) frozen until just before serving — it should be thick and sorbet-like
- If using frozen açaí pulp, blend briefly with the minimum amount of liquid until smooth and spoonable

**Assemble**:
- Spoon the açaí into a cold bowl
- Slice the banana (70g) into rounds and arrange on top
- Place the sliced strawberries (20g) alongside the banana
- Sprinkle the granola (30g) over the fruit

**Garnish and serve**:
- Add a few fresh basil leaves (3g) for aroma and a vibrant finish
- Serve immediately before the açaí melts$$,
    image = '/uploads/images/brazilian.webp'
WHERE name = 'Brazilian';


-- ============================================================
-- Brunch
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare**:
- Spoon the yogurt (75g) into a small bowl or serving cup
- Optionally layer with granola, fresh fruit or honey for a more complete plate

**Serve**:
- Serve chilled as part of a larger brunch spread
- Pairs well with seasonal fruits, toasted bread and eggs$$,
    image = '/uploads/images/brunch.webp'
WHERE name = 'Brunch';


-- ============================================================
-- Caramelized Mixed Nuts
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare**:
- Line a baking tray or large plate with baking paper and set aside
- Have the mixed nuts (1000g) ready at room temperature

**Make the caramel**:
- Place the brown sugar (1000g) in a wide, heavy-bottomed pan over medium heat
- Let the sugar melt without stirring — swirl the pan gently if needed
- Cook until it reaches a deep amber caramel colour

**Coat the nuts**:
- Add the mixed nuts all at once and stir quickly to coat every nut in the caramel
- Add the salt (15g) and stir again for 30 seconds

**Set and cool**:
- Immediately pour the caramelized nuts onto the prepared baking paper
- Spread into a single layer as quickly as possible using a spatula — the caramel sets fast
- Leave to cool completely at room temperature (about 20 minutes)

**Break and store**:
- Once fully set and cooled, break into pieces
- Store in an airtight container at room temperature for up to 2 weeks$$,
    image = '/uploads/images/caramelizedmixednuts.webp'
WHERE name = 'Caramelized Mixed Nuts';


-- ============================================================
-- Chicken Burger
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Season and cook the chicken**:
- Season the chicken breast (100g) with thyme (1g), rosemary (2g), salt and pepper
- Cook in a hot pan with a drizzle of oil for 5–6 minutes per side until golden and cooked through
- Rest for 2 minutes, then slice or leave whole

**Prepare the bread**:
- Slice the curry bread (80g) and toast lightly in the same pan until golden

**Prepare the fillings**:
- Slice or mash the avocado (40g) and season lightly
- Have the caramelized onion (40g) and lemon mayonnaise (40g) ready

**Assemble**:
- Spread lemon mayonnaise on both sides of the toasted bread
- Layer the iberian salad (15g), avocado, then the chicken breast
- Spoon the caramelized onion on top of the chicken

**Serve**:
- Close the burger and serve with sweet potato chips (30g) on the side$$,
    image = '/uploads/images/chickenburger.webp'
WHERE name = 'Chicken Burger';


-- ============================================================
-- Chicken Salad
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Cook the chicken**:
- Season the chicken breast (120g) generously with salt (to taste), black pepper (14g), thyme (1g) and rosemary (2g)
- Cook in a hot pan with a drizzle of oil for 5–6 minutes per side until golden and fully cooked
- Rest for 5 minutes, then slice thinly or shred

**Prepare the salad base**:
- Arrange the iberian salad leaves (40g) on a plate or in a bowl
- Slice the avocado (40g) and radish (12g) and add to the base
- Scatter the caramelized mixed nuts (10g) and sesame seeds (5g) over the top

**Assemble**:
- Place the sliced chicken on top of the salad

**Dress and serve**:
- Drizzle the orange vinaigrette (12g) over everything
- Serve immediately$$,
    image = '/uploads/images/chickensalad.webp'
WHERE name = 'Chicken Salad';


-- ============================================================
-- Classic Gin
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the glass**:
- Fill a balloon glass or copa glass generously with ice cubes

**Build the drink**:
- Pour the gin (0.65g measure) over the ice
- Add the tonic water (0.39g measure) slowly, pouring down the side of the glass to preserve the bubbles
- Stir gently once with a long spoon — just enough to combine

**Garnish and serve**:
- Add a slice or ribbon of fresh cucumber (0.05g) as garnish
- Serve immediately$$,
    image = '/uploads/images/classicgin.webp'
WHERE name = 'Classic Gin';


-- ============================================================
-- Eggs Florentine
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the mushrooms and spinach**:
- Slice the white mushrooms (50g) and sauté in a pan with a drizzle of olive oil over medium-high heat for 3–4 minutes until golden
- Add the spinach (20g) to the same pan, season with salt and pepper, and wilt for 1 minute
- Set aside and keep warm

**Toast the bread**:
- Slice the Saloia bread (90g) and toast until golden and crispy

**Poach the eggs**:
- Bring a saucepan of water to a gentle simmer and add a splash of white vinegar
- Crack each egg (2 units) into a small cup and gently slide into the water
- Poach for 3–4 minutes until whites are set and yolks are still soft
- Remove with a slotted spoon and drain briefly on a paper towel

**Warm the Mornay sauce**:
- Gently warm the Mornay sauce (50g) in a small saucepan over low heat, stirring occasionally

**Assemble and serve**:
- Place toasted bread on the plate, top with the mushroom and spinach mixture
- Set the poached eggs on top and spoon Mornay sauce generously over the eggs
- Finish with chopped chives (3g) and serve immediately$$,
    image = '/uploads/images/eggsflorentine.webp'
WHERE name = 'Eggs Florentine';


-- ============================================================
-- French Toast Milk
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Combine all ingredients**:
- In a wide shallow bowl, whisk together the milk (150g), brown sugar (15g) and cinnamon (2g) until the sugar dissolves
- Crack in the egg (1 unit) and whisk thoroughly until fully combined and smooth

**Use**:
- This mixture is used to soak brioche bread for French toast
- Dip each slice for at least 30 seconds per side so the bread absorbs the custard evenly
- Proceed with cooking the French toast in a buttered pan over medium heat until golden on both sides$$,
    image = '/uploads/images/frenchtoastmilk.webp'
WHERE name = 'French Toast Milk';


-- ============================================================
-- Fruit Bowl
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the base**:
- Spoon the Greek yogurt (200g) into a bowl
- Add a few torn fresh mint leaves (3g) and drizzle with honey (10g), stirring gently to swirl

**Prepare the fruit**:
- Slice the banana (70g) into rounds
- Peel and slice the kiwi (45g) into half-moons or rounds

**Assemble**:
- Arrange the banana and kiwi slices on top of the yogurt
- Sprinkle the granola (50g) over the fruit for crunch

**Serve**:
- Garnish with extra mint and an extra drizzle of honey if desired
- Serve immediately so the granola stays crispy$$,
    image = '/uploads/images/fruitbowl.webp'
WHERE name = 'Fruit Bowl';


-- ============================================================
-- Gin Bee Tonic
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the glass**:
- Fill a balloon glass generously with ice cubes

**Build the drink**:
- Pour the gin (0.65g measure) over the ice
- Add the honey (0.03g) and stir briefly to dissolve
- Squeeze in the lemon juice (from the 0.05g lemon) and drop the squeezed slice into the glass
- Add the cinnamon (0.05g) — a small pinch or a cinnamon stick for garnish
- Top slowly with tonic water (0.39g measure), pouring down the side of the glass

**Garnish and serve**:
- Stir once gently and serve immediately$$,
    image = '/uploads/images/ginbeetonic.webp'
WHERE name = 'Gin Bee Tonic';


-- ============================================================
-- Go Green
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Cook the quinoa**:
- Rinse the quinoa (100g) well under cold water
- Cook in a saucepan with double the volume of salted water for 12–15 minutes until fluffy and the germ rings appear
- Drain any excess water and let cool

**Prepare the vegetables**:
- Slice the cucumber (25g) into thin rounds or half-moons
- Cube the mango (60g)
- Halve the cherry tomatoes (50g)
- Drain and rinse the chickpeas (45g)

**Assemble the bowl**:
- Place the quinoa as the base
- Arrange the spinach (35g), iberian salad (40g), cucumber, mango, cherry tomatoes and chickpeas on top

**Dress and finish**:
- Spoon the tzatziki sauce (20g) on the side or in the centre of the bowl
- Drizzle the orange vinaigrette (10g) over the vegetables
- Scatter the caramelized mixed nuts (10g) and sesame seeds (5g) over everything
- Serve at room temperature or slightly chilled$$,
    image = '/uploads/images/gogreen.webp'
WHERE name = 'Go Green';


-- ============================================================
-- Grape Cinnamon Gin
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the glass**:
- Fill a balloon glass generously with ice cubes

**Build the drink**:
- Lightly muddle the grapes (0.14g) at the bottom of the glass to release their juices
- Pour the gin (0.65g measure) over the ice and grapes
- Add a pinch of cinnamon (0.05g) or place a cinnamon stick as garnish
- Top slowly with tonic water (0.39g measure), pouring down the side of the glass

**Garnish and serve**:
- Stir once gently, garnish with a few whole grapes and a cinnamon stick
- Serve immediately$$,
    image = '/uploads/images/grapecinnamongin.webp'
WHERE name = 'Grape Cinnamon Gin';


-- ============================================================
-- Herb Oil
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Blanch the herbs**:
- Bring a small pot of water to a boil
- Briefly blanch the chives (18g), parsley (20g), cilantro (13g), thyme (12g) and basil (13g) for 15–20 seconds
- Immediately transfer to a bowl of ice water to preserve the vibrant green colour
- Drain and squeeze out all excess water

**Blend**:
- Place the blanched herbs in a blender with the olive oil (200g), garlic (11g) and lemon juice (62g)
- Blend on high for 1–2 minutes until completely smooth and vivid green

**Strain (optional)**:
- For a refined oil, strain through a fine mesh sieve or cheesecloth, pressing to extract all liquid
- Discard the solids

**Season and store**:
- Taste and adjust seasoning with salt if needed
- Store in a sealed jar in the fridge for up to 5 days
- Use as a finishing drizzle over eggs, salads, bread or grilled meats$$,
    image = '/uploads/images/herboil.webp'
WHERE name = 'Herb Oil';


-- ============================================================
-- Hollandaise Sauce
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Separate and prepare the eggs**:
- Separate the eggs (3 units) and place only the yolks in a heatproof bowl
- Squeeze the lemon juice (311g) and set aside

**Make the emulsion**:
- Set the bowl over a saucepan of barely simmering water (bain-marie) — the bowl should not touch the water
- Whisk the egg yolks with a splash of lemon juice continuously until the mixture thickens and becomes pale and ribbony (about 3–5 minutes)
- Remove the bowl from the heat

**Add the butter**:
- Melt the butter (200g) until fully liquid and slightly foaming
- Very slowly drizzle the melted butter into the yolk mixture, whisking constantly — a few drops at a time at first, then in a thin stream
- The sauce will thicken into a smooth, creamy emulsion

**Season**:
- Whisk in the remaining lemon juice, salt (3g) and black pepper (3g) to taste

**Keep warm and serve**:
- Keep the sauce warm by leaving the bowl over the hot (off the heat) water, stirring occasionally
- Use immediately — hollandaise does not reheat well once fully cooled$$,
    image = '/uploads/images/hollandaisesauce.webp'
WHERE name = 'Hollandaise Sauce';


-- ============================================================
-- Lemon Coconut Shake
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the glass**:
- Chill a serving glass in the freezer for a few minutes

**Blend**:
- Combine the cachaça (2.55g measure), coconut milk (0.74g measure), condensed milk (1.1g measure) and lemon juice (from 0.42g lemon) in a blender
- Add a generous handful of ice and blend until smooth and frothy

**Serve**:
- Pour into the chilled glass
- Garnish with a slice of lemon on the rim
- Serve immediately$$,
    image = '/uploads/images/lemoncoconutshake.webp'
WHERE name = 'Lemon Coconut Shake';


-- ============================================================
-- Lemon Mayonnaise
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Combine ingredients**:
- Place the mayonnaise (150g) in a bowl
- Squeeze in the lemon juice (from 93g lemon) and add the lemon zest for extra flavour if desired
- Season with salt (2g) and black pepper (4g)

**Mix**:
- Whisk or stir until fully combined and smooth
- Taste and adjust the lemon, salt and pepper balance to your preference

**Store**:
- Cover and refrigerate until needed
- Use within 3 days as a spread, dipping sauce or dressing$$,
    image = '/uploads/images/lemonmayonnaise.webp'
WHERE name = 'Lemon Mayonnaise';


-- ============================================================
-- Mango Basil Gin
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the glass**:
- Fill a balloon glass generously with ice cubes

**Build the drink**:
- Lightly muddle a couple of fresh basil leaves (0.06g) at the bottom of the glass
- Add the mango (0.2g) — sliced or as a small purée — and press gently
- Pour the gin (0.65g measure) over the ice
- Top slowly with tonic water (0.39g measure), pouring down the side of the glass

**Garnish and serve**:
- Stir once gently, garnish with a slice of fresh mango and a basil sprig
- Serve immediately$$,
    image = '/uploads/images/mangobasilgin.webp'
WHERE name = 'Mango Basil Gin';


-- ============================================================
-- Mango Puree
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the mango**:
- Peel and dice the ripe mango (302g), discarding the stone

**Cook**:
- Place the mango pieces and brown sugar (20g) in a small saucepan over medium heat
- Cook, stirring occasionally, for 5–8 minutes until the mango softens completely and the sugar is dissolved

**Blend**:
- Transfer to a blender or use a hand blender and blend until completely smooth
- If the purée is too thick, add a small splash of water and blend again

**Strain and cool**:
- For an extra smooth purée, pass through a fine sieve
- Let cool to room temperature, then refrigerate
- Use as a topping for pancakes, bowls or desserts$$,
    image = '/uploads/images/mangopuree.webp'
WHERE name = 'Mango Puree';


-- ============================================================
-- Mascarpone Dulce de Leche French Toast
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the milk mixture**:
- Have the French toast milk (30g) ready in a shallow bowl

**Soak and cook the bread**:
- Slice the brioche bread (60g) into thick slices
- Dip each slice into the milk mixture, soaking for about 30 seconds per side
- Heat butter (25g) and oil (50g) together in a non-stick pan over medium heat
- Cook each soaked slice for 2–3 minutes per side until deeply golden and caramelised

**Prepare the topping**:
- In a small bowl, mix the mascarpone (60g) until smooth and creamy
- Have the dulce de leche (60g) ready at room temperature so it is spreadable or pourable

**Assemble and serve**:
- Place the hot French toast on the plate
- Spread or dollop the mascarpone on top
- Drizzle or spoon the dulce de leche generously over the mascarpone
- Serve immediately$$,
    image = '/uploads/images/mascarponeducledelechefrenchtoast.webp'
WHERE name = 'Mascarpone Dulce de Leche French Toast';


-- ============================================================
-- Mimosa
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the glass**:
- Chill a champagne flute in the freezer for a few minutes before serving

**Build the drink**:
- Squeeze fresh orange juice (from the 0.09g orange measure) into the glass, filling it halfway
- Slowly top with chilled sparkling wine (0.28g measure), pouring gently down the side to preserve the bubbles

**Garnish and serve**:
- Optionally garnish with a thin orange slice on the rim
- Serve immediately$$,
    image = '/uploads/images/mimosa.webp'
WHERE name = 'Mimosa';


-- ============================================================
-- Mint Rosemary Lime Gin
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the glass**:
- Fill a balloon glass generously with ice cubes

**Build the drink**:
- Lightly muddle the fresh mint leaves (0.02g) and rosemary sprig (0.03g) at the bottom of the glass to release their aromas
- Squeeze in the lime juice (from 0.16g lime) and drop the squeezed lime wedge into the glass
- Pour the gin (0.65g measure) over the ice
- Top slowly with tonic water (0.39g measure), pouring down the side of the glass

**Garnish and serve**:
- Stir once gently, garnish with a sprig of fresh mint and rosemary
- Serve immediately$$,
    image = '/uploads/images/mintrosemarylimegin.webp'
WHERE name = 'Mint Rosemary Lime Gin';


-- ============================================================
-- Orange Vinaigrette
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the orange**:
- Squeeze the oranges (355g) to extract all the juice
- Optionally add a little zest for extra flavour

**Emulsify**:
- Pour the orange juice into a jar or bowl
- Add the olive oil (80g), salt (3g) and black pepper (3g)
- Whisk vigorously or shake in a sealed jar until emulsified and slightly thickened

**Taste and adjust**:
- Taste the vinaigrette and adjust seasoning — add more salt, pepper or a small squeeze of lemon if needed

**Store**:
- Keep in a sealed jar in the fridge for up to 5 days
- Shake or whisk again before each use as the oil and juice will separate$$,
    image = '/uploads/images/orangevinaigrette.webp'
WHERE name = 'Orange Vinaigrette';


-- ============================================================
-- Salmon Sandwich
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the dressing**:
- In a small bowl, mix the tzatziki sauce (60g) with the lemon juice (10g), olive oil (30g) and a pinch of salt (1g) — stir until smooth

**Prepare the fillings**:
- Thinly slice the green apple (40g) — toss with a little lemon juice to prevent browning
- Finely chop the chives (6g)

**Assemble the sandwich**:
- Spread the tzatziki dressing generously on both sides of the bread
- Layer the iberian salad leaves (16g), then the green apple slices
- Top with the smoked salmon, folding loosely for a generous filling
- Scatter the chives over everything

**Serve**:
- Close and slice in half, serve immediately$$,
    image = '/uploads/images/salmonsandwich.webp'
WHERE name = 'Salmon Sandwich';


-- ============================================================
-- Seasonal Fruits
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the fruits**:
- Cube the pineapple (70g) and cantaloupe melon (15g)
- Slice the kiwi (8g) into rounds
- Pick over the blackberries (39g) and raspberries (29g)
- Slice the banana (7g) and halve the grapes (9g)

**Assemble the bowl**:
- Arrange all the prepared fruits in a wide bowl or plate, grouping by colour for visual appeal
- Sprinkle the oats (10g) and coconut flakes (5g) over the fruit

**Top and serve**:
- Add the caramelized mixed nuts (60g) for crunch
- Finish with a spoonful of coconut foam (15g) on top
- Serve immediately$$,
    image = '/uploads/images/seasonalfruits.webp'
WHERE name = 'Seasonal Fruits';


-- ============================================================
-- Smoked Salmon Salad
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the base**:
- Arrange the iberian salad leaves (40g) in a wide bowl or plate

**Add the toppings**:
- Slice the avocado (40g) and arrange on the salad
- Slice the radish (12g) thinly and scatter over the top
- Place the smoked salmon (65g) on top, folding it loosely for volume

**Finish**:
- Sprinkle the caramelized mixed nuts (10g) and sesame seeds (5g) over everything
- Drizzle the orange vinaigrette (12g) over the entire salad

**Serve**:
- Serve immediately — do not dress in advance or the salad will wilt$$,
    image = '/uploads/images/smokedsalmonsalad.webp'
WHERE name = 'Smoked Salmon Salad';


-- ============================================================
-- Sparkling Sangria
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the fruit**:
- Slice the orange (0.23g measure) and lemon (0.06g measure) into thin rounds or half-moons
- Keep the frozen red berries (0.33g) frozen until assembly

**Make the base**:
- In a large jug, combine the sugar (0.12g) with a splash of the sparkling wine and stir until dissolved
- Add the cinnamon (0.14g) — a stick or ground — and let infuse for 2–3 minutes

**Assemble**:
- Add the sliced citrus fruits, frozen red berries and mint leaves (0.02g) to the jug
- Pour in the sparkling wine (0.94g measure) and tonic water (0.52g measure) gently to preserve the bubbles
- Add any water (0.0g) as needed to adjust strength

**Serve**:
- Fill glasses with ice, pour the sangria over and garnish with a mint sprig and orange slice
- Serve immediately$$,
    image = '/uploads/images/sparklingsangria.webp'
WHERE name = 'Sparkling Sangria';


-- ============================================================
-- Strawberry Jam
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the strawberries**:
- Hull and halve the strawberries (560g)
- Place in a heavy-bottomed saucepan with the brown sugar (25g) and lemon juice (124g)
- Stir to coat, then leave to macerate for 15–30 minutes until the strawberries release their juices

**Cook the jam**:
- Place the pan over medium-high heat and bring to a vigorous boil, stirring frequently
- Reduce heat to medium and continue cooking for 20–25 minutes, stirring often, until the jam thickens
- To test: place a small spoonful on a cold plate — if it wrinkles when pushed with a finger, it is set

**Skim and jar**:
- Remove any foam from the surface with a spoon
- Pour into sterilised jars while still hot and seal immediately

**Cool and store**:
- Let cool completely before refrigerating
- Keeps for up to 3 weeks in the fridge or 6 months if properly jarred and sealed$$,
    image = '/uploads/images/strawberryjam.webp'
WHERE name = 'Strawberry Jam';


-- ============================================================
-- Tea Gin
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Brew the tea**:
- Brew the tea (0.08 unit) in a small amount of hot water and let it cool completely — do not use while hot

**Prepare the glass**:
- Fill a balloon glass or tall glass generously with ice cubes

**Build the drink**:
- Pour the cooled tea over the ice
- Add a slice of orange (0.04g) and a pinch of cinnamon (0.05g)
- Stir gently to combine

**Serve**:
- Garnish with an orange slice and a cinnamon stick if desired
- Serve immediately$$,
    image = '/uploads/images/teagin.webp'
WHERE name = 'Tea Gin';


-- ============================================================
-- Traditional Pancake Batter
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Mix dry ingredients**:
- In a large bowl, sift together the flour (500g), baking powder (6g) and salt (1g)
- Add the brown sugar (90g) and stir to combine

**Add wet ingredients**:
- Make a well in the centre of the dry mixture
- Crack in the eggs (2 units), pour in the whole milk (200g), melted butter (40g) and vanilla extract (20g)
- Whisk from the centre outward until the batter is smooth — a few small lumps are fine, do not overmix

**Rest the batter**:
- Let the batter rest for at least 10 minutes before cooking — this relaxes the gluten and produces fluffier pancakes

**Cook**:
- Heat a non-stick pan over medium heat and grease lightly with butter
- Pour a ladleful of batter per pancake
- Cook for 2–3 minutes until bubbles form and the edges look dry, then flip and cook 1–2 minutes more
- Keep warm in a low oven while cooking the remaining batter$$,
    image = '/uploads/images/traditionalpancakebatter.webp'
WHERE name = 'Traditional Pancake Batter';


-- ============================================================
-- Tropical Curd Pancake
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the toppings**:
- Peel and slice the kiwi (22g) into rounds or half-moons
- Cube the pineapple (56g) into bite-sized pieces

**Cook the pancakes**:
- Use the pre-made traditional pancake batter and cook on a lightly buttered non-stick pan over medium heat
- Pour a ladle of batter per pancake, cook until bubbles form on the surface, then flip and cook 1 more minute

**Assemble**:
- Stack the warm pancakes on a plate
- Spoon or pour the tropical curd (or lemon curd) generously over the top
- Arrange the kiwi slices and pineapple pieces on top

**Serve**:
- Serve immediately, optionally with a dusting of powdered sugar or a drizzle of honey$$,
    image = '/uploads/images/tropicalcurdpancake.webp'
WHERE name = 'Tropical Curd Pancake';


-- ============================================================
-- Tzatziki Sauce
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the cucumber**:
- Grate the cucumber (150g) coarsely and place in a clean cloth or fine mesh sieve
- Squeeze out as much water as possible — this step is essential to prevent a watery tzatziki

**Mix**:
- In a bowl, combine the Greek yogurt (150g) with the drained cucumber
- Add the olive oil (10g), mint (5g, finely chopped), salt (2g) and black pepper (3g)
- Stir until well combined

**Taste and chill**:
- Taste and adjust salt, pepper or mint to your liking
- Cover and refrigerate for at least 30 minutes before serving — this allows the flavours to develop

**Serve**:
- Serve as a dip, sauce or condiment alongside grilled meats, burgers, sandwiches or vegetables$$,
    image = '/uploads/images/tzatzikisauce.webp'
WHERE name = 'Tzatziki Sauce';


-- ============================================================
-- Vegan Beetroot Pancake
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Make the vegan batter**:
- Peel and cook the beetroot (300g) until tender, then blend until smooth
- In a large bowl, mash the bananas (255g) well
- Add the oats (115g), flour (50g), soy milk (180ml), vanilla extract (18g), agave syrup (40g) and blended beetroot
- Mix until a smooth, vibrant pink batter forms — let rest for 5 minutes

**Cook the pancakes**:
- Heat a non-stick pan over medium heat, lightly greased with a neutral oil
- Pour a ladleful of batter per pancake and cook for 3 minutes until bubbles form and the edges look set
- Flip carefully and cook 2 more minutes
- Repeat with the remaining batter

**Prepare the toppings**:
- Warm the mango purée (80g) gently until pourable
- Slice the mango (120g), strawberries (18g), and keep the raspberries (23g) and blueberries (15g) whole

**Assemble and serve**:
- Stack the pancakes and top with fresh mango, strawberries, raspberries and blueberries
- Drizzle the mango purée over the stack
- Finish with coconut foam (40g) and a scatter of coconut flakes (15g)$$,
    image = '/uploads/images/veganbeetrootpancake.webp'
WHERE name = 'Vegan Beetroot Pancake';


-- ============================================================
-- Vegan Brunch
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the mushrooms and spinach**:
- Slice the white mushrooms (50g) and sauté in a pan with a drizzle of olive oil over medium-high heat for 3–4 minutes until golden
- Add the spinach (20g) to the pan, season with salt and pepper and wilt for 1 minute
- Set aside

**Toast the bread**:
- Slice the Saloia bread (100g) and toast until golden and crispy

**Prepare the salad**:
- Toss the iberian salad (20g) and cherry tomatoes (10g, halved) with the orange vinaigrette (5g)

**Assemble the plate**:
- Arrange the toasted bread on the plate
- Spread or serve the hummus (50g) alongside or on the bread
- Add the sautéed mushrooms and spinach
- Place the dressed salad on the side

**Serve**:
- Serve with a hot coffee (1 unit) on the side$$,
    image = '/uploads/images/veganbrunch.webp'
WHERE name = 'Vegan Brunch';


-- ============================================================
-- Vegan Sandwich
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Prepare the fillings**:
- Slice the zucchini (38g) thinly and grill or sauté in a drizzle of olive oil for 2–3 minutes per side until golden and tender
- Thinly slice the pear (60g) and set aside
- Wilt the spinach (80g) briefly in the same pan with a pinch of salt — 1 minute is enough

**Prepare the bread**:
- Slice the Saloia bread (200g) and toast lightly until golden

**Assemble**:
- Spread a generous layer of hummus (110g) on both sides of the toasted bread
- Layer the spinach, grilled zucchini and sliced pear
- Top with the caramelized onion (40g)
- Scatter the sesame seeds (4g) and chopped chives (10g) over everything

**Serve**:
- Close the sandwich, slice in half and serve immediately$$,
    image = '/uploads/images/vegansandwich.webp'
WHERE name = 'Vegan Sandwich';


-- ============================================================
-- Veggie Burger
-- ============================================================
UPDATE dev_dba.all_recipes
SET
    instructions = $$**Cook the quinoa patty base**:
- Rinse the quinoa (100g) and cook in salted water for 12–15 minutes until fluffy
- Grate the zucchini (20g) and squeeze out all excess water
- Mince the garlic (2g)
- Combine the cooked quinoa, zucchini and garlic in a bowl, season with salt and pepper, and form into a patty
- Cook the patty in a hot pan with oil for 3–4 minutes per side until golden and crispy

**Prepare the bread**:
- Slice the tomato bread (80g) and toast lightly

**Prepare the fillings**:
- Have the beetroot hummus (100g) and tzatziki sauce (20g) ready
- Prepare the sweet potato chips (30g) — either oven-baked at 200°C for 20 minutes or use pre-made

**Assemble**:
- Spread beetroot hummus generously on the bottom half of the toasted bread
- Add the iberian salad leaves (15g)
- Place the quinoa patty on top
- Spoon the tzatziki sauce over the patty

**Serve**:
- Close the burger and serve with sweet potato chips on the side$$,
    image = '/uploads/images/veggieburger.webp'
WHERE name = 'Veggie Burger';