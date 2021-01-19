// Requires
const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const { Sequelize, DataTypes } = require('sequelize')
const { success, getUniqueId } = require('./helper.js')

// DB File
let pokemons = require('./mock-pokemon')
const PokemonModel = require('./src/models/pokemon')

// App Init
const app = express()
const port = 3000

// DB Init
const sequelize = new Sequelize(
    'pokedex',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2'
        },
        logging: false
    }
)
sequelize.authenticate()
    .then(_ => console.log('La connexion à la base de donnée a bien été établie.'))
    .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))

const Pokemon = PokemonModel(sequelize,DataTypes)

sequelize.sync({force:true})
    .then(_ => console.log('La base de données "Pokedex" a bien été synchronisée.'))

// Middlewares
app
    .use(morgan('dev'))
    .use(favicon(__dirname + '/favicon.ico'))
    .use(bodyParser.json())

// Routes
app.get('/', (req,res) => res.send('Hello again, Express !'))
app.get('/api/pokemons', (req, res) => {
    const message = `La liste des pokémons a bien été récupérée.`
    res.json(success(message, pokemons))
})
app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    const message = 'Un pokémon a bien été trouvé.'
    res.json(success(message, pokemon))
})
app.post('/api/pokemons', (req,res) => {
    const id = getUniqueId(pokemons)
    const pokemonCreated = { ...req.body, ...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le Pokemon ${pokemonCreated.name} a bien été créé.`
    res.json(success(message, pokemonCreated))
})
app.put('/api/pokemons/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const pokemonUpdated = { ... req.body, id: id}
    pokemons = pokemons.map(pokemon =>{
        return pokemon.id === id ? pokemonUpdated : pokemon
    })
    message = `Le pokemon ${pokemonUpdated.name} a bien été modifié.`
    res.json(success(message, pokemonUpdated))
})
app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
    pokemons.filter(pokemon => pokemon.id !== id)
    const message = `Le pokemon ${pokemonDeleted.name} a bien été supprimé.`
    res.json(success(message, pokemonDeleted))
})

// Listener
app.listen(port, () => console.log(`Notre application Node est start sur : http://localhost:${port}`))
