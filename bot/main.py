import asyncio
import os
import logging

from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, WebAppInfo

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("tg_coper_bot")

BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()
WEBAPP_URL = os.getenv("WEBAPP_URL", "").strip()

dp = Dispatcher()


@dp.message(CommandStart())
async def start(message: Message) -> None:
    greeting = (
        "🚀 Добро пожаловать в TG_Coper!\n\n"
        "Автоматизация наполнения Telegram-каналов: меньше рутины — больше времени на развитие.\n\n"
        "Откройте приложение, чтобы скачать программу, узнать о лицензии и получить поддержку."
    )
    if WEBAPP_URL.startswith("https://"):
        keyboard = ReplyKeyboardMarkup(
            keyboard=[[KeyboardButton(text="Открыть TG_Coper", web_app=WebAppInfo(url=WEBAPP_URL))]],
            resize_keyboard=True,
            is_persistent=True,
        )
        await message.answer(greeting, reply_markup=keyboard)
    else:
        await message.answer(
            greeting
            + "\n\nMini App пока не опубликован. Администратору нужно задать WEBAPP_URL "
              "после размещения веб-приложения на HTTPS-хостинге."
        )


async def main() -> None:
    if not BOT_TOKEN:
        raise RuntimeError("Set BOT_TOKEN in environment before starting the bot.")
    bot = Bot(token=BOT_TOKEN)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
