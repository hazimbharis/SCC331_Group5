from microbit import *
import radio

# Receives:
# Channel 001: ID of User and ID of Zone
# Channel 002: Door ID and Status (Locked, Closed, Alarm)
# Channel 003: Zone ID and Environment (Temp, Noise, Light)

#ignore other functions other than main
def main():
    uart.init(115200, 8, None, 1)
    
    radio.config(channel=31, power=7, queue=10)
    radio.on()
    display.show("C")
    
    while(1):
        if uart.any():
            msgBytes = uart.read()
            msgStr = str(msgBytes, 'UTF-8')
            radio.send(msgStr)
        
        message = radio.receive()
        if message is not None:
            print(message)
            #serialMessage = message.split(",")
            #print(serialMessage[0][:3])
            #if serialMessage[0][:3] == "001": #prisoner data: prisoner id and zone id
            #    pass
            #if len(message) > 9: print("0:,PID:"+serialMessage[1]+",ZID:"+str(calc(serialMessage[2])))
            #print("0:,PID:"+serialMessage[1]+",ZID:"+serialMessage[2])
            # if int(serialMessage[0]) == 1: #enviroment data: zone id, temp, noise and light
            #     print("1:,ZID:"+serialMessage[1]+",TEMP:"+serialMessage[2]+str(calc(serialMessage[2]))+",NOISE:"+str(calc(serialMessage[3]))+",LIGHT:"+serialMessage[4])
            #     #updateZones(int(serialMessage[1]), int(serialMessage[2]))
            # if int(serialMessage[0]) == 2: #door data: door id, locked, closed, alarmed
            #     print("2:,DID"+serialMessage[1]+",LOCK:"+serialMessage[2]+",CLOSE:"+serialMessage[3]+",ALARM:"+serialMessage[4])
            #     #updateZones(int(serialMessage[1]), int(serialMessage[2]))
        
        
main()  