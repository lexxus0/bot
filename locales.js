export const localesMessages = {
  en: {
    welcome: `Welcome!\nI am a bot that will help you remind yourself of your tasks!\nPress "/" on your keyboard to see a list of commands.`,
    taskQuestion: "What is the business you want to be reminded of?",
    timeQuestion: `At what time would you like to be reminded?\n(Format: 00:00)`,
    regionQuestion: "Where are you from?",
    reminderSet: (task, time) => `Reminder is set:\n"${task}" at ${time}.`,
    invalidTime: `Invalid time format.\nPlease use the format 00:00.`,
    showReminders: (reminderList) => `Your reminders:\n${reminderList}`,
    noReminders: "You have no any reminders.",
    reminderDeleted: "Reminder has been successfully deleted.",
    invalidReminderNumber: "Invalid reminder number.\nTry again!",
    dontForget: (task) => `Don't forget about ${task}!`,
    languageQuestion: "Please choose your language:",
    help: `Here are the available commands:\n/remind - Create a reminder\n/show - Show all reminders\n/delete <number> - Delete a reminder by number\n/help - Show available commands`,
  },
  ua: {
    welcome: `Ласкаво просимо!\nЯ - бот, який допоможе вам нагадувати про ваші справи!\nНатисніть "/" на вашій клавіатурі, щоб побачити список команд.`,
    taskQuestion: "Про яку справу ви хочете, щоб вам нагадали?",
    timeQuestion: `О котрій годині вам потрібно нагадати?\n(Формат: 00:00)`,
    reminderSet: (task, time) =>
      `Нагадування встановлено:\n"${task}" о ${time}.`,
    regionQuestion: "Звідки ви?",
    invalidTime:
      "Неправильний формат часу.\nБудь ласка, використовуйте формат 00:00.",
    showReminders: (reminderList) => `Ваші нагадування:\n${reminderList}`,
    noReminders: "У вас немає нагадувань.",
    reminderDeleted: "Нагадування успішно видалено.",
    invalidReminderNumber: "Невірний номер нагадування. Спробуйте ще раз!",
    dontForget: (task) => `Не забудьте про ${task}!`,
    languageQuestion: "Будь ласка, оберіть мову:",
    help: `Ось доступні команди:\n/remind - Створити нагадування\n/show - Показати всі нагадування\n/delete <number> - Видалити нагадування за номером\n/help - Показати доступні команди`,
  },
};
