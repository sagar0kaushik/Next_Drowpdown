
"use client";

import { useState, useEffect } from "react";
import Dropdown from "@/components/Dropdown";
import ToggleSwitch from "@/components/ToggleSwitch";

export default function Home() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(`${theme}-mode`);
  }, [theme]);

  return (
    <div className="page">
      <ToggleSwitch theme={theme} toggleTheme={toggleTheme} />
      <Dropdown />
    </div>
  );
}
