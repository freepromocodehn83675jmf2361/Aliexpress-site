export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const userAgent = req.headers["user-agent"] || "Неизвестно";

    let device = "💻 Компьютер";

    if (/tablet|ipad/i.test(userAgent)) {
      device = "📱 Планшет";
    } else if (/mobile|android|iphone/i.test(userAgent)) {
      device = "📱 Телефон";
    }

    const now = new Date();

    const time = now.toLocaleString("ru-RU", {
      timeZone: "Europe/Moscow",
      dateStyle: "short",
      timeStyle: "medium"
    });

    const message =
      `🟢 Новый посетитель на сайте!\n\n` +
      `🕐 Время: ${time}\n` +
      `${device}`;

    const telegramUrl =
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: message
      })
    });

    if (!response.ok) {
      return res.status(500).json({
        error: "Telegram error"
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
}
