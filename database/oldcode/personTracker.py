from microbit import *
import radio
import math

# Receives: Signals from each zone
# Sends: ID of person with current zone

IDENTIFIER = "2,"
ID = 1

def main():
    radio.config(group=4, power=1)
    radio.on()
    
    currentZone = 0
    lastZone = 0
    zones = [[-1000 for x in range(3)] for y in range(3)]
    z1Count = 0
    z2Count = 0
    z3Count = 0

    while True:
        message = radio.receive_full()
        
        if message is not None:
            m = message[0].decode('utf-8')
            stringList = m.split(',')
            if len(stringList) == 2:
                if int(stringList[1]) == 1:
                    zones[0][z1Count] = int(message[1])
                    z1Count += 1
                    if z1Count > 2:
                        z1Count = 0
                if int(stringList[1]) == 2:
                    zones[1][z2Count] = int(message[1])
                    z2Count += 1
                    if z2Count > 2:
                        z2Count = 0
                if int(stringList[1]) == 3:
                    zones[2][z3Count] = int(message[1])
                    z3Count += 1
                    if z3Count > 2:
                        z3Count = 0

        temp = -3000
        zoneVals = [0, 0, 0]       
        for x in range(len(zones)):
            for y in range(len(zones[x])):
                zoneVals[x] += zones[x][y]
            if zoneVals[x] >= temp:
                temp = zoneVals[x]
                currentZone = x+1
                
        if lastZone != currentZone:
            print(currentZone)
            lastZone = currentZone
            display.show(currentZone)
            radio.send(IDENTIFIER+str(ID)+","+str(currentZone))
        
main()