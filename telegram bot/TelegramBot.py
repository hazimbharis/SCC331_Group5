import threading
import time
import telebot
import sqlite3
import schedule
import mysql.connector

# Connect to the bot
token = "6929891453:AAH6Fu6CzgMVoFyPAAOobpVgAEsL-RbNkGE"
bot = telebot.TeleBot(token)
chat_id = "YOUR_CHAT_ID"
reading = ""
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="MyNewPass",
    database="microbits"
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
    bot.reply_to(message, "Welcome to Smart Lab Bot!",
                 reply_markup=telebot.types.ReplyKeyboardRemove())
    get_data_from_db()


@bot.message_handler(func=lambda message: message.text == "Zone 1")
def handle_zone_1(message):
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM environment WHERE zoneID=1")
    result = cursor.fetchall()
    cursor.close()
    retrieved_data = result[-1]
    if reading == "noise":
        user_reading = retrieved_data[3]
        bot.send_message(message.chat.id,
                         f"🔊Noise in Zone 1 is {int(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())
    elif reading == "temperature":
        user_reading = retrieved_data[2]
        bot.send_message(message.chat.id,
                         f"🌡Temperature in Zone 1 is {int(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())
    elif reading == "light":
        user_reading = retrieved_data[4]
        bot.send_message(message.chat.id,
                         f"💡Light in Zone 1 is {int(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())


@bot.message_handler(func=lambda message: message.text == "Zone 2")
def handle_zone_2(message):
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM environment WHERE zoneID=2")
    result = cursor.fetchall()
    cursor.close()
    retrieved_data = result[-1]
    if reading == "noise":
        user_reading = retrieved_data[3]
        bot.send_message(message.chat.id,
                         f"🔊Noise in Zone 2 is {int(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())
    elif reading == "temperature":
        user_reading = retrieved_data[2]
        bot.send_message(message.chat.id,
                         f"🌡Temperature in Zone 2 is {int(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())
    elif reading == "light":
        user_reading = retrieved_data[4]
        bot.send_message(message.chat.id,
                         f"💡Light in Zone 2 is {int(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())


@bot.message_handler(func=lambda message: message.text == "Zone 3")
def handle_zone_3(message):
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM environment WHERE zoneID=3")
    result = cursor.fetchall()
    cursor.close()
    retrieved_data = result[-1]
    if reading == "noise":
        user_reading = retrieved_data[3]
        bot.send_message(message.chat.id,
                         f"🔊Noise in Zone 3 is {int(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())
    elif reading == "temperature":
        user_reading = retrieved_data[2]
        bot.send_message(message.chat.id,
                         f"🌡Temperature in Zone 3 is {int(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())
    elif reading == "light":
        user_reading = retrieved_data[4]
        bot.send_message(message.chat.id,
                         f"💡Light in Zone 3 is {int(user_reading)}",
                         reply_markup=telebot.types.ReplyKeyboardRemove())


# 🔊 💡 🌡 🤔
# Handle text messages from user
@bot.message_handler(content_types=["text"])
def handle_response(message):
    global reading
    markup = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
    zone1 = telebot.types.KeyboardButton("Zone 1")
    zone2 = telebot.types.KeyboardButton("Zone 2")
    zone3 = telebot.types.KeyboardButton("Zone 3")
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


schedule.every(60).minutes.do(send_periodic_message)
schedule_thread = threading.Thread(target=schedule_thread)
schedule_thread.start()

if __name__ == "__main__":
    # Start the bot with infinity polling
    bot.infinity_polling()
