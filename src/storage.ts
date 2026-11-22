import AsyncStorage from "@react-native-async-storage/async-storage";

export type Character = { id:string; name:string; tagline:string; personality:string; avatar:string; category:string };
export type ChatMessage = { role:"user"|"assistant"; content:string; createdAt:number };
const KEYS={endpoint:"soulmate.endpoint",characters:"soulmate.characters",chats:"soulmate.chats"};
export async function getEndpoint(){return (await AsyncStorage.getItem(KEYS.endpoint))||"";}
export async function saveEndpoint(value:string){await AsyncStorage.setItem(KEYS.endpoint,value.trim());}
export async function getCharacters():Promise<Character[]>{try{return JSON.parse((await AsyncStorage.getItem(KEYS.characters))||"[]");}catch{return [];}}
export async function saveCharacter(character:Character){const all=await getCharacters();await AsyncStorage.setItem(KEYS.characters,JSON.stringify([character,...all]));}
export async function getChat(id:string):Promise<ChatMessage[]>{try{const all=JSON.parse((await AsyncStorage.getItem(KEYS.chats))||"{}");return all[id]||[];}catch{return [];}}
export async function saveChat(id:string,messages:ChatMessage[]){const all=JSON.parse((await AsyncStorage.getItem(KEYS.chats))||"{}");all[id]=messages;await AsyncStorage.setItem(KEYS.chats,JSON.stringify(all));}
