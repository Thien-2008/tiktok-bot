const TelegramBot = require("node-telegram-bot-api");

// Lấy token từ env (Render)
const TOKEN = process.env.TOKEN;

// Tạo bot polling
const bot = new TelegramBot(TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
});

// Anti crash
process.on("uncaughtException", (err) => {
  console.log("Lỗi:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.log("Lỗi promise:", err);
});

// Log khi start
console.log("🤖 Bot đang chạy...");

// Test reply
bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "OK bot hoạt động 🚀");
});

// Command mẫu
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Bot đã sẵn sàng 😎");
});
