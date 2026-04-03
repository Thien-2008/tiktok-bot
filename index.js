const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// ===== WEB SERVER (fix Render lỗi port) =====
const app = express();
app.get("/", (req, res) => res.send("Bot is running"));
app.listen(process.env.PORT || 3000);

// ===== DATA =====
let users = new Set(); // không bị reset giữa lệnh
let lastAction = {}; // chống spam

// ===== KEYBOARD =====
const keyboard = {
  reply_markup: {
    keyboard: [
      ["📈 Tăng View", "❤️ Tăng Tim"],
      ["👤 Tăng Follow"],
      ["📊 Thống kê"]
    ],
    resize_keyboard: true
  }
};

// ===== START =====
bot.onText(/\/start/, (msg) => {
  users.add(msg.chat.id);

  bot.sendMessage(
    msg.chat.id,
    "🔥 TikTok Boost Bot\nChọn dịch vụ:",
    keyboard
  );
});

// ===== CHỐNG SPAM =====
function isSpam(id) {
  const now = Date.now();
  if (lastAction[id] && now - lastAction[id] < 5000) return true;
  lastAction[id] = now;
  return false;
}

// ===== MENU =====
bot.on("message", async (msg) => {
  const id = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  users.add(id);

  if (isSpam(id)) {
    return bot.sendMessage(id, "⏳ Đợi tí rồi dùng tiếp...");
  }

  // ===== VIEW =====
  if (text === "📈 Tăng View") {
    return bot.sendMessage(id, "🔗 Gửi link TikTok cần tăng view:");
  }

  // ===== LIKE =====
  if (text === "❤️ Tăng Tim") {
    return bot.sendMessage(id, "🔗 Gửi link TikTok cần tăng tim:");
  }

  // ===== FOLLOW =====
  if (text === "👤 Tăng Follow") {
    return bot.sendMessage(id, "🔗 Gửi link TikTok cần tăng follow:");
  }

  // ===== STATS =====
  if (text === "📊 Thống kê") {
    return bot.sendMessage(
      id,
      `👥 Tổng user: ${users.size}`
    );
  }

  // ===== XỬ LÝ LINK =====
  if (text.includes("tiktok.com")) {
    bot.sendMessage(id, "⏳ Đang xử lý...");

    // fake delay cho giống thật
    setTimeout(() => {
      const type =
        text.includes("view") ? "👁 View" :
        text.includes("like") ? "❤️ Tim" :
        "🔥 Boost";

      const amount = Math.floor(Math.random() * 5000) + 1000;
      const time = Math.floor(Math.random() * 5) + 1;

      bot.sendMessage(
        id,
        `✅ Tăng thành công!\n${type}: +${amount}\n⏱ Thời gian: ${time} phút`
      );
    }, 2000);
  }
});
