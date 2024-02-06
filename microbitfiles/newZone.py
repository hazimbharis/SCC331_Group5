# ZONE 1
from microbit import *
import radio
import random


radio.on()
radio.config(channel = 10, power = 7)

zoneID = 1
temp = 0
noise = 0
light = 0

while True:

    temp = temperature()
    noise = microphone.sound_level()
    light = display.read_light_level()
    radio.send('Zone1')
    radio.send
    sleep(random.randint(50, 150)) 
    

# first all zones had equal sleep time. However, this led pings interfere each other
# and prevent some zone pings to reach the user microbit