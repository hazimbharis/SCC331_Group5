from microbit import *
import radio

# Receives: Each signal from person
# Sends: Local values, zone number for person

IDENTIFIER = "0,"
ZONE = 1
MONITORED_OBJECT = "Chair"
MAX = 7

def main():
    radio.config(group=4, power = 7)
    radio.on()
    
    active = 1 #Change to 0 when not testing lights
    brightnessSetting = 100
    lightMode = 0
    check = 0
    timeToCheck = 0
    objSent = 0
    values = [[None for x in range(MAX)] for y in range(3)]
    
    # Light = values[0]
    # Noise = values[1]
    # Temperature = values[2]
    
    while(1):
        message = radio.receive()
        
        if message is not None:
            stringList = message.split(',')
            if len(stringList) == 3 and int(stringList[0]) == ZONE:
                if stringList[1] == "off":
                    lightMode = 2
                if stringList[1] == "on":
                    brightnessSetting = int(stringList[2])
                    lightMode = 1
                if stringList[1] == "amb":
                    lightMode = 0
            if len(stringList) == 4 and int(stringList[1]) == ZONE:
                if int(stringList[2]) == 1: active = 1
                else: active = 0
        
        values[0][check] = display.read_light_level()
        values[1][check] = microphone.sound_level()
        values[2][check] = temperature()
        check += 1
                
        if check == MAX:
            valAggs = [0, 0, 0]
            for x in range(MAX):
                valAggs[0] += values[0][x]
                valAggs[1] += values[1][x]
                valAggs[2] += values[2][x]
            valAggs[0] = int(valAggs[0] / MAX)
            valAggs[1] = int(valAggs[1] / MAX)
            valAggs[2] = int(valAggs[2] / MAX)
            values = [ZONE, valAggs[0], valAggs[1], valAggs[2]]
            messageToSend = ','.join(map(str, values))
            print(messageToSend)
            radio.send(IDENTIFIER+messageToSend)
            check = 0
            values = [[None for x in range(MAX)] for y in range(3)]
            
        radio.send(IDENTIFIER+str(ZONE))
            
        # lightMode 0 = Light controlled by ambience if person is in zone
        # lightMode 1 = Light is on depending on brightness if person is in zone
        # lightMode 2 = Light is always off
        
        if active == 1:
            if lightMode == 0:
                light = display.read_light_level()
                light = light / 28
                level = 9 - int(light)
                temp = str(level)+str(level)+str(level)+str(level)+str(level)
                temp = temp+":"+temp+":"+temp+":"+temp+":"+temp
                brightness = Image(temp)
                display.show(brightness)             
            elif lightMode == 1:
                level = int((9 * brightnessSetting) / 100)
                print(level)
                temp = str(level)+str(level)+str(level)+str(level)+str(level)
                brightness = Image(temp+":"+temp+":"+temp+":"+temp+":"+temp)
                display.show(brightness)                 
            elif lightMode == 2:
                brightness = Image("0:0:0:0:0")
                display.show(brightness)

        if pin0.read_digital() == 1 and timeToCheck == 0:
            radio.send(IDENTIFIER+MONITORED_OBJECT+",0")
            objSent = 1
        if objSent == 1:
            timeToCheck += 1
            if timeToCheck == MAX*2:
                timeToCheck = 0
                objSent = 0
            
        sleep(333)

main()