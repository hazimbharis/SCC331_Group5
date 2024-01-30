from microbit import *
import music
import time
import radio

name = "cell1" #Can be used as id for each door, maybe change to placeholder at start so it can be assigned
state = "stationary" #Track the door's status, motion means door is moving, stationary means door is not moving
last = time.ticks_ms()
locked = False
alarm = False
previousX = accelerometer.get_x() #Used to check if door is moving
previousY = accelerometer.get_y()
previousZ = accelerometer.get_z()
speaker.on()
radio.on()
radio.config(length = 251, channel = 11)
fill = Image("99999:" + "99999:" + "99999:" + "99999:" + "99999")
closed = False
closedX = 0
closedY = 0
closedZ = 0
set = False

display.scroll("Setting door system", wait = False, loop = True, delay = 100)
while (set == False):
    if (button_a.was_pressed()):
        closedX = accelerometer.get_x() #Set the MicroBit angle that the door is closed at
        closedY = accelerometer.get_y()
        closedZ = accelerometer.get_z()
        set = True
display.scroll("System set up", wait = False, delay = 100)
music.pitch(300, duration = 500, wait = False)

while True:
    if (time.ticks_diff(time.ticks_ms(), last) > 500): #Limit the rate that data collected, compares current time to the last time data was collected
        x = accelerometer.get_x() #Should be using get_strength() instead but it doesn't seem to be working?
        y = accelerometer.get_y()
        z = accelerometer.get_z()
        if (abs(closedX - x) + abs(closedY - y) + abs(closedZ - z) > 175): #If the angle deviates too much, the door is open
            closed = False
        else:
            closed = True
        if (abs(previousX - x) + abs(previousY - y) + abs(previousZ - z) > 125): #If too much change in any of the axis, count as moving
            state = "motion"
            if (locked == True):
                alarm = True
                #Placeholder to send warning to base station
                radio.send_bytes(bytes("alarm", "utf-8"))
                music.pitch(100, duration = -1, wait = False)
                display.show(Image.NO)
        else:
            state = "stationary"
        if (locked == True):
            lock = "locked"
        else:
            lock = "unlocked"
        if (closed == True):
            clos = "closed"
        else:
            clos = "open"
        print("door " + name + " " + clos + " " + state + " " + lock)
        #print(str(x) + " " + str(y) + " " + str(z)) #For testing
        previousX = x
        previousY = y
        previousZ = z
        last = time.ticks_ms()
        #Placeholder to send data to base station
        #radio.send_bytes(bytes("door " + name + " " + clos + " " + state + " " + lock, "utf-8"))
    if (button_a.was_pressed() and alarm == False):
        if (locked == False and closed == True):
            locked = True
            display.show(fill, wait = False) #wait prevents the rest of the code from blocking when display animation is occurring
            music.pitch(300, duration = 500, wait = False)
        elif (locked == True):
            locked = False
            display.clear()
            music.pitch(300, duration = 500, wait = False) #Audio feedback
    elif (button_b.was_pressed()):
        music.stop()
        if (locked == True):
            display.show(fill)
        alarm = False
        #Placeholder to stop warning at base station
        #radio.send_bytes(bytes("door " + name + " alert off", "utf-8"))