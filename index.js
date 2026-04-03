require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// ==== CONFIG ====
const CHANNEL_ID = process.env.CHANNEL_ID; // -100xxxx
let users = new Set();

// ==== WEB SERVER (fix lỗi Render) ====
const app = express();
app.get('/', (req, res) => {
  res.send('Bot đang chạy 🚀');
});
app.listen(process.env.PORT || 3000);

// ==== MENU ====
const menu = {
  reply_markup: {
    keyboard: [
      ['📈 Tăng View', '❤️ Tăng Tim'],
      ['👤 Tăng Follow'],
      ['📊 Thống kê']
    ],
    resize_keyboard: true
  }
};

// ==== START ====
bot.onText(/\/start/, (msg) => {
  users.add(msg.from.id);

  bot.sendMessage(msg.chat.id,
    "🔥 TikTok Boost Bot\nChọn dịch vụ:",
    menu
  );
});

// ==== HANDLE BUTTON ====
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  // ==== THỐNG KÊ ====
  if (text === '📊 Thống kê') {
    return bot.sendMessage(chatId, `👥 Tổng user: ${users.size}`);
  }

  // ==== VIEW ====
  if (text === '📈 Tăng View') {
    return bot.sendMessage(chatId, '📎 Gửi link TikTok cần tăng view:');
  }

  // ==== TIM ====
  if (text === '❤️ Tăng Tim') {
    return bot.sendMessage(chatId, '📎 Gửi link TikTok cần tăng tim:');
  }

  // ==== FOLLOW ====
  if (text === '👤 Tăng Follow') {
    return bot.sendMessage(chatId, '📎 Gửi link TikTok cần tăng follow:');
  }

  // ==== HANDLE LINK ====
  if (text.includes('tiktok.com')) {
    bot.sendMessage(chatId, '⏳ Đang xử lý...');

    // random fake số
    const view = Math.floor(Math.random() * 5000) + 1000;
    const like = Math.floor(Math.random() * 3000) + 500;
    const time = Math.floor(Math.random() * 5) + 2;

    // gửi về user
    bot.sendMessage(chatId,
`✅ Thành công!
👁 View: +${view}
❤️ Tim: +${like}
⏱ Thời gian: ${time} phút`
    );

    // ==== GỬI LOG VỀ KÊNH ====
    if (CHANNEL_ID) {
      try {
        bot.sendMessage(CHANNEL_ID,
`📢 Có user dùng bot

👤 ID: ${msg.from.id}
🔗 Link: ${text}

👁 +${view} view
❤️ +${like} tim
⏱ ${time} phút`
        );
      } catch (err) {
        console.log("Lỗi gửi kênh:", err.message);
      }
    }
  }
});
