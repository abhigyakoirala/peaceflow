export type Post = {
  id: string;
  category: string;
  title: string;
  body: string;
  source: string;
  url: string;
  accent: string;
  background: string;
  motif: string;
};
type Group = {
  category: string;
  source: string;
  url: string;
  accent: string;
  background: string;
  motif: string;
  tips: [string, string][];
};
const groups: Group[] = [
  {
    category: "Cycle",
    source: "NHS · Periods",
    url: "https://www.nhs.uk/conditions/periods/",
    accent: "#923B59",
    background: "#FBE3EC",
    motif: "orbit",
    tips: [
      [
        "Your cycle has its own rhythm.",
        "Periods do not always arrive every 28 days. Record your dates to understand your own pattern.",
      ],
      [
        "A period is more than one day.",
        "Bleeding often lasts several days. Record the start and end to build a useful personal history.",
      ],
      [
        "Different days. Different shades.",
        "Period blood can look red on heavier days and pink or brown on lighter days.",
      ],
      [
        "Find your comfortable fit.",
        "Pads, tampons, cups and period underwear offer different ways to manage bleeding. Choose what feels comfortable for you.",
      ],
      [
        "Mood changes can be part of it.",
        "Some people notice bloating, irritability or breast tenderness before a period. Not everyone experiences PMS.",
      ],
    ],
  },
  {
    category: "Comfort",
    source: "NHS · Period pain",
    url: "https://www.nhs.uk/symptoms/period-pain/",
    accent: "#8C4539",
    background: "#F8E4D9",
    motif: "sun",
    tips: [
      [
        "A little warmth can help.",
        "Try a warm bath or shower when period cramps arrive.",
      ],
      [
        "Wrap up the warmth.",
        "A heat pad or hot-water bottle on your tummy may help. Wrap the bottle in a towel to protect your skin.",
      ],
      [
        "Gentle movement. Your pace.",
        "Walking, swimming or gentle yoga may ease period pain. Choose what feels manageable.",
      ],
      [
        "Try a gentle massage.",
        "Gently massaging your tummy or back may help ease cramps.",
      ],
      [
        "Pain deserves to be heard.",
        "Seek urgent medical advice if pelvic or period pain is severe or worse than usual and pain relief has not helped.",
      ],
    ],
  },
  {
    category: "Nutrition",
    source: "WHO · Healthy diet",
    url: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
    accent: "#45634A",
    background: "#E7EDDE",
    motif: "leaf",
    tips: [
      [
        "Make room for variety.",
        "A varied diet can include vegetables, fruit, pulses, whole grains and suitable sources of protein.",
      ],
      [
        "Small beans. Useful goodness.",
        "Lentils and beans can bring fibre and plant protein to everyday meals.",
      ],
      [
        "Whole grains belong here.",
        "Try oats, brown rice or other whole grains as part of a varied diet.",
      ],
      [
        "Fresh is not the only option.",
        "Frozen or canned fruit and vegetables can be useful choices. Look for options without added sugars or excess sodium.",
      ],
      [
        "Your plate can be personal.",
        "Healthy eating can fit your culture, available foods and individual needs. There is no single perfect menu for everyone.",
      ],
    ],
  },
  {
    category: "Rest",
    source: "CDC · About sleep",
    url: "https://www.cdc.gov/sleep/about/",
    accent: "#5E518E",
    background: "#EAE5F6",
    motif: "moon",
    tips: [
      [
        "Sleep needs change with age.",
        "Teenagers aged 13–17 generally need 8–10 hours of sleep. Adults aged 18–60 generally need at least 7 hours.",
      ],
      [
        "Give bedtime a rhythm.",
        "Try going to bed and getting up at consistent times, including weekends.",
      ],
      [
        "Make space for quiet.",
        "A cool, quiet bedroom can help create conditions for sleep.",
      ],
      [
        "Let screens rest, too.",
        "Turn off electronic devices at least 30 minutes before bedtime.",
      ],
      [
        "Still tired after sleeping?",
        "Regular trouble sleeping or persistent tiredness is worth discussing with a healthcare professional.",
      ],
    ],
  },
  {
    category: "Movement",
    source: "WHO · Physical activity",
    url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
    accent: "#35666A",
    background: "#DDEEF0",
    motif: "wave",
    tips: [
      [
        "Every bit of movement counts.",
        "Physical activity includes walking, cycling, sport and everyday movement—not just time at a gym.",
      ],
      [
        "Start where you are.",
        "Some activity is better than none. Begin with manageable amounts and build gradually.",
      ],
      [
        "Break up sitting time.",
        "When you can, replace some sitting time with movement, even light activity.",
      ],
      [
        "Find movement you enjoy.",
        "Dancing, walking or cycling can all be ways to bring movement into your day.",
      ],
      [
        "Strength is for everyday life.",
        "Muscle-strengthening activities are part of physical activity guidance. Choose activities suited to your ability and health.",
      ],
    ],
  },
  {
    category: "Mind",
    source: "NHS · Breathing for stress",
    url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/",
    accent: "#77517D",
    background: "#F0E1EF",
    motif: "orbit",
    tips: [
      [
        "Give yourself a breathing moment.",
        "A few minutes of gentle breathing can be a calming practice when you feel stressed.",
      ],
      [
        "Get comfortable first.",
        "Sit with your back supported, stand comfortably or lie down before beginning a breathing exercise.",
      ],
      [
        "Let the breath be gentle.",
        "Try breathing in through your nose and out through your mouth, without forcing the breath.",
      ],
      [
        "Count if it helps.",
        "Count gently as you breathe in and out. Keep the pace comfortable rather than trying to reach a target.",
      ],
      [
        "A small daily pause.",
        "Practise gentle breathing regularly. You can make a few quiet minutes part of your routine.",
      ],
    ],
  },
  {
    category: "Care",
    source: "NHS · Vaginal discharge",
    url: "https://www.nhs.uk/symptoms/vaginal-discharge/",
    accent: "#8A4C66",
    background: "#F8E8EF",
    motif: "leaf",
    tips: [
      [
        "Discharge is often normal.",
        "Clear or white vaginal discharge is common and helps keep the vagina moist and clean.",
      ],
      [
        "Gentle care on the outside.",
        "Wash the skin around the vagina gently with warm water and mild, unperfumed soap.",
      ],
      ["Skip internal washing.", "Do not douche or wash inside the vagina."],
      [
        "Fragrance is not necessary.",
        "Avoid scented wipes, deodorants and perfumed washes around the vagina, which can cause irritation.",
      ],
      [
        "Notice a change? Ask for help.",
        "Seek medical advice for changes in discharge, itching, soreness, pelvic pain or pain when urinating. Avoid self-diagnosis.",
      ],
    ],
  },
  {
    category: "Products",
    source: "FDA · Tampon safety",
    url: "https://www.fda.gov/consumers/consumer-updates/facts-tampons-and-tampon-safety",
    accent: "#88622E",
    background: "#F6ECD5",
    motif: "sun",
    tips: [
      [
        "Read the instructions first.",
        "Different period products have different instructions. Follow the package guidance when using a tampon.",
      ],
      [
        "Clean hands, before and after.",
        "Wash your hands before and after inserting or removing a tampon.",
      ],
      [
        "Keep an eye on the time.",
        "Change tampons every 4–8 hours. Never leave a single tampon in for longer than 8 hours.",
      ],
      [
        "Choose the absorbency you need.",
        "Use the lowest tampon absorbency that meets your flow needs, and only use tampons during your period.",
      ],
      [
        "Know when to act quickly.",
        "Sudden fever, vomiting, diarrhoea, faintness or a sunburn-like rash while using a tampon can signal toxic shock syndrome. Remove it and get medical help immediately.",
      ],
    ],
  },
  {
    category: "Support",
    source: "NHS · Period problems",
    url: "https://www.nhs.uk/conditions/periods/period-problems/",
    accent: "#3F6572",
    background: "#E1EBF1",
    motif: "wave",
    tips: [
      [
        "Heavy bleeding deserves support.",
        "If bleeding disrupts your life, talk with a healthcare professional. You do not have to manage it alone.",
      ],
      [
        "Keep a note of product changes.",
        "Needing to change a pad or tampon every 1–2 hours can be a sign of heavy periods. Mention this when seeking care.",
      ],
      [
        "Your notes can help you explain.",
        "Record the dates, bleeding and symptoms you want to discuss at an appointment.",
      ],
      [
        "Changes are worth a conversation.",
        "If your usual period pattern changes, discuss it with a healthcare professional.",
      ],
      [
        "Pain should not run your day.",
        "If period pain affects everyday activities, ask a clinician about support and treatment options.",
      ],
    ],
  },
  {
    category: "Reflection",
    source: "Paceflow · Journal prompts",
    url: "",
    accent: "#715C4F",
    background: "#F2E9E0",
    motif: "moon",
    tips: [
      [
        "How do you feel, really?",
        "Journal prompt: describe today in three words. There is no right answer.",
      ],
      [
        "What felt kind today?",
        "Journal prompt: write about one small act of care you received or gave yourself.",
      ],
      [
        "You can leave space.",
        "Journal prompt: what is one thing you do not need to solve today?",
      ],
      [
        "Name a little bright spot.",
        "Journal prompt: notice a moment, place or person you appreciated today.",
      ],
      [
        "Tomorrow can start small.",
        "Journal prompt: what is one manageable thing you would like to make space for tomorrow?",
      ],
    ],
  },
];
// Interleave topics so the feed feels varied; stable IDs keep bookmarks meaningful.
export const posts: Post[] = Array.from({ length: 5 }, (_, i) =>
  groups.map((g) => ({
    id: `${g.category.toLowerCase()}-${i + 1}`,
    category: g.category,
    title: g.tips[i][0],
    body: g.tips[i][1],
    source: g.source,
    url: g.url,
    accent: g.accent,
    background: g.background,
    motif: g.motif,
  })),
).flat();
export const categories = ["All", ...groups.map((g) => g.category)];
export const women = [
  {
    id: "malala",
    name: "Malala Yousafzai",
    country: "Pakistan",
    field: "Education",
    initials: "MY",
    color: "#F3DDE6",
    accent: "#853A59",
    headline: "A voice for every girl’s education.",
    body: "Malala Yousafzai advocates for children’s right to education. After speaking out for girls’ schooling in Pakistan, she became a global voice for equal access to learning. She shared the 2014 Nobel Peace Prize.",
    milestone: "2014 · Nobel Peace Prize",
    source: "Nobel Prize",
    url: "https://www.nobelprize.org/prizes/peace/2014/yousafzai/facts/",
  },
  {
    id: "wangari",
    name: "Wangari Maathai",
    country: "Kenya",
    field: "Environment",
    initials: "WM",
    color: "#E2E9D9",
    accent: "#456443",
    headline: "Planting trees. Growing possibility.",
    body: "Wangari Maathai founded the Green Belt Movement in 1977, connecting tree planting with women’s participation and environmental care. In 2004, she became the first African woman to receive the Nobel Peace Prize.",
    milestone: "1977 · Green Belt Movement",
    source: "Nobel Prize",
    url: "https://www.nobelprize.org/prizes/peace/2004/maathai/facts/",
  },
  {
    id: "katherine",
    name: "Katherine Johnson",
    country: "United States",
    field: "Mathematics",
    initials: "KJ",
    color: "#DFE7F2",
    accent: "#455C82",
    headline: "The mathematics behind a giant leap.",
    body: "Katherine Johnson was a NASA research mathematician whose calculations contributed to American human spaceflight. Her work included checking orbital calculations for John Glenn’s mission. Her career also opened doors for women and Black scientists.",
    milestone: "2015 · Presidential Medal of Freedom",
    source: "NASA",
    url: "https://science.nasa.gov/people/katherine-johnson/",
  },
  {
    id: "tu",
    name: "Tu Youyou",
    country: "China",
    field: "Medicine",
    initials: "TY",
    color: "#F4E6D7",
    accent: "#8C5D36",
    headline: "Research that changed malaria treatment.",
    body: "Tu Youyou’s research led to the discovery of artemisinin, an important treatment for malaria. Her work connected investigation of historical medical texts with modern scientific research. She shared the 2015 Nobel Prize in Physiology or Medicine.",
    milestone: "2015 · Nobel Prize in Medicine",
    source: "Nobel Prize",
    url: "https://www.nobelprize.org/prizes/medicine/2015/tu/facts/",
  },
  {
    id: "marie",
    name: "Marie Curie",
    country: "Poland · France",
    field: "Science",
    initials: "MC",
    color: "#EAE0F0",
    accent: "#73548B",
    headline: "Curiosity that crossed boundaries.",
    body: "Born in Warsaw, Marie Curie pursued scientific research in Paris. Her work on radioactivity included the discovery of polonium and radium. She received the Nobel Prize in Physics in 1903 and the Nobel Prize in Chemistry in 1911.",
    milestone: "1903 & 1911 · Nobel Prizes",
    source: "Nobel Prize",
    url: "https://www.nobelprize.org/prizes/chemistry/1911/marie-curie/biographical/",
  },
];
