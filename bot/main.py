import asyncio
import logging
import os
from urllib.parse import urlparse

from aiogram import Bot, Dispatcher
from aiogram.filters import Command, CommandStart
from aiogram.types import (
    BotCommand,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    MenuButtonWebApp,
    Message,
    WebAppInfo,
)

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
log = logging.getLogger("tg_coper_bot")

BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()
WEBAPP_URL = os.getenv("WEBAPP_URL", "").strip()

dp = Dispatcher()


def valid_webapp_url(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme == "https" and bool(parsed.netloc)


def app_keyboard() -> InlineKeyboardMarkup | None:
    if not valid_webapp_url(WEBAPP_URL):
        return None
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(
                text="Открыть TG_Coper",
                web_app=WebAppInfo(url=WEBAPP_URL),
            )]
        ]
    )


async def send_welcome(message: Message) -> None:
    greeting = (
        "🚀 Добро пожаловать в TG_Coper!\n\n"
        "Автоматизация наполнения Telegram-каналов: меньше рутины — "
        "больше времени на развитие.\n\n"
        "В приложении можно посмотреть возможности программы, скачать "
        "дистрибутив и ознакомиться с лицензией."
    )
    keyboard = app_keyboard()
    if keyboard:
        await message.answer(greeting, reply_markup=keyboard)
    else:
        await message.answer(
            greeting
            + "\n\nПриложение ещё не опубликовано. Оно появится здесь "
              "после подключения HTTPS-адреса Mini App."
        )


@dp.message(CommandStart())
async def start(message: Message) -> None:
    await send_welcome(message)


@dp.message(Command("app"))
async def open_app(message: Message) -> None:
    await send_welcome(message)


@dp.message(Command("help"))
async def help_command(message: Message) -> None:
    await message.answer(
        "Команды TG_Coper:\n"
        "/start — главное меню\n"
        "/app — открыть Mini App\n"
        "/help — эта справка"
    )


async def main() -> None:
    if not BOT_TOKEN:
        raise RuntimeError(
            "BOT_TOKEN is missing. Set it as a private environment variable."
        )
    if WEBAPP_URL and not valid_webapp_url(WEBAPP_URL):
        raise RuntimeError("WEBAPP_URL must be a full HTTPS URL.")

    bot = Bot(token=BOT_TOKEN)
    try:
        await bot.set_my_commands([
            BotCommand(command="start", description="Главное меню"),
            BotCommand(command="app", description="Открыть TG_Coper"),
            BotCommand(command="help", description="Помощь"),
        ])
        if valid_webapp_url(WEBAPP_URL):
            await bot.set_chat_menu_button(
                menu_button=MenuButtonWebApp(
                    text="TG_Coper",
                    web_app=WebAppInfo(url=WEBAPP_URL),
                )
            )
            log.info("Mini App menu button configured: %s", WEBAPP_URL)
        else:
            log.warning("WEBAPP_URL is not configured; Mini App button is disabled.")
        log.info("TG_Coper bot is starting.")
        await dp.start_polling(bot)
    finally:
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())
