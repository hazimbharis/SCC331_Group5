from microbit import *
import music
import time
import radio

name = 1 #Can be used as id for each door, maybe change to placeholder at start so it can be assigned
state = "stationary" #Track the door's status, motion means door is moving, stationary means door is not moving
last = time.ticks_ms()
locked = False
alarm = False
previousX = accelerometer.get_x() #Used to check if door is moving
previousY = accelerometer.get_y()
previousZ = accelerometer.get_z()
speaker.on()
radio.on()
radio.config(length = 64, channel = 31)
fill = Image("99999:" + "99999:" + "99999:" + "99999:" + "99999")
closed = False
closedDeg = 0
set = False

display.scroll("Setting door system", wait = False, loop = True, delay = 100) #Setup
while (set == False):
    if (button_a.was_pressed()):
        closedDeg = compass.heading() #Set the MicroBit angle that the door is closed at
        set = True
display.scroll("System set up", wait = False, delay = 100)
music.pitch(300, duration = 500, wait = False)

while True:
    if (time.ticks_diff(time.ticks_ms(), last) > 1000): #Limit the rate that data collected, compares current time to the last time data was collected
        h = compass.heading()
        if (abs(closedDeg - h) > 20): #If the angle deviates too much, the door is open
            closed = False
            if (locked == True): #Door should not be open and locked
                alarm = True
                music.pitch(100, duration = -1, wait = False)
                display.show(Image.NO, wait = False)
            else:
                display.clear()
        else:
            closed = True
            if (locked == False):
                display.show(Image.SQUARE, wait = False) #Display to user that door is closed if it is not locked, indicates to user that door can be locked
        x = accelerometer.get_x() #Should be using get_strength() instead but it doesn't seem to be working?
        y = accelerometer.get_y()
        z = accelerometer.get_z()
        if (abs(previousX - x) + abs(previousY - y) + abs(previousZ - z) > 50): #If too much change in any of the axis, count as moving
            state = "motion"
            if (locked == True):
                alarm = True
                music.pitch(100, duration = -1, wait = False)
                display.show(Image.NO, wait = False)
        else:
            state = "stationary"
        if (locked == True):
            lock = 1
        else:
            lock = 0
        if (closed == True):
            clos = 1
        else:
            clos = 0
        if (alarm == True):
            alar = 1
        else:
            alar = 0
        #print("door " + name + " " + clos + " " + state + " " + lock + " " + alar)
        #print(str(x) + " " + str(y) + " " + str(z)) #For testing
        #print(str(h))
        previousX = x
        previousY = y
        previousZ = z
        last = time.ticks_ms()
        print("002:," + str(name) + "," + str(lock) + "," + str(clos) + "," + str(alar) + ",")
        radio.send("002:," + str(name) + "," + str(lock) + "," + str(clos) + "," + str(alar) + ",") #Send data to base station via radio channel
    if (button_a.was_pressed() and alarm == False): #Locking and unlocking the door
        if (locked == False and closed == True):
            locked = True
            display.show(fill, wait = False) #wait prevents the rest of the code from blocking when display animation is occurring
            music.pitch(300, duration = 500, wait = False)
        elif (locked == True and closed == True):
            locked = False
            display.clear()
            music.pitch(300, duration = 500, wait = False) #Audio feedback
    elif (button_b.was_pressed()): #Turning off the alarm
        music.stop()
        if (locked == True):
            display.show(fill, wait = False)
        alarm = False