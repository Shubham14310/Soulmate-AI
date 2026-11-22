import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View, Image, Pressable, StyleSheet, TextInput } from "react-native";

const purple = "#C7A6FF";
const characters = [
  { id: "hana", name: "Hana", detail: "Dreamy storyteller · Fantasy", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=85", tag: "POPULAR" },
  { id: "akari", name: "Akari", detail: "Cheerful artist · Slice of life", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=85", tag: "NEW" },
  { id: "rin", name: "Rin", detail: "Quiet genius · Mystery", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=85", tag: "TRENDING" }
];

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return <View style={s.sectionHead}><Text style={s.sectionTitle}>{title}</Text>{action ? <Text style={s.seeAll}>{action}</Text> : null}</View>;
}

export default function Home() {
  const router = useRouter();
  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.top}>
        <View><Text style={s.eyebrow}>YOUR IMAGINATION, YOUR WORLD</Text><Text style={s.brand}>Soulmate <Text style={{ color: purple }}>AI</Text></Text></View>
        <Pressable style={s.avatarButton} onPress={() => router.push("/profile")}><Ionicons name="person" size={20} color="#EDE7F7" /></Pressable>
      </View>
      <LinearGradient colors={["#33234D", "#211A32", "#191522"]} start={{x:0,y:0}} end={{x:1,y:1}} style={s.hero}>
        <View style={s.heroGlow} />
        <Text style={s.heroKicker}>A LITTLE ESCAPE, A BIG STORY</Text>
        <Text style={s.heroTitle}>Meet someone{ "\n" }unforgettable.</Text>
        <Text style={s.heroSub}>Discover characters, start a conversation, and create your own universe.</Text>
        <Pressable style={s.heroButton} onPress={() => router.push("/discover")}><Text style={s.heroButtonText}>Explore characters</Text><Ionicons name="arrow-forward" size={16} color="#17111F" /></Pressable>
        <Text style={s.sparkle}>✦</Text>
      </LinearGradient>
      <View style={s.search}><Ionicons name="search" size={19} color="#9A91A8" /><TextInput placeholder="Search characters or stories" placeholderTextColor="#82798F" style={s.searchInput} /></View>
      <SectionTitle title="Made for your mood" action="See all" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
        {["All", "Anime", "Fantasy", "Romance", "Adventure", "Mystery"].map((x,i)=><View key={x} style={[s.chip, i===0 && s.chipActive]}><Text style={[s.chipText, i===0 && {color:"#21172E"}]}>{x}</Text></View>)}
      </ScrollView>
      <SectionTitle title="Characters to meet" action="View all" />
      {characters.map((c) => (
        <Pressable key={c.id} style={s.characterCard} onPress={() => router.push({ pathname: "/chat/[id]", params: { id: c.id, name: c.name } })}>
          <Image source={{ uri: c.image }} style={s.characterImage} />
          <View style={s.characterShade} />
          <View style={s.tag}><Text style={s.tagText}>{c.tag}</Text></View>
          <View style={s.characterInfo}><Text style={s.characterName}>{c.name}</Text><Text style={s.characterDetail}>{c.detail}</Text></View>
          <View style={s.arrow}><Ionicons name="arrow-up" size={17} color="#21172E" /></View>
        </Pressable>
      ))}
      <Pressable onPress={() => router.push("/create")} style={s.createBanner}><View style={s.createIcon}><Ionicons name="add" size={24} color={purple} /></View><View style={{flex:1}}><Text style={s.createTitle}>Create your own character</Text><Text style={s.createSub}>Give them a name, story and personality</Text></View><Ionicons name="chevron-forward" size={20} color="#A99BB9" /></Pressable>
      <Text style={s.footer}>Soulmate AI · Your story starts here</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen:{flex:1,backgroundColor:"#100D18"}, content:{padding:20,paddingTop:20,paddingBottom:30},
  top:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:22},
  eyebrow:{fontSize:9,letterSpacing:2,color:"#9A8BAE",fontWeight:"700"},brand:{fontSize:27,fontWeight:"800",color:"#F7F1FF",letterSpacing:-1,marginTop:3},
  avatarButton:{width:42,height:42,borderRadius:15,backgroundColor:"#241D30",borderWidth:1,borderColor:"#393047",alignItems:"center",justifyContent:"center"},
  hero:{borderRadius:25,padding:22,minHeight:230,overflow:"hidden",marginBottom:20},heroGlow:{position:"absolute",width:170,height:170,borderRadius:100,backgroundColor:"#8C5BCB",opacity:.18,right:-45,top:-55},
  heroKicker:{color:"#D5BFFF",fontSize:9,fontWeight:"800",letterSpacing:1.8},heroTitle:{fontSize:31,lineHeight:35,color:"#FFF",fontWeight:"800",letterSpacing:-.8,marginTop:13},
  heroSub:{fontSize:12,color:"#C8BED5",lineHeight:18,maxWidth:250,marginTop:9},heroButton:{marginTop:18,backgroundColor:"#D5BCFF",paddingHorizontal:16,paddingVertical:11,borderRadius:13,alignSelf:"flex-start",flexDirection:"row",alignItems:"center",gap:9},
  heroButtonText:{color:"#21172E",fontSize:12,fontWeight:"800"},sparkle:{position:"absolute",right:25,bottom:30,color:"#D7C1FF",fontSize:44},
  search:{height:48,borderRadius:15,backgroundColor:"#1B1724",borderWidth:1,borderColor:"#30283C",flexDirection:"row",alignItems:"center",paddingHorizontal:14,marginBottom:25},searchInput:{flex:1,color:"#F5EEFF",fontSize:12,marginLeft:10},
  sectionHead:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:13},sectionTitle:{fontSize:18,color:"#F5F0FA",fontWeight:"800",letterSpacing:-.4},seeAll:{fontSize:11,color:purple,fontWeight:"700"},
  chips:{gap:8,paddingBottom:23},chip:{borderRadius:20,borderWidth:1,borderColor:"#393044",paddingHorizontal:15,paddingVertical:9,backgroundColor:"#1B1724"},chipActive:{backgroundColor:"#D5BCFF",borderColor:"#D5BCFF"},chipText:{fontSize:11,color:"#C9BED4",fontWeight:"700"},
  characterCard:{height:178,borderRadius:21,overflow:"hidden",marginBottom:13,backgroundColor:"#282033"},characterImage:{width:"100%",height:"100%",position:"absolute"},characterShade:{...StyleSheet.absoluteFillObject,backgroundColor:"rgba(12,8,18,.30)"},tag:{position:"absolute",top:13,left:13,backgroundColor:"rgba(19,14,28,.75)",paddingHorizontal:10,paddingVertical:6,borderRadius:8},tagText:{fontSize:8,color:"#E4D5FF",fontWeight:"900",letterSpacing:1.1},characterInfo:{position:"absolute",left:17,bottom:16},characterName:{fontSize:23,color:"#FFF",fontWeight:"800"},characterDetail:{fontSize:11,color:"#E2D9E9",marginTop:3},arrow:{position:"absolute",right:16,bottom:16,width:34,height:34,borderRadius:12,backgroundColor:"#D5BCFF",alignItems:"center",justifyContent:"center"},
  createBanner:{marginTop:7,padding:15,borderRadius:18,backgroundColor:"#1C1726",borderWidth:1,borderColor:"#352B43",flexDirection:"row",alignItems:"center",gap:12},createIcon:{width:43,height:43,borderRadius:14,backgroundColor:"#30233F",alignItems:"center",justifyContent:"center"},createTitle:{color:"#F6F0FF",fontSize:13,fontWeight:"800"},createSub:{color:"#9F95AA",fontSize:10,marginTop:4},footer:{textAlign:"center",color:"#6F667A",fontSize:10,marginTop:25}
});