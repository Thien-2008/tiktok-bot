require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// ✅ FIX Render (mở port giả)
require("http")
  .createServer((req, res) => {
    res.write("Bot is running");
    res.end();
  })
  .listen(process.env.PORT || 3000);

// ✅ Tạo bot + fix 409 conflict
const bot = new TelegramBot(process.env.BOT_TOKEN);

bot.deleteWebHook().then(() => {
  bot.startPolling();
});

// ✅ chống crash
process.on("uncaughtException", (err) => console.log(err));
process.on("unhandledRejection", (err) => console.log(err));

// ================= DATA =================
const step = {};
const userData = {};

// ================= MENU =================
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "🔥 TikTok Boost Bot\nChọn dịch vụ:", {
    reply_markup: {
      keyboard: [
        ["👤 Tăng Follow"],
        ["📈 Tăng View", "❤️ Tăng Tim"]
      ],
      resize_keyboard: true
    }
  });
});

// ================= CHỌN FOLLOW =================
bot.onText(/Tăng Follow/, (msg) => {
  const chatId = msg.chat.id;

  step[chatId] = "wait_link";
  bot.sendMessage(chatId, "🔗 Gửi link TikTok cần tăng follow:");
});

// ================= HANDLE =================
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  // ===== STEP 1: LINK =====
  if (step[chatId] === "wait_link") {

    if (!text.includes("tiktok.com")) {
      return bot.sendMessage(chatId, "❌ Link không hợp lệ!");
    }

    userData[chatId] = { link: text };
    step[chatId] = "wait_amount";

    return bot.sendMessage(chatId, "🔢 Nhập số lượng (10 - 100000):");
  }

  // ===== STEP 2: SỐ LƯỢNG =====
  if (step[chatId] === "wait_amount") {

    const amount = parseInt(text);

    if (isNaN(amount) || amount < 10 || amount > 100000) {
      return bot.sendMessage(chatId, "❌ Nhập số từ 10 - 100000");
    }

    userData[chatId].amount = amount;

    // 💰 TÍNH GIÁ (test)
    const pricePer1000 = 2.1;
    const total = (amount / 1000) * pricePer1000;

    userData[chatId].price = total.toFixed(2);

    step[chatId] = "confirm";

    return bot.sendMessage(chatId,
`📦 XÁC NHẬN ĐƠN

🔗 Link: ${userData[chatId].link}
👤 Số lượng: ${amount}
💰 Giá: ${userData[chatId].price}$

👉 Gõ "ok" để chạy`);
  }

  // ===== STEP 3: CONFIRM =====
  if (step[chatId] === "confirm") {

    if (text.toLowerCase() !== "ok") return;

    bot.sendMessage(chatId, "⏳ Đang xử lý...");

    // 🔥 TEST FAKE
    setTimeout(() => {
      bot.sendMessage(chatId,
`✅ Thành công!
👤 Follow: +${userData[chatId].amount}
💰 Giá: ${userData[chatId].price}$
⏱️ Thời gian: 1-5 phút`);
    }, 2000);

    step[chatId] = null;
  }
});
