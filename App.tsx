import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Linking,
  ActivityIndicator,
  BackHandler,
  AppState,
  useWindowDimensions,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Svg, { Circle } from "react-native-svg";
import {
  C,
  Icon,
  IconButton,
  Label,
  Heading,
  Body,
  Button,
  Chip,
  Field,
  Card,
  Art,
  s,
} from "./src/ui";
import {
  Data,
  Period,
  Entry,
  Flow,
  emptyData,
  today,
  addDays,
  daysBetween,
  formatDate,
  prediction,
  validatePeriod,
} from "./src/core";
import { loadData, saveData } from "./src/storage";
import { posts, categories, women } from "./src/content";
import DateField from "./src/DateField";

type Tab = "Home" | "Cycle" | "Learn" | "Journal" | "World";
type Sheet =
  "period" | "entry" | "menu" | "privacy" | "about" | "delete-all" | null;
const nav = [
  ["Home", "home-outline"],
  ["Cycle", "calendar-outline"],
  ["Learn", "play-circle-outline"],
  ["Journal", "book-outline"],
  ["World", "globe-outline"],
] as const;
const symptoms = [
  "Cramps",
  "Bloating",
  "Headache",
  "Tender breasts",
  "Tiredness",
  "Mood changes",
];
const moods = ["Calm", "Happy", "Low", "Anxious", "Tired", "Hopeful"];
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
const newPeriod = (): Period => ({
  id: id(),
  start: today(),
  end: today(),
  flow: "Medium",
  symptoms: [],
});
const newEntry = (): Entry => ({
  id: id(),
  date: today(),
  title: "",
  body: "",
  mood: "Calm",
});

