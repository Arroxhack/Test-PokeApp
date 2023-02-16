const {Router} = require("express");
const getTypesRouter = Router();
const axios = require("axios");
const {type: TYPE} = require("../../db.js")
// console.log("TYPE: ", TYPE)

getTypesRouter.get("/getTypes", async (req, res) => { // /pokemon
    try {
        /* if already have types in db dont search for types */
        let dbTypes = await TYPE.findAll(); 

        if(dbTypes.length > 0){
            return res.json(dbTypes)
        }

        /* get types from pokemons api */
        let response = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=20");
        let allPokemonsArray = response.data.results;

        let allTypes = allPokemonsArray.map(async pokemon => {
            let subResponse = await axios.get(pokemon.url);
            let types = subResponse.data.types.map(type => type.type.name);
            return types;
        });

        let allTypesArray = await Promise.all(allTypes)
            .then(allTypes => allTypes.join(",").split(","));

        // console.log("allTypesArray: ", allTypesArray); // aca

        /* post types to table */
        allTypesArray.forEach(async (type) => {
            await TYPE.findOrCreate({ // No funciona bien el metodo asi que le puse unique al modelo
                where: {
                    name: type
                }
            });
        });
        
        dbTypes = await TYPE.findAll();

        return res.json(dbTypes)

    } catch (error) {
        console.log(error);
        res.send("Hubo un error");
    }
});

module.exports = getTypesRouter;