from microbit import *
import time

name = "cell 1"
state = "stationary" #Track the door's status, motion means door is moving, stationary means door is not moving
last = time.ticks_ms()
locked = False
previousX = accelerometer.get_x() #Used to check if door is moving
previousY = accelerometer.get_y()
previousZ = accelerometer.get_z()

while True:
    if (time.ticks_diff(time.ticks_ms(), last) > 500): #Limit the rate that data collected, compares current time to the last time data was collected
        x = accelerometer.get_x()
        y = accelerometer.get_y()
        z = accelerometer.get_z()
        if (abs(previousX - x) > 20 or abs(previousY - y) > 20 or abs(previousZ - z) > 20): #If too much change in any of the axis, count as moving
            print("x")
            state = "motion"
        else:
            state = "stationary"
        print("door" + " " + name + " " + state)
        print(str(x) + " " + str(y) + " " + str(z))
        previousX = x;
        previousY = y;
        previousZ = z;
        last = time.ticks_ms()
        #Placeholder to send data to base station