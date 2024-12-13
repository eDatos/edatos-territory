declare const Edatos: {
  HeaderManagement: {
    addAtStart: (element: HTMLElement) => void;
    addAtEnd: (element: HTMLElement) => void;
  };
  i18n: {
    getChosenLocaleCookie: () => string;
    getDefaultLanguage: () => string;
    onLanguageChange: (callback: (event: Event) => void) => void;
  };
  Dropdown: {
    initialize: (buttonId: string, dropdownId: string) => void;
  };
};
