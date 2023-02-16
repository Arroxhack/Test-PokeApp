const {Router} = require("express");
const getPokemonsRouter = Router();
const axios = require("axios");
const {pokemon: POKEMON, type: TYPE} = require("../../db.js");
const {Op} = require("sequelize");


    
// /pokemon/getPokemons or /pokemon/getPokemons/?name=nombreDePokemon 
getPokemonsRouter.get("/getPokemons", async (req, res) => {
    const {name} = req.query;

    /* en caso de sin nombre por query */
    if(!name){
        try {
               /*  Usando el next para traer 40 haciendo 2 busquedas de 20
            let response = await axios.get("https://pokeapi.co/api/v2/pokemon/");
            let pokemonsArray = response.data.results;
            
            let responseNext = await axios.get(response.data.next);
            let pokemonsArrayNext = responseNext.data.results;
    
            allPokemonsArray = [...pokemonsArray, ...pokemonsArrayNext] // Es como concat */
    
                /* Busqueda de pokemons en api */
            let apiPokemons = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=20"); // Para traer 150 usar ? limit=150
            let apiPokemonsArray = apiPokemons.data.results;
    
            let apiAllPokemons = apiPokemonsArray.map(async pokemon => {
                let subResponse = await axios.get(pokemon.url);
                let subResponseData = subResponse.data; 
    
                /* codigo para obtener los tipos prolijo */
                // let types = subResponseData.types.map(type => type.type.name)
                
                return {
                    id: subResponseData.id,
                    name: subResponseData.name,
                    image: subResponseData.sprites.other["official-artwork"]["front_default"],
                    type: subResponseData.types.map(type => type.type.name),
                    hp: subResponseData.stats[0]["base_stat"],
                    attack: subResponseData.stats[1]["base_stat"],
                    defense: subResponseData.stats[2]["base_stat"],
                    speed: subResponseData.stats[5]["base_stat"],
                    height: subResponseData.height,
                    weight: subResponseData.weight,
                }
            });
    
                /* Busqueda de pokemons en db */
            let dbAllPokemons = await POKEMON.findAll({
                include: [
                    {model: TYPE}
                ]
            })
                .then(dbPokemons => dbPokemons.map((pokemon) => {
                    return {
                        id: pokemon.id,
                        name: pokemon.name,
                        image: pokemon.image,
                        type: pokemon.types.map(type => type.name),
                        hp: pokemon.hp,
                        attack: pokemon.attack,
                        defense: pokemon.defense,
                        speed: pokemon.speed,
                        height: pokemon.height,
                        weight: pokemon.weight,
                    }
                }));
    
            Promise.all([...apiAllPokemons, ...dbAllPokemons])
                .then(finalPokemons => res.json(finalPokemons));
    
        } catch (error) {
            console.log(error);
            res.send("Hubo un error");
        }
    }

    /* en caso de nombre por query */
    try {
        /* busqueda nombre en api */
        let apiPokemons = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=20"); // Para traer 150 usar ? limit=150
        let apiPokemonsArray = apiPokemons.data.results;
        let apiPokemonsArrayName = apiPokemonsArray.filter(pokemon => {
            return pokemon.name.toLowerCase().includes(name.toLowerCase())
        }) 

        let apiAllPokemons = apiPokemonsArrayName.map(async pokemon => {
            let subResponse = await axios.get(pokemon.url);
            let subResponseData = subResponse.data;
            
            return {
                id: subResponseData.id,
                name: subResponseData.name,
                image: subResponseData.sprites.other["official-artwork"]["front_default"],
                type: subResponseData.types.map(type => type.type.name),
                hp: subResponseData.stats[0]["base_stat"],
                attack: subResponseData.stats[1]["base_stat"],
                defense: subResponseData.stats[2]["base_stat"],
                speed: subResponseData.stats[5]["base_stat"],
                height: subResponseData.height,
                weight: subResponseData.weight,
            }
        });
        
        /* busqueda nombre en db */
        let dbAllPokemons = await POKEMON.findAll({
            where: { name: {
                [Op.iLike]: `%${name}%`
            }},
             include: [
                {
                model: TYPE
                }
            ]
        })
        .then(dbPokemons => dbPokemons.length > 0 ? dbPokemons.map((pokemon) => {
            return {
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.image,
                type: pokemon.types.map(type => type.name),
                hp: pokemon.hp,
                attack: pokemon.attack,
                defense: pokemon.defense,
                speed: pokemon.speed,
                height: pokemon.height,
                weight: pokemon.weight,
            }
        }) : []);
        
        Promise.all([...apiAllPokemons, ...dbAllPokemons])
            .then(finalPokemons => res.json(finalPokemons));

    } catch (error) {
        console.log(error);
        res.send("Hubo un error");
    }
});



// /pokemon/{pokemonId}
getPokemonsRouter.get("/:pokemonId", async (req, res) => {
    const {pokemonId} = req.params;

    /* caso de que el id sea de la db */
    if(pokemonId.length > 8){
        try {
            let pokemonDbId = await POKEMON.findByPk(pokemonId, {
                include: TYPE
            });
            if(pokemonDbId !== null){
                let pokemonDbIdWithType = {
                    id: pokemonDbId.id,
                    name: pokemonDbId.name,
                    image: pokemonDbId.image,
                    type: pokemonDbId.types.map(type => type.name),
                    hp: pokemonDbId.hp,
                    attack: pokemonDbId.attack,
                    defense: pokemonDbId.defense,
                    speed: pokemonDbId.speed,
                    height: pokemonDbId.height,
                    weight: pokemonDbId.weight,
                }
                return res.json(pokemonDbIdWithType);
            }
            return res.send("No pokemons with that ID");
        } catch (error) {
            console.log(error);
            return res.send("Incorrect ID");
        }
    }

    /* caso de que el id sea de la api */
    try {
        let pokemonApiId = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        let pokemonApiIdData = pokemonApiId.data

        let formatedPokemonApiId = {
            id: pokemonApiIdData.id,
            name: pokemonApiIdData.name,
            image: pokemonApiIdData.sprites.other["official-artwork"]["front_default"],
            type: pokemonApiIdData.types.map(type => type.type.name),
            hp: pokemonApiIdData.stats[0]["base_stat"],
            attack: pokemonApiIdData.stats[1]["base_stat"],
            defense: pokemonApiIdData.stats[2]["base_stat"],
            speed: pokemonApiIdData.stats[5]["base_stat"],
            height: pokemonApiIdData.height,
            weight: pokemonApiIdData.weight,
        }
        return res.json(formatedPokemonApiId);
    } catch (error) {
        console.log(error);
        res.send("Incorrect ID");
    }
    

    // res.send("Funciona");
    
})





module.exports = getPokemonsRouter;