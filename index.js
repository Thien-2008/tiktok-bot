const TelegramBot = require("node-telegram-bot-api");
const http = require("http");

// 🔑 Lấy token từ ENV
const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

// 🌐 Fake server để Render không sleep
http.createServer((req, res) => {
  res.end("Bot is running");
}).listen(3000);

// 🚀 /start menu
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "🔥 TikTok Boost Bot\nChọn dịch vụ:", {
    reply_markup: {
      keyboard: [
        ["📈 Tăng View", "❤️ Tăng Tim"],
        ["👤 Tăng Follow"]
      ],
      resize_keyboard: true
    }
  });
});

// 📌 Xử lý nút + link
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // ❌ bỏ qua /start (tránh spam)
  if (text === "/start") return;

  // 👉 chọn dịch vụ
  if (text === "📈 Tăng View") {
    bot.sendMessage(chatId, "📎 Gửi link TikTok cần tăng view:");
    return;
  }

  if (text === "❤️ Tăng Tim") {
    bot.sendMessage(chatId, "📎 Gửi link TikTok cần tăng tim:");
    return;
  }

  if (text === "👤 Tăng Follow") {
    bot.sendMessage(chatId, "📎 Gửi link TikTok cần tăng follow:");
    return;
  }

  // 🔥 xử lý link TikTok (demo)
  if (text && text.includes("tiktok.com")) {
    bot.sendMessage(chatId, "⏳ Đang xử lý...");

    setTimeout(() => {
      bot.sendMessage(chatId, "✅ Hoàn tất!\n+1000 (demo)");
    }, 2000);
  }
});
