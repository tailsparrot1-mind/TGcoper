# TG_Coper Mini App

Telegram Mini App storefront for the TG_Coper desktop application.

## Current scope
- Product landing screen
- Download section (awaits the approved installer URL)
- License purchase flow UI (payment integration intentionally disabled until merchant/payment setup)
- Account and support sections

## Run locally
Open `miniapp/index.html` in a browser for a static preview. Telegram-specific user data is read through the official Telegram Web Apps SDK when available. The UI remains previewable outside Telegram.

## Important
This is the front-end foundation only. A production release still needs a Telegram bot token, a trusted HTTPS host, server-side Telegram initData validation, a license/order backend, and a verified payment provider integration. Never place bot tokens or payment secrets in frontend code.
