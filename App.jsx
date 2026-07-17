import { useState, useEffect, useMemo } from "react";
import { Leaf, TreePine, Users, Megaphone, MapPin, Menu, X, Lock, Plus, Trash2, Pencil, ArrowLeft, Instagram, Facebook, Eye, Loader2 } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const LOGO_URI = "/logo.png";

const LANG = {
  hi: {
    siteName: "जस्ट थिंक इट", tagline: "प्रकृति की आवाज़, लोगों की आवाज़",
    home: "मुखपृष्ठ", about: "परिचय", admin: "एडमिन", allCategories: "सभी", gallery: "फ़ोटो गैलरी",
    readMore: "पूरा पढ़ें", back: "वापस", published: "प्रकाशित",
    followUs: "हमें फॉलो करें", latestFromSocial: "सोशल मीडिया से ताज़ा",
    viewOnInstagram: "इंस्टाग्राम पर देखें", noArticles: "अभी कोई खबर नहीं है।", noPhotos: "अभी कोई फ़ोटो नहीं है।",
    adminLogin: "एडमिन लॉगिन", password: "पासवर्ड", login: "लॉगिन", wrongPassword: "गलत पासवर्ड",
    dashboard: "डैशबोर्ड", addArticle: "नई खबर जोड़ें", editArticle: "खबर संपादित करें",
    titleHi: "शीर्षक (हिंदी)", titleMr: "शीर्षक (मराठी)", bodyHi: "विवरण (हिंदी)", bodyMr: "विवरण (मराठी)",
    category: "श्रेणी", imageUrl: "फ़ोटो URL", save: "सहेजें", cancel: "रद्द करें", logout: "लॉगआउट",
    manageArticles: "सभी खबरें", edit: "संपादित करें", delete: "हटाएं", confirmDelete: "क्या आप वाकई इसे हटाना चाहते हैं?",
    saving: "सहेजा जा रहा है...", loading: "लोड हो रहा है...", empty: "कोई फ़ील्ड खाली न छोड़ें",
    aboutTitle: "गडचिरोली — बेहतर कल के लिए", aboutBody: "जस्ट थिंक इट पर्यावरण, जलवायु और समाज से जुड़ी सच्ची खबरें गडचिरोली से आप तक लाता है। सोचो • करो • प्रेरित करो।",
    managePhotos: "सभी फ़ोटो", addPhoto: "नई फ़ोटो जोड़ें", captionHi: "कैप्शन (हिंदी)", captionMr: "कैप्शन (मराठी)", morePhotos: "इस खबर से जुड़ी और तस्वीरें", articleImages: "अतिरिक्त फ़ोटो (URL, हर एक नई लाइन में)",
    regionGadchiroli: "गडचिरोली", regionMaharashtra: "महाराष्ट्र", regionDesh: "देश", region: "क्षेत्र",
  },
  mr: {
    siteName: "जस्ट थिंक इट", tagline: "निसर्गाचा आवाज, लोकांचा आवाज",
    home: "मुखपृष्ठ", about: "ओळख", admin: "अ‍ॅडमिन", allCategories: "सर्व", gallery: "फोटो गॅलरी",
    readMore: "पूर्ण वाचा", back: "मागे", published: "प्रकाशित",
    followUs: "आम्हाला फॉलो करा", latestFromSocial: "सोशल मीडियावरून ताजे",
    viewOnInstagram: "इंस्टाग्रामवर पहा", noArticles: "सध्या कोणतीही बातमी नाही.", noPhotos: "सध्या कोणताही फोटो नाही.",
    adminLogin: "अ‍ॅडमिन लॉगिन", password: "पासवर्ड", login: "लॉगिन", wrongPassword: "चुकीचा पासवर्ड",
    dashboard: "डॅशबोर्ड", addArticle: "नवीन बातमी जोडा", editArticle: "बातमी संपादित करा",
    titleHi: "शीर्षक (हिंदी)", titleMr: "शीर्षक (मराठी)", bodyHi: "तपशील (हिंदी)", bodyMr: "तपशील (मराठी)",
    category: "विभाग", imageUrl: "फोटो URL", save: "जतन करा", cancel: "रद्द करा", logout: "लॉगआउट",
    manageArticles: "सर्व बातम्या", edit: "संपादित करा", delete: "काढून टाका", confirmDelete: "तुम्हाला खात्री आहे का?",
    saving: "जतन होत आहे...", loading: "लोड होत आहे...", empty: "कोणतेही क्षेत्र रिकामे ठेवू नका",
    aboutTitle: "गडचिरोली — उद्याच्या भल्यासाठी", aboutBody: "जस्ट थिंक इट पर्यावरण, हवामान आणि समाजाशी संबंधित खऱ्या बातम्या गडचिरोलीहून तुमच्यापर्यंत आणते. विचार करा • कृती करा • प्रेरित करा.",
    managePhotos: "सर्व फोटो", addPhoto: "नवीन फोटो जोडा", captionHi: "कॅप्शन (हिंदी)", captionMr: "कॅप्शन (मराठी)", morePhotos: "या बातमीशी संबंधित आणखी फोटो", articleImages: "अतिरिक्त फोटो (URL, प्रत्येक नवीन ओळीत)",
    regionGadchiroli: "गडचिरोली", regionMaharashtra: "महाराष्ट्र", regionDesh: "देश", region: "प्रदेश",
  },
};

