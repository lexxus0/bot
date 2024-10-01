import TelegramBot from "node-telegram-bot-api";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import moment from "moment-timezone";
import { localesMessages } from "./locales.js";

dotenv.config();

const token = process.env.TOKEN;
const bot = new TelegramBot(token);

const webhookUrl = process.env.WEBHOOK_URL || "https://bot-zz41.onrender.com";

bot.setWebHook(`${webhookUrl}/bot${token}`);

const app = express();
app.use(bodyParser.json());

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

let reminders = {};
let userLanguage = {};
let userRegion = {};

const getLocalizedMessage = (key, lang) => {
  return localesMessages[lang] && localesMessages[lang][key]
    ? localesMessages[lang][key]
    : localesMessages["en"][key];
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, getLocalizedMessage("languageQuestion", "en"), {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "English", callback_data: "lang_en" },
          { text: "Українська", callback_data: "lang_ua" },
        ],
      ],
    },
  });
});

bot.on("callback_query", (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === "lang_en" || data === "lang_ua") {
    userLanguage[chatId] = data === "lang_en" ? "en" : "ua";

    bot.sendMessage(
      chatId,
      getLocalizedMessage("regionQuestion", userLanguage[chatId]),
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Ukraine", callback_data: "region_ua" },
              { text: "Europe", callback_data: "region_eu" },
            ],
          ],
        },
      }
    );

    bot.editMessageReplyMarkup(
      { inline_keyboard: [] },
      { chat_id: chatId, message_id: callbackQuery.message.message_id }
    );
  }

  if (data === "region_ua" || data === "region_eu") {
    userRegion[chatId] = data === "region_ua" ? "Europe/Kiev" : "Europe/Madrid";
    const lang = userLanguage[chatId] || "en";
    bot.sendMessage(chatId, getLocalizedMessage("welcome", lang));
  }
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const lang = userLanguage[chatId] || "en";
  bot.sendMessage(chatId, getLocalizedMessage("help", lang));
});

bot.onText(/\/remind/, (msg) => {
  const chatId = msg.chat.id;
  const lang = userLanguage[chatId] || "en";

  bot
    .sendMessage(chatId, getLocalizedMessage("taskQuestion", lang))
    .then(() => {
      bot.once("message", (taskMsg) => {
        const task = taskMsg.text;

        bot
          .sendMessage(chatId, getLocalizedMessage("timeQuestion", lang))
          .then(() => {
            bot.once("message", (timeMsg) => {
              const time = timeMsg.text;

              const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
              if (!timeRegex.test(time)) {
                bot.sendMessage(
                  chatId,
                  getLocalizedMessage("invalidTime", lang)
                );
                return;
              }

              const userTimezone = userRegion[chatId] || "Europe/Kiev";
              const reminderTime = moment
                .tz(time, "HH:mm", userTimezone)
                .utc()
                .format("HH:mm");

              if (!reminders[chatId]) reminders[chatId] = [];
              reminders[chatId].push({ task, time: reminderTime });

              bot.sendMessage(
                chatId,
                getLocalizedMessage("reminderSet", lang)(task, time)
              );
            });
          });
      });
    });
});

bot.onText(/\/show/, (msg) => {
  const chatId = msg.chat.id;
  const lang = userLanguage[chatId] || "en";

  if (reminders[chatId] && reminders[chatId].length > 0) {
    let reminderList = reminders[chatId]
      .map((r, i) => `${i + 1}: ${r.task} at ${r.time}`)
      .join("\n");
    bot.sendMessage(
      chatId,
      getLocalizedMessage("showReminders", lang)(reminderList)
    );
  } else {
    bot.sendMessage(chatId, getLocalizedMessage("noReminders", lang));
  }
});

bot.onText(/\/delete (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const lang = userLanguage[chatId] || "en";
  const reminderIndex = parseInt(match[1], 10) - 1;

  if (reminders[chatId] && reminders[chatId][reminderIndex]) {
    reminders[chatId].splice(reminderIndex, 1);
    bot.sendMessage(chatId, getLocalizedMessage("reminderDeleted", lang));
  } else {
    bot.sendMessage(chatId, getLocalizedMessage("invalidReminderNumber", lang));
  }
});

const checkReminders = () => {
  const currentTime = moment.utc().format("HH:mm");

  for (let chatId in reminders) {
    reminders[chatId] = reminders[chatId].filter((reminder) => {
      if (reminder.time === currentTime) {
        const lang = userLanguage[chatId] || "en";
        bot.sendMessage(
          chatId,
          getLocalizedMessage("dontForget", lang)(reminder.task)
        );
        return false;
      }
      return true;
    });
  }
};

setInterval(checkReminders, 1000);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
