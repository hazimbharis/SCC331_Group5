from microbit import *
import music
import radio

status = False
speaker.on()
radio.on()
radio.config(length = 251, channel = 11)

while True:
    msg = radio.receive_bytes()
    if (button_a.was_pressed()):
        status = True
        music.pitch(200, duration = -1, wait = False)
    elif (button_b.was_pressed()):
        music.stop()
        status = False
    if (msg == b"alarm"):
        #print(msg)
        status = True
        music.pitch(200, duration = -1, wait = False)