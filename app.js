const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const sequelize = require('./src/db/sequelize')


// App Init
const app = express()
const port = 3000

// Middlewares
app
    .use(morgan('dev'))
    .use(favicon(__dirname + '/favicon.ico'))
    .use(bodyParser.json())

// DB Init
sequelize.initDb()

// Endpoints
require('./src/routes/findAllPokemons')(app)
require('./src/routes/findPokemonByPk')(app)
require('./src/routes/createPokemon')(app)
require('./src/routes/updatePokemon')(app)
require('./src/routes/deletePokemon')(app)

// Listener
app.listen(port, () => console.log(`Notre application Node est start sur : http://localhost:${port}`))
