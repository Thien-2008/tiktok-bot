const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const TOKEN = process.env.TOKEN;
const API_KEY = process.env.API_KEY;

const ADMIN_ID = "ID_CUA_M"; // sửa lại
const SERVICE_ID = 9406;
const PANEL_URL = "https://morethanpanel.com/api/v2";

// Tạo bot
const bot = new TelegramBot(TOKEN, {
  polling: {
    interval: 300,
    autoStart: true
  }
});

// 🔥 FIX 409 (quan trọng)
bot.deleteWebHook()
  .then(() => console.log("✅ Webhook cleared"))
  .catch(() => {});

// START
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
`🔥 Tăng Follow TikTok

💰 1000 follow = 60k

👉 Gửi link TikTok để bắt đầu`
  );
});

// HANDLE LINK
bot.on("message", async (msg) => {
  try {
    const chatId = msg.chat.id;
    const text = msg.text;

    // bỏ qua lệnh
    if (!text || text.startsWith("/")) return;

    // check link
    if (!text.includes("tiktok.com")) {
      return bot.sendMessage(chatId, "❌ Gửi link TikTok hợp lệ");
    }

    await bot.sendMessage(chatId, "⏳ Đang tạo đơn...");

    const res = await axios.post(PANEL_URL, {
      key: API_KEY,
      action: "add",
      service: SERVICE_ID,
      link: text,
      quantity: 1000
    });

    if (!res.data || !res.data.order) {
      throw new Error("API lỗi");
    }

    await bot.sendMessage(chatId,
`✅ Thành công!
📦 Order: ${res.data.order}`
    );

    await bot.sendMessage(ADMIN_ID,
`📥 Đơn mới:
User: ${chatId}
Link: ${text}
ID: ${res.data.order}`
    );

  } catch (err) {
    console.log("❌ ERROR:", err.response?.data || err.message);

    bot.sendMessage(msg.chat.id,
"❌ Lỗi tạo đơn, thử lại sau"
    );
  }
});

// LOG chạy
console.log("🤖 Bot đang chạy...");
