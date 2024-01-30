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

#ignore other functions other than main
def main():
    uart.init(115200, 8, None, 1)
    
    radio.config(group=4, power = 1)
    radio.on()
    display.show("C")
    
    while(1):
        if uart.any():
            msgBytes = uart.read()
            msgStr = str(msgBytes, 'UTF-8')
            radio.send(msgStr)
        
        message = radio.receive()
        if message is not None:
            serialMessage = message.split(",")
            if int(serialMessage[0]) == 0: #prisoner data: prisoner id and zone id
                for x in range(len(OBJECTS)):
                    if serialMessage[1] == OBJECTS[x]: print(OBJECTS[x])
                if len(message) > 9: print("0:,PID:"+serialMessage[1]+",ZID:"+str(calc(serialMessage[2])))
            if int(serialMessage[0]) == 1: #enviroment data: zone id, temp, noise and light
                print("1:,ZID:"+serialMessage[1]+",TEMP:"+serialMessage[2]+str(calc(serialMessage[2]))+",NOISE:"+str(calc(serialMessage[3]))+",LIGHT:"+serialMessage[4])
                #updateZones(int(serialMessage[1]), int(serialMessage[2]))
            if int(serialMessage[0]) == 2: #door data: door id, locked, closed, alarmed
                print("2:,DID"+serialMessage[1]+",LOCK:"+serialMessage[2]+",CLOSE:"+serialMessage[3]+",ALARM:"+serialMessage[4])
                #updateZones(int(serialMessage[1]), int(serialMessage[2]))
                
        for x in range(3):
            checkZones(x)
        
        
main()  