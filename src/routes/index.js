const {Router} = require("express");
const getPokemonsRouter = require("./pokemon/getPokemons.js");
const postPokemonRouter = require("./pokemon/postPokemon.js");
const getTypesRouter = require("./pokemon/getTypes.js");


const indexRouter = Router();
indexRouter.use('/pokemon', getPokemonsRouter);
indexRouter.use('/pokemon', postPokemonRouter);
indexRouter.use('/pokemon', getTypesRouter);




indexRouter.get("/", (req, res, next) => {
    res.send(`Ruta /`)
})

indexRouter.get("*", (req, res, next) => {
    res.send(`Ruta ${req.url} no valida`)
})


module.exports = indexRouter;