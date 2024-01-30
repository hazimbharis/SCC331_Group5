from microbit import *
import radio

def main():
    radio.config(group=4)
    radio.on()
    
    while(1):
        
        message = radio.receive()
        
        if message is not None:
            print(message)

main()