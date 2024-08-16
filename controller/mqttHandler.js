const mqtt = require('mqtt')
const { saveDataSensor, iot } = require('./dataSensorControler.js')

const MqttHandler = {
    mqttClient: null,
    host: 'mqtt://test.mosquitto.org',
    port: 1883,
    username: '',
    password: '',

    async connect() {
        this.mqttClient = mqtt.connect(`${this.host}:${this.port}`, {
            username: this.username,
            password: this.password,
        })

        this.mqttClient.on('error', (err) => {
            console.log(err)
            this.mqttClient.end()
        })

        this.mqttClient.on('connect', () => {
            console.log(`mqtt client connected`)
            this.mqttClient.subscribe('dita/data6snAr', { qos: 0 })

            this.mqttClient.on('message', async (topic, message) => {
                try {
                    const { co, pm25 } = JSON.parse(message.toString())
                    await saveDataSensor({ co, pm25 })
                    console.log('co :', co)
                    console.log('pm25 :', pm25)
                    const ispuData = await iot()
                    const { finalISPU } = ispuData
                    const nilai =
                        finalISPU <= 50
                            ? 1
                            : finalISPU <= 100
                            ? 2
                            : finalISPU <= 200
                            ? 3
                            : finalISPU <= 300
                            ? 4
                            : 5

                    const topicToPublish = 'dita/val9fII5'
                    this.mqttClient.publish(
                        topicToPublish,
                        nilai.toString(),
                        { qos: 0 },
                        (err) => {
                            if (err) {
                                console.log(
                                    `Failed to publish to ${topicToPublish}:`,
                                    err
                                )
                            } else {
                                console.log(
                                    `Message published to ${topicToPublish}:`,
                                    nilai
                                )
                            }
                        }
                    )
                } catch (error) {
                    console.error('Error processing message:', error)
                }
            })
        })

        this.mqttClient.on('close', () => {
            console.log(`mqtt client disconnected`)
        })
    },
}

module.exports = MqttHandler
