require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// قراءة الأدعية اليومية فقط من ملف duas.json
const dailyDuas = JSON.parse(fs.readFileSync('./duas.json', 'utf8'));

function sendDua(dua) {
  const embed = new EmbedBuilder()
    .setTitle(`🕊️ ${dua.title}`)
    .setDescription(dua.description)
    .setColor(0x2ecc71)
    .setFooter({ text: '🤍 زورو بوت - أذكار يومية' })
    .setTimestamp();

  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  if (channel) {
    channel.send({ embeds: [embed] });
  } else {
    console.error('⚠️ لم يتم العثور على القناة. تحقق من CHANNEL_ID في .env');
  }
}

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // إرسال دعاء عشوائي من الأدعية اليومية
  const randomDua = dailyDuas[Math.floor(Math.random() * dailyDuas.length)];
  sendDua(randomDua);

  // إرسال دعاء عشوائي كل 24 ساعة
  setInterval(() => {
    const randomDua = dailyDuas[Math.floor(Math.random() * dailyDuas.length)];
    sendDua(randomDua);
  }, 24 * 60 * 60 * 1000); // كل 24 ساعة
});

client.login(process.env.DISCORD_TOKEN);
