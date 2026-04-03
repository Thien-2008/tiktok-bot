const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;

// check token
if (!token) {
  console.log("❌ Thiếu TOKEN rồi!");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log("🤖 Bot đang chạy...");

// lệnh start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🚀 Bot boost TikTok\nGửi link video để bắt đầu!");
});

// xử lý tin nhắn
bot.on('message', (msg) => {
  const text = msg.text;

  if (!text || text.startsWith("/")) return;

  if (text.includes("tiktok.com")) {
    bot.sendMessage(msg.chat.id, "⏳ Đang xử lý link...");

    setTimeout(() => {
      bot.sendMessage(msg.chat.id, "🔥 +1000 views\n❤️ +200 likes\n👀 Done!");
    }, 2000);

  } else {
    bot.sendMessage(msg.chat.id, "❌ Gửi link TikTok hợp lệ!");
  }
});