export default function App() {
  return (
    <SafeAreaProvider>
      <Peaceflow />
    </SafeAreaProvider>
  );
}
function Peaceflow() {
  const [data, setData] = useState<Data | null>(null),
    [loadingError, setLoadingError] = useState("");
  const [tab, setTab] = useState<Tab>("Home"),
    [sheet, setSheet] = useState<Sheet>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  const [period, setPeriod] = useState<Period>(newPeriod),
    [entry, setEntry] = useState<Entry>(newEntry),
    [confirmDelete, setConfirmDelete] = useState(false),
    [discard, setDiscard] = useState(false);
  const original = useRef("");
  const [selectedWoman, setSelectedWoman] = useState<
    (typeof women)[number] | null
  >(null);
  const [category, setCategory] = useState("All"),
    [savedOnly, setSavedOnly] = useState(false),
    [feedCount, setFeedCount] = useState(50),
    [feedHeight, setFeedHeight] = useState(580);
  const [month, setMonth] = useState(() => today().slice(0, 7)),
    [selectedDay, setSelectedDay] = useState(today());
  const [now, setNow] = useState(today());
  const [hidden, setHidden] = useState(false);
  const { fontScale } = useWindowDimensions();
  const feed = useRef<FlatList>(null);
  const saving = useRef(false);
  const refresh = () => {
    setLoadingError("");
    loadData()
      .then(setData)
      .catch((e) => setLoadingError(e.message));
  };
  useEffect(() => {
    refresh();
    const sub = AppState.addEventListener("change", (state) => {
      setHidden(state !== "active");
      if (state === "active") setNow(today());
    });
    const timer = setInterval(() => setNow(today()), 60000);
    return () => {
      sub.remove();
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timeout);
  }, [notice]);
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (selectedWoman) {
        setSelectedWoman(null);
        return true;
      }
      if (sheet) {
        closeSheet();
        return true;
      }
      if (tab !== "Home") {
        setTab("Home");
        return true;
      }
      return false;
    });
    return () => sub.remove();
  });
  async function commit(next: Data, message = "Saved on this device") {
    if (saving.current) return false;
    saving.current = true;
    setBusy(true);
    setError("");
    try {
      await saveData(next);
      setData(next);
      setNotice(message);
      return true;
    } catch {
      setError(
        "Could not save on this device. Your changes are still here. Check available storage and try again.",
      );
      return false;
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }
  function openSheet(value: Sheet) {
    setError("");
    setDiscard(false);
    setConfirmDelete(false);
    setSheet(value);
  }
  function editPeriod(value = newPeriod()) {
    setPeriod(value);
    original.current = JSON.stringify(value);
    openSheet("period");
  }
  function editEntry(value = newEntry()) {
    setEntry(value);
    original.current = JSON.stringify(value);
    openSheet("entry");
  }
  function closeSheet() {
    if (busy) return;
    if (
      (sheet === "entry" && JSON.stringify(entry) !== original.current) ||
      (sheet === "period" && JSON.stringify(period) !== original.current)
    ) {
      setDiscard(true);
      return;
    }
    setSheet(null);
    setError("");
  }
  async function external(url: string) {
    try {
      await Linking.openURL(url);
    } catch {
      setNotice("Could not open the source. Check your connection.");
    }
  }
  async function bookmark(key: string) {
    if (!data) return;
    await commit(
      {
        ...data,
        saved: data.saved.includes(key)
          ? data.saved.filter((x) => x !== key)
          : [...data.saved, key],
      },
      data.saved.includes(key) ? "Removed from saved" : "Saved for later",
    );
  }
  if (hidden)
    return (
      <View style={a.loading}>
        <Text style={a.wordmark}>peaceflow</Text>
        <Icon name="lock-closed-outline" color={C.pink} />
      </View>
    );
  if (!data)
    return (
      <SafeAreaView style={a.loading}>
        <Text style={a.wordmark}>peaceflow</Text>
        {loadingError ? (
          <>
            <Heading>Your records are protected.</Heading>
            <Body>{loadingError}</Body>
            <Button onPress={refresh}>Try again</Button>
          </>
        ) : (
          <ActivityIndicator color={C.pink} />
        )}
      </SafeAreaView>
    );
  const estimate = prediction(data.periods, now);
  const filtered = posts.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (!savedOnly || data.saved.includes(p.id)),
  );
  const feedItems = filtered.length
    ? Array.from(
        { length: savedOnly ? filtered.length : feedCount },
        (_, i) => ({ post: filtered[i % filtered.length], index: i }),
      )
    : [];
  const cardHeight = Math.max(feedHeight, 520 * fontScale);
  const latest = [...data.periods].sort((x, y) =>
    y.start.localeCompare(x.start),
  );
  const daysUntil = estimate.next ? daysBetween(now, estimate.next) : null;
  const latestEntry = [...data.entries].sort((x, y) =>
    y.date.localeCompare(x.date),
  )[0];
  const monthStart = `${month}-01`;
  const calendarOffset = new Date(`${monthStart}T12:00:00`).getDay();
  const monthLength = new Date(
    Number(month.slice(0, 4)),
    Number(month.slice(5, 7)),
    0,
  ).getDate();
  function moveMonth(amount: number) {
    const d = new Date(`${monthStart}T12:00:00`);
    d.setMonth(d.getMonth() + amount);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  const recordForDay = data.periods.find(
    (p) => selectedDay >= p.start && selectedDay <= p.end,
  );
  const empty = (title: string, body: string) => (
    <Card>
      <Heading>{title}</Heading>
      <Body>{body}</Body>
    </Card>
  );
  const summary = (
    <View style={a.cycleHero}>
      <View style={s.row}>
        <Label>YOUR CYCLE, YOUR PACE</Label>
        <Icon name="sparkles-outline" color={C.pink} size={20} />
      </View>
      <View style={a.ringArea}>
        <Svg
          width={224}
          height={224}
          viewBox="0 0 224 224"
          style={{ position: "absolute" }}
        >
          <Circle
            cx="112"
            cy="112"
            r="96"
            fill="none"
            stroke="#F0CCDB"
            strokeWidth="9"
          />
          <Circle
            cx="112"
            cy="112"
            r="96"
            fill="none"
            stroke={C.pink}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${estimate.cycleDay ? Math.min(estimate.cycleDay / (estimate.typical || 28), 1) * 603 : 85} 603`}
            rotation="-90"
            origin="112,112"
          />
        </Svg>
        <Icon name="water-outline" color={C.pink} size={25} />
        <Text style={a.ringSmall}>
          {estimate.cycleDay ? "CYCLE DAY" : "A LITTLE SELF-CARE"}
        </Text>
        <Text style={a.ringNumber}>{estimate.cycleDay || "Hello"}</Text>
        <Text style={a.ringCaption}>
          {estimate.cycleDay ? "Getting to know you" : "starts with you"}
        </Text>
      </View>
      <Text style={a.heroTitle}>
        {estimate.next
          ? daysUntil! < 0
            ? "Your cycle, at its own pace"
            : daysUntil === 0
              ? "Estimated to start today"
              : `Next period in about ${daysUntil} days`
          : "Let’s get to know your cycle."}
      </Text>
      <Text style={a.heroBody}>
        {estimate.next
          ? `Estimated start · ${formatDate(estimate.next)}`
          : "A few dates can help you understand your rhythm."}
      </Text>
      <Button onPress={() => editPeriod()} icon="add">
        Log period
      </Button>
      <View style={[s.row, { justifyContent: "center", gap: 5 }]}>
        <Icon name="lock-closed-outline" size={13} color={C.muted} />
        <Text style={s.small}>Private. Only on this device.</Text>
      </View>
    </View>
  );
  return (
    <View style={a.outer}>
      <StatusBar style="dark" />
      <SafeAreaView style={a.app} edges={["top", "bottom"]}>
        <View style={a.header}>
          <IconButton
            name="menu-outline"
            label="Open menu"
            onPress={() => openSheet("menu")}
          />
          <View style={{ alignItems: "center" }}>
            <Text style={a.wordmark}>
              peaceflow<Text style={{ fontSize: 15 }}> ♥</Text>
            </Text>
            <Text style={a.tagline}>your cycle. your power. your pace.</Text>
          </View>
          <View style={a.brandFlower}>
            <Icon name="flower-outline" size={25} color={C.pink} />
          </View>
        </View>
        {tab === "Learn" ? (
          <View style={{ flex: 1 }}>
            <View style={a.feedHeader}>
              <View style={s.row}>
                <View>
                  <Label>A LITTLE WISDOM, EVERY DAY</Label>
                  <Heading>For your wellbeing.</Heading>
                </View>
                <IconButton
                  name={savedOnly ? "bookmark" : "bookmark-outline"}
                  label={savedOnly ? "Show all posts" : "Show saved posts"}
                  onPress={() => {
                    setSavedOnly(!savedOnly);
                    setFeedCount(50);
                    feed.current?.scrollToOffset({
                      offset: 0,
                      animated: false,
                    });
                  }}
                />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingVertical: 14 }}
              >
                {categories.map((c) => (
                  <Chip
                    key={c}
                    text={c}
                    selected={category === c}
                    onPress={() => {
                      setCategory(c);
                      setFeedCount(50);
                      feed.current?.scrollToOffset({
                        offset: 0,
                        animated: false,
                      });
                    }}
                  />
                ))}
              </ScrollView>
            </View>
            <View
              style={{ flex: 1 }}
              onLayout={(e) => setFeedHeight(e.nativeEvent.layout.height)}
            >
              <FlatList
                testID="learning-feed"
                ref={feed}
                data={feedItems}
                keyExtractor={(item) => `${item.post.id}-${item.index}`}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                initialNumToRender={2}
                maxToRenderPerBatch={3}
                windowSize={5}
                onEndReached={() => {
                  if (!savedOnly) setFeedCount((n) => n + 50);
                }}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                  <View style={{ padding: 24 }}>
                    {empty(
                      "A little space for your favourites.",
                      "Save a post using its bookmark. Try another topic or return to all posts.",
                    )}
                  </View>
                }
                renderItem={({ item: { post: p, index } }) => (
                  <View
                    style={{
                      minHeight: cardHeight,
                      paddingHorizontal: 20,
                      paddingBottom: 14,
                    }}
                  >
                    <View style={[a.reel, { backgroundColor: p.background }]}>
                      <View style={s.row}>
                        <Text style={[a.reelCategory, { color: p.accent }]}>
                          {p.category.toUpperCase()}
                        </Text>
                        <Text style={[s.small, { color: p.accent }]}>
                          {(index % filtered.length) + 1} / {filtered.length}
                          {index >= filtered.length ? " · Revisit" : ""}
                        </Text>
                      </View>
                      <View style={a.reelArt}>
                        <Art motif={p.motif} color={p.accent} size={165} />
                      </View>
                      <View style={{ gap: 15 }}>
                        <Text
                          accessibilityRole="header"
                          style={[a.reelTitle, { color: p.accent }]}
                        >
                          {p.title}
                        </Text>
                        <Text style={[a.reelBody, { color: p.accent }]}>
                          {p.body}
                        </Text>
                      </View>
                      <View style={{ flex: 1, minHeight: 20 }} />
                      <View style={[s.row, { alignItems: "flex-end" }]}>
                        <View style={{ flex: 1 }}>
                          <Text style={[s.small, { color: p.accent }]}>
                            peaceflow / learn
                          </Text>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={
                              p.url
                                ? `Read source: ${p.source}`
                                : "Open journal prompt"
                            }
                            onPress={() =>
                              p.url
                                ? external(p.url)
                                : editEntry({
                                    ...newEntry(),
                                    body: p.body.replace(
                                      "Journal prompt: ",
                                      "",
                                    ),
                                  })
                            }
                            style={{ paddingVertical: 12 }}
                          >
                            <Text style={[a.source, { color: p.accent }]}>
                              {p.source} ↗
                            </Text>
                          </Pressable>
                        </View>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={
                            data.saved.includes(p.id)
                              ? "Unsave post"
                              : "Save post"
                          }
                          onPress={() => bookmark(p.id)}
                          style={a.saveButton}
                        >
                          <Icon
                            name={
                              data.saved.includes(p.id)
                                ? "bookmark"
                                : "bookmark-outline"
                            }
                            color={p.accent}
                          />
                        </Pressable>
                      </View>
                      <Text
                        style={[s.small, { color: p.accent, opacity: 0.85 }]}
                      >
                        Swipe up for more · General education, not medical
                        advice
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        ) : (
          <ScrollView
            key={tab}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={a.content}
            keyboardShouldPersistTaps="handled"
          >
            {tab === "Home" && (
              <>
                <View style={{ gap: 7 }}>
                  <Label>
                    {new Date(`${now}T12:00:00`).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </Label>
                  <Heading>A little care, just for you.</Heading>
                  <Body>Your space to understand, reflect and grow.</Body>
                </View>
                {Platform.OS === "web" && (
                  <Text style={a.preview}>
                    Browser preview · Use sample information. Browser storage is
                    not encrypted.
                  </Text>
                )}
                {summary}
                <View style={s.row}>
                  <Text style={s.sectionTitle}>How are you feeling?</Text>
                  <Icon name="heart-outline" color={C.pink} size={21} />
                </View>
                <Card>
                  <View style={s.row}>
                    <View style={{ flex: 1, gap: 5 }}>
                      <Text style={s.sectionTitle}>
                        {latestEntry
                          ? "Make a little room for yourself."
                          : "A moment to check in."}
                      </Text>
                      <Body>
                        {latestEntry
                          ? `Last reflection · ${formatDate(latestEntry.date)}`
                          : "Big feelings, little thoughts. They all belong here."}
                      </Body>
                    </View>
                    <Art motif="leaf" size={65} />
                  </View>
                  <Button
                    secondary
                    onPress={() => editEntry()}
                    icon="create-outline"
                  >
                    Write in my journal
                  </Button>
                </Card>
                <View style={s.row}>
                  <Text style={s.sectionTitle}>A little learning</Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setTab("Learn")}
                    style={{ padding: 10 }}
                  >
                    <Text style={s.link}>Explore all →</Text>
                  </Pressable>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Explore health education"
                  onPress={() => setTab("Learn")}
                  style={[a.teaser, { backgroundColor: posts[0].background }]}
                >
                  <View style={{ flex: 1, gap: 10 }}>
                    <Label>KNOW YOUR BODY</Label>
                    <Text style={a.teaserTitle}>{posts[0].title}</Text>
                    <Text style={s.small}>
                      50 little lessons for your wellbeing ↗
                    </Text>
                  </View>
                  <Art size={100} />
                </Pressable>
                <View style={s.row}>
                  <Icon
                    name="shield-checkmark-outline"
                    size={17}
                    color={C.green}
                  />
                  <Body style={{ flex: 1, fontSize: 12 }}>
                    No account. No public profile. Your space.
                  </Body>
                </View>
              </>
            )}
            {tab === "Cycle" && (
              <>
                <View style={{ gap: 7 }}>
                  <Label>KNOW YOUR RHYTHM</Label>
                  <Heading>My cycle</Heading>
                  <Body>Every body has its own pattern.</Body>
                </View>
                <Card>
                  <View style={s.row}>
                    <IconButton
                      name="chevron-back"
                      label="Previous month"
                      onPress={() => moveMonth(-1)}
                    />
                    <Text style={s.sectionTitle}>
                      {new Date(`${monthStart}T12:00:00`).toLocaleDateString(
                        undefined,
                        { month: "long", year: "numeric" },
                      )}
                    </Text>
                    <IconButton
                      name="chevron-forward"
                      label="Next month"
                      onPress={() => moveMonth(1)}
                    />
                  </View>
                  <View style={a.calendar}>
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <Text key={`week-${i}`} style={a.weekday}>
                        {d}
                      </Text>
                    ))}
                    {Array.from({ length: calendarOffset }, (_, i) => (
                      <View key={`blank-${i}`} style={a.dayCell} />
                    ))}
                    {Array.from({ length: monthLength }, (_, i) => {
                      const date = `${month}-${String(i + 1).padStart(2, "0")}`,
                        logged = data.periods.some(
                          (p) => date >= p.start && date <= p.end,
                        ),
                        predicted =
                          estimate.range &&
                          date >= estimate.range[0] &&
                          date <= estimate.range[1];
                      return (
                        <Pressable
                          key={date}
                          accessibilityRole="button"
                          accessibilityLabel={`${formatDate(date)}${logged ? ", recorded period" : predicted ? ", estimated start window" : ""}`}
                          accessibilityState={{
                            selected: date === selectedDay,
                          }}
                          onPress={() => setSelectedDay(date)}
                          style={a.dayCell}
                        >
                          <View
                            style={[
                              a.day,
                              logged && { backgroundColor: C.pink },
                              predicted &&
                                !logged && {
                                  borderColor: C.pink,
                                  borderStyle: "dashed",
                                  borderWidth: 1,
                                },
                              date === selectedDay && {
                                borderWidth: 2,
                                borderColor: C.ink,
                              },
                            ]}
                          >
                            <Text
                              style={{
                                color: logged ? "white" : C.ink,
                                fontWeight: date === now ? "800" : "400",
                              }}
                            >
                              {i + 1}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                  <Text style={s.small}>
                    ● Filled: recorded period ◌ Outlined: estimated start
                  </Text>
                  <View style={a.divider} />
                  <Text style={s.fieldLabel}>{formatDate(selectedDay)}</Text>
                  <Body>
                    {recordForDay
                      ? `${recordForDay.flow} flow${recordForDay.symptoms.length ? ` · ${recordForDay.symptoms.join(", ")}` : ""}`
                      : "No period recorded for this date."}
                  </Body>
                  {selectedDay <= now && (
                    <Button
                      secondary
                      onPress={() =>
                        editPeriod(
                          recordForDay || {
                            ...newPeriod(),
                            start: selectedDay,
                            end: selectedDay,
                          },
                        )
                      }
                    >
                      {recordForDay ? "Edit this period" : "Log this date"}
                    </Button>
                  )}
                </Card>
                {summary}
                <Card>
                  <View style={s.row}>
                    <Text style={s.sectionTitle}>Your personal estimate</Text>
                    <Icon name="sparkles-outline" color={C.pink} />
                  </View>
                  {estimate.next && (
                    <Text style={a.estimateDate}>
                      {formatDate(estimate.next)}
                    </Text>
                  )}
                  <Body>{estimate.reason}</Body>
                  {estimate.range && (
                    <Body style={{ fontSize: 13 }}>
                      History-based window: {formatDate(estimate.range[0])} –{" "}
                      {formatDate(estimate.range[1])}
                    </Body>
                  )}
                  <Text style={s.small}>
                    A calendar estimate, not a diagnosis or a way to prevent
                    pregnancy. Irregular cycles and life changes can make
                    estimates less reliable.
                  </Text>
                </Card>
                <Text style={s.sectionTitle}>Period history</Text>
                {latest.length
                  ? latest.map((p) => (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Edit period ${formatDate(p.start)}`}
                        key={p.id}
                        onPress={() => editPeriod(p)}
                      >
                        <Card>
                          <View style={s.row}>
                            <View style={{ flex: 1, gap: 5 }}>
                              <Text style={s.fieldLabel}>
                                {formatDate(p.start)} – {formatDate(p.end)}
                              </Text>
                              <Body>
                                {daysBetween(p.start, p.end) + 1} days ·{" "}
                                {p.flow} flow
                              </Body>
                            </View>
                            <Icon name="create-outline" color={C.pink} />
                          </View>
                        </Card>
                      </Pressable>
                    ))
                  : empty(
                      "Your story starts here.",
                      "Log your first period when you are ready. You can also add dates from previous months.",
                    )}
              </>
            )}
            {tab === "Journal" && (
              <>
                <View style={{ gap: 7 }}>
                  <Label>JUST BETWEEN YOU & YOU</Label>
                  <Heading>My journal</Heading>
                  <Body>A soft place for whatever is on your mind.</Body>
                </View>
                <View style={a.journalHero}>
                  <Art motif="leaf" size={125} />
                  <Text style={a.journalQuote}>
                    You don’t need the perfect words.{"\n"}Just your own.
                  </Text>
                  <Button onPress={() => editEntry()} icon="add">
                    Write a reflection
                  </Button>
                </View>
                <View style={s.row}>
                  <Text style={s.sectionTitle}>Your reflections</Text>
                  <Text style={s.small}>
                    {data.entries.length} entries · private
                  </Text>
                </View>
                {data.entries.length
                  ? [...data.entries]
                      .sort(
                        (x, y) =>
                          y.date.localeCompare(x.date) ||
                          y.id.localeCompare(x.id),
                      )
                      .map((e) => (
                        <Pressable
                          key={e.id}
                          accessibilityRole="button"
                          accessibilityLabel={`Open journal: ${e.title || "A little reflection"}`}
                          onPress={() => editEntry(e)}
                        >
                          <Card>
                            <View style={s.row}>
                              <Label>{e.mood}</Label>
                              <Text style={s.small}>{formatDate(e.date)}</Text>
                            </View>
                            <Text style={s.sectionTitle}>
                              {e.title || "A little reflection"}
                            </Text>
                            <Body>
                              {e.body.length > 140
                                ? e.body.slice(0, 140) + "…"
                                : e.body}
                            </Body>
                            <Text style={s.link}>Open reflection →</Text>
                          </Card>
                        </Pressable>
                      ))
                  : empty(
                      "A fresh page awaits.",
                      "Write a sentence, a feeling or a whole story. Entries are saved only when you tap Save.",
                    )}
              </>
            )}
            {tab === "World" && (
              <>
                <View style={{ gap: 7 }}>
                  <Label>DIFFERENT PLACES. SHARED POSSIBILITY.</Label>
                  <Heading>Women who inspire.</Heading>
                  <Body>
                    Meet five women whose ideas and courage changed the world
                    around them.
                  </Body>
                </View>
                {women.map((w, i) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Read about ${w.name}`}
                    key={w.id}
                    onPress={() => setSelectedWoman(w)}
                    style={a.womanCard}
                  >
                    <View style={[a.womanArt, { backgroundColor: w.color }]}>
                      <View
                        style={{ position: "absolute", right: -15, top: -25 }}
                      >
                        <Art
                          motif={["orbit", "leaf", "moon", "sun", "wave"][i]}
                          size={200}
                          color={w.accent}
                        />
                      </View>
                      <Text style={[a.womanInitials, { color: w.accent }]}>
                        {w.initials}
                      </Text>
                      <View style={[s.row, { alignSelf: "stretch" }]}>
                        <Text style={[a.reelCategory, { color: w.accent }]}>
                          {w.country}
                        </Text>
                        <Text style={[s.small, { color: w.accent }]}>
                          0{i + 1} / 05
                        </Text>
                      </View>
                    </View>
                    <View style={{ padding: 23, gap: 9 }}>
                      <Label>{w.field}</Label>
                      <Text style={s.heading}>{w.name}</Text>
                      <Body>{w.headline}</Body>
                      <View style={s.row}>
                        <Text style={s.small}>
                          {w.source} · Curated profile
                        </Text>
                        <Icon name="arrow-forward" color={C.pink} />
                      </View>
                    </View>
                  </Pressable>
                ))}
              </>
            )}
            <View style={{ height: 8 }} />
          </ScrollView>
        )}
        {!!error && !sheet && (
          <Text accessibilityRole="alert" style={a.error}>
            {error}
          </Text>
        )}
        {!!notice && (
          <View accessibilityLiveRegion="polite" style={a.toast}>
            <Icon name="checkmark-circle-outline" size={18} color="white" />
            <Text style={a.toastText}>{notice}</Text>
          </View>
        )}
        <View style={a.navWrap}>
          <View style={a.nav}>
            {nav.map(([name, icon]) => (
              <Pressable
                key={name}
                accessibilityRole="tab"
                accessibilityState={{ selected: tab === name }}
                accessibilityLabel={name}
                onPress={() => {
                  setTab(name);
                  setError("");
                }}
                style={a.navItem}
              >
                <View
                  style={[
                    a.navIcon,
                    tab === name && { backgroundColor: C.pale },
                  ]}
                >
                  <Icon
                    name={icon}
                    color={tab === name ? C.pink : C.muted}
                    size={23}
                  />
                </View>
                <Text
                  style={[
                    a.navLabel,
                    tab === name && { color: C.pink, fontWeight: "700" },
                  ]}
                >
                  {name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <Modal
          visible={!data.welcomed}
          animationType="fade"
          transparent
          onRequestClose={() => commit({ ...data, welcomed: true }, "")}
        >
          <View style={a.modalBackdrop}>
            <View style={a.welcome}>
              <ScrollView contentContainerStyle={{ gap: 18 }}>
                <Art motif="leaf" size={95} />
                <Text style={[a.wordmark, { fontSize: 45 }]}>peaceflow</Text>
                <Text style={a.tagline}>
                  your cycle. your power. your pace.
                </Text>
                <Heading>A little space for you.</Heading>
                <Body>
                  Understand your cycle, find a little wisdom and keep your
                  thoughts close.
                </Body>
                <Card style={{ backgroundColor: C.pale, borderWidth: 0 }}>
                  <View style={s.row}>
                    <Icon name="lock-closed-outline" color={C.pink} />
                    <Text style={s.fieldLabel}>Your device. Your records.</Text>
                  </View>
                  <Body>
                    No account or cloud backup. Losing this device or deleting
                    the app can mean losing your records.
                  </Body>
                  {Platform.OS === "web" && (
                    <Text style={s.small}>
                      This browser preview uses unencrypted browser storage.
                      Please use sample data only.
                    </Text>
                  )}
                </Card>
                <Button
                  disabled={busy}
                  onPress={() => commit({ ...data, welcomed: true }, "")}
                >
                  Let’s begin
                </Button>
                {!!error && <Text style={a.error}>{error}</Text>}
              </ScrollView>
            </View>
          </View>
        </Modal>
        <Modal
          visible={sheet !== null}
          transparent
          animationType="slide"
          onRequestClose={closeSheet}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={a.modalBackdrop}
          >
            <View style={a.sheet}>
              <View style={a.sheetHandle} />
              <View style={s.row}>
                <Text style={s.sectionTitle}>
                  {sheet === "period"
                    ? "Log your period"
                    : sheet === "entry"
                      ? "Your private reflection"
                      : sheet === "menu"
                        ? "Your Peaceflow"
                        : sheet === "privacy"
                          ? "Privacy & your data"
                          : sheet === "delete-all"
                            ? "Delete all personal data"
                            : "About Peaceflow"}
                </Text>
                <IconButton
                  name="close"
                  label="Close dialog"
                  onPress={closeSheet}
                />
              </View>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ gap: 20, paddingBottom: 25 }}
              >
                {sheet === "period" && (
                  <>
                    <Body>
                      Add a past period, or record today and update its end date
                      as it continues.
                    </Body>
                    <DateField
                      label="Start date"
                      value={period.start}
                      onChange={(v) => setPeriod({ ...period, start: v })}
                    />
                    <DateField
                      label="End date"
                      value={period.end}
                      onChange={(v) => setPeriod({ ...period, end: v })}
                    />
                    <Text style={s.fieldLabel}>Flow</Text>
                    <View style={s.wrap}>
                      {(["Light", "Medium", "Heavy"] as Flow[]).map((f) => (
                        <Chip
                          key={f}
                          text={f}
                          selected={period.flow === f}
                          onPress={() => setPeriod({ ...period, flow: f })}
                        />
                      ))}
                    </View>
                    <Text style={s.fieldLabel}>Symptoms · optional</Text>
                    <View style={s.wrap}>
                      {symptoms.map((sym) => (
                        <Chip
                          key={sym}
                          text={sym}
                          selected={period.symptoms.includes(sym)}
                          onPress={() =>
                            setPeriod({
                              ...period,
                              symptoms: period.symptoms.includes(sym)
                                ? period.symptoms.filter((x) => x !== sym)
                                : [...period.symptoms, sym],
                            })
                          }
                        />
                      ))}
                    </View>
                    <Button
                      disabled={busy}
                      onPress={async () => {
                        const err = validatePeriod(period, data.periods, now);
                        if (err) {
                          setError(err);
                          return;
                        }
                        if (
                          await commit({
                            ...data,
                            periods: [
                              ...data.periods.filter((p) => p.id !== period.id),
                              period,
                            ],
                          })
                        ) {
                          setSheet(null);
                          setMonth(period.start.slice(0, 7));
                          setSelectedDay(period.start);
                        }
                      }}
                    >
                      {busy ? "Saving…" : "Save period"}
                    </Button>
                    {data.periods.some((p) => p.id === period.id) && (
                      <Button
                        secondary
                        disabled={busy}
                        onPress={async () => {
                          if (!confirmDelete) {
                            setConfirmDelete(true);
                            return;
                          }
                          if (
                            await commit(
                              {
                                ...data,
                                periods: data.periods.filter(
                                  (p) => p.id !== period.id,
                                ),
                              },
                              "Period deleted",
                            )
                          )
                            setSheet(null);
                        }}
                      >
                        {confirmDelete
                          ? "Confirm delete period"
                          : "Delete period"}
                      </Button>
                    )}
                  </>
                )}
                {sheet === "entry" && (
                  <>
                    <Text style={s.small}>
                      {formatDate(entry.date)} · Only on this device
                    </Text>
                    <Field
                      label="Title (optional)"
                      value={entry.title}
                      onChangeText={(v) => setEntry({ ...entry, title: v })}
                      placeholder="Give today a few words"
                    />
                    <Text style={s.fieldLabel}>How are you feeling?</Text>
                    <View style={s.wrap}>
                      {moods.map((m) => (
                        <Chip
                          key={m}
                          text={m}
                          selected={entry.mood === m}
                          onPress={() => setEntry({ ...entry, mood: m })}
                        />
                      ))}
                    </View>
                    <Field
                      label="Your thoughts"
                      value={entry.body}
                      onChangeText={(v) => setEntry({ ...entry, body: v })}
                      placeholder="Today, I’m feeling…"
                      multiline
                      maxLength={10000}
                    />
                    <Text style={s.small}>
                      {entry.body.length.toLocaleString()} / 10,000 characters ·
                      Tap Save to keep your writing.
                    </Text>
                    <Button
                      disabled={busy}
                      onPress={async () => {
                        if (!entry.body.trim()) {
                          setError("Write a little something before saving.");
                          return;
                        }
                        if (
                          await commit({
                            ...data,
                            entries: [
                              ...data.entries.filter((e) => e.id !== entry.id),
                              {
                                ...entry,
                                title: entry.title.trim(),
                                body: entry.body.trim(),
                              },
                            ],
                          })
                        )
                          setSheet(null);
                      }}
                    >
                      {busy ? "Saving…" : "Save reflection"}
                    </Button>
                    {data.entries.some((e) => e.id === entry.id) && (
                      <Button
                        secondary
                        disabled={busy}
                        onPress={async () => {
                          if (!confirmDelete) {
                            setConfirmDelete(true);
                            return;
                          }
                          if (
                            await commit(
                              {
                                ...data,
                                entries: data.entries.filter(
                                  (e) => e.id !== entry.id,
                                ),
                              },
                              "Reflection deleted",
                            )
                          )
                            setSheet(null);
                        }}
                      >
                        {confirmDelete
                          ? "Confirm delete reflection"
                          : "Delete reflection"}
                      </Button>
                    )}
                  </>
                )}
                {sheet === "menu" && (
                  <>
                    <Body>Your cycle. Your power. Your pace.</Body>
                    {[
                      ["bookmark-outline", "Saved learning", "saved"],
                      [
                        "shield-checkmark-outline",
                        "Privacy & your data",
                        "privacy",
                      ],
                      ["information-circle-outline", "About & help", "about"],
                    ].map(([icon, title, target]) => (
                      <Pressable
                        key={target}
                        accessibilityRole="button"
                        accessibilityLabel={title}
                        onPress={() => {
                          if (target === "saved") {
                            setTab("Learn");
                            setSavedOnly(true);
                            setCategory("All");
                            setSheet(null);
                          } else openSheet(target as Sheet);
                        }}
                        style={a.menuRow}
                      >
                        <Icon name={icon as any} color={C.pink} />
                        <Text style={[s.fieldLabel, { flex: 1 }]}>{title}</Text>
                        <Icon name="chevron-forward" size={18} />
                      </Pressable>
                    ))}
                    <Card style={{ backgroundColor: C.pale, borderWidth: 0 }}>
                      <Label>YOUR PRIVATE SPACE</Label>
                      <Body>
                        No account. No ads. No health records sent to a server.
                      </Body>
                    </Card>
                  </>
                )}
                {sheet === "privacy" && (
                  <>
                    <Heading>Personal means personal.</Heading>
                    <Body>
                      {Platform.OS === "web"
                        ? "This browser preview stores records in this browser’s local storage, which is not encrypted. Use sample information only. Clearing site data removes these records."
                        : "Your records are stored in an encrypted database on this device. The app has no account or cloud sync. Device backup and transfer exclusions are configured for personal records."}
                    </Body>
                    <Body>
                      There is no recovery account. Losing your device,
                      uninstalling the app or clearing its data can permanently
                      remove records.
                    </Body>
                    <Body>
                      Opening a source link takes you to an external website
                      with its own privacy policy. Your journal and cycle
                      records are not included in that link.
                    </Body>
                    <Text style={s.sectionTitle}>Your records</Text>
                    <Body>
                      {data.periods.length} periods · {data.entries.length}{" "}
                      reflections · {data.saved.length} saved posts
                    </Body>
                    <Button secondary onPress={() => openSheet("delete-all")}>
                      Delete all personal data
                    </Button>
                  </>
                )}
                {sheet === "delete-all" && (
                  <>
                    <Heading>A fresh start?</Heading>
                    <Body>
                      This permanently deletes your recorded periods, journal
                      entries and bookmarks from this app. There is no undo or
                      cloud copy.
                    </Body>
                    <Button
                      disabled={busy}
                      onPress={async () => {
                        if (
                          await commit(
                            { ...emptyData(), welcomed: true },
                            "All personal data deleted",
                          )
                        ) {
                          setSheet(null);
                          setTab("Home");
                          setPeriod(newPeriod());
                          setEntry(newEntry());
                          setSelectedDay(now);
                          setMonth(now.slice(0, 7));
                        }
                      }}
                    >
                      Delete all my data
                    </Button>
                    <Button secondary onPress={() => openSheet("privacy")}>
                      Keep my records
                    </Button>
                  </>
                )}
                {sheet === "about" && (
                  <>
                    <Heading>A little care, every day.</Heading>
                    <Body>
                      Peaceflow brings your cycle, thoughts and learning into
                      one quiet space. Version 1.0.
                    </Body>
                    <Text style={s.sectionTitle}>Using the tracker</Text>
                    <Body>
                      Log at least three period start dates. The app uses the
                      median of up to six recent cycle intervals and shows the
                      range observed in your history. It does not predict
                      ovulation or provide contraception advice.
                    </Body>
                    <Text style={s.sectionTitle}>Learning with context</Text>
                    <Body>
                      Our 50 short posts link to NHS, WHO, CDC and FDA sources,
                      alongside original journal prompts. These summaries have
                      not received an independent clinical review and are
                      general education.
                    </Body>
                    <Text style={s.sectionTitle}>When you need support</Text>
                    <Body>
                      If symptoms concern you, speak with a healthcare
                      professional. For an emergency, contact your local
                      emergency service.
                    </Body>
                    <Button
                      secondary
                      onPress={() =>
                        external("https://www.nhs.uk/conditions/periods/")
                      }
                    >
                      Read NHS period guidance ↗
                    </Button>
                  </>
                )}
                {!!error && (
                  <Text accessibilityRole="alert" style={a.error}>
                    {error}
                  </Text>
                )}
                {discard && (
                  <Card style={{ backgroundColor: C.pale }}>
                    <Text style={s.sectionTitle}>Leave without saving?</Text>
                    <Body>Your latest changes will be lost.</Body>
                    <Button
                      onPress={() => {
                        setSheet(null);
                        setDiscard(false);
                        setError("");
                      }}
                    >
                      Discard changes
                    </Button>
                    <Button secondary onPress={() => setDiscard(false)}>
                      Keep writing
                    </Button>
                  </Card>
                )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        <Modal
          visible={!!selectedWoman}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedWoman(null)}
        >
          <View style={a.modalBackdrop}>
            <View style={a.sheet}>
              <View style={s.row}>
                <Label>WOMEN AROUND THE WORLD</Label>
                <IconButton
                  name="close"
                  label="Close profile"
                  onPress={() => setSelectedWoman(null)}
                />
              </View>
              {selectedWoman && (
                <ScrollView
                  contentContainerStyle={{ gap: 20, paddingBottom: 25 }}
                >
                  <View
                    style={[
                      a.profileArt,
                      { backgroundColor: selectedWoman.color },
                    ]}
                  >
                    <Art
                      motif="orbit"
                      color={selectedWoman.accent}
                      size={200}
                    />
                    <Text
                      style={[
                        a.profileInitials,
                        { color: selectedWoman.accent },
                      ]}
                    >
                      {selectedWoman.initials}
                    </Text>
                  </View>
                  <Label>
                    {selectedWoman.country} / {selectedWoman.field}
                  </Label>
                  <Heading>{selectedWoman.name}</Heading>
                  <Text style={a.teaserTitle}>{selectedWoman.headline}</Text>
                  <Body>{selectedWoman.body}</Body>
                  <Card>
                    <Text style={s.fieldLabel}>{selectedWoman.milestone}</Text>
                  </Card>
                  <Button secondary onPress={() => external(selectedWoman.url)}>
                    Read the full story at {selectedWoman.source} ↗
                  </Button>
                  <Text style={s.small}>
                    An original summary based on the linked source. Decorative
                    initials are not a portrait.
                  </Text>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
        {hidden && (
          <View style={a.privacyCover}>
            <Text style={a.wordmark}>peaceflow</Text>
            <Icon name="lock-closed-outline" color={C.pink} />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const a = StyleSheet.create({
  outer: { flex: 1, backgroundColor: "#F2E6EC", alignItems: "center" },
  app: { flex: 1, width: "100%", maxWidth: 560, backgroundColor: C.paper },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    gap: 25,
    backgroundColor: C.paper,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 8,
    paddingBottom: 17,
    borderBottomWidth: 1,
    borderColor: "#F4E8ED",
  },
  wordmark: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 33,
    color: C.pink,
    letterSpacing: -1.2,
  },
  tagline: { fontSize: 9, letterSpacing: 0.7, color: C.pink, marginTop: 0 },
  brandFlower: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.pale,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { padding: 24, gap: 22 },
  preview: {
    fontSize: 11,
    lineHeight: 17,
    color: C.muted,
    backgroundColor: "#F4EDF0",
    padding: 10,
    borderRadius: 10,
  },
  cycleHero: {
    backgroundColor: "#FCE6EE",
    borderRadius: 28,
    padding: 24,
    gap: 14,
  },
  ringArea: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 224,
    height: 224,
    gap: 4,
    marginVertical: 2,
  },
  ringSmall: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: C.pink,
    marginTop: 6,
  },
  ringNumber: {
    fontSize: 57,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    color: C.pink,
    lineHeight: 65,
  },
  ringCaption: { fontSize: 12, color: C.pink },
  heroTitle: {
    fontSize: 21,
    fontWeight: "600",
    letterSpacing: -0.5,
    textAlign: "center",
    color: C.ink,
  },
  heroBody: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    color: C.muted,
  },
  teaser: {
    borderRadius: 23,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  teaserTitle: {
    fontSize: 23,
    lineHeight: 30,
    letterSpacing: -0.5,
    fontWeight: "500",
    color: C.ink,
  },
  navWrap: {
    paddingHorizontal: 18,
    paddingTop: 9,
    paddingBottom: 10,
    backgroundColor: C.paper,
  },
  nav: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 32,
    flexDirection: "row",
    paddingHorizontal: 7,
    paddingVertical: 8,
    boxShadow: "0 4px 22px rgba(95,40,64,0.07)",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    minHeight: 54,
    justifyContent: "center",
  },
  navIcon: { paddingHorizontal: 16, paddingVertical: 4, borderRadius: 18 },
  navLabel: { fontSize: 10, color: C.muted },
  feedHeader: { paddingHorizontal: 24, paddingTop: 22 },
  reel: { flex: 1, borderRadius: 27, padding: 25, overflow: "hidden" },
  reelCategory: { fontSize: 11, fontWeight: "700", letterSpacing: 1.7 },
  reelArt: { alignItems: "center", paddingVertical: 3 },
  reelTitle: {
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -1,
    fontWeight: "600",
  },
  reelBody: { fontSize: 17, lineHeight: 26 },
  source: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  saveButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF88",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  estimateDate: {
    fontSize: 32,
    letterSpacing: -1,
    color: C.pink,
    fontWeight: "600",
  },
  calendar: { flexDirection: "row", flexWrap: "wrap" },
  weekday: {
    width: "14.285%",
    textAlign: "center",
    fontSize: 12,
    color: C.muted,
    paddingVertical: 10,
  },
  dayCell: {
    width: "14.285%",
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  day: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 5 },
  journalHero: {
    backgroundColor: "#F3E9ED",
    padding: 26,
    borderRadius: 28,
    gap: 25,
    alignItems: "stretch",
  },
  journalQuote: {
    fontSize: 28,
    lineHeight: 37,
    letterSpacing: -0.7,
    color: C.pink,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  womanCard: {
    borderRadius: 26,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    overflow: "hidden",
  },
  womanArt: {
    height: 210,
    padding: 22,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  womanInitials: {
    fontSize: 100,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: -10,
    opacity: 0.9,
  },
  profileArt: {
    height: 210,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
  },
  profileInitials: {
    position: "absolute",
    fontSize: 80,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "#30202E66",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  sheet: {
    backgroundColor: C.paper,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%",
    maxWidth: 560,
    maxHeight: "92%",
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 10,
  },
  sheetHandle: {
    height: 4,
    width: 36,
    borderRadius: 2,
    backgroundColor: "#DBC5D0",
    alignSelf: "center",
    marginTop: 12,
  },
  welcome: {
    backgroundColor: C.paper,
    borderRadius: 28,
    padding: 28,
    width: "92%",
    maxWidth: 480,
    maxHeight: "90%",
    marginVertical: "auto",
  },
  menuRow: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderBottomWidth: 1,
    borderColor: C.line,
  },
  error: {
    color: "#A72C3D",
    backgroundColor: "#FFE8EC",
    padding: 12,
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 21,
  },
  toast: {
    position: "absolute",
    bottom: 102,
    alignSelf: "center",
    backgroundColor: C.ink,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 22,
    flexDirection: "row",
    gap: 8,
    maxWidth: "90%",
    zIndex: 20,
  },
  toastText: { color: "white", fontSize: 13, flexShrink: 1 },
  privacyCover: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: C.paper,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    zIndex: 100,
  },
});
