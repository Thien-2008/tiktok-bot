const TelegramBot = require("node-telegram-bot-api");
const http = require("http");

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// 🌐 SERVER (fix Render)
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is running");
}).listen(PORT);

// 📦 lưu user
let users = {};

// 🚀 /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  users[userId] = true;

  bot.sendMessage(chatId, "🔥 TikTok Boost Bot\nChọn dịch vụ:", {
    reply_markup: {
      keyboard: [
        ["📈 Tăng View", "❤️ Tăng Tim"],
        ["👤 Tăng Follow"],
        ["📊 Thống kê"]
      ],
      resize_keyboard: true
    }
  });
});

// 📌 xử lý message
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  if (!text) return;
  if (text === "/start") return;

  // 📊 thống kê
  if (text === "📊 Thống kê") {
    return bot.sendMessage(chatId,
      `👥 Tổng user: ${Object.keys(users).length}`
    );
  }

  // 👉 chọn dịch vụ
  if (text === "📈 Tăng View") {
    return bot.sendMessage(chatId, "📎 Gửi link TikTok cần tăng view:");
  }

  if (text === "❤️ Tăng Tim") {
    return bot.sendMessage(chatId, "📎 Gửi link TikTok cần tăng tim:");
  }

  if (text === "👤 Tăng Follow") {
    return bot.sendMessage(chatId, "📎 Gửi link TikTok cần tăng follow:");
  }

  // 🔥 xử lý link
  if (text.includes("tiktok.com")) {
    bot.sendMessage(chatId, "⏳ Đang xử lý...");

    setTimeout(() => {
      const random = Math.floor(Math.random() * 5000) + 1000;

      bot.sendMessage(chatId,
        `✅ Hoàn tất!\n+${random} (demo)`
      );
    }, 2000);
  }
});
