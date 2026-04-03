const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Lệnh start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Gửi link TikTok để boost 🚀");
});

// Nhận mọi tin nhắn
bot.on('message', (msg) => {
    const text = msg.text;

    // Bỏ qua /start
    if (text.startsWith("/")) return;

    // Check link TikTok
    if (text.includes("tiktok.com")) {
        bot.sendMessage(msg.chat.id, "✅ Đã nhận link TikTok!\nĐang xử lý...");
        
        // Demo fake boost
        setTimeout(() => {
            bot.sendMessage(msg.chat.id, "🚀 Boost thành công (demo)");
        }, 2000);

    } else {
        bot.sendMessage(msg.chat.id, "❌ Gửi link TikTok hợp lệ");
    }
});
