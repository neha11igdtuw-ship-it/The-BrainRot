// Edit freely: characters, natures (tag), signature lines (sig) and jokes. {x} = user's input.
// g = gender of the cartoon avatar/voice (m/f). old:true = grey hair.
const C = (id, name, tag, g, sig, extra) => ({ id, name, tag, g, sig, ...(extra || {}) });

window.CHARS = Object.fromEntries([
  // ---- Chumbak Colony ----
  C("rajni", "Rajni Merchant", "Queen of Drama", "f", ["Main drama nahi karti, bas background music add karti hoon.", "Entry hamesha grand honi chahiye, warna kya fayda?"]),
  C("kuku", "Kuku Merchant", "Ex-files Expert", "m", ["Purani baatein? Wo toh archives mein hain, par yaad sab hai.", "Main kuch nahi bolunga… (bolta hai) bas ek line sunlo."]),
  C("aditya", "Aditya Khanna", "Chill Pill", "m", ["Arre chill maar, colony mein sab theek ho jata hai. Ya nahi hota.", "Tension ka kya, chai pi aur aage badh."]),
  C("priyanka", "Priyanka Khanna", "Over-planner", "f", ["Maine iska schedule bana liya hai, Excel sheet bhej rahi hoon.", "Plan A, B, C ready hai. D bhi, bas bataungi nahi."]),
  C("mikhael", "Dr. Mikhael Oberoi", "Dr. Gyaan", "m", ["Doctor ki salah: gossip kam, paani zyada. Par sunna zaroor.", "Mere diagnosis mein ye 'serious overreaction' hai."]),
  C("twinkle", "Twinkle Oberoi", "Selfie Soul", "f", ["Ek selfie toh banti hai, pehle angle sahi karo.", "Ye moment viral hone wala hai, camera on karo!"]),
  C("dharmendra", "Dharmendra Kejriwal", "Mr. Dhamaka", "m", ["Dhamaka toh abhi baaki hai mere dost!", "Jab main aata hoon, interval nahi hota."]),
  C("kiran", "Kiran Kejriwal", "Quiet Roaster", "m", ["Main kam bolta hoon, par jab bolta hoon toh seedha dil pe.", "Chup rehna bhi ek talent hai, mere paas hai."]),
  C("freddy", "Freddy Taraporewala", "Party Starter", "m", ["Party kab hai? Wo pehle batao, baaki baad mein.", "Music on karo, mood apne aap theek ho jayega!"]),
  C("hutoxi", "Hutoxi Taraporewala", "Sassy Sidekick", "f", ["Ye toh viral hone wali baat hai, screenshot lo!", "Eye-roll bhi ek poori sentence hai."]),
  C("gulshan", "Gulshan Taraporewala", "Gossip Radar", "f", ["Mujhe pehle se pata tha, bas bolne ka time nahi mila.", "Colony mein jo hota hai, mere radar pe aata hai."]),
  C("nari", "Nari Ravjiani", "Colony Uncle Energy", "m", ["Mere zamaane mein ye sab nahi hota tha, par mazaa aa raha hai.", "Hum toh society ke 'old is gold' hain."], { old: true }),
  // ---- Chaotic friends ----
  C("chhavi", "Chaos Chhavi", "Chaos Queen", "f", ["Plan? Plan toh kal bana tha, aaj vibes chal rahi hai.", "Tension mat le, main usse bhi bada tension laati hoon."]),
  C("reel", "Reel Rahul", "Reel Addict", "m", ["Ruk, pehle iska reel banate hain, phir problem solve.", "Bhai ye moment trending audio deserve karta hai."]),
  C("filmy", "Filmy Falguni", "Drama in 4K", "f", ["Mere jeevan mein interval nahi aata, sirf climax.", "Slow-motion entry, background violin. Action!"]),
  C("gaurav", "Gyaani Gaurav", "Fake Philosopher", "m", ["Zindagi ek Wi-Fi hai bhai, kabhi connect kabhi disconnect.", "Jo hota hai achhe ke liye hota hai. Pizza ke liye bhi."]),
  C("farhan", "Foodie Farhan", "Every Problem = Biryani", "m", ["Har problem ka solution biryani hai. Extra raita ke saath.", "Pehle khana, phir gyaan, phir bill split."]),
  C("laxmi", "Lazy Laxmi", "Kal Karungi", "f", ["Jo kaam kal ho sakta hai, wo parso bhi ho sakta hai.", "Neend meri side hobby nahi, primary career hai."]),
  C("om", "Overthinker Om", "3 AM Expert", "m", ["Mujhe lagta hai usne 'ok' ka matlab alag socha tha.", "Raat ke 3 baje mere paas 47 theories hoti hain."]),
  C("pinky", "Broke Pinky", "Udhaar Queen", "f", ["Paise nahi hain, par aatma-vishwas full hai. Udhaar de?", "Salary aane tak main 'minimalist' hoon."]),
  // ---- IGDTU ----
  C("tanya", "Topper Tanya", "Notes Machine", "f", ["Notes toh hain, par photocopy ka charge lagega. Hasi mazaak.", "Maine syllabus teen baar padha, chauthi baar chai ke saath."]),
  C("bunty", "Bunker Bunty", "Attendance Gambler", "m", ["Mera attendance 74.9% hai, ye art hai bhai.", "Proxy dene wala dost sabse bada bank hai."]),
  C("devd", "Deadline Dev", "Last-minute Legend", "m", ["Deadline kal hai? Toh aaj raat hi toh productivity hai.", "Mera best code raat 3 baje likha jata hai."]),
  C("chintu", "Canteen Chintu", "Maggi Minister", "m", ["Canteen mein sab milta hai, bas syllabus nahi.", "Samosa pehle, shiksha baad mein."]),
  C("bhavya", "Backbench Bhavya", "Silent Observer", "f", ["Back bench se poori class ka scene dikhta hai.", "Main kuch nahi bolti, par sab note karti hoon."]),
  C("chirag", "Coder Chirag", "Bug Is a Feature", "m", ["Mere code mein bug nahi, surprise features hain.", "Works on my machine. Case closed."]),
  // ---- Siblings ----
  C("bhai", "Bada Bhai", "Remote Dictator", "m", ["Main bada hoon, isliye remote mera hai. Constitution mein likha hai.", "Mummy ko bol dun? Deal kar le."]),
  C("behen", "Chhoti Behen", "Chugli Champion", "f", ["Mummyyy! Bhai ne phir se mera charger liya!", "Main chhoti hoon, isliye main hamesha sahi hoon."]),
  C("mummy", "Mummy", "Voice from Kitchen", "f", ["Dono ladna band karo, warna dono ko bartan dhone padenge!", "Maine kya kaha tha? Barabar baantna."], { old: true }),
  C("papa", "Papa", "Bijli Bill Inspector", "m", ["Light kyun jal rahi hai? Ye ghar hai ya stadium?", "Hum jab chhote the toh ek hi remote tha, aur ek hi channel."], { old: true }),
  C("dadi", "Dadi", "Secret Supporter", "f", ["Ladne do bachon ko, warna kal ye ek doosre ko miss karenge.", "Beta, ek laddoo le le, jhagda apne aap khatam."], { old: true }),
  C("monty", "Cousin Monty", "Meddling Cousin", "m", ["Main toh bas popcorn kha raha hoon, aap log continue karo.", "Neutral hoon, par jo jeetega uska side lunga."]),
  // ---- Exam panic ----
  C("pari", "Padhaku Pari", "Highlighter Hero", "f", ["Maine syllabus ko 5 colors mein highlight kar diya hai.", "Padhai shuru, phone door. (Phone 2 minute mein wapas.)"]),
  C("dhruv", "Distraction Dhruv", "Meme Dealer", "m", ["Bas ek meme dekh le, 2 second ka hai. Pakka.", "Padhai baad mein, pehle ye reel dekh!"]),
  C("lakshya", "Last-night Lakshya", "Raat Ka Raja", "m", ["Main toh raat ko padhta hoon, subah sab bhool jaata hoon.", "Dua par vishwas hai, syllabus par kam."]),
  C("neel", "Notes-wala Neel", "Notes Hoarder", "m", ["Mere paas notes ke notes ke notes hain.", "PDF 400 pages ka hai, par mood 4 line ka."]),
  C("pooja", "Panic Pooja", "Panic Button", "f", ["Mujhe kuch nahi aata! (Sabse zyada number layegi.)", "Heart rate 140, par highlighter steady hai."]),
  C("chetan", "Chill Chetan", "No-Tension Guy", "m", ["Kal exam hai? Toh aaj bhi so sakte hain.", "Jo hoga dekha jayega. Maggi bana loon?"]),
  // ---- Group project ----
  C("kabir", "Kaam-wala Kabir", "The Only Worker", "m", ["Main kar leta hoon, tum bas 'great work' likh dena.", "Commit kar diya hai: final_final_v3_real.zip"]),
  C("kunal", "Kal-Pakka Kunal", "Kal Pakka", "m", ["Kal pakka kar dunga. Pakka wala pakka.", "Bas thoda network issue hai, aur thoda life issue."]),
  C("nisha", "Naam-wali Nisha", "Naming Genius", "f", ["Group ka naam socha: 'Team Pixel Quantum Warriors 2.0'.", "Kaam ka pata nahi, par logo ka design ready hai."]),
  C("lavish", "Leader Lavish", "Meeting Maniac", "m", ["Ek chhoti si meeting rakhte hain, 3 ghante ki.", "Main sirf coordinate karta hoon. Karne wale alag hain."]),
  C("gauri", "Ghost Gauri", "Seen, No Reply", "f", ["Seen. Reply kal karungi. Ya parso.", "Group chat mute hai, par dil mein aap sab ho."]),
  C("parth", "PPT Parth", "Font Fanatic", "m", ["Content baad mein, pehle font aur animation set karo.", "Slide 1 ke liye 3 ghante lage, par kya hi swag hai!"])
].map((c) => [c.id, c]));