const CATEGORIES = [
  { id: "environment", hi: "पर्यावरण", mr: "पर्यावरण", icon: TreePine, color: "#1B7A43", bg: "#E3F5EA", grad: "from-[#1B7A43] to-[#5CB85C]" },
  { id: "climate", hi: "जलवायु", mr: "हवामान", icon: Leaf, color: "#0E7C9E", bg: "#E1F3FA", grad: "from-[#0E7C9E] to-[#4FC3E8]" },
  { id: "society", hi: "समाज", mr: "समाज", icon: Users, color: "#C6461E", bg: "#FCE9E1", grad: "from-[#C6461E] to-[#F08A4B]" },
  { id: "awareness", hi: "जागरूकता", mr: "जागृती", icon: Megaphone, color: "#8E2A8E", bg: "#F5E4F5", grad: "from-[#8E2A8E] to-[#D45FD4]" },
];

const REGIONS = [
  { id: "gadchiroli", labelKey: "regionGadchiroli", color: "#1B7A43" },
  { id: "maharashtra", labelKey: "regionMaharashtra", color: "#0E7C9E" },
  { id: "desh", labelKey: "regionDesh", color: "#C6461E" },
];

const SEED_ARTICLES = [
  {
    id: "a1", category: "environment", region: "gadchiroli", date: "2026-07-10",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&q=80",
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&q=80",
    ],
    title: { hi: "वैनगंगा नदी में औद्योगिक प्रदूषण बढ़ा, ग्रामीण चिंतित", mr: "वैनगंगा नदीत औद्योगिक प्रदूषण वाढले, ग्रामस्थ चिंतेत" },
    excerpt: { hi: "स्थानीय कारखानों से निकलने वाला अपशिष्ट नदी के जल स्तर को प्रभावित कर रहा है।", mr: "स्थानिक कारखान्यांमधून येणारा सांडपाणी नदीच्या पाण्याच्या पातळीवर परिणाम करत आहे." },
    body: {
      hi: "गडचिरोली जिले में वैनगंगा नदी के किनारे बसे गांवों के लोगों ने पिछले कुछ महीनों में पानी के रंग और गंध में बदलाव देखा है। स्थानीय मछुआरों का कहना है कि मछलियों की संख्या में भारी गिरावट आई है। ग्रामीणों ने प्रशासन से जांच की मांग की है और आने वाले दिनों में शांतिपूर्ण प्रदर्शन की योजना बनाई है। पर्यावरण कार्यकर्ताओं ने भी इस मुद्दे को उठाया है और सरकार से तुरंत कार्रवाई की अपील की है।",
      mr: "गडचिरोली जिल्ह्यातील वैनगंगा नदीकाठच्या गावांतील लोकांनी गेल्या काही महिन्यांत पाण्याचा रंग आणि वास बदलल्याचे लक्षात आणले आहे. स्थानिक मच्छिमारांच्या मते माशांची संख्या मोठ्या प्रमाणात घटली आहे. ग्रामस्थांनी प्रशासनाकडे चौकशीची मागणी केली असून येत्या काळात शांततापूर्ण आंदोलनाचे नियोजन केले आहे. पर्यावरण कार्यकर्त्यांनीही हा मुद्दा उपस्थित केला असून सरकारकडे तातडीने कारवाईची विनंती केली आहे.",
    },
  },
  {
    id: "a2", category: "society", region: "gadchiroli", date: "2026-07-05",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=80",
      "https://images.unsplash.com/photo-1461783436728-0a9217714694?w=900&q=80",
    ],
    title: { hi: "कमलापूर के 14 गांवों का MIDC प्रस्ताव के खिलाफ आंदोलन", mr: "कमलापूरच्या १४ गावांचे MIDC प्रस्तावाविरोधात आंदोलन" },
    excerpt: { hi: "गांववालों ने ऐलान किया है कि जब तक प्रस्ताव रद्द नहीं होता, बच्चों को स्कूल नहीं भेजेंगे।", mr: "प्रस्ताव रद्द होईपर्यंत मुलांना शाळेत पाठवणार नाही, असा ग्रामस्थांचा निर्धार." },
    body: {
      hi: "गडचिरोली क्षेत्र के 14 गांवों के निवासियों ने प्रस्तावित MIDC औद्योगिक क्षेत्र का पुरजोर विरोध किया है। ग्रामसभा की बैठक में सर्वसम्मति से निर्णय लिया गया कि जब तक यह प्रस्ताव पूरी तरह रद्द नहीं होता, तब तक बच्चों को स्कूल नहीं भेजा जाएगा। ग्रामीणों का कहना है कि इस परियोजना से उनकी खेती की ज़मीन और जंगल प्रभावित होंगे, जिससे उनकी आजीविका पर सीधा असर पड़ेगा।",
      mr: "गडचिरोली परिसरातील १४ गावांतील रहिवाशांनी प्रस्तावित MIDC औद्योगिक क्षेत्राला तीव्र विरोध दर्शवला आहे. ग्रामसभेच्या बैठकीत सर्वानुमते निर्णय घेण्यात आला की जोपर्यंत हा प्रस्ताव पूर्णपणे रद्द होत नाही, तोपर्यंत मुलांना शाळेत पाठवले जाणार नाही. या प्रकल्पामुळे शेतजमीन आणि जंगलावर परिणाम होऊन उपजीविकेवर थेट परिणाम होईल, असे ग्रामस्थांचे म्हणणे आहे.",
    },
  },
  {
    id: "a3", category: "climate", region: "gadchiroli", date: "2026-06-28",
    image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80",
    ],
    title: { hi: "अनियमित मानसून से गडचिरोली के किसान परेशान", mr: "अनियमित पावसामुळे गडचिरोलीतील शेतकरी हैराण" },
    excerpt: { hi: "समय पर बारिश न होने से धान की बुवाई पर असर, कृषि विशेषज्ञों ने दी सलाह।", mr: "वेळेवर पाऊस न पडल्याने भात लागवडीवर परिणाम, कृषी तज्ज्ञांचा सल्ला." },
    body: {
      hi: "इस वर्ष मानसून के अनियमित पैटर्न ने गडचिरोली के धान किसानों की चिंता बढ़ा दी है। कई इलाकों में बुवाई एक महीने तक टलनी पड़ी। कृषि विभाग ने किसानों को कम अवधि की धान किस्मों की सिफारिश की है और जल संरक्षण के उपाय अपनाने की सलाह दी है।",
      mr: "यंदा पावसाच्या अनियमित पॅटर्नमुळे गडचिरोलीतील भात शेतकऱ्यांची चिंता वाढली आहे. अनेक भागांत लागवड महिनाभर लांबणीवर टाकावी लागली. कृषी विभागाने शेतकऱ्यांना कमी कालावधीच्या भात जातींची शिफारस केली असून जलसंधारणाचे उपाय अवलंबण्याचा सल्ला दिला आहे.",
    },
  },
  {
    id: "a4", category: "environment", region: "maharashtra", date: "2026-07-08",
    image: "https://images.unsplash.com/photo-1580130379624-3a069adbfbb6?w=1200&q=80",
    gallery: [],
    title: { hi: "महाराष्ट्र सरकार की नई वन नीति को मंज़ूरी", mr: "महाराष्ट्र सरकारच्या नवीन वन धोरणाला मंजुरी" },
    excerpt: { hi: "राज्यभर में वृक्षारोपण और वनसंरक्षण के लिए नई योजना शुरू।", mr: "राज्यभर वृक्षारोपण आणि वनसंवर्धनासाठी नवीन योजना सुरू." },
    body: {
      hi: "महाराष्ट्र सरकार ने राज्यभर में वन क्षेत्र बढ़ाने के लिए एक नई नीति को मंज़ूरी दी है। इस योजना के तहत अगले पांच वर्षों में करोड़ों पौधे लगाए जाएंगे, विशेष रूप से विदर्भ और कोंकण क्षेत्र में। पर्यावरण मंत्री ने कहा कि स्थानीय समुदायों को इस अभियान में शामिल किया जाएगा और वन विभाग स्थानीय ग्रामसभाओं के साथ मिलकर काम करेगा।",
      mr: "महाराष्ट्र सरकारने राज्यभर वनक्षेत्र वाढवण्यासाठी नवीन धोरणाला मंजुरी दिली आहे. या योजनेअंतर्गत पुढील पाच वर्षांत कोट्यवधी रोपे लावली जाणार आहेत, विशेषतः विदर्भ आणि कोकण भागात. स्थानिक समुदायांना या मोहिमेत सामील करून घेतले जाईल आणि वन विभाग स्थानिक ग्रामसभांसोबत मिळून काम करेल, असे पर्यावरण मंत्र्यांनी सांगितले.",
    },
  },
  {
    id: "a5", category: "climate", region: "desh", date: "2026-07-12",
    image: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=1200&q=80",
    gallery: [],
    title: { hi: "भारत में इस साल गर्मी ने तोड़े कई रिकॉर्ड", mr: "भारतात यंदा उन्हाळ्याने अनेक विक्रम मोडले" },
    excerpt: { hi: "मौसम विभाग ने आने वाले महीनों में और अधिक तापमान बढ़ने की चेतावनी दी है।", mr: "हवामान खात्याने पुढील महिन्यांत तापमान आणखी वाढण्याचा इशारा दिला आहे." },
    body: {
      hi: "भारत मौसम विज्ञान विभाग के अनुसार, इस वर्ष देश के कई हिस्सों में तापमान ने पिछले दशक के रिकॉर्ड तोड़ दिए हैं। विशेषज्ञों का कहना है कि जलवायु परिवर्तन के कारण गर्मी की लहरें अब पहले से अधिक बार और अधिक तीव्रता से आ रही हैं। सरकार ने राज्यों को हीटवेव एक्शन प्लान लागू करने के निर्देश दिए हैं।",
      mr: "भारतीय हवामान खात्याच्या मते, यंदा देशातील अनेक भागांत तापमानाने गेल्या दशकातील विक्रम मोडले आहेत. हवामान बदलामुळे उष्णतेच्या लाटा आता पूर्वीपेक्षा अधिक वेळा आणि अधिक तीव्रतेने येत आहेत, असे तज्ज्ञांचे म्हणणे आहे. सरकारने राज्यांना हीटवेव्ह अ‍ॅक्शन प्लॅन राबवण्याचे निर्देश दिले आहेत.",
    },
  },
];

