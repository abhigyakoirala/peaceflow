import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  ViewStyle,
  StyleProp,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Circle, Path, G, Ellipse } from "react-native-svg";
export const C = {
  ink: "#392D35",
  muted: "#7B6974",
  pink: "#A53E65",
  rose: "#F29DB8",
  pale: "#FCEAF0",
  paper: "#FFFAFC",
  line: "#EEDFE5",
  white: "#FFFFFF",
  green: "#527563",
};
export function Icon({
  name,
  size = 23,
  color = C.ink,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  size?: number;
  color?: string;
}) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      aria-hidden={true}
      accessible={false}
    />
  );
}
export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={s.label}>{children}</Text>;
}
export function Body({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  return <Text style={[s.body, style]}>{children}</Text>;
}
export function Heading({ children }: { children: React.ReactNode }) {
  return (
    <Text accessibilityRole="header" style={s.heading}>
      {children}
    </Text>
  );
}
export function Button({
  children,
  onPress,
  secondary = false,
  disabled = false,
  icon,
}: {
  children: React.ReactNode;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={React.Children.toArray(children).join("")}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        { opacity: disabled ? 0.45 : pressed ? 0.75 : 1 },
      ]}
    >
      {icon && (
        <Icon name={icon} size={20} color={secondary ? C.pink : C.white} />
      )}
      <Text style={[s.buttonText, secondary && { color: C.pink }]}>
        {children}
      </Text>
    </Pressable>
  );
}
export function IconButton({
  name,
  label,
  onPress,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [s.iconButton, { opacity: pressed ? 0.5 : 1 }]}
    >
      <Icon name={name} />
    </Pressable>
  );
}
export function Chip({
  text,
  selected,
  onPress,
}: {
  text: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[s.chip, selected && s.chipSelected]}
    >
      <Text style={[s.chipText, selected && { color: C.white }]}>{text}</Text>
    </Pressable>
  );
}
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  maxLength = 100,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  testID?: string;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#947F8B"
        multiline={multiline}
        maxLength={maxLength}
        style={[
          s.input,
          multiline && { minHeight: 180, textAlignVertical: "top" },
        ]}
        {...rest}
      />
    </View>
  );
}
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[s.card, style]}>{children}</View>;
}
export function Art({
  motif = "orbit",
  color = C.pink,
  size = 180,
}: {
  motif?: string;
  color?: string;
  size?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" aria-hidden={true}>
      {motif === "leaf" ? (
        <G fill={color} opacity={0.22}>
          <Ellipse
            cx="77"
            cy="72"
            rx="25"
            ry="55"
            rotation="-38"
            origin="77,72"
          />
          <Ellipse
            cx="129"
            cy="117"
            rx="26"
            ry="58"
            rotation="40"
            origin="129,117"
          />
          <Path
            d="M50 165 Q120 115 142 36"
            stroke={color}
            strokeWidth="3"
            fill="none"
          />
        </G>
      ) : motif === "moon" ? (
        <G>
          <Path
            d="M133 30 A75 75 0 1 0 171 143 A78 78 0 0 1 133 30"
            fill={color}
            opacity={0.16}
          />
          <Path
            d="M146 45 v22 M135 56 h22 M170 92 v12 M164 98 h12"
            stroke={color}
            strokeWidth="2"
          />
        </G>
      ) : motif === "wave" ? (
        <G stroke={color} opacity={0.35} strokeWidth="2" fill="none">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Path
              key={i}
              d={`M10 ${65 + i * 15} Q55 ${10 + i * 15} 100 ${65 + i * 15} T190 ${65 + i * 15}`}
            />
          ))}
        </G>
      ) : motif === "sun" ? (
        <G stroke={color} strokeWidth="2" opacity={0.35}>
          <Circle cx="100" cy="100" r="43" fill={color} opacity={0.25} />
          {Array.from({ length: 12 }, (_, i) => (
            <Path key={i} d="M100 26 v20" rotation={i * 30} origin="100,100" />
          ))}
        </G>
      ) : (
        <G fill="none" stroke={color} strokeWidth="1.5" opacity={0.32}>
          <Ellipse
            cx="100"
            cy="100"
            rx="83"
            ry="35"
            rotation="-35"
            origin="100,100"
          />
          <Ellipse
            cx="100"
            cy="100"
            rx="83"
            ry="35"
            rotation="35"
            origin="100,100"
          />
          <Circle cx="100" cy="100" r="57" />
          <Circle cx="145" cy="61" r="8" fill={color} />
        </G>
      )}
    </Svg>
  );
}
export const s = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: C.pink,
    textTransform: "uppercase",
  },
  heading: {
    fontSize: 29,
    fontWeight: "600",
    letterSpacing: -1,
    color: C.ink,
    lineHeight: 37,
  },
  body: { fontSize: 15, lineHeight: 23, color: C.muted },
  button: {
    backgroundColor: C.pink,
    borderRadius: 18,
    minHeight: 52,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 9,
  },
  secondary: { backgroundColor: C.pale },
  buttonText: { fontSize: 15, fontWeight: "600", color: C.white },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
  },
  chip: {
    paddingHorizontal: 17,
    paddingVertical: 13,
    borderRadius: 24,
    backgroundColor: "#F5EDF1",
    minHeight: 44,
    justifyContent: "center",
  },
  chipSelected: { backgroundColor: C.pink },
  chipText: { fontSize: 13, fontWeight: "600", color: C.muted },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: C.ink },
  input: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 14,
    padding: 15,
    fontSize: 16,
    color: C.ink,
    minHeight: 52,
  },
  card: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 24,
    padding: 22,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  small: { fontSize: 12, lineHeight: 19, color: C.muted },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: C.ink,
    letterSpacing: -0.4,
  },
  link: { color: C.pink, fontSize: 14, fontWeight: "600" },
});
