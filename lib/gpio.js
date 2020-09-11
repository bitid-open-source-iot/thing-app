var sensor = require("node-dht-sensor");

exports.test = () => {
    try {
        setInterval(() => {
            sensor.read(11, 4, (error, temperature, humidity) => {
                if (error) {
                    console.warn(error.message);
                } else {
                    console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
                };
            });
        }, 1000)
    } catch (error) {
        console.warn(error.message);
    };
};