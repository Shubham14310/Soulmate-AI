import AsyncStorage from "@react-native-async-storage/async-storage";

export type Character = { id:string; name:string; tagline:string; personality:string; avatar:string; category:string };
export type ChatMessage = { role:"user"|"assistant"; content:string; createdAt:number };
const KEYS={endpoint:"soulmate.endpoint",characters:"soulmate.characters",chats:"soulmate.chats"};
export async function getEndpoint(){return (await AsyncStorage.getItem(KEYS.endpoint))||"";}
export async function saveEndpoint(value:string){await AsyncStorage.setItem(KEYS.endpoint,value.trim());}
export async function getCharacters():Promise<Character[]>{try{return JSON.parse((await AsyncStorage.getItem(KEYS.characters))||"[]");}catch{return [];}}
export async function getCharacter(id:string):Promise<Character|undefined>{return (await getCharacters()).find(character=>character.id===id);}
export async function saveCharacter(character:Character){const all=await getCharacters();await AsyncStorage.setItem(KEYS.characters,JSON.stringify([character,...all]));}
export async function getChat(id:string):Promise<ChatMessage[]>{try{const all=JSON.parse((await AsyncStorage.getItem(KEYS.chats))||"{}");return all[id]||[];}catch{return [];}}
export async function saveChat(id:string,messages:ChatMessage[]){const all=JSON.parse((await AsyncStorage.getItem(KEYS.chats))||"{}");all[id]=messages;await AsyncStorage.setItem(KEYS.chats,JSON.stringify(all));}
export async function getAllChats():Promise<{id:string;messages:ChatMessage[]}[]>{try{const all=JSON.parse((await AsyncStorage.getItem(KEYS.chats))||"{}");return Object.entries(all).map(([id,messages])=>({id,messages:messages as ChatMessage[]})).filter(x=>x.messages.length>0).sort((a,b)=>(b.messages[b.messages.length-1]?.createdAt||0)-(a.messages[a.messages.length-1]?.createdAt||0));}catch{return [];}}
