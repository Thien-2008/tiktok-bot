const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const TOKEN = process.env.TOKEN;
const API_KEY = process.env.API_KEY;

const ADMIN_ID = "ID_CUA_M";
const SERVICE_ID = 9406;
const PANEL_URL = "https://morethanpanel.com/api/v2";

// ❗ Fix conflict polling
const bot = new TelegramBot(TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
});

// Xóa webhook trước khi chạy
bot.deleteWebHook().then(() => {
  console.log("✅ Webhook cleared");
});

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
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || !text.includes("tiktok.com")) return;

  bot.sendMessage(chatId, "⏳ Đang tạo đơn...");

  try {
    const res = await axios.post(PANEL_URL, {
      key: API_KEY,
      action: "add",
      service: SERVICE_ID,
      link: text,
      quantity: 1000
    });

    if (res.data.order) {
      bot.sendMessage(chatId,
`✅ Thành công!
📦 Order: ${res.data.order}`
      );

      bot.sendMessage(ADMIN_ID,
`📥 Đơn mới:
User: ${chatId}
Link: ${text}
ID: ${res.data.order}`
      );
    } else {
      bot.sendMessage(chatId, "❌ Lỗi API panel");
      console.log(res.data);
    }

  } catch (err) {
    console.log(err.response?.data || err.message);
    bot.sendMessage(chatId, "❌ Lỗi tạo đơn");
  }
});
