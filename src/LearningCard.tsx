import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Post } from "./content";
import { Art, Icon, s } from "./ui";

export default function LearningCard({
  post,
  index,
  count,
  height,
  saved,
  onSave,
  onOpen,
  onNext,
}: {
  post: Post;
  index: number;
  count: number;
  height: number;
  saved: boolean;
  onSave: () => void;
  onOpen: () => void;
  onNext?: () => void;
}) {
  const { fontScale } = useWindowDimensions();
  const [viewport, setViewport] = useState(0);
  const [content, setContent] = useState(0);
  const overflow = viewport > 0 && content > viewport + 2;
  const ink = { color: post.accent };
  return (
    <View
      testID={`learning-card-${index}`}
      style={{ height, paddingHorizontal: 16, paddingBottom: 8 }}
    >
      <View style={[styles.card, { backgroundColor: post.background }]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          scrollEnabled={overflow}
          nestedScrollEnabled
          showsVerticalScrollIndicator={overflow}
          onLayout={(event) => setViewport(event.nativeEvent.layout.height)}
          onContentSizeChange={(_, h) => setContent(h)}
        >
          <View style={s.row}>
            <Text style={[styles.category, ink]}>
              {post.category.toUpperCase()}
            </Text>
            <Text style={[s.small, ink]}>
              {(index % count) + 1} / {count}
              {index >= count ? " · Revisit" : ""}
            </Text>
          </View>
          {fontScale <= 1.3 && (
            <View style={styles.art}>
              <Art
                motif={post.motif}
                color={post.accent}
                size={Math.max(75, Math.min(165, height - 410))}
              />
            </View>
          )}
          <View style={{ gap: 16 }}>
            <Text
              accessibilityRole="header"
              style={[
                styles.title,
                ink,
                height < 550 && { fontSize: 28, lineHeight: 34 },
              ]}
            >
              {post.title}
            </Text>
            <Text style={[styles.body, ink]}>{post.body}</Text>
          </View>
          <View style={{ flexGrow: 1, minHeight: 12 }} />
          <Text style={[s.small, ink]}>paceflow / learn</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              post.url ? `Read source: ${post.source}` : "Open journal prompt"
            }
            onPress={onOpen}
            style={{ paddingVertical: 12 }}
          >
            <Text style={[styles.source, ink]}>{post.source} ↗</Text>
          </Pressable>
          <Text style={[s.small, ink]}>
            General education, not medical advice
          </Text>
        </ScrollView>
        <View style={styles.footer}>
          {onNext ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next lesson"
              onPress={onNext}
              style={styles.next}
            >
              <Text style={[styles.nextLabel, ink]}>
                {overflow
                  ? "Scroll to read · Next lesson"
                  : "Swipe up for the next lesson"}
              </Text>
              <Icon name="arrow-down" size={20} color={post.accent} />
            </Pressable>
          ) : (
            <Text style={[s.small, ink, { flex: 1 }]}>
              You’re all caught up on saved lessons.
            </Text>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={saved ? "Unsave post" : "Save post"}
            onPress={onSave}
            style={styles.save}
          >
            <Icon
              name={saved ? "bookmark" : "bookmark-outline"}
              color={post.accent}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: 27, overflow: "hidden" },
  content: { flexGrow: 1, padding: 25, paddingBottom: 6 },
  category: { fontSize: 11, fontWeight: "700", letterSpacing: 1.7 },
  art: { alignItems: "center", paddingVertical: 12 },
  title: { fontSize: 34, lineHeight: 40, letterSpacing: -1, fontWeight: "600" },
  body: { fontSize: 17, lineHeight: 26 },
  source: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 8,
  },
  next: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nextLabel: { fontSize: 12, lineHeight: 18, flexShrink: 1 },
  save: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF88",
    alignItems: "center",
    justifyContent: "center",
  },
});