window.MOODS = [
  {
    id: "chumbak", emoji: "🏘️", name: "Chumbak Colony", color: "#ff7a45",
    desc: "Colony ka over-the-top gossip, galatfehmiyan aur daily drama",
    tagline: "Colony ke gate khul rahe hain… gossip loading 🏘️",
    chips: ["Padosi ne meri chai ki baat poori colony ko bata di", "Mera friend har baar late aata hai", "Society meeting mein bahut drama hua"],
    chars: ["rajni", "kuku", "aditya", "priyanka", "mikhael", "twinkle", "dharmendra", "kiran", "freddy", "hutoxi", "gulshan", "nari"],
    topics: {
      study: ["Padhai? Poori colony ko pata chal gaya hai ki aaj tu padhne wala hai. Pressure ab society-level ka hai.", "Kal se padhai? Colony WhatsApp group mein announce kar de, accountability mil jayegi.", "Padhega toh chai pe charcha band ho jayegi. Soch le, colony ka nuksaan hai."],
      late: ["Late? Gate ka CCTV sab bata dega. Time-stamp ke saath.", "Late aana ab trend hai. Par colony ko 'fashionably' nahi, 'suspiciously' late lagta hai.", "Tu late nahi, gossip jaldi thi. Colony ka time-zone alag hota hai."],
      food: ["Khana? Kisi ke ghar se pakode aaye hain, sath mein 3 sawal bhi.", "Kuch bana hai kya? Colony mein khushboo pehle gossip phailata hai, phir plate.", "Paneer bana hai? Colony ko pehle khabar lag chuki hai, ab hissa bhi lagega."],
      sleep: ["Neend? Colony mein 11 baje ke baad sirf gossip aur kutte jaagte hain.", "Sone ja raha hai? Pehle bata, balcony wali baat sach hai ya afwah?", "Soja beta, kal subah society meeting hai: 'Neend kyun aati hai'."],
      tech: ["Wifi chal nahi raha? Colony ka password ab 3 ghar tak 'confidential' hai.", "Charger chahiye? Hai, par pehle ek lecture lena padega.", "Reel ban rahi hai? Colony mein sab extra hain, par tu lead role."],
      default: ["'{x}' — arre! Ye khabar toh colony ko 5 minute pehle hi mil gayi thi.", "'{x}'? Note kar liya, kal colony ki headline wahi hogi.", "'{x}' sunke sabne chashma uthaya aur bola: 'Hmm, interesting.'"]
    },
    random: [
      ["Suna? Kisi ne bola tera cycle kal raat 'ghoomne' gaya tha.", "Cycle ghoomne? Maine toh suna society ka CCTV hi gum tha.", "Sab afwah hai. Par agar sach nikla toh Sunday ko meeting pakki.", "Meeting ke baad samosa? Phir toh meri taraf se sab sach!"],
      ["Aaj lift kharab hai, 5th floor tak gossip bhi seedhi chadhi.", "Gossip ke liye toh lift ki zaroorat hi nahi, hawa mein phailti hai.", "Hawa se yaad aaya, mere sukhte kapde kaun le gaya?", "Wo toh kisi ne 'sanitize' kiye. 3 baar."],
      ["Colony ka naya rule: raat 10 ke baad koi gossip nahi.", "Matlab 9:59 pe saari baatein ek saath?", "Haan, 'last-minute breaking news' round.", "Rule pass! Samosa second round shuru."]
    ]
  },
  {
    id: "chaotic", emoji: "🌀", name: "Chaotic Friends", color: "#ff3d81",
    desc: "Har serious baat ka dramatic, unexpected jawab",
    tagline: "Seatbelt baandh lo, dimaag ghar pe chhod do 🌀",
    chips: ["Kal se padhai shuru karungi", "Mera assignment complete nahi hua", "Mujhe lagta hai main bahut thak gayi hoon"],
    chars: ["chhavi", "reel", "filmy", "gaurav", "farhan", "laxmi", "om", "pinky"],
    topics: {
      study: ["Kal se padhai? Kal kaun sa? Is week wala ya next semester wala?", "Tension mat le. Pehle ek motivational reel dekhte hain… phir tension lenge.", "Padhai ka mood nahi? Mood ko bhi toh chhutti chahiye."],
      late: ["Late? Time ek illusion hai, aur tu us illusion ka VIP guest.", "Tu late nahi, baaki sab jaldi hain. Perspective ki baat hai.", "Late aaya? Chal, entry slow-motion mein kar, background music main laga deti hoon."],
      food: ["Bhookh lagi? Ye signal hai ki brain ko 'fries' ka update chahiye.", "Diet kal se. Aaj ka khana kal ki taakat banega, logic sahi hai.", "Pizza order karte hain. Reason baad mein dhundhenge."],
      sleep: ["Neend nahi aa rahi? Bhed-bakri nahi, 'overthinking' gin le.", "Sone ka time? Raat ke 3 baje mere best ideas aate hain, suno.", "Soja. Kal ki tension kal ki mujhse baat karegi."],
      tech: ["Wifi gaya? Shaant reh. Universe tujhe 'digital detox' de raha hai.", "Phone 2% pe? Ye toh ab survival game hai.", "Battery low = 'Dil toh bachcha hai ji' vibes."],
      default: ["'{x}'? Itni serious baat pe main bina reel ke react nahi karti.", "'{x}' — theek hai, ek kaam kar: seedha pizza order kar, solution baad mein.", "'{x}'? Ye toh Bollywood ka climax material hai, interval mat le."]
    },
    random: [
      ["Mera assignment complete nahi hua.", "Tension mat le. Pehle ek motivational reel dekhte hain.", "Aur phir assignment?", "Phir tension lenge. Ek ek karke."],
      ["Mujhe lagta hai main bahut thak gayi hoon.", "Ye thakan nahi, 'dramatic pause' hai. Climax abhi baaki hai.", "Climax mein kya hoga?", "Tu hero banegi aur pizza arrive hoga."],
      ["Aaj ka plan kya hai?", "Plan? Plan toh kal bana tha, aaj 'vibes' chal rahi hai.", "Vibes se kaam chalega?", "Vibes se toh poora zamana chal raha hai bhai."]
    ]
  },
  {
    id: "igdtu", emoji: "🎓", name: "IGDTU Wars", color: "#7c5cff",
    desc: "Attendance, assignments, canteen aur project deadlines",
    tagline: "Attendance low, drama high… class shuru! 🎓",
    chips: ["Aaj class bunk karun?", "Group project ka kaam kisne kiya?", "Kal submission hai aur kuch bana nahi"],
    chars: ["tanya", "bunty", "devd", "chintu", "bhavya", "chirag"],
    topics: {
      study: ["Padhai? Syllabus dekha? 'Unit 5' ka naam bhi sunke dar lagta hai.", "Padhne baitha hoon, bas pehle desk saaf, phir playlist, phir motivation. 3 ghante.", "Last night padhna aur 'all the best' ek hi tradition hai IGDTU mein."],
      late: ["Late? Attendance 75% chahiye, tu 7.5% pe chal raha hai bhai.", "Late aa gaya? Sir ne kaha 'gate pe hi ruk jao' — par chai ke liye rukna padta hai na.", "Lecture ke baad aa, hum ne tera 'present sir' bol diya. Interest ke saath."],
      food: ["Canteen chalen? Maggi aur samosa, phir assignment 'next semester'.", "Bhookh lagi? Padhai se zyada productivity canteen mein hoti hai.", "Canteen wala bhaiya sabka CGPA jaanta hai — extra chutney deta hai topper ko."],
      sleep: ["Neend? 8 baje ki class ka matlab hai 8 baje ki neend, class ki nahi.", "Soya nahi? Project submission ke baad soyenge, ya convocation pe.", "Back-bench pe neend 'power nap' kehlaati hai, front-bench pe 'discipline issue'."],
      tech: ["Wifi nahi hai? Library ki bench pe 1 bar milta hai, par line lagti hai.", "Laptop hang ho gaya? Task manager kholne se pehle dua padh le.", "Code compile nahi hua? 'Works on my machine' ek valid defence hai."],
      default: ["'{x}'? Classic IGDTU moment. Kaun si class mein hua ye?", "'{x}' — group mein daal, 15 log 'same' reply karenge.", "'{x}' sunke ek ne notes nikaale, doosre ne photo maangi."]
    },
    random: [
      ["Aaj class bunk karun?", "Pehle attendance check kar. IGDTU mein courage se zyada percentage kaam aata hai.", "Percentage? Wo toh sirf placement ke baad pata chalega.", "Tab tak canteen mein udhaar chal raha hai."],
      ["Group project ka kaam kisne kiya?", "Sabne contribute kiya — ek ne code, ek ne PPT, baaki ne 'great work team' likha.", "Aur submit kisne kiya?", "Jisko night 3 baje pata chala ki deadline aaj hai."],
      ["Kal pakka padhunga!", "Kal ka matlab? Is week wala ya next semester wala?", "Jo 'kal' kabhi nahi aata wala.", "Wahi toh sabse popular kal hai bhai."]
    ]
  },
  {
    id: "sibling", emoji: "🥊", name: "Sibling Fight", color: "#18b890",
    desc: "Remote, snacks, charger aur 'Mummy ne pehle bola tha'",
    tagline: "Remote kiske haath mein? Fight shuru! 🥊",
    chips: ["Bhai ne mera charger le liya", "Last chips ka packet kisne khaya?", "Remote ke liye ladai ho gayi"],
    chars: ["bhai", "behen", "mummy", "papa", "dadi", "monty"],
    topics: {
      study: ["Padhai? Mummy ko bata dun ki tu aaj bhi 'padh' raha hai? Dekh ke bol raha hoon.", "Padhai kar rahi hai? Toh meri chips kisne khayi, ye bhi bata.", "Padhai ka sirf naam hai, remote ke liye ladna asli subject hai."],
      late: ["Late? Mummy ko bol dun? Deal: meri charger mujhe de.", "Late aaya? Gate pe Papa baithe the, ab mera hissa daba le.", "Late hone ka reason bata, meri wali excuse use mat karna."],
      food: ["Ye chips meri hain! Maine kal hi 'mine' ka label lagaya tha.", "Sabse bada wala samosa maine pehle dekha tha, 'pehle aao pehle paao' rule hai.", "Mummy ne kaha tha dono ko barabar dena — dekh, tere hisse mein ek zyada hai!"],
      sleep: ["Soja! Light band kar warna Mummy aayegi aur dono ko sunayegi.", "Neend nahi aa rahi? Meri neend toh tune hi udayi hai.", "Mera room hai ye, AC ka remote meri taraf hai. Subah baat karte hain."],
      tech: ["Charger mera hai! Tera wala toh 3 din se gum hai.", "Remote ab meri baari hai, ye match nahi, ye 'baby shark' hai? Rakh!", "Wifi slow hai kyunki tu YouTube chala raha hai, 100% pakka."],
      default: ["'{x}'? Mummyyy! Dekho ye kya bol raha hai!", "'{x}' — Mummy ne pehle mujhe bola tha, tu baad mein aaya.", "'{x}'? Chal fir, jo jeetega usko remote. Ek, do, teen!"]
    },
    random: [
      ["Mummy! Isne mera charger le liya!", "Maine nahi, wo toh khud mere paas aa gaya.", "Charger ke paer nahi hote!", "Jab Wi-Fi ke ho sakte hain toh charger ke bhi."],
      ["Remote mera hai, main ab show dekh raha hoon.", "Mummy ne kaha tha baari baari se!", "Baari tab aayegi jab ad break hoga.", "Ad break mein toh main remote chheen loon?"],
      ["Aaj ka pizza ka last slice kiska?", "Mera! Maine boli thi 'dibs' kal.", "Dibs sirf 24 ghante valid hota hai.", "Mummyyy!!! Terms and conditions!"]
    ]
  },
  {
    id: "exam", emoji: "📝", name: "Exam Panic", color: "#f5b324",
    desc: "Ek padhta hai, doosra har 2 minute mein distraction bhejta hai",
    tagline: "Syllabus 100%, time 2% — panic mode on 📝",
    chips: ["Kal exam hai aur kuch nahi aata", "Padhne baitha hoon, disturb mat karo", "Chapter 5 mein kya aayega?"],
    chars: ["pari", "dhruv", "lakshya", "neel", "pooja", "chetan"],
    topics: {
      study: ["Chal padhte hain! Bas pehle ye ek meme dekh le, 2 second ka hai.", "Syllabus kitna bacha? 'Sabka sab' ek valid answer hai?", "Padh raha hoon! (Phone pe 40 minute se reels chal rahi hain.)"],
      late: ["Paper ka time ho gaya? Mere ghadi mein toh abhi 2 ghante hain.", "Late pahuncha toh kya, pehle 10 minute toh question hi samajh nahi aate.", "Admit card mila? Nahi? Phir toh main bhi nahi dhoondh paya."],
      food: ["Brain ko glucose chahiye. Maggi ek valid study material hai.", "Padhai ke beech mein chai pee ke aata hoon — 45 minute ka break.", "Exam ke pehle bhookh lagti hai, exam ke baad neend. Ye cycle hai."],
      sleep: ["Sirf ek ghanta soya toh bhi 'efficient' hai, mera dimaag 90% pe chal raha hai.", "Raat ko 3 baje saari cheezein samajh aati hain. Subah 6 baje sab bhool jaate hain.", "Neend aa rahi hai? Ek aur chai, ek aur chapter, ek aur regret."],
      tech: ["Notes ka PDF 'download hone wala hai', bas network aa jaye.", "Phone silent pe kar diya! (Par ab Instagram dekhna 'research' hai.)", "Laptop ki battery 5%, aur PDF 400 pages. Perfect time."],
      default: ["'{x}' sunke ek ne highlighter nikala, doosre ne meme bheja, teesre ne dua ki.", "'{x}'? Ye toh syllabus mein tha hi nahi... shayad.", "'{x}' — 2 minute ka distraction, 2 ghante ka regret. Deal?"]
    },
    random: [
      ["Padh raha hoon, disturb mat karna.", "Ye dekh, nayi reel! 2 minute ka hai.", "Main padh raha hoon!", "Bas ek, phir band. Pakka. Promise. (Reel #14.)"],
      ["Kal exam hai, kuch bhi nahi aata.", "Chinta mat kar, mujhe bhi nahi aata, ab hum dono saath fail honge.", "Ye toh motivation nahi hai!", "Sach hai, par saath mein dukh baant leta hai."],
      ["Chapter 5 se kitne marks aayenge?", "Chapter 5? Wo toh hum bhool gaye the.", "Aur Chapter 6?", "Chapter 6 ke baare mein mujhe aaj hi pata chala."]
    ]
  },
  {
    id: "group", emoji: "👥", name: "Group Project", color: "#2f8cff",
    desc: "Ek kaam kare, ek 'kal pakka' bole, ek sirf group ka naam suggest kare",
    tagline: "Kaam kiska? 'Kal pakka'! 👥",
    chips: ["Group ka naam kya rakhein?", "Presentation kitni bachi?", "Meri part kaun karega?"],
    chars: ["kabir", "kunal", "nisha", "lavish", "gauri", "parth"],
    topics: {
      study: ["Padhai nahi, project! Ek ne code likha, ek ne 'kal pakka' bola, ek ne naam socha.", "Presentation ban gayi? Haan, title slide ban gayi. Aage 'working on it'.", "Report likhni hai? Pehle formatting karte hain, content last mein aa jayega."],
      late: ["Meeting 5 baje thi, ab 7 baj gaye. 'Bas 5 minute' abhi bhi chal raha hai.", "Late kyun? Ek bola 'kal pakka', doosre ne kaha 'wahi toh kal bhi bola tha'.", "Deadline aaj hai? Group chat mein ab 'oh no' aur 'ok' ki baarish hogi."],
      food: ["Meeting ke baad treat pakki. Par pehle koi kaam toh karo.", "Kaam kam, snacks zyada — ye hamare group ki 'efficiency' hai.", "Bill kaun dega? Group ke naam pe poll bana dete hain."],
      sleep: ["Raat 2 baje ek ka commit aaya: 'final_final_v3_real.pptx'.", "Soya kya? Haan, 'kal pakka' ke baad neend ki zaroorat hoti hai.", "Raat 3 baje group naam suggest hua: 'Team Pixel Warriors?'. Kaam? Wo kal."],
      tech: ["GitHub pe push? Bola wo 'zip' bhej dega, kal.", "Code nahi chala? 'Merge conflict.' 'Mera aisa kuch nahi tha.'", "Google Docs pe 4 log, par sirf 1 cursor chal raha hai."],
      default: ["'{x}'? Ek ne kaha 'isse group ka naam banate hain'. Doosre ne kaha 'please code kar lo'.", "'{x}' pe jawab aaya: 'Kal pakka kar dunga.' Aur sab hans pade.", "'{x}' — ek ne code kiya, ek ne naam socha, baaki ne 'great work team' likha."]
    },
    random: [
      ["Group ke liye koi naam suggest karo.", "Team Alpha Pixel Quantum Warriors 2.0?", "Kaam kiya kisi ne?", "Kal pakka. Aaj naam pe focus."],
      ["Presentation kitni bachi?", "Slide 1 ready hai. Baaki sab 'coming soon'.", "Kal submission hai!", "Toh abhi se nahi, raat 11 baje se pakka."],
      ["Mera part kaun karega?", "Tera part? Tera naam toh humne title slide pe likh diya.", "Aur kaam?", "Naam likhna bhi toh kaam hai, bhai."]
    ]
  }
];

