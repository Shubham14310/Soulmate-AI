import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const INK = "#100D18";
const MUTED = "#8E879C";
const ACCENT = "#C7A6FF";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: "#171321", borderTopColor: "#2B2438", height: 62, paddingTop: 7, paddingBottom: 7 },
      tabBarActiveTintColor: ACCENT,
      tabBarInactiveTintColor: MUTED,
      tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
    }}>
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="discover" options={{ title: "Discover", tabBarIcon: ({ color, size }) => <Ionicons name="compass" size={size} color={color} /> }} />
      <Tabs.Screen name="library" options={{ title: "Chats", tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} /> }} />
    </Tabs>
  );
}