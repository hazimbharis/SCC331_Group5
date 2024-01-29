from microbit import *

while True:
    # Accelerometer
    x, y, z = accelerometer.get_values()
    print("Accelerometer - X:", x, " Y:", y, " Z:", z)

    # Magnetometer (Compass)
    heading = compass.heading()
    print("Compass Heading:", heading)

    # Temperature Sensor
    temperature = temperature()
    print("Temperature:", temperature, "°C")

    # Light Sensor
    light_level = display.read_light_level()
    print("Light Level:", light_level)

    sleep(1000)  # Pause for 1 second before reading again
