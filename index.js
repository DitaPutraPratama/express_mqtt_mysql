const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const productRoutes = require('./routes/dataRoutes.js')
const MqttHandler = require('./controller/mqttHandler.js')
const db = require('./models/koneksi.js')
const createTable = require('./models/createTable.js')
dotenv.config()

const app = express()
const port = process.env.APP_PORT

app.use(cors())
app.use(express.json())
app.use(productRoutes)

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`)
})

async function inits() {
    await MqttHandler.connect()
    await db.connectToDatabase()
    await createTable.createTable()
}
inits()
