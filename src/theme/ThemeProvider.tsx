import { type ReactNode, createContext, useContext } from "react";

interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const theme: Theme = {
  colors: {
    primary: "#6200ea",
    secondary: "#00bfa5",
    accent: "#ff6f00",
  },
};

const ThemeContext = createContext<Theme>(theme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
