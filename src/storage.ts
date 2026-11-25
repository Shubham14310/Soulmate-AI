import AsyncStorage from "@react-native-async-storage/async-storage";

export type Character = { id:string; name:string; tagline:string; personality:string; avatar:string; category:string };
export type ChatMessage = { role:"user"|"assistant"; content:string; createdAt:number };
const KEYS={endpoint:"soulmate.endpoint",characters:"soulmate.characters",chats:"soulmate.chats"};
const DEFAULT_ENDPOINT="https://soulmate-ai-api.onrender.com/api/generate";

// The deployed backend is the default; users can still replace it in Settings.
export async function getEndpoint() {
  const saved = (await AsyncStorage.getItem(KEYS.endpoint)) || "";
  if (saved.includes("ngrok-free.dev") || saved.includes("ngrok.io")) {
    await AsyncStorage.removeItem(KEYS.endpoint);
    return DEFAULT_ENDPOINT;
  }
  return saved.trim() || DEFAULT_ENDPOINT;
}
export async function saveEndpoint(value:string){await AsyncStorage.setItem(KEYS.endpoint,value.trim());}
export async function getCharacters():Promise<Character[]>{try{return JSON.parse((await AsyncStorage.getItem(KEYS.characters))||"[]");}catch{return [];}}
export async function getCharacter(id:string):Promise<Character|undefined>{return (await getCharacters()).find(character=>character.id===id);}
export async function saveCharacter(character:Character){const all=await getCharacters();await AsyncStorage.setItem(KEYS.characters,JSON.stringify([character,...all]));}
export async function getChat(id:string):Promise<ChatMessage[]>{try{const all=JSON.parse((await AsyncStorage.getItem(KEYS.chats))||"{}");return all[id]||[];}catch{return [];}}
export async function saveChat(id:string,messages:ChatMessage[]){const all=JSON.parse((await AsyncStorage.getItem(KEYS.chats))||"{}");all[id]=messages;await AsyncStorage.setItem(KEYS.chats,JSON.stringify(all));}
export async function getAllChats():Promise<{id:string;messages:ChatMessage[]}[]>{try{const all=JSON.parse((await AsyncStorage.getItem(KEYS.chats))||"{}");return Object.entries(all).map(([id,messages])=>({id,messages:messages as ChatMessage[]})).filter(x=>x.messages.length>0).sort((a,b)=>(b.messages[b.messages.length-1]?.createdAt||0)-(a.messages[a.messages.length-1]?.createdAt||0));}catch{return [];}}
