from microbit import *
import radio

# Receives:
# Channel 0: Information from zone
# Channel 2: ID and current zone of person

activeZones = [[], [], []]
nowActive = [0, 0, 0]
lastActive = [0 , 0, 0]

def checkZones(zone):
    if len(activeZones[zone]) > 0:
        if nowActive[zone] == 1: lastActive[zone] = 1
        else: nowActive[zone] = 1
    else:
        if nowActive[zone] == 0: lastActive[zone] = 0
        else: nowActive[zone] = 0
    
    if nowActive[zone] != lastActive[zone]: radio.send("0,"+str(zone)+","+str(nowActive[zone])+"1") #Extra value at end means nothing - should ignore but needs it

def updateZones(id, zone):
    for x in range(len(activeZones)):
        if len(activeZones[x]) > 0:
            for y in range(len(activeZones[x])):
                if activeZones[x][y] == id: activeZones[x].remove(id)
    activeZones[zone-1].append(id)

def calc(val):
    intVal = int(val)
    newVal = (intVal / 255) *10
    return int(newVal)

def main():
    uart.init(115200, 8, None, 1)
    
    radio.config(group=4, power = 1)
    radio.on()
    display.show("C")
    
    while(1):   
        sleep(1)
        
        print("testmessage")

        if uart.any():
            msgBytes = uart.read()
            msgStr = str(msgBytes, 'UTF-8')
            radio.send(msgStr)
        
        message = radio.receive()
        if message is not None:
            serialMessage = message.split(",")
            if int(serialMessage[0]) == 0:
                for x in range(len(OBJECTS)):
                    if serialMessage[1] == OBJECTS[x]: print(OBJECTS[x])
                if len(message) > 9: print("0:,Z:"+serialMessage[1]+",L:"+str(calc(serialMessage[2]))+",N:"+str(calc(serialMessage[3]))+",T:"+serialMessage[4])
            if int(serialMessage[0]) == 2: 
                print("2:,ID"+serialMessage[1]+",Z:"+serialMessage[2])
                updateZones(int(serialMessage[1]), int(serialMessage[2]))
                
        for x in range(3):
            checkZones(x)
        
        
main()  