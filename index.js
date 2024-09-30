import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { localesMessages } from "./locales.js";

dotenv.config();

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

let reminders = {};
let userLanguage = {};

const getLocalizedMessage = (key, lang) => {
  return localesMessages[lang][key];
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

  if (data === "lang_en") {
    userLanguage[chatId] = "en";
    bot.sendMessage(chatId, getLocalizedMessage("welcome", "en"));
  } else if (data === "lang_ua") {
    userLanguage[chatId] = "ua";
    bot.sendMessage(chatId, getLocalizedMessage("welcome", "ua"));
  }

  bot.editMessageReplyMarkup(
    { inline_keyboard: [] },
    {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id,
    }
  );
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

              if (!reminders[chatId]) reminders[chatId] = [];
              reminders[chatId].push({ task, time });

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
  const currentTime = new Date().toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });

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
