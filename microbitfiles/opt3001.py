import microbit
import math


I2C_LS_REG_RESULT = 0x00
I2C_LS_REG_CONFIG = 0x01
I2C_LS_REG_LOWLIMIT = 0x02
I2C_LS_REG_HIGHLIMIT = 0x03
I2C_LS_REG_MANUFACTURERID = 0x7E
I2C_LS_REG_DEVICEID = 0x7F

# Configdata for Register "Configuration"
I2C_LS_CONFIG_DEFAULT = 0xc810

# Configdata for Register "Configuration"
I2C_LS_CONFIG_CONT_FULL_800MS = 0xcc10
#----------------------------------

def _read_16bit(address, reg):
    microbit.i2c.write(address, bytes([reg]),repeat=True)
    values = microbit.i2c.read(address,2)
    data = (values[0] << 8) | values[1]
    return data

def _write_16bit(address, reg, data):
    d1= (data >> 8)
    d0= data & 0xFF
    microbit.i2c.write(address, bytes([reg,d1,d0]))


class opt3001:
    def __init__(self, address = 0x44):
        
        self.addr = address
        _write_16bit(self.addr,I2C_LS_REG_CONFIG,I2C_LS_CONFIG_CONT_FULL_800MS)

    def read_manufacture_id(self):
        
        return _read_16bit(self.addr, I2C_LS_REG_MANUFACTURERID)

    def read_device_id(self):
        return _read_16bit(self.addr, I2C_LS_REG_DEVICEID)
    
    def read_lux_fixpoint(self):
       
        # Register Value
        req_value = _read_16bit(self.addr,I2C_LS_REG_RESULT)
        # Convert to LUX
        mantisse = req_value & 0x0fff
        exponent = (req_value & 0xf000) >> 12

        return 2**exponent * mantisse  # mantisse << exponent;

    def read_lux_float(self):
        
        # Register Value
        req_value = _read_16bit(self.addr,I2C_LS_REG_RESULT)

        # Convert to LUX
        mantisse = req_value & 0x0fff
        exponent = (req_value & 0xf000) >> 12

        return 2**exponent * mantisse * 0.01  # mantisse << exponent * 0.01;