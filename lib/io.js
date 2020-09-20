const Gpio = require('onoff').Gpio;

class IO {

    constructor() {
        this.inputs = [];
    };

    clear() {
        this.inputs.map(input => {
            input.pin.unexport();
        });
    };

    add(input) {
        this.inputs.push({
            'pin': new Gpio(input.pin, input.type),
            'inputId': input.inputId
        });
    };

    read(inputId) {
        for (let i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].inputId == inputId) {
                return input.pin.readSync();
            };
        };
    };

    toggle(inputId) {
        for (let i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].inputId == inputId) {
                if (input.pin.readSync() === 0) {
                    input.pin.writeSync(1);
                } else {
                    input.pin.writeSync(0);
                };
                break;                
            };
        };
    };

};

module.exports = IO;