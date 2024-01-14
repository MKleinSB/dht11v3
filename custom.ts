/**
  * MakeCode editor extension for DHT11 humidity/temperature sensor
  * by Alan Wang https://github.com/alankrantas/pxt-dht11_dht22
  * Changes by M. Klein 13 & 14.1.2024
  */


//% color=#2159b2 icon="\uf2c9" block="DHT11"
namespace DHT11 {

    let _temperature: number = -999.0
    let _humidity: number = -999.0
    let _readSuccessful: boolean = false
    let _sensorresponding: boolean = false
    let dht11Pin: DigitalPin = DigitalPin.C16
    let dht11startTime: number = 0
    let dht11WaitTime: number = 2000

    //% blockId=setPin block="DHT11 at pin %myPin"
    //% myPin.defl=DigitalPin.C16 weight=100
    //% myPin.fieldEditor="gridpicker" myPin.fieldOptions.columns=4
    //% myPin.fieldOptions.tooltips="false" myPin.fieldOptions.width="300"
    export function setPin(myPin: DigitalPin): void {
        dht11Pin = myPin;
    }

    /**
    * Query data from DHT11 sensor.
    */
    export function queryData(dataPin: DigitalPin) {

        //initialize
        let checksum: number = 0
        let checksumTmp: number = 0
        let dataArray: boolean[] = []
        let resultArray: number[] = []

        for (let index = 0; index < 40; index++) dataArray.push(false)
        for (let index = 0; index < 5; index++) resultArray.push(0)

        _humidity = -999.0
        _temperature = -999.0

        //request data
        pins.digitalWritePin(dataPin, 0) //begin protocol, pull down pin
        basic.pause(18)

        pins.setPull(dataPin, PinPullMode.PullUp) //pull up data pin
        pins.digitalReadPin(dataPin) //pull up pin
        control.waitMicros(40)

        if (pins.digitalReadPin(dataPin) == 1) {
            serial.writeLine("dht11 not responding")
        } else {
            _sensorresponding = true

            while (pins.digitalReadPin(dataPin) == 0); //sensor response
            while (pins.digitalReadPin(dataPin) == 1); //sensor response

            //read data (5 bytes)
            for (let index = 0; index < 40; index++) {
                while (pins.digitalReadPin(dataPin) == 1);
                while (pins.digitalReadPin(dataPin) == 0);
                control.waitMicros(28)
                //if sensor still pull up data pin after 28 us it means 1, otherwise 0
                if (pins.digitalReadPin(dataPin) == 1) dataArray[index] = true
            }

            //convert byte number array to integer
            for (let index = 0; index < 5; index++)
                for (let index2 = 0; index2 < 8; index2++)
                    if (dataArray[8 * index + index2]) resultArray[index] += 2 ** (7 - index2)

            //verify checksum
            checksumTmp = resultArray[0] + resultArray[1] + resultArray[2] + resultArray[3]
            checksum = resultArray[4]
            if (checksumTmp >= 512) checksumTmp -= 512
            if (checksumTmp >= 256) checksumTmp -= 256
            if (checksum == checksumTmp) _readSuccessful = true

            //read data if checksum ok
            if (_readSuccessful) {

                _humidity = resultArray[0] + resultArray[1] / 100
                _temperature = Math.round(resultArray[2] + resultArray[3] / 100)
            } else
                serial.writeLine("checksumerror")
        }
        dht11startTime = input.runningTime()
    }

    //% blockId=humidity block="humidity in percent"
    export function humidity(): number {
        if (dht11WaitTime > (input.runningTime() - dht11startTime)) { basic.pause(dht11WaitTime - (input.runningTime() - dht11startTime)) }
        queryData(dht11Pin);
        return _humidity
    }

    //% blockId=temperature block="temperature in ˚C"       
    export function temperature(): number {
        if (dht11WaitTime > (input.runningTime() - dht11startTime)) { basic.pause(dht11WaitTime - (input.runningTime() - dht11startTime)) }
        queryData(dht11Pin);
        return _temperature
    }
}