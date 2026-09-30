import React from "react";
import { today } from "./core";
export default function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        fontFamily: "system-ui",
        fontSize: 14,
        fontWeight: 600,
        color: "#392D35",
      }}
    >
      {label}
      <input
        type="date"
        aria-label={label}
        value={value}
        max={today()}
        onChange={(e) => onChange(e.target.value)}
        style={{
          boxSizing: "border-box",
          width: "100%",
          background: "white",
          border: "1px solid #EEDFE5",
          borderRadius: 14,
          padding: 15,
          minHeight: 52,
          fontFamily: "inherit",
          fontSize: 16,
          color: "#392D35",
        }}
      />
    </label>
  );
}
