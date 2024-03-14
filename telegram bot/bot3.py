import threading
import time
import telebot
import sqlite3
import schedule
import mysql.connector

rooms = ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 7", "Room 8", "Room 9",
         "Room 10"]
# Connect to the bot
token = "6295634114:AAG71F3Mw6PuGavGoI9KyKA0eXjmGds1MQA"
bot = telebot.TeleBot(token)
chat_id = "YOUR_CHAT_ID"
reading = ""
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="MyNewPass",
    database="hotel"
)


# Retrieve data from db
def get_data_from_db():
    cursor = conn.cursor()
    retrieved_data = []
    cursor.execute("SELECT * FROM environment")
    result = cursor.fetchall()
    for row in result:
        retrieved_data.append(row)
    return retrieved_data[-1]


# Warnings
def check_warning_periodic():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM warnings")
    result = cursor.fetchall()
    cursor.close()
    zones = ["", "Reception", "Restaurant", "Room 1", "Room 2", "Room 3", "Room 4", "Room 5",
             "Room 6", "Room 7", "Room 8",
             "Room 9", "Room 10"]
    warnings = ["Staff needs help in ", "Temperature too high in ", "Temperature too low in ",
                "Noise too high in ", "Lights too low in "]
    for item in result:
        msg = f"⚠️{warnings[item[1] - 1] + zones[item[0] - 1]}"
        bot.send_message(chat_id, msg)


def send_periodic_message():
    readings = get_data_from_db()
    message_text = (
        f"Current readings: \n 🔊 Noise: {int(readings[3])} \n 💡 Light: {int(readings[4])} \n "
        f"🌡 Temperature: {int(readings[2])}")
    bot.send_message(chat_id, message_text)


def schedule_thread():
    while True:
        schedule.run_pending()
        time.sleep(1)


# Handle start command from a user
@bot.message_handler(commands=['start'])
def send_welcome(message):
    global chat_id
    chat_id = message.chat.id
    bot.reply_to(message, "Welcome to Smart Hotel Bot!",
                 reply_markup=telebot.types.ReplyKeyboardRemove())
    get_data_from_db()


@bot.message_handler(func=lambda message: message.text == "Hotel Rooms")
def handle_zone_1(message):
    markup = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
    room1 = telebot.types.KeyboardButton("Room 1")
    room2 = telebot.types.KeyboardButton("Room 2")
    room3 = telebot.types.KeyboardButton("Room 3")
    room4 = telebot.types.KeyboardButton("Room 4")
    room5 = telebot.types.KeyboardButton("Room 5")
    room6 = telebot.types.KeyboardButton("Room 6")
    room7 = telebot.types.KeyboardButton("Room 7")
    room8 = telebot.types.KeyboardButton("Room 8")
    room9 = telebot.types.KeyboardButton("Room 9")
    room10 = telebot.types.KeyboardButton("Room 10")
    markup.add(room1, room2, room3, room4, room5, room6, room7, room8, room9, room10)
    bot.send_message(message.chat.id, f"Please choose a room",
                     reply_markup=markup)


@bot.message_handler(func=lambda message: message.text == "Reception")
def handle_zone_2(message):
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM environment WHERE zoneID=2")
    result = cursor.fetchall()
    cursor.close()
    retrieved_data = result[-1]
    if reading == "noise":
        user_reading = retrieved_data[3]
        bot.send_message(message.chat.id,
                         f"🔊Noise in Reception is {float(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())
    elif reading == "temperature":
        user_reading = retrieved_data[2]
        bot.send_message(message.chat.id,
                         f"🌡Temperature in Reception is {float(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())
    elif reading == "light":
        user_reading = retrieved_data[4]
        bot.send_message(message.chat.id,
                         f"💡Light in Reception is {float(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())


@bot.message_handler(func=lambda message: message.text == "Restaurant")
def handle_zone_3(message):
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM environment WHERE zoneID=3")
    result = cursor.fetchall()
    cursor.close()
    retrieved_data = result[-1]
    if reading == "noise":
        user_reading = retrieved_data[3]
        bot.send_message(message.chat.id,
                         f"🔊Noise in Restaurant is {float(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())
    elif reading == "temperature":
        user_reading = retrieved_data[2]
        bot.send_message(message.chat.id,
                         f"🌡Temperature in Restaurant is {float(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())
    elif reading == "light":
        user_reading = retrieved_data[4]
        bot.send_message(message.chat.id,
                         f"💡Light in Restaurant is {float(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())


@bot.message_handler(func=lambda message: message.text in rooms)
def room_handler(message):
    room_number = int(message.text.replace("Room ", ""))
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM environment WHERE zoneID={room_number}")
    result = cursor.fetchall()
    cursor.close()
    retrieved_data = result[-1]
    if reading == "noise":
        user_reading = retrieved_data[3]
        bot.send_message(message.chat.id,
                         f"🔊Noise in Room {room_number} is {float(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())
    elif reading == "temperature":
        user_reading = retrieved_data[2]
        bot.send_message(message.chat.id,
                         f"🌡Temperature in Room {room_number} is {float(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())
    elif reading == "light":
        user_reading = retrieved_data[4]
        bot.send_message(message.chat.id,
                         f"💡Light in Room {room_number} is {float(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())


# 🔊 💡 🌡 🤔
# Handle text messages from user
@bot.message_handler(content_types=["text"])
def handle_response(message):
    global reading
    markup = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
    zone1 = telebot.types.KeyboardButton("Hotel Rooms")
    zone2 = telebot.types.KeyboardButton("Reception")
    zone3 = telebot.types.KeyboardButton("Restaurant")
    markup.add(zone1, zone2, zone3)
    readings = get_data_from_db()
    if "noise" in message.text.lower():
        reading = "noise"
        bot.reply_to(message, f"Please choose a zone",
                     reply_markup=markup)
    if "light" in message.text.lower():
        reading = "light"
        bot.reply_to(message, f"Please choose a zone",
                     reply_markup=markup)
    if "temperature" in message.text.lower():
        reading = "temperature"
        bot.reply_to(message, f"Please choose a zone",
                     reply_markup=markup)

    if "noise" not in message.text.lower() and "light" not in message.text.lower() and "temperature" not in message.text.lower():
        bot.reply_to(message,
                     "🤔I do not understand your command.\n Try using keywords: noise, light, "
                     "temperature")


# schedule.every(60).minutes.do(send_periodic_message)
schedule.every(1).minutes.do(check_warning_periodic)
schedule_thread = threading.Thread(target=schedule_thread)
schedule_thread.start()

if __name__ == "__main__":
    # Start the bot with infinity polling
    bot.infinity_polling()
