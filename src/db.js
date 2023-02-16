require('dotenv').config();
const {DB_USER, DB_PASSWORD, DB_HOST, DB_NAME} = process.env;
const {Sequelize} = require("sequelize");
const modelPokemon = require("../src/models/pokemon.js");
const modelType = require("../src/models/type.js");
const modelPokemonType = require("../src/models/pokemon_type.js");

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
    logging: false,
    native: false
});

modelPokemon(sequelize);
modelType(sequelize);
modelPokemonType(sequelize);

let {pokemon, type, pokemon_type} = sequelize.models;


pokemon.belongsToMany(type, {through: pokemon_type});
type.belongsToMany(pokemon, {through: pokemon_type});

module.exports = {
    ...sequelize.models,
    db: sequelize,
}