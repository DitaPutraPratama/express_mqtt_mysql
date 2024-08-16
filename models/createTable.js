const { pool } = require('./koneksi')

const createTable = async () => {
    const createSensorDhtTable = `
        CREATE TABLE IF NOT EXISTS sensor (
            id INT AUTO_INCREMENT PRIMARY KEY,
            time VARCHAR(100) NOT NULL,
            date VARCHAR(100) NOT NULL,
            co double,
            pm25 double
        )
`

    await pool
        .query(createSensorDhtTable)
        .then(() => console.log('sensor table created successfully'))
        .catch((err) => {
            if (err) {
                console.error('Error creating sensor table:', err)
                return
            }
        })
}

module.exports = {
    createTable,
}
