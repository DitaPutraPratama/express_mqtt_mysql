const express = require('express')
const {
    getSensor,
    getSensorAsc,
    getSensorOne,
    ispu,
    // iot,
} = require('../controller/dataSensorControler.js')

const router = express.Router()

router.get('/', (_, res) =>
    res.status(200).json({
        status: 200,
        nama: 'apiAirguard',
        dibuat_oleh : 'https://github.com/DitaPutraPratama',
        deskripsi:'sebuah api yang terintegrasi dengan mqtt untuk kalkulasi gas CO dan PM2,5',
        versi: '1.0.0',
    })
)
router.get('/data', getSensor)
router.get('/asc', getSensorAsc)
router.get('/one', getSensorOne)
router.get('/ispu', ispu)
// router.get('/iot', iot);

module.exports = router
