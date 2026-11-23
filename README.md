# TG_Coper Mini App

Telegram Mini App storefront for the TG_Coper desktop application.

## Current scope
- Product landing screen
- Download section (awaits the approved installer URL)
- License purchase flow UI (payment integration intentionally disabled until merchant/payment setup)
- Account and support sections

## Connect the Telegram bot

The Mini App is published at:

`https://tailsparrot1-mind.github.io/TGcoper/`

The bot code is in `bot/main.py`. It already sends an **Open TG_Coper** Web App button on `/start` and `/app`, and configures the bot's menu button when it starts.

### First launch from Kali Linux

1. Open a terminal in the cloned repository folder.
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set the two environment variables in that terminal. Get the token from BotFather; **do not paste it into GitHub, source files, or a chat**:
   ```bash
   export BOT_TOKEN='PASTE_YOUR_BOTFATHER_TOKEN_HERE'
   export WEBAPP_URL='https://tailsparrot1-mind.github.io/TGcoper/'
   ```
5. Start the bot:
   ```bash
   python bot/main.py
   ```
6. Open Telegram, find `@tg_coper_bot`, and send `/start`. The bot should show the button that opens the Mini App.

Keep that terminal and process running. This local polling setup is for the first connection check; the bot stops when the process or computer stops. For 24/7 operation, it must later be moved to an always-on host with `BOT_TOKEN` stored as a private environment secret.

## Run locally

Open `miniapp/index.html` in a browser for a static preview. Telegram-specific user data is read through the official Telegram Web Apps SDK when available. The UI remains previewable outside Telegram.

## Production work still required

This is currently a static front end plus a basic bot launcher. A production release still needs server-side Telegram initData validation, a license/order backend, a verified installer URL, payment integration, and secure key issuance. GitHub Pages hosts the web page; it does not run the Python bot. Never place bot tokens or payment secrets in frontend code.
