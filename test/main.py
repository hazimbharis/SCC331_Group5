from microbit import *
import radio
import time

sum_rssi1 = sum_rssi2 = sum_rssi3 = sum_rssi4 = 0
counter1 = counter2 = counter3 = counter4 = 0
rssi_strongest = 0
last_zone = None # to save previous zone
radio.on()
radio.config(channel = 10, power = 7)
zone_rssi = {
    1 : None,
    2 : None,
    3 : None,
    4 : None
}
last = time.ticks_ms()

while True:
    ping = radio.receive_full()
    if ping:
        msg, rssi, timestamp = ping
        message = msg.decode('utf-8')
        #print(message);
        # identify to which zone ping belongs
        if message[-1] == "1":
            counter1 += 1
            sum_rssi1 += rssi
            if counter1 == 10:
                avgRSSI = sum_rssi1/10
                counter1 = 0
                sum_rssi1 = 0
                zone_rssi[1] = avgRSSI
        elif message[-1] == "2":
            counter2 += 1
            sum_rssi2 += rssi
            if counter2 == 10:
                avgRSSI = sum_rssi2/10
                counter2 = 0 # set counter back to 0
                sum_rssi2 = 0
                zone_rssi[2] = avgRSSI
        elif message[-1] == "3":
            counter3 += 1
            sum_rssi3 += rssi
            if counter3 == 10:
                avgRSSI = sum_rssi3/10
                counter3 = 0
                sum_rssi3 = 0
                zone_rssi[3] = avgRSSI
        elif message[-1] == "4":
            counter4 += 1
            sum_rssi4 += rssi
            if counter4 == 10:
                avgRSSI = sum_rssi4/10
                counter4 = 0
                sum_rssi4 = 0
                zone_rssi[4] = avgRSSI

    # compares rssi averages if all three has value and returns zone with strongest rssi
    if zone_rssi[1] != None and zone_rssi[2] != None and zone_rssi[3] != None and zone_rssi[4] != None:
        if zone_rssi[1] > zone_rssi[2] and zone_rssi[1] > zone_rssi[3] and zone_rssi[1] > zone_rssi[4]:
            rssi_strongest = 1
        elif zone_rssi[2] > zone_rssi[1] and zone_rssi[2] > zone_rssi[3] and zone_rssi[2] > zone_rssi[4]:
            rssi_strongest = 2
        elif zone_rssi[3] > zone_rssi[1] and zone_rssi[3] > zone_rssi[2] and zone_rssi[3] > zone_rssi[4]:
            rssi_strongest = 3
        elif zone_rssi[4] > zone_rssi[1] and zone_rssi[4] > zone_rssi[2] and zone_rssi[4] > zone_rssi[3]:
            rssi_strongest = 4
        if rssi_strongest != last_zone:
            last_zone = rssi_strongest
        # SEND IT TO MAIN HUB OR PRINT HERE
        zone_rssi[1] = zone_rssi[2] = zone_rssi[3] = zone_rssi[4] = None
    if time.ticks_diff(time.ticks_ms(), last) and last_zone != None > 1000:
        # Temperature Sensor
        temperature = temperature()
        # Light Sensor
        light_level = display.read_light_level()
        #Noise Sensor
        noise_level = microphone.sound_level()
        radio.config(channel = 31, power = 7)
        radio.send("003:," + str(last_zone) + "," + str(round(temperature)) + "," + str(round(light_level)) + "," + str(round(noise_level)) + ",")  # sends
        radio.config(channel = 10) #we still need to test this
        print("003:," + str(last_zone) + "," + str(round(temperature)) + "," + str(round(light_level)) + "," + str(round(noise_level)) + ",")
        last = time.ticks_ms()
    sleep(100)