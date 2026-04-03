const TelegramBot = require("node-telegram-bot-api");
const http = require("http");

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// lưu user + trạng thái
let users = {};
let userState = {};

// SERVER giữ Render sống
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.end("Bot is running");
}).listen(PORT);

// START
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  users[chatId] = true;

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

// HANDLE BUTTON
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "📈 Tăng View") {
    userState[chatId] = "view";
    bot.sendMessage(chatId, "📎 Gửi link TikTok cần tăng view:");
  }

  else if (text === "❤️ Tăng Tim") {
    userState[chatId] = "like";
    bot.sendMessage(chatId, "📎 Gửi link TikTok cần tăng tim:");
  }

  else if (text === "👤 Tăng Follow") {
    userState[chatId] = "follow";
    bot.sendMessage(chatId, "📎 Gửi link TikTok cần tăng follow:");
  }

  else if (text === "📊 Thống kê") {
    bot.sendMessage(chatId, `👥 Tổng user: ${Object.keys(users).length}`);
  }

  // 👉 xử lý link
  else if (text.includes("tiktok.com")) {

    if (!userState[chatId]) {
      bot.sendMessage(chatId, "⚠️ Hãy chọn dịch vụ trước!");
      return;
    }

    bot.sendMessage(chatId, "⏳ Đang xử lý...");

    setTimeout(() => {

      let amount = Math.floor(Math.random() * 5000) + 1000;

      let typeText = "";
      if (userState[chatId] === "view") typeText = "👁 View";
      if (userState[chatId] === "like") typeText = "❤️ Tim";
      if (userState[chatId] === "follow") typeText = "👤 Follow";

      bot.sendMessage(chatId,
`✅ Tăng thành công!
${typeText}: +${amount}
⏱ Thời gian: ${Math.floor(Math.random()*5)+1} phút`
      );

      userState[chatId] = null;

    }, 2000);
  }
});
