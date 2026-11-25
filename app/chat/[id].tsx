import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getChat, saveChat, getEndpoint, getCharacter, type ChatMessage } from "../../src/storage";

export default function Chat() {
  const { id = "hana", name = "Hana" } = useLocalSearchParams<{ id: string; name: string }>();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [endpoint, setEndpoint] = useState("");
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState("");

  useEffect(() => {
    getChat(String(id)).then(setMessages);
    getEndpoint().then(setEndpoint);
    getCharacter(String(id)).then(character => setPersona(character?.personality || ""));
  }, [id]);

  useEffect(() => {
    saveChat(String(id), messages);
  }, [id, messages]);

  const send = async () => {
    const prompt = message.trim();
    if (!prompt || loading) return;

    const next: ChatMessage[] = [
      ...messages,
      { role: "user", content: prompt, createdAt: Date.now() }
    ];
    setMessages(next);
    setMessage("");

    if (!endpoint) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "AI server abhi set nahi hua hai. Settings mein deployed backend URL save karo.",
          createdAt: Date.now()
        }
      ]);
      return;
    }

    setLoading(true);
    try {
      const builtIn: Record<string, string> = {
        hana: "A dreamy, kind fantasy storyteller who loves gentle mysteries and imaginative adventures.",
        akari: "A cheerful, creative anime artist who is curious, encouraging and upbeat.",
        rin: "A quiet, thoughtful mystery enthusiast who notices small details and speaks calmly."
      };
      const traits = persona || builtIn[String(id)] || "A friendly, imaginative conversation partner.";
      const history = next.slice(-12)
        .map(item => (item.role === "user" ? "User" : "Character") + ": " + item.content)
        .join("\n");
      const contextualPrompt =
        "You are roleplaying as the fictional character " + String(name) +
        ". Character personality: " + traits +
        "\nStay consistent with this personality and respond naturally in character. Keep the conversation respectful and age-appropriate. Do not claim to be a real person.\nConversation:\n" +
        history + "\nCharacter:";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: contextualPrompt })
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Server returned " + response.status);
      }

      const data = await response.json();
      const answer = data.response;
      if (typeof answer !== "string" || !answer.trim()) {
        throw new Error("Server response did not contain a reply.");
      }

      setMessages([
        ...next,
        { role: "assistant", content: answer.trim(), createdAt: Date.now() }
      ]);
    } catch (e) {
      const reason = e instanceof Error ? e.message : "Connection failed";
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "Connection error: " + reason + "\nSettings mein backend URL aur server status check karo.",
          createdAt: Date.now()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return <SafeAreaView style={s.bg} edges={["top", "bottom"]}>
    <KeyboardAvoidingView style={s.keyboard} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={0}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="chevron-back" size={25} color="#F7F0FF" /></Pressable>
        <View style={s.avatar}><Text style={s.avatarText}>{String(name).slice(0, 1)}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{name}</Text>
          <Text style={s.online}>{endpoint ? "OpenRouter AI connected" : "Preview · connect AI in Settings"}</Text>
        </View>
        <Pressable onPress={() => router.push("/settings")}><Ionicons name="settings-outline" size={21} color="#EDE5F7" /></Pressable>
      </View>
      <ScrollView contentContainerStyle={s.messages} keyboardShouldPersistTaps="handled">
        {messages.length === 0 && <View style={s.welcome}>
          <Text style={s.star}>✦</Text>
          <Text style={s.welcomeTitle}>Your story with {name} starts here</Text>
          <Text style={s.welcomeSub}>Say hello, share an idea, or begin a new adventure.</Text>
        </View>}
        {messages.map((m, i) => <View key={i} style={[s.bubble, m.role === "user" ? s.userBubble : s.botBubble]}>
          <Text style={s.bubbleText}>{m.content}</Text>
        </View>)}
        {loading && <View style={s.typing}><ActivityIndicator color="#C7A6FF" /><Text style={s.typingText}>{name} is thinking...</Text></View>}
      </ScrollView>
      <View style={s.composer}>
        <TextInput value={message} onChangeText={setMessage} placeholder="Message your character..." placeholderTextColor="#81778E" style={s.input} multiline maxLength={4000} />
        <Pressable disabled={loading || !message.trim()} style={[s.send, (loading || !message.trim()) && { opacity: 0.45 }]} onPress={send}>
          <Ionicons name="arrow-up" size={20} color="#21172E" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#100D18" },
  keyboard: { flex: 1 },
  header: { height: 68, paddingHorizontal: 17, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: "#2A2333" },
  avatar: { width: 38, height: 38, borderRadius: 14, backgroundColor: "#49335F", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#E8D7FF", fontWeight: "900", fontSize: 17 },
  name: { fontSize: 15, color: "#FFF", fontWeight: "800" },
  online: { fontSize: 10, color: "#9C91A8", marginTop: 2 },
  messages: { padding: 17, flexGrow: 1, justifyContent: "flex-end" },
  welcome: { alignItems: "center", padding: 25, marginBottom: 20 },
  star: { fontSize: 32, color: "#C7A6FF" },
  welcomeTitle: { fontSize: 18, color: "#F7F0FF", fontWeight: "800", marginTop: 10, textAlign: "center" },
  welcomeSub: { fontSize: 11, color: "#9B91A8", textAlign: "center", lineHeight: 18, marginTop: 7 },
  bubble: { padding: 13, borderRadius: 17, marginBottom: 10, maxWidth: "88%" },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#4D3768", borderBottomRightRadius: 5 },
  botBubble: { alignSelf: "flex-start", backgroundColor: "#211B2C", borderBottomLeftRadius: 5 },
  bubbleText: { color: "#FFF", fontSize: 13, lineHeight: 19 },
  typing: { flexDirection: "row", gap: 9, alignItems: "center", padding: 10 },
  typingText: { color: "#A99EB4", fontSize: 11 },
  composer: { flexDirection: "row", alignItems: "flex-end", padding: 11, borderTopWidth: 1, borderTopColor: "#2A2333", gap: 9 },
  input: { flex: 1, minHeight: 45, maxHeight: 110, backgroundColor: "#211B2C", borderRadius: 15, paddingHorizontal: 14, paddingVertical: 12, color: "#FFF", fontSize: 13 },
  send: { width: 43, height: 43, borderRadius: 14, backgroundColor: "#D5BCFF", alignItems: "center", justifyContent: "center" }
});
