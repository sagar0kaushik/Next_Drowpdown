import styles from "../styles/ToggleSwitch.module.css";

export default function ToggleSwitch({
  theme,
  toggleTheme,
}: {
  theme: string;
  toggleTheme: () => void;
}) {
  return (
    <div className={styles["theme-toggle"]}>
      <label className={styles["switch"]}>
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={toggleTheme}
        />
        <span className={styles["slider"]} />
      </label>
    </div>
  );
}