const SEED_PHOTOS = [
  { id: "p1", image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=900&q=80", caption: { hi: "वैनगंगा नदी किनारे सुबह का दृश्य", mr: "वैनगंगा नदीकाठी सकाळचे दृश्य" } },
  { id: "p2", image: "https://images.unsplash.com/photo-1516214104703-d870798883c5?w=900&q=80", caption: { hi: "गडचिरोली के घने जंगल", mr: "गडचिरोलीतील घनदाट जंगल" } },
  { id: "p3", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=80", caption: { hi: "ग्रामसभा की बैठक", mr: "ग्रामसभेची बैठक" } },
  { id: "p4", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&q=80", caption: { hi: "स्थानीय आदिवासी जीवनशैली", mr: "स्थानिक आदिवासी जीवनशैली" } },
  { id: "p5", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=80", caption: { hi: "आंदोलन में एकत्र ग्रामीण", mr: "आंदोलनात एकवटलेले ग्रामस्थ" } },
  { id: "p6", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80", caption: { hi: "हरियाली से भरा गडचिरोली", mr: "हिरवाईने नटलेले गडचिरोली" } },
];

const SEED_SOCIAL = [
  { id: "s1", platform: "instagram", views: "65.7K", caption: { hi: "प्रदूषण पर एक मार्मिक एनिमेटेड कहानी", mr: "प्रदूषणावर एक हृदयस्पर्शी अ‍ॅनिमेटेड कथा" }, link: "https://instagram.com/justhinkk_it" },
  { id: "s2", platform: "instagram", views: "45.1K", caption: { hi: "कमलापूर आंदोलन का ग्राउंड रिपोर्ट", mr: "कमलापूर आंदोलनाचा ग्राउंड रिपोर्ट" }, link: "https://instagram.com/justhinkk_it" },
];

const ADMIN_PASSWORD = "gadchiroli2026";

function useLang() {
  const [lang, setLang] = useState("hi");
  return [lang, setLang, LANG[lang]];
}

function LeafDivider() {
  return (
    <div className="flex items-center gap-3 my-1" aria-hidden="true">
      <div className="h-0.5 flex-1 rainbow-bar opacity-30 rounded-full" />
      <Leaf size={16} className="text-[#1B7A43]" />
      <div className="h-0.5 flex-1 rainbow-bar opacity-30 rounded-full" />
    </div>
  );
}

function CategoryBadge({ cat, lang }) {
  const c = CATEGORIES.find((x) => x.id === cat);
  if (!c) return null;
  const Icon = c.icon;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold tracking-wide px-2.5 py-1 rounded-full"
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      <Icon size={12} />
      {c[lang]}
    </span>
  );
}

function RegionBadge({ region, t }) {
  const r = REGIONS.find((x) => x.id === (region || "gadchiroli"));
  if (!r) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: r.color }}>
      <MapPin size={9} />
      {t[r.labelKey]}
    </span>
  );
}

export default function App() {
  const [lang, setLang, t] = useLang();
  const [view, setView] = useState("home"); // home | article | about | admin
  const [activeId, setActiveId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeRegion, setActiveRegion] = useState("gadchiroli");
  const [menuOpen, setMenuOpen] = useState(false);

  const [articles, setArticles] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [editing, setEditing] = useState(null); // article being edited, or "new"
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [photoEditing, setPhotoEditing] = useState(null);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [adminTab, setAdminTab] = useState("articles");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "site", "articles"));
        if (mounted && snap.exists() && snap.data().items) {
          setArticles(snap.data().items);
        } else if (mounted) {
          setArticles(SEED_ARTICLES);
          await setDoc(doc(db, "site", "articles"), { items: SEED_ARTICLES });
        }
      } catch {
        if (mounted) setArticles(SEED_ARTICLES);
      }
      try {
        const snap2 = await getDoc(doc(db, "site", "photos"));
        if (mounted && snap2.exists() && snap2.data().items) {
          setPhotos(snap2.data().items);
        } else if (mounted) {
          setPhotos(SEED_PHOTOS);
          await setDoc(doc(db, "site", "photos"), { items: SEED_PHOTOS });
        }
      } catch {
        if (mounted) setPhotos(SEED_PHOTOS);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const persistPhotos = async (next) => {
    setPhotos(next);
    try {
      await setDoc(doc(db, "site", "photos"), { items: next });
    } catch {
      // best-effort; UI already updated optimistically
    }
  };

  const persistArticles = async (next) => {
    setArticles(next);
    try {
      await setDoc(doc(db, "site", "articles"), { items: next });
    } catch {
      // best-effort; UI already updated optimistically
    }
  };

  const filtered = useMemo(() => {
    const sorted = [...articles].sort((a, b) => (a.date < b.date ? 1 : -1));
    const byRegion = sorted.filter((a) => (a.region || "gadchiroli") === activeRegion);
    if (activeCategory === "all") return byRegion;
    return byRegion.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory, activeRegion]);

  const hero = filtered[0];
  const rest = filtered.slice(1);
  const activeArticle = articles.find((a) => a.id === activeId);

  const goHome = () => { setView("home"); setMenuOpen(false); };
  const openArticle = (id) => { setActiveId(id); setView("article"); window.scrollTo(0, 0); };

  const handleLogin = () => {
    if (pwInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setPwError(false);
      setView("admin");
    } else {
      setPwError(true);
    }
  };

  const startNew = () => {
    setFormError("");
    setEditing({
      id: "new",
      category: "environment",
      region: "gadchiroli",
      date: new Date().toISOString().slice(0, 10),
      image: "",
      gallery: [],
      title: { hi: "", mr: "" },
      excerpt: { hi: "", mr: "" },
      body: { hi: "", mr: "" },
    });
  };

  const startEdit = (a) => { setFormError(""); setEditing(JSON.parse(JSON.stringify(a))); };

  const saveArticle = async () => {
    if (!editing.title.hi || !editing.title.mr || !editing.body.hi || !editing.body.mr) {
      setFormError(t.empty);
      return;
    }
    setSaving(true);
    const record = { ...editing, excerpt: { hi: editing.excerpt.hi || editing.body.hi.slice(0, 90), mr: editing.excerpt.mr || editing.body.mr.slice(0, 90) } };
    let next;
    if (editing.id === "new") {
      record.id = "a" + Date.now();
      next = [record, ...articles];
    } else {
      next = articles.map((a) => (a.id === editing.id ? record : a));
    }
    await persistArticles(next);
    setSaving(false);
    setEditing(null);
  };

  const deleteArticle = async (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    await persistArticles(articles.filter((a) => a.id !== id));
  };

  const startNewPhoto = () => {
    setPhotoError("");
    setPhotoEditing({ id: "new", image: "", caption: { hi: "", mr: "" } });
  };

  const savePhoto = async () => {
    if (!photoEditing.image) {
      setPhotoError(t.empty);
      return;
    }
    setPhotoSaving(true);
    const record = { ...photoEditing };
    let next;
    if (photoEditing.id === "new") {
      record.id = "p" + Date.now();
      next = [record, ...photos];
    } else {
      next = photos.map((p) => (p.id === photoEditing.id ? record : p));
    }
    await persistPhotos(next);
    setPhotoSaving(false);
    setPhotoEditing(null);
  };

  const deletePhoto = async (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    await persistPhotos(photos.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen text-[#1A1A1A]" style={{ fontFamily: "'Noto Sans Devanagari','Inter',sans-serif", background: "linear-gradient(180deg,#FFF9EE 0%,#FBF3E4 400px,#F7F4EE 800px)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .display-font { font-family: 'Tiro Devanagari Hindi', serif; }
        .bark-texture { background: linear-gradient(120deg, rgba(27,122,67,0.12), rgba(14,124,158,0.10) 45%, rgba(232,163,61,0.14) 100%); }
        .rainbow-bar { background: linear-gradient(90deg,#1B7A43,#4FC3E8,#F08A4B,#D45FD4); }
      `}</style>

      <div className="h-1 rainbow-bar" />
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#F7F4EE]/95 backdrop-blur border-b border-[#1B4332]/15">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={goHome} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform shadow-md overflow-hidden bg-white ring-2 ring-[#1B7A43]/20">
              <img src={LOGO_URI} alt="Just Think It logo" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <div className="display-font text-lg leading-none font-bold" style={{ background: "linear-gradient(90deg,#1B7A43,#0E7C9E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.siteName}</div>
              <div className="text-[10px] text-[#C6461E] font-semibold tracking-wide">{t.tagline}</div>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={goHome} className={`text-sm font-medium ${view === "home" ? "text-[#1B4332]" : "text-[#1A1A1A]/60"} hover:text-[#1B4332]`}>{t.home}</button>
            <button onClick={() => setView("gallery")} className={`text-sm font-medium ${view === "gallery" ? "text-[#1B4332]" : "text-[#1A1A1A]/60"} hover:text-[#1B4332]`}>{t.gallery}</button>
            <button onClick={() => setView("about")} className={`text-sm font-medium ${view === "about" ? "text-[#1B4332]" : "text-[#1A1A1A]/60"} hover:text-[#1B4332]`}>{t.about}</button>
            <button onClick={() => setView(isAdmin ? "admin" : "login")} className={`text-sm font-medium flex items-center gap-1 ${view === "admin" || view === "login" ? "text-[#1B4332]" : "text-[#1A1A1A]/60"} hover:text-[#1B4332]`}>
              <Lock size={12} /> {t.admin}
            </button>
            <div className="flex rounded-full border-2 border-[#1B7A43]/30 overflow-hidden text-xs font-bold">
              <button onClick={() => setLang("hi")} className={`px-3 py-1.5 transition-colors ${lang === "hi" ? "text-white" : "text-[#1B7A43]"}`} style={lang === "hi" ? { background: "linear-gradient(90deg,#1B7A43,#0E7C9E)" } : {}}>HI</button>
              <button onClick={() => setLang("mr")} className={`px-3 py-1.5 transition-colors ${lang === "mr" ? "text-white" : "text-[#1B7A43]"}`} style={lang === "mr" ? { background: "linear-gradient(90deg,#1B7A43,#0E7C9E)" } : {}}>MR</button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <div className="flex rounded-full border-2 border-[#1B7A43]/30 overflow-hidden text-xs font-bold">
              <button onClick={() => setLang("hi")} className={`px-2.5 py-1 ${lang === "hi" ? "text-white" : "text-[#1B7A43]"}`} style={lang === "hi" ? { background: "linear-gradient(90deg,#1B7A43,#0E7C9E)" } : {}}>HI</button>
              <button onClick={() => setLang("mr")} className={`px-2.5 py-1 ${lang === "mr" ? "text-white" : "text-[#1B7A43]"}`} style={lang === "mr" ? { background: "linear-gradient(90deg,#1B7A43,#0E7C9E)" } : {}}>MR</button>
            </div>
            <button onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-[#1B4332]/15 px-4 py-3 flex flex-col gap-3 bg-[#F7F4EE]">
            <button onClick={goHome} className="text-left text-sm font-medium">{t.home}</button>
            <button onClick={() => { setView("gallery"); setMenuOpen(false); }} className="text-left text-sm font-medium">{t.gallery}</button>
            <button onClick={() => { setView("about"); setMenuOpen(false); }} className="text-left text-sm font-medium">{t.about}</button>
            <button onClick={() => { setView(isAdmin ? "admin" : "login"); setMenuOpen(false); }} className="text-left text-sm font-medium flex items-center gap-1"><Lock size={12} /> {t.admin}</button>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-[#52796F] gap-2">
            <Loader2 size={18} className="animate-spin" /> {t.loading}
          </div>
        ) : view === "home" ? (
          <>
            {/* Region tabs - Gadchiroli / Maharashtra / Desh */}
            <div className="flex gap-2 pt-6">
              {REGIONS.map((r) => {
                const isActive = activeRegion === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setActiveRegion(r.id)}
                    className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl transition-all"
                    style={isActive ? { backgroundColor: r.color, color: "white", boxShadow: `0 4px 14px ${r.color}55` } : { border: `2px solid ${r.color}30`, color: r.color, backgroundColor: "white" }}
                  >
                    {t[r.labelKey]}
                  </button>
                );
              })}
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 pt-4 pb-4">
              <button
                onClick={() => setActiveCategory("all")}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all"
                style={activeCategory === "all" ? { background: "linear-gradient(90deg,#1B7A43,#0E7C9E)", color: "white" } : { border: "2px solid #1B433230", color: "#1B4332" }}
              >
                {t.allCategories}
              </button>
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const isActive = activeCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all"
                    style={isActive ? { backgroundColor: c.color, color: "white", boxShadow: `0 3px 10px ${c.color}55` } : { border: `2px solid ${c.color}35`, color: c.color, backgroundColor: c.bg }}
                  >
                    <Icon size={12} /> {c[lang]}
                  </button>
                );
              })}
            </div>

            {filtered.length === 0 ? (
              <p className="text-sm text-[#1A1A1A]/60 py-16 text-center">{t.noArticles}</p>
            ) : (
              <>
                {/* Hero */}
                {hero && (
                  <button onClick={() => openArticle(hero.id)} className="block w-full text-left bark-texture rounded-2xl overflow-hidden border-2 border-[#1B7A43]/15 mb-8 group shadow-sm hover:shadow-xl transition-shadow">
                    <div className="grid md:grid-cols-2">
                      <div className="aspect-[16/10] md:aspect-auto overflow-hidden relative">
                        <img src={hero.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      </div>
                      <div className="p-6 flex flex-col justify-center gap-3">
                        <div className="flex items-center gap-2">
                          <CategoryBadge cat={hero.category} lang={lang} />
                          <RegionBadge region={hero.region} t={t} />
                        </div>
                        <h1 className="display-font text-2xl md:text-3xl font-bold leading-snug text-[#1B4332]">{hero.title[lang]}</h1>
                        <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">{hero.excerpt[lang]}</p>
                        <span className="text-xs font-bold mt-1" style={{ color: "#C6461E" }}>{t.readMore} →</span>
                      </div>
                    </div>
                  </button>
                )}

                <LeafDivider />

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                  {rest.map((a) => {
                    const cat = CATEGORIES.find((c) => c.id === a.category);
                    return (
                      <button key={a.id} onClick={() => openArticle(a.id)} className="text-left rounded-xl overflow-hidden border border-[#1B4332]/10 bg-white hover:shadow-xl hover:-translate-y-1 transition-all group">
                        <div className="h-1.5" style={{ backgroundColor: cat?.color || "#1B7A43" }} />
                        <div className="aspect-[16/10] overflow-hidden">
                          <img src={a.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <CategoryBadge cat={a.category} lang={lang} />
                            <RegionBadge region={a.region} t={t} />
                          </div>
                          <h3 className="display-font font-bold text-base leading-snug text-[#1B4332]">{a.title[lang]}</h3>
                          <p className="text-xs text-[#1A1A1A]/60 leading-relaxed line-clamp-2">{a.excerpt[lang]}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Social section */}
            <LeafDivider />
            <div className="mt-6">
              <h2 className="display-font text-xl font-bold mb-4" style={{ background: "linear-gradient(90deg,#C6461E,#8E2A8E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.latestFromSocial}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {SEED_SOCIAL.map((s, i) => (
                  <a key={s.id} href={s.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl border-2 border-[#1B4332]/8 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: i % 2 === 0 ? "linear-gradient(135deg,#F08A4B,#8E2A8E)" : "linear-gradient(135deg,#0E7C9E,#1B7A43)" }}>
                      <Instagram size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">{s.caption[lang]}</p>
                      <p className="text-xs text-[#1A1A1A]/50 flex items-center gap-1 mt-0.5"><Eye size={11} /> {s.views} · {t.viewOnInstagram}</p>
                    </div>
                  </a>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <a href="https://instagram.com/justhinkk_it" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full text-white" style={{ background: "linear-gradient(90deg,#F08A4B,#8E2A8E)" }}><Instagram size={13} /> justhinkk_it</a>
                <a href="#" className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full text-white" style={{ background: "linear-gradient(90deg,#0E7C9E,#1B7A43)" }}><Facebook size={13} /> Facebook</a>
              </div>
            </div>

            {/* Photo strip preview */}
            {photos.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="display-font text-xl font-bold" style={{ background: "linear-gradient(90deg,#8E2A8E,#C6461E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.gallery}</h2>
                  <button onClick={() => setView("gallery")} className="text-xs font-bold" style={{ color: "#8E2A8E" }}>{t.readMore} →</button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {photos.slice(0, 6).map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => setLightbox(p)}
                      className="aspect-square rounded-lg overflow-hidden border-2 group"
                      style={{ borderColor: ["#1B7A4330", "#0E7C9E30", "#C6461E30", "#8E2A8E30"][i % 4] }}
                    >
                      <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : view === "article" && activeArticle ? (
          <article className="pt-6 max-w-2xl mx-auto">
            <button onClick={goHome} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52796F] mb-4"><ArrowLeft size={14} /> {t.back}</button>
            <div className="flex items-center gap-2">
              <CategoryBadge cat={activeArticle.category} lang={lang} />
              <RegionBadge region={activeArticle.region} t={t} />
            </div>
            <h1 className="display-font text-2xl md:text-3xl font-bold leading-snug text-[#1B4332] mt-3">{activeArticle.title[lang]}</h1>
            <p className="text-xs text-[#1A1A1A]/45 mt-2 flex items-center gap-1"><MapPin size={11} /> Gadchiroli · {activeArticle.date}</p>
            <div className="rounded-xl overflow-hidden my-5 border border-[#1B4332]/10">
              <img src={activeArticle.image} alt="" className="w-full object-cover" />
            </div>
            <p className="text-[15px] leading-loose text-[#1A1A1A]/85 whitespace-pre-line">{activeArticle.body[lang]}</p>
            {activeArticle.gallery && activeArticle.gallery.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-bold mb-3" style={{ color: "#8E2A8E" }}>{t.morePhotos}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activeArticle.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox({ image: img, caption: { hi: activeArticle.title.hi, mr: activeArticle.title.mr } })}
                      className="aspect-[4/3] rounded-lg overflow-hidden border-2 group"
                      style={{ borderColor: ["#1B7A4330", "#0E7C9E30", "#C6461E30", "#8E2A8E30"][i % 4] }}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </article>
        ) : view === "gallery" ? (
          <div className="pt-6">
            <h1 className="display-font text-2xl font-bold mb-1" style={{ background: "linear-gradient(90deg,#8E2A8E,#C6461E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.gallery}</h1>
            <p className="text-xs text-[#1A1A1A]/50 mb-5 flex items-center gap-1"><MapPin size={11} /> Gadchiroli, Maharashtra</p>
            {photos.length === 0 ? (
              <p className="text-sm text-[#1A1A1A]/60 py-16 text-center">{t.noPhotos}</p>
            ) : (
              <div className="columns-2 sm:columns-3 gap-3 [column-fill:_balance]">
                {photos.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setLightbox(p)}
                    className="block w-full mb-3 rounded-xl overflow-hidden border-2 group relative break-inside-avoid"
                    style={{ borderColor: ["#1B7A4330", "#0E7C9E30", "#C6461E30", "#8E2A8E30"][i % 4] }}
                  >
                    <img src={p.image} alt="" className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-white text-xs font-medium text-left">{p.caption[lang]}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : view === "about" ? (
          <div className="pt-10 max-w-xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg overflow-hidden bg-white ring-4 ring-[#1B7A43]/15">
              <img src={LOGO_URI} alt="Just Think It logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="display-font text-2xl font-bold mb-3" style={{ background: "linear-gradient(90deg,#1B7A43,#0E7C9E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.aboutTitle}</h1>
            <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">{t.aboutBody}</p>
          </div>
        ) : view === "login" ? (
          <div className="pt-16 max-w-sm mx-auto">
            <h1 className="display-font text-xl font-bold text-[#1B4332] mb-5 flex items-center gap-2"><Lock size={18} /> {t.adminLogin}</h1>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder={t.password}
              className="w-full border border-[#1B4332]/25 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1B4332]/30"
            />
            {pwError && <p className="text-xs text-red-600 mt-2">{t.wrongPassword}</p>}
            <button onClick={handleLogin} className="mt-4 w-full text-white text-sm font-bold rounded-lg py-2.5 shadow-md" style={{ background: "linear-gradient(90deg,#1B7A43,#0E7C9E)" }}>{t.login}</button>
          </div>
        ) : view === "admin" && isAdmin ? (
          <div className="pt-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="display-font text-xl font-bold" style={{ background: "linear-gradient(90deg,#1B7A43,#0E7C9E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.dashboard}</h1>
              <button onClick={() => { setIsAdmin(false); goHome(); }} className="text-xs font-semibold text-[#1A1A1A]/50 hover:text-[#1A1A1A]">{t.logout}</button>
            </div>

            <div className="flex gap-2 mb-6">
              <button onClick={() => { setAdminTab("articles"); setPhotoEditing(null); }} className="text-xs font-bold px-3.5 py-1.5 rounded-full transition-all" style={adminTab === "articles" ? { background: "linear-gradient(90deg,#1B7A43,#0E7C9E)", color: "white" } : { border: "2px solid #1B433230", color: "#1B4332" }}>{t.manageArticles}</button>
              <button onClick={() => { setAdminTab("photos"); setEditing(null); }} className="text-xs font-bold px-3.5 py-1.5 rounded-full transition-all" style={adminTab === "photos" ? { background: "linear-gradient(90deg,#8E2A8E,#C6461E)", color: "white" } : { border: "2px solid #8E2A8E30", color: "#8E2A8E" }}>{t.managePhotos}</button>
            </div>

            {adminTab === "articles" && (editing ? (
              <div className="bg-white border border-[#1B4332]/15 rounded-xl p-5 max-w-xl">
                <h2 className="font-semibold text-[#1B4332] mb-4">{editing.id === "new" ? t.addArticle : t.editArticle}</h2>
                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input value={editing.title.hi} onChange={(e) => setEditing({ ...editing, title: { ...editing.title, hi: e.target.value } })} placeholder={t.titleHi} className="border border-[#1B4332]/20 rounded-lg px-3 py-2 text-sm" />
                    <input value={editing.title.mr} onChange={(e) => setEditing({ ...editing, title: { ...editing.title, mr: e.target.value } })} placeholder={t.titleMr} className="border border-[#1B4332]/20 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <textarea value={editing.body.hi} onChange={(e) => setEditing({ ...editing, body: { ...editing.body, hi: e.target.value } })} placeholder={t.bodyHi} rows={4} className="border border-[#1B4332]/20 rounded-lg px-3 py-2 text-sm" />
                  <textarea value={editing.body.mr} onChange={(e) => setEditing({ ...editing, body: { ...editing.body, mr: e.target.value } })} placeholder={t.bodyMr} rows={4} className="border border-[#1B4332]/20 rounded-lg px-3 py-2 text-sm" />
                  <div className="grid grid-cols-2 gap-3">
                    <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="border border-[#1B4332]/20 rounded-lg px-3 py-2 text-sm">
                      {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c[lang]}</option>)}
                    </select>
                    <select value={editing.region || "gadchiroli"} onChange={(e) => setEditing({ ...editing, region: e.target.value })} className="border border-[#1B4332]/20 rounded-lg px-3 py-2 text-sm">
                      {REGIONS.map((r) => <option key={r.id} value={r.id}>{t[r.labelKey]}</option>)}
                    </select>
                  </div>
                  <input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} className="border border-[#1B4332]/20 rounded-lg px-3 py-2 text-sm" />
                  <input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder={t.imageUrl} className="border border-[#1B4332]/20 rounded-lg px-3 py-2 text-sm" />
                  <textarea
                    value={(editing.gallery || []).join("\n")}
                    onChange={(e) => setEditing({ ...editing, gallery: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                    placeholder={t.articleImages}
                    rows={3}
                    className="border border-[#1B4332]/20 rounded-lg px-3 py-2 text-sm"
                  />
                  {editing.gallery && editing.gallery.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {editing.gallery.map((img, i) => (
                        <img key={i} src={img} alt="" className="w-16 h-16 rounded-md object-cover border border-[#1B4332]/15" />
                      ))}
                    </div>
                  )}
                  {formError && <p className="text-xs text-red-600">{formError}</p>}
                  <div className="flex gap-2 mt-1">
                    <button onClick={saveArticle} disabled={saving} className="text-white text-sm font-bold rounded-lg px-4 py-2 flex items-center gap-2 disabled:opacity-60" style={{ background: "linear-gradient(90deg,#1B7A43,#0E7C9E)" }}>
                      {saving && <Loader2 size={14} className="animate-spin" />} {saving ? t.saving : t.save}
                    </button>
                    <button onClick={() => setEditing(null)} className="text-sm font-semibold text-[#1A1A1A]/60 px-4 py-2">{t.cancel}</button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <button onClick={startNew} className="inline-flex items-center gap-2 text-white text-sm font-bold rounded-lg px-4 py-2 mb-6 shadow-md" style={{ background: "linear-gradient(90deg,#F08A4B,#C6461E)" }}><Plus size={16} /> {t.addArticle}</button>
                <div className="grid gap-2">
                  {[...articles].sort((a, b) => (a.date < b.date ? 1 : -1)).map((a) => (
                    <div key={a.id} className="flex items-center gap-3 bg-white border border-[#1B4332]/10 rounded-lg p-3">
                      <img src={a.image} alt="" className="w-14 h-14 rounded-md object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{a.title[lang]}</p>
                        <p className="text-xs text-[#1A1A1A]/45">{a.date}</p>
                      </div>
                      <button onClick={() => startEdit(a)} className="p-2 text-[#1B4332] hover:bg-[#1B4332]/10 rounded-md"><Pencil size={15} /></button>
                      <button onClick={() => deleteArticle(a.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md"><Trash2 size={15} /></button>
                    </div>
                  ))}
                </div>
              </>
            ))}

            {adminTab === "photos" && (photoEditing ? (
              <div className="bg-white border border-[#8E2A8E]/15 rounded-xl p-5 max-w-xl">
                <h2 className="font-semibold text-[#8E2A8E] mb-4">{t.addPhoto}</h2>
                <div className="grid gap-3">
                  <input value={photoEditing.image} onChange={(e) => setPhotoEditing({ ...photoEditing, image: e.target.value })} placeholder={t.imageUrl} className="border border-[#8E2A8E]/20 rounded-lg px-3 py-2 text-sm" />
                  {photoEditing.image && <img src={photoEditing.image} alt="" className="w-full max-h-48 object-cover rounded-lg border border-[#8E2A8E]/10" />}
                  <div className="grid grid-cols-2 gap-3">
                    <input value={photoEditing.caption.hi} onChange={(e) => setPhotoEditing({ ...photoEditing, caption: { ...photoEditing.caption, hi: e.target.value } })} placeholder={t.captionHi} className="border border-[#8E2A8E]/20 rounded-lg px-3 py-2 text-sm" />
                    <input value={photoEditing.caption.mr} onChange={(e) => setPhotoEditing({ ...photoEditing, caption: { ...photoEditing.caption, mr: e.target.value } })} placeholder={t.captionMr} className="border border-[#8E2A8E]/20 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  {photoError && <p className="text-xs text-red-600">{photoError}</p>}
                  <div className="flex gap-2 mt-1">
                    <button onClick={savePhoto} disabled={photoSaving} className="text-white text-sm font-bold rounded-lg px-4 py-2 flex items-center gap-2 disabled:opacity-60" style={{ background: "linear-gradient(90deg,#8E2A8E,#C6461E)" }}>
                      {photoSaving && <Loader2 size={14} className="animate-spin" />} {photoSaving ? t.saving : t.save}
                    </button>
                    <button onClick={() => setPhotoEditing(null)} className="text-sm font-semibold text-[#1A1A1A]/60 px-4 py-2">{t.cancel}</button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <button onClick={startNewPhoto} className="inline-flex items-center gap-2 text-white text-sm font-bold rounded-lg px-4 py-2 mb-6 shadow-md" style={{ background: "linear-gradient(90deg,#8E2A8E,#C6461E)" }}><Plus size={16} /> {t.addPhoto}</button>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {photos.map((p) => (
                    <div key={p.id} className="relative group rounded-lg overflow-hidden border border-[#8E2A8E]/10">
                      <img src={p.image} alt="" className="w-full aspect-square object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => deletePhoto(p.id)} className="p-2 bg-white rounded-md text-red-600"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ))}
          </div>
        ) : null}
      </main>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/80 hover:text-white"><X size={28} /></button>
          <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.image} alt="" className="w-full rounded-lg max-h-[75vh] object-contain bg-black" />
            <p className="text-white text-sm text-center mt-3">{lightbox.caption[lang]}</p>
          </div>
        </div>
      )}

      <footer className="border-t border-[#1B4332]/15 py-6 text-center">
        <p className="text-xs text-[#1A1A1A]/40">© 2026 {t.siteName} · Gadchiroli, Maharashtra</p>
      </footer>
    </div>
  );
}
