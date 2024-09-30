export const localesMessages = {
  en: {
    welcome: `Welcome! Press the / to start.`,
    taskQuestion: "What is the business you want to be reminded of?",
    timeQuestion: "At what time would you like to be reminded? (Format: 00:00)",
    reminderSet: (task, time) => `Reminder is set: "${task}" at ${time}.`,
    invalidTime: "Invalid time format. Please use the format 00:00.",
    showReminders: (reminderList) => `Your reminders:\n${reminderList}`,
    noReminders: "You have no any reminders.",
    reminderDeleted: "Reminder has been successfully deleted.",
    invalidReminderNumber: "Invalid reminder number. Try again!",
    dontForget: (task) => `Don't forget about ${task}!`,
    languageQuestion: "Please choose your language:",
    help: `Here are the available commands:\n/remind - Create a reminder\n/show - Show all reminders\n/delete <number> - Delete a reminder by number\n/help - Show available commands`,
  },
  ua: {
    welcome: `Ласкаво просимо! 
    Я - бот, який допоможе вам нагадувати про ваші справи!
    Натисніть "/" на вашій клавіатурі, щоб побачити список команд.`,
    taskQuestion: "Про яку справу ви хочете, щоб вам нагадали?",
    timeQuestion: "О котрій годині вам потрібно нагадати? (Формат: 00:00)",
    reminderSet: (task, time) =>
      `Нагадування встановлено: "${task}" о ${time}.`,
    invalidTime:
      "Неправильний формат часу. Будь ласка, використовуйте формат 00:00.",
    showReminders: (reminderList) => `Ваші нагадування:\n${reminderList}`,
    noReminders: "У вас немає нагадувань.",
    reminderDeleted: "Нагадування успішно видалено.",
    invalidReminderNumber: "Невірний номер нагадування. Спробуйте ще раз!",
    dontForget: (task) => `Не забудьте про ${task}!`,
    languageQuestion: "Будь ласка, оберіть мову:",
    help: `Ось доступні команди:\n/remind - Створити нагадування\n/show - Показати всі нагадування\n/delete <number> - Видалити нагадування за номером\n/help - Показати доступні команди`,
  },
};
