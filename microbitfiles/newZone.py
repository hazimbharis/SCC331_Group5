# ZONE 1
from opt3001 import *
from microbit import *
import radio
import random

opt = opt3001()
radio.on()

zoneID = 1
temp = 0
noise = 0
light = 0.0

while True:
    radio.config(channel = 10, power = 7)
    temp = temperature()
    noise = microphone.sound_level()
    light = opt.read_lux_float()
    radio.send('Zone1')
    radio.config(channel = 31, power = 7)
    #print("003:," + str(zoneID) + "," + str(temp) + "," + str(noise) + "," + str(light) + ",")
    radio.send("003:," + str(zoneID) + "," + str(temp) + "," + str(noise) + "," + str(light) + ",")
    sleep(random.randint(50, 150)) 
    

# first all zones had equal sleep time. However, this led pings interfere each other
# and prevent some zone pings to reach the user microbit