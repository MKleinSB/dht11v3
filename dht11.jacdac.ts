//% deprecated
namespace DHT11 { }   // Auskommentieren wenn die normalen Blöcke erscheinen sollen

namespace modules {

    /**
     * The dht11 temperature sensor
     */
    //% fixedInstance whenUsed block="dht11 temperature"
    export const _dht11Temperature = new TemperatureClient(
        "dht11 temperature?dev=self"
    )

    /**
     * The dht11 air humidity sensor
     */
    //% fixedInstance whenUsed block="dht11 humidity"
    export const _dht11Humidity = new HumidityClient(
       "dht11 humidity?dev=self"
    )

}

namespace servers {
    const STREAMING_INTERVAL = 1400

    function createServers() {
        let ready = false
        // start all servers on hardware
        const servers: jacdac.Server[] = [
            jacdac.createSimpleSensorServer(
                jacdac.SRV_TEMPERATURE,
                jacdac.TemperatureRegPack.Temperature,
                () => DHT11.temperature(),
                {
                    streamingInterval: STREAMING_INTERVAL,
                    statusCode: jacdac.SystemStatusCodes.Initializing
                }
            ),
            jacdac.createSimpleSensorServer(
                jacdac.SRV_HUMIDITY,
                jacdac.HumidityRegPack.Humidity,
                () => DHT11.humidity(),
                {
                    streamingInterval: STREAMING_INTERVAL,
                    statusCode: jacdac.SystemStatusCodes.Initializing
                }
            ),
        ]


        control.runInBackground(() => {
            for (const serv of servers)
                serv.setStatusCode(jacdac.SystemStatusCodes.Ready)
            // keep polling
            while (true) {
                DHT11.temperature()
                DHT11.humidity()
            }
        })
        return servers
    }

    function start() {
        jacdac.productIdentifier = 0x3560a8cb
        jacdac.deviceDescription = "Seeed Grove dht11 (A1)"        
        jacdac.startSelfServers(() => createServers())
    }
    start()
}