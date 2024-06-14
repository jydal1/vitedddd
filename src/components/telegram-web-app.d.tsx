interface TelegramWebApp {
    expand: () => void;
    close: () => void;
  }
  
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
  