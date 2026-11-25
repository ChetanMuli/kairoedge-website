import { useEffect, useState } from "react";

export type Theme = "light";

export function useTheme() {
  const [theme] = useState<Theme>("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("ke-theme", "light");
  }, []);

  const toggleTheme = () => {
    // Light theme locked
  };

  return { theme, toggleTheme, setTheme: () => {} };
}
