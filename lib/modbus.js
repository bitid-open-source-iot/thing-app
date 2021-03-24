const converter = require('hex2dec');
const SerialPort = require('serialport');
const ModbusMaster = require('modbus-rtu').ModbusMaster;

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
        this.positions = [3, 4];
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
            if (typeof(args.positions) != 'undefined' && args.positions != null) {
                this.positions = args.positions;
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
                    register.value = Buffer.from(register.positions.map(i => data[i]))[register.parser](register.offset);
                    __logger.info(['READ EVENT: slave = ', register.slave, ', value = ', register.value, ', from-to = ', register.from, '-', register.to, ', function = ', register.function].join(''));
                }, error => {
                    register.value = null;
                    __logger.error([error.name, ': ', error.message].join(''));
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