from microbit import *
import music
import time

name = "cell 1"
state = "stationary" #Track the door's status, motion means door is moving, stationary means door is not moving
last = time.ticks_ms()
locked = False
previousX = accelerometer.get_x() #Used to check if door is moving
previousY = accelerometer.get_y()
previousZ = accelerometer.get_z()
speaker.on()

while True:
    if (time.ticks_diff(time.ticks_ms(), last) > 500): #Limit the rate that data collected, compares current time to the last time data was collected
        x = accelerometer.get_x() #Should be using get_strength() instead but it doesn't seem to be working?
        y = accelerometer.get_y()
        z = accelerometer.get_z()
        if (abs(previousX - x) + abs(previousY - y) + abs(previousZ - z) > 150): #If too much change in any of the axis, count as moving
            state = "motion"
        else:
            state = "stationary"
        if (locked == True):
            print("door" + " " + name + " " + state + " locked")
        else:
            print("door" + " " + name + " " + state + " unlocked")
        print(str(x) + " " + str(y) + " " + str(z))
        previousX = x;
        previousY = y;
        previousZ = z;
        last = time.ticks_ms()
        #Placeholder to send data to base station
    if (button_a.was_pressed() and button_b.was_pressed()):
        if (locked == True):
            locked = False
            display.scroll("Unlocked", wait = False) #wait prevents the rest of the code from blocking when display animation is occurring
            music.pitch(300, duration = 500, wait = False) #Audio feedback
        else:
            locked = True
            display.scroll("Locked", wait = False)
            music.pitch(300, duration = 500, wait = False)