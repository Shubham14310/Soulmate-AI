import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getEndpoint, saveEndpoint } from "../src/storage";

const DEFAULT_ENDPOINT = "https://soulmate-ai-api.onrender.com/api/generate";

export default function Settings() {
  const router = useRouter();
  const [url, setUrl] = useState(DEFAULT_ENDPOINT);
  const [saving, setSaving] = useState(false);
  useEffect(() => { getEndpoint().then(value => setUrl(value || DEFAULT_ENDPOINT)); }, []);
  const save = async () => {
    const value = url.trim();
    if (!/^https:\/\//i.test(value)) {
      Alert.alert("Invalid URL", "Backend URL https:// se start hona chahiye.");
      return;
    }
    setSaving(true);
    await saveEndpoint(value);
    setSaving(false);
    Alert.alert("Saved", "Soulmate AI backend URL saved on this device.");
  };
  return <ScrollView style={s.bg} contentContainerStyle={s.wrap} contentInsetAdjustmentBehavior="automatic">
    <Pressable onPress={() => router.back()} style={s.back}><Ionicons name="chevron-back" size={23} color="#FFF" /></Pressable>
    <Text style={s.kicker}>PERSONALIZE YOUR EXPERIENCE</Text>
    <Text style={s.title}>AI connection</Text>
    <Text style={s.sub}>Soulmate AI's deployed backend is pre-filled. Your OpenRouter API key stays on the server and is never stored in this app.</Text>
    <Text style={s.label}>BACKEND API URL</Text>
    <TextInput value={url} onChangeText={setUrl} placeholder="https://your-service.onrender.com/api/generate" placeholderTextColor="#82798F" autoCapitalize="none" keyboardType="url" style={s.input} />
    <View style={s.info}>
      <Text style={s.infoTitle}>OpenRouter Free AI</Text>
      <Text style={s.infoText}>The backend uses OpenRouter's free-model router. Save changes here only if your backend address changes.</Text>
      <Text style={s.infoText}>Never paste your OpenRouter API key into this app.</Text>
    </View>
    <Pressable onPress={save} style={s.button}><Text style={s.buttonText}>{saving ? "Saving..." : "Save backend URL"}</Text></Pressable>
    <Text style={s.note}>Render's free service may sleep during inactivity, so the first reply after a quiet period can take longer.</Text>
  </ScrollView>;
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#100D18" },
  wrap: { padding: 20, paddingTop: 10, paddingBottom: 24 },
  back: { marginBottom: 22 },
  kicker: { fontSize: 9, color: "#C7A6FF", fontWeight: "900", letterSpacing: 1.8 },
  title: { fontSize: 29, color: "#FFF", fontWeight: "800", marginTop: 8 },
  sub: { fontSize: 12, color: "#A49AAD", lineHeight: 18, marginTop: 7, marginBottom: 24 },
  label: { fontSize: 10, color: "#C8B7DD", fontWeight: "900", letterSpacing: 1, marginBottom: 9 },
  input: { backgroundColor: "#211B2C", borderWidth: 1, borderColor: "#3A3048", borderRadius: 14, padding: 15, color: "#FFF", fontSize: 12 },
  info: { backgroundColor: "#211B2C", borderRadius: 15, padding: 16, marginTop: 17, borderWidth: 1, borderColor: "#352B43" },
  infoTitle: { color: "#EDE4F7", fontSize: 12, fontWeight: "800", marginBottom: 8 },
  infoText: { color: "#A99EB4", fontSize: 11, lineHeight: 18, marginTop: 4 },
  button: { height: 49, backgroundColor: "#D5BCFF", borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 22 },
  buttonText: { color: "#21172E", fontSize: 13, fontWeight: "900" },
  note: { color: "#81778E", fontSize: 10, lineHeight: 16, marginTop: 12 }
});
