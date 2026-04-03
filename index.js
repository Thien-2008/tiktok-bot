
const TelegramBot = require('node-telegram-bot-api');

// Lấy token từ ENV (Render)
const token = process.env.TOKEN;

if (!token) {
  console.error("❌ Thiếu TOKEN!");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "OK bot hoạt động 🚀\nBot đã sẵn sàng 😎");
});

console.log("🤖 Bot đang chạy...");
