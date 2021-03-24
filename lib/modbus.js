const converter = require('hex2dec');
const SerialPort = require('serialport');
const ModbusMaster = require('modbus-rtu').ModbusMaster;

//create serail port with params. Refer to node-serialport for documentation
// const serialPort = new SerialPort("/dev/ttyUSB0", {
//     baudRate: 9600
// });

// //create ModbusMaster instance and pass the serial port object
// const master = new ModbusMaster(serialPort);

// setInterval(() => {
//     master.readHoldingRegisters(1, 4, 0x0001, 0x0001).then((data) => {
//         //promise will be fulfilled with parsed data
//         console.log(data); //output will be [10, 100, 110, 50] (numbers just for example)
//         const bufReg1 = Buffer.from([data[3],data[4]]);
//         console.log(bufReg1.readInt16BE(0));
//     }, (err) => {
//         //or will be rejected with error
//         console.log(err)
//     });
// }, 1000);

// //Read from slave with address 1 four holding registers starting from 0.
// master.readHoldingRegisters(1, 0, 4).then((data) => {
// //promise will be fulfilled with parsed data
// console.log(data); //output will be [10, 100, 110, 50] (numbers just for example)
// }, (err) => {
// //or will be rejected with error
// });

// //Write to first slave into second register value 150.
// //slave, register, value
// // master.writeSingleRegister(1, 2, 150).then(success, error);

class Register {

    constructor(args) {
        this.id = 0;
        this.to = 0;
        this.from = 0;
        this.value = null;
        this.slave = 0;
        this.offset = 0;
        this.parser = 'readInt16BE';
        this.function = 0;
        if (typeof(args) != 'undefined' && args != null) {
            if (typeof(args.id) != 'undefined' && args.id != null) {
                this.id = args.id;
            };
            if (typeof(args.to) != 'undefined' && args.to != null) {
                this.to = args.to;
            };
            if (typeof(args.from) != 'undefined' && args.from != null) {
                this.from = args.from;
            };
            if (typeof(args.slave) != 'undefined' && args.slave != null) {
                this.slave = args.slave;
            };
            if (typeof(args.offset) != 'undefined' && args.offset != null) {
                this.offset = args.offset;
            };
            if (typeof(args.parser) != 'undefined' && args.parser != null) {
                this.parser = args.parser;
            };
            if (typeof(args.function) != 'undefined' && args.function != null) {
                this.function = args.function;
            };
        };
    }

}

class ModbusRTU {

    constructor(args) {
        this.serial = {
            id: '/dev/ttyUSB0',
            baudRate: 9600
        };
        this.master = null;
        this.txtime = 60000;
        this.rxtime = 1000;
        this.registers = [];
        if (typeof(args) != 'undefined' && args != null) {
            if (typeof(args.serial) != 'undefined' && args.serial != null) {
                if (typeof(args.serial.id) != 'undefined' && args.serial.id != null) {
                    this.serial.id = args.serial.id;
                };
                if (typeof(args.serial.baudRate) != 'undefined' && args.serial.baudRate != null) {
                    this.serial.baudRate = args.serial.baudRate;
                };
            };
            if (typeof(args.txtime) != 'undefined' && args.txtime != null) {
                this.txtime = args.txtime;
            };
            if (typeof(args.registers) != 'undefined' && args.registers != null) {
                this.registers = args.registers.map(o => new Register(o));
            };
        };
        
        this.connect();
    }

    async read() {
        if (typeof(this.master) != 'undefined' && this.master != null) {
            this.registers.map(register => {
                this.master.readHoldingRegisters(register.slave, register.function, converter.decToHex(JSON.stringify(register.from)), converter.decToHex(JSON.stringify(register.to))).then(data => {
                    // will this work for all 
                    register.value = Buffer.from([data[3], data[4]])[register.parser](register.offset);
                }, err => {
                    register.value = null;
                    console.log(err)
                });
            });
        };
    }
    
    async write() {}

    async connect() {
        this.master = new ModbusMaster(new SerialPort(this.serial.id, {baudRate: this.serial.baudRate}));
        return await this.master;
    }

}

module.exports = ModbusRTU;