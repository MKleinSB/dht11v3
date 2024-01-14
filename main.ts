input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    basic.showNumber(modules._dht11Temperature.temperature())
    basic.setLedColors(0x000000, 0x000000, 0xff00ff)
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    basic.showNumber(DHT11.temperature())
})
basic.setLedColors(0x00ffff, 0xff0080, 0xff00ff)
