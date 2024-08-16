const { pool } = require('../models/koneksi.js')

const getSensor = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM sensor ORDER BY id DESC LIMIT 9'
        )
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const calculateISPU = (Xx, Xa, Xb, Ia, Ib) => {
    return ((Ia - Ib) * (Xx - Xb)) / (Xa - Xb) + Ib
}

const saveDataSensor = async ({ co, pm25 }) => {
    var currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0') // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0')

    const hours = String(currentDate.getHours()).padStart(2, '0')
    const minutes = String(currentDate.getMinutes()).padStart(2, '0')
    const seconds = String(currentDate.getSeconds()).padStart(2, '0')

    const time = `${hours}:${minutes}:${seconds}`
    const date = `${year}-${month}-${day}`

    console.log(time)

    const roundToThreeDecimals = (num) => {
        return parseFloat(num.toFixed(2))
    }

    const data = {
        time,
        date,
        co: roundToThreeDecimals(co),
        pm25: roundToThreeDecimals(pm25),
    }
    try {
        await pool.query(
            'INSERT INTO sensor (time, date, co, pm25) VALUES (?,?,?,?)',
            [data.time, data.date, data.co, data.pm25]
        )
        // await prisma.sensor.create({ data });
        console.log('Data sensor saved to database🎉')
    } catch (error) {
        console.error('Error saving sensor data:', error)
    }
}

const getSensorAsc = async (req, res) => {
    try {
        // const response = await prisma.sensor.findMany({
        //   orderBy: { id: "asc" },
        //   take: 10,
        // });
        const [response] = await pool.query(
            'SELECT * FROM sensor ORDER BY id ASC LIMIT 10'
        )
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const getSensorOne = async (req, res) => {
    try {
        // const response = await prisma.sensor.findMany({
        //   orderBy: { id: "desc" },
        //   take: 1,
        // });
        const [response] = await pool.query(
            'SELECT * FROM sensor ORDER BY id DESC LIMIT 1'
        )
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const fetchLatestSensorData = async () => {
    const [sensors] = await pool.query(
        'SELECT * FROM sensor ORDER BY id DESC LIMIT 1'
    )

    if (sensors.length === 0) {
        throw new Error('Data sensor tidak ditemukan')
    }

    return sensors[0]
}

const calculateFinalISPU = (sensorData) => {
    const { pm25, co } = sensorData

    const pm25Bounds = [
        { Xa: 15.5, Xb: 0, Ia: 50, Ib: 0 },
        { Xa: 55.4, Xb: 15.5, Ia: 100, Ib: 50 },
        { Xa: 150.4, Xb: 55.4, Ia: 200, Ib: 100 },
        { Xa: 250.4, Xb: 150.4, Ia: 300, Ib: 200 },
        { Xa: 500, Xb: 250.4, Ia: 500, Ib: 300 },
    ]

    const coBounds = [
        { Xa: 4000, Xb: 0, Ia: 50, Ib: 0 },
        { Xa: 8000, Xb: 4000, Ia: 100, Ib: 50 },
        { Xa: 15000, Xb: 8000, Ia: 200, Ib: 100 },
        { Xa: 30000, Xb: 15000, Ia: 300, Ib: 200 },
        { Xa: 45000, Xb: 30000, Ia: 500, Ib: 300 },
    ]

    const findBounds = (value, bounds) => {
        for (let i = 0; i < bounds.length; i++) {
            if (value <= bounds[i].Xa) {
                return bounds[i]
            }
        }
        return bounds[bounds.length - 1]
    }

    const pm25Bound = findBounds(pm25, pm25Bounds)
    const ispuPM25 = calculateISPU(
        pm25,
        pm25Bound.Xa,
        pm25Bound.Xb,
        pm25Bound.Ia,
        pm25Bound.Ib
    )

    const coBound = findBounds(co, coBounds)
    const ispuCO = calculateISPU(
        co,
        coBound.Xa,
        coBound.Xb,
        coBound.Ia,
        coBound.Ib
    )

    const finalISPU = Math.max(ispuPM25, ispuCO)

    return {
        ispuPM25: Math.round(ispuPM25),
        ispuCO: Math.round(ispuCO),
        finalISPU: Math.round(finalISPU),
        co: Math.round(co),
        pm25: Math.round(pm25),
    }
}

const ispu = async (req, res) => {
    try {
        const sensorData = await fetchLatestSensorData()
        const ispuData = calculateFinalISPU(sensorData)
        res.status(200).json(ispuData)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const iot = async () => {
    try {
        const sensorData = await fetchLatestSensorData()
        const { finalISPU } = calculateFinalISPU(sensorData)

        // Use finalISPU in the iot function logic
        // Add your logic here

        return { finalISPU }
    } catch (error) {
        json({ msg: error.message })
    }
}

module.exports = {
    getSensor,
    saveDataSensor,
    getSensorAsc,
    getSensorOne,
    ispu,
    iot,
}
