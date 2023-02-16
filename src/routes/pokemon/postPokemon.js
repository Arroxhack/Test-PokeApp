const {Router} = require("express");
const postPokemonRouter = Router();
const axios = require("axios");
const {pokemon} = require("../../db.js");


postPokemonRouter.post('/postPokemon', async (req, res) => { // /pokemon
    try {
        let {name, image, hp, attack, defense, speed, height, weight, type} = req.body
        /* create new pokemon */
        let newPokemon = {}
        if(name, hp, attack, defense, speed, height, weight){
            newPokemon = await pokemon.create({
                name, image:image ? image:null, hp, attack, defense, speed, height, weight    
            }) 
        }
        // console.log(newPokemon);
        /* add types to pokemon */
        if(type){
            await newPokemon.addTypes(type)
            return res.json(newPokemon)
        }
        
        return res.json(newPokemon)
    } catch (error) {
        console.log(error);
        res.send("Hubo un error");
    }
})

module.exports = postPokemonRouter;