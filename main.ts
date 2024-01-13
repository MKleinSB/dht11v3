input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    basic.showString("" + (DHT11.temperature()))
    basic.setLedColors(0xffff00, 0x0ff000, 0x000000)
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    basic.showString("" + (DHT11.humidity()))
    basic.setLedColors(0x000000, 0x000000, 0xff00ff)
})
basic.setLedColors(0x000000, 0x00ffff, 0x00ff00)
DHT11.setPin(DigitalPin.C16)
basic.setLedColors(0xff8000, 0x00ffff, 0x00ff00)
