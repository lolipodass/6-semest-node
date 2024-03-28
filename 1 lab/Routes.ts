import { Router } from "express";
import * as Turtle_controller from "./controller/Turtle_controller.ts";
import * as Weapon_controller from "./controller/Weapon_controller.ts";
import * as Pizzas_controller from "./controller/Pizzas_controller.ts";

const router = Router();

//!turtles
router.get('/api/turtles', Turtle_controller.GetTurtles);
router.get('/api/turtles/:id', Turtle_controller.GetTurtleById);

router.post('/api/turtles', Turtle_controller.createTurtle);

router.put('/api/turtles/:id', Turtle_controller.updateTurtleById);
router.put('/api/turtles/:turtleId/favoritePizzaBind/:pizzaId', Turtle_controller.bindFavoritePizza);
router.put('/api/turtles/:turtleId/secondFavoritePizzaBind/:pizzaId', Turtle_controller.bindSecondFavoritePizza);
router.put('/api/turtles/:turtleId/weaponBind/:weaponId', Turtle_controller.bindWeapon);

router.delete('/api/turtles/:turtleId/favoritePizzaUnbind/:pizzaId', Turtle_controller.unbindFavoritePizza);
router.delete('/api/turtles/:turtleId/secondFavoritePizzaUnbind/:pizzaId', Turtle_controller.unbindSecondFavoritePizza);
router.delete('/api/turtles/:turtleId/weaponUnbind/:weaponId', Turtle_controller.unbindWeapon);

//!weapons
router.get("/api/weapons", Weapon_controller.getWeapons);
router.get("/api/weapons/:id", Weapon_controller.getWeaponById);
router.post("/api/weapons", Weapon_controller.createWeapon);
router.put("/api/weapons/:id", Weapon_controller.updateWeapon);
router.delete("/api/weapons/:id", Weapon_controller.deleteWeapon);


// !pizzas
router.get("/api/pizzas", Pizzas_controller.getPizzas);
router.get("/api/pizzas/:id", Pizzas_controller.GetPizzaById);
router.post("/api/pizzas", Pizzas_controller.createPizza);
router.put("/api/pizzas/:id", Pizzas_controller.updatePizzaById);
router.delete("/api/pizzas/:id", Pizzas_controller.deletePizzaById);
router.get("/api/pizzasfat", Pizzas_controller.updateFatPizzas);

export default router;