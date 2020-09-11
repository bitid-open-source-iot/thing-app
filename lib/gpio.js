const GPIO = require('onoff').Gpio;
// var sensor = require("node-dht-sensor");

exports.test = () => {
    try {
        const temperature = new GPIO(11, 'out');
        temperature.watch((err, value) => {
            if (err) {
                console.warn(err.message);
            } else {
                console.log(value);
                temperature.writeSync(value)
            };
        });

        // sensor.read(11, 4, (error, temperature, humidity) => {
        //     if (error) {
        //         console.warn(error.message);
        //     } else {
        //         console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
        //     };
        // });
    } catch (error) {
        console.warn(error.message);
    };
};