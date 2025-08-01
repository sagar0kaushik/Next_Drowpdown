"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import ToggleSwitch from "./ToggleSwitch";
import styles from "../styles/DropdownForm.module.css";

const API_URL = "https://api.countrystatecity.in/v1";
const API_KEY = "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==";

const defaultRow = { country: "", state: "", city: "", states: [], cities: [] };

const fetchData = async (url: string) => {
  try {
    const res = await fetch(url, { headers: { "X-CSCAPI-KEY": API_KEY } });
    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    return [];
  }
};

export default function Dropdown() {
  const [rows, setRows] = useState([defaultRow]);
  const [countries, setCountries] = useState<any[]>([]);
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  // 🌓 Initialize theme before render
  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.body.className = `${savedTheme}-mode`;
    setMounted(true);
  }, []);

  // 🔁 Theme update
  useEffect(() => {
    if (mounted) {
      document.body.className = `${theme}-mode`;
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  // 🌎 Load countries + restore previous state
  useEffect(() => {
    fetchData(`${API_URL}/countries`).then(data => Array.isArray(data) && setCountries(data));
    const saved = JSON.parse(localStorage.getItem("locationRows") || "[]");
    if (saved.length) setRows(saved);
  }, []);

  // 💾 Save to localStorage
  useEffect(() => localStorage.setItem("locationRows", JSON.stringify(rows)), [rows]);

  const updateRow = (index: number, updates: any) =>
    setRows(rows.map((r, i) => (i === index ? { ...r, ...updates } : r)));

  const handleCountryChange = async (i: number, country: string) => {
    const states = country ? await fetchData(`${API_URL}/countries/${country}/states`) : [];
    updateRow(i, { country, state: "", city: "", states, cities: [] });
  };

  const handleStateChange = async (i: number, state: string) => {
    const { country } = rows[i];
    const cities = (country && state)
      ? await fetchData(`${API_URL}/countries/${country}/states/${state}/cities`)
      : [];
    updateRow(i, { state, city: "", cities });
  };

  const getName = (list: any[], code: string) =>
    list.find((item) => item.iso2 === code)?.name || "";

  return (
    <div className={styles.page}>
      {mounted && (
        <ToggleSwitch
          theme={theme}
          toggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        />
      )}

      <div className={styles["multi-location-selector"]}>
        <h1 className={styles.heading}>Multi Location Selector</h1>

        {rows.map((row, i) => (
          <div key={i} className={styles["location-block"]}>
            <div className={styles["dropdown-row"]}>
              {/* Country */}
              <select
                className={styles.select}
                value={row.country}
                onChange={(e) => handleCountryChange(i, e.target.value)}
              >
                <option value="">Select Country</option>
                {countries.map(({ iso2, name }) => (
                  <option key={iso2} value={iso2}>{name}</option>
                ))}
              </select>

              {/* State */}
              <select
                className={styles.select}
                value={row.state}
                disabled={!row.country}
                onChange={(e) => handleStateChange(i, e.target.value)}
              >
                <option value="">Select State</option>
                {row.states.map(({ iso2, name }) => (
                  <option key={iso2} value={iso2}>{name}</option>
                ))}
              </select>

              {/* City */}
              <select
                className={styles.select}
                value={row.city}
                disabled={!row.state}
                onChange={(e) => updateRow(i, { city: e.target.value })}
              >
                <option value="">Select City</option>
                {row.cities.map(({ id, name }) => (
                  <option key={id} value={name}>{name}</option>
                ))}
              </select>

              {/* Delete */}
              <button
                className={styles["remove-btn"]}
                onClick={() => {
                  const updated = [...rows];
                  updated.splice(i, 1);
                  setRows(updated.length ? updated : [defaultRow]);
                }}
              >
                Delete
              </button>
            </div>

            <p className={styles["selected-values"]}>
              <strong>Selected Values:</strong><br />
              Country: {getName(countries, row.country)} | State: {getName(row.states, row.state)} | City: {row.city}
            </p>
          </div>
        ))}

        {/* Add Button */}
        <button className={styles["add-btn"]} onClick={() => setRows([...rows, defaultRow])}>
          Add More
        </button>
      </div>
    </div>
  );
}
