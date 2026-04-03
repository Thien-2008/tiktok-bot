const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// ENV
const TOKEN = process.env.TOKEN;
const API_KEY = process.env.API_KEY;
const ADMIN_ID = process.env.ADMIN_ID;

const SERVICE_ID = 9406;
const PANEL_URL = "https://morethanpanel.com/api/v2";

// CHECK ENV
if (!TOKEN || !API_KEY || !ADMIN_ID) {
  console.log("❌ Thiếu ENV (TOKEN / API_KEY / ADMIN_ID)");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

console.log("🤖 Bot đang chạy...");

// START
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`🔥 Tăng Follow TikTok

💰 1000 follow = 60k

👉 Gửi link TikTok để bắt đầu`
  );
});

// HANDLE LINK
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // bỏ qua lệnh
  if (!text || text.startsWith("/")) return;

  // check link tiktok
  if (!text.includes("tiktok.com")) {
    return bot.sendMessage(chatId, "❌ Gửi link TikTok hợp lệ");
  }

  bot.sendMessage(chatId, "⏳ Đang tạo đơn...");

  try {
    const res = await axios.post(PANEL_URL, {
      key: API_KEY,
      action: "add",
      service: SERVICE_ID,
      link: text,
      quantity: 1000
    });

    if (!res.data.order) {
      throw new Error("Không tạo được đơn");
    }

    // gửi user
    await bot.sendMessage(chatId,
`✅ Thành công!
📦 Order: ${res.data.order}`
    );

    // gửi admin
    await bot.sendMessage(ADMIN_ID,
`📥 Đơn mới:
👤 User: ${chatId}
🔗 Link: ${text}
🆔 Order: ${res.data.order}`
    );

  } catch (err) {
    console.log("❌ Lỗi:", err.response?.data || err.message);

    bot.sendMessage(chatId, "❌ Lỗi tạo đơn, thử lại sau");
  }
});
