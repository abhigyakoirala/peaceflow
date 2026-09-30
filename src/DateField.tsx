import React, { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate, today } from "./core";
import { C, Icon, s } from "./ui";
export default function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      <Text style={s.fieldLabel}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${formatDate(value)}`}
        onPress={() => setOpen(!open)}
        style={[s.input, s.row]}
      >
        <Text style={{ fontSize: 16, color: C.ink }}>{formatDate(value)}</Text>
        <Icon name="calendar-outline" color={C.pink} />
      </Pressable>
      {open && (
        <DateTimePicker
          value={new Date(`${value}T12:00:00`)}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          maximumDate={new Date(`${today()}T23:59:59`)}
          onChange={(event, date) => {
            if (Platform.OS !== "ios") setOpen(false);
            if (event.type === "set" && date)
              onChange(
                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
              );
          }}
        />
      )}
    </View>
  );
}