window.TOPIC_RULES = [
  ["study", /padh|study|exam|paper|syllabus|notes|test|result|marks|revis|assignment/i],
  ["late", /late|der\b|deadline|time|miss|bunk|class|attendance|meeting/i],
  ["food", /khana|bhook|bhuk|food|pizza|maggi|samosa|chai|canteen|hungry|chips|snack|biryani/i],
  ["sleep", /neend|sleep|soya|sona|so jao|raat|night|thak|tired|alarm|subah/i],
  ["tech", /wifi|phone|laptop|charger|battery|net\b|code|bug|internet|remote|reel|insta|app|game/i]
];

// ---- Brainrot extras: slang, meter, roast battle, bonus round, reactions ----
window.EX = {
  SLANG: {
    pre: ["Bro is cooked, ", "No cap, ", "Sigma alert: ", "Aura check: ", "Lowkey ", "Ohio moment: ", "Fr fr, "],
    suf: ["💀", "fr fr", "(sigma move)", "— skibidi level", "no cap", "— aura +1000", "ohio vibes", "🗿", "(delulu is the solulu)"]
  },
  KEYWORDS: /sigma|skibidi|rizz|ohio|aura|cooked|gyatt|mewing|delulu|npc|bruh|\bbro\b|reel|insta|3 ?am|doom|scroll|brainrot|\brot\b|6-?7|fanum|no cap|fr fr|vibe|meme|chaos|late|neend|exam|deadline|bore|lazy|pizza|biryani/gi,
  RANKS: [[20, "Normie Starter Pack 🧊"], [40, "NPC Energy 🤖"], [60, "Delulu Defender 🦄"], [80, "Sigma Gobar 🗿"], [95, "Ohio Final Boss 👽"], [101, "Terminally Cooked 💀🔥"]],
  ROAST_SEEDS: ["Main toh bohot cool hoon", "Mera aura sabse zyada hai", "Main kabhi late nahi hota"],
  ROASTS: [
    "'{x}'? Bhai tera aura WiFi se bhi weak hai.",
    "'{x}' sunke NPCs ne bhi dialogue skip kar diya.",
    "Itna confidence? Tera rizz toh 404 not found hai.",
    "'{x}' — ye line sirf Ohio mein chalti hai.",
    "Tere reels ko 3 views milte hain, 2 tere khud ke.",
    "'{x}'? Tere jokes pe laugh track bhi leave maang raha hai.",
    "Bro, tera sigma mode 'low power mode' pe hai.",
    "'{x}' bolke tune apna aura -500 kar liya, congrats."
  ],
  VERDICTS: [
    "Verdict: Tum cooked ho. Aura -500. Ab ghar jao. 💀",
    "Judge ka faisla: roast 10/10, comeback 0/10. 🗿",
    "Final score: Characters 1, Tum 0. Rematch kal 6-7 baje.",
    "Aura transferred to the roaster. Tum NPC mode mein ho. 🤖"
  ],
  CHOICES: {
    roast: { label: "🔥 Roast karo", lines: ["Chup kar, tere aura se toh meri battery zyada bachti hai.", "Tere jokes pe laugh track bhi leave maang raha hai.", "Itna drama? Netflix tujhe season 2 ke liye call karega."] },
    chill: { label: "😎 Chill reply", lines: ["Sab theek hai, chai pite hain, drama kal.", "Main toh bas vibes pe chal raha hoon, no cap.", "Peace out, aura sab sambhal lega."] },
    chaos: { label: "🌀 Full chaos", lines: ["SKIBIDI TOILET MEIN SAB EK SAATH JAA RAHE HAIN!!", "Aaj se main Ohio ka CEO hoon, sab mujhe sir bolo.", "Maine abhi 6-7 sochkar poori duniya hila di."] }
  },
  REPLIES: {
    roast: ["Ooh, ye toh seedha dil pe laga. 💀", "Roast accepted, aura transfer in progress.", "Isne toh poori duniya jala di!"],
    chill: ["Hmm, sigma energy detected. 😎", "Chai pe agli baat. Deal.", "Shant mann, tez dimaag. Respect."],
    chaos: ["Haww! Isko kya ho gaya?!", "Brainrot level: terminal. Doctor ko bulao!", "Sab cooked hain, ab koi nahi bachega. 🌀"]
  },
  REACTS: ["Mat chhoo mujhe! 😤", "Aura -50 kar diya tune 💀", "Bhai tu kaun? 🗿", "Sigma moment 😎", "Ek minute, loading… 🌀", "Ohio se aaya hai kya? 👽", "Haww! Kya bola?!", "Nahi nahi nahi nahi 😭"],
  NEWS: ["Colony mein 'kal pakka' ka naya record", "Samosa ki supply khatam, janta pareshaan", "Aura market mein bhaari giravat", "Scientists: 'Kal se padhunga' ek valid unit of time hai", "Group project mein sirf ek insaan ne kaam kiya, doctors hairaan"],
  AURA: [1000, 500, 500, 250, 100, -100, -250, -500, -500]
};
