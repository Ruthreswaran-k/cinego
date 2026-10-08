export interface Person {
  name: string;
  role: string;
  image: string;
}

export interface MovieCreditInfo {
  about: string;
  cast: Person[];
  crew: Person[];
}

// Curated high-resolution portraits for realistic BookMyShow cinema experience
const PORTRAITS = {
  // Male Actors & Directors
  vijaySethupathi: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  nivinPauly: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  kamalHaasan: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  rajinikanth: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
  thalapathyVijay: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  shahRukhKhan: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
  sundeepKishan: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  ashokSelvan: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
  sivaKarthikeyan: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
  cillianMurphy: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  matthewMcConaughey: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  soori: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=400&auto=format&fit=crop&q=80',
  harshathKhan: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',

  // Female Actresses & Crew
  lijomolJose: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  chaithraAchar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  ketikaSharma: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
  ramyaRanganathan: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  anjali: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  trishaKrishnan: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  deepikaPadukone: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
  nayanthara: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  saiPallavi: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  anneHathaway: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  emilyBlunt: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',

  // Directors & Technicians
  hiphopTamizha: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  lokeshKanagaraj: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  nelsonDilipkumar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
  anirudhRavichander: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  arRahman: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  christopherNolan: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
  atleeKumar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
  hansZimmer: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  cinematographer: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
  producer: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=400&auto=format&fit=crop&q=80',
};

// Movie-Specific Curations
const CURATED_CREDITS: Record<string, MovieCreditInfo> = {
  // Baththa (Matching BookMyShow User Reference)
  MOV001: {
    about:
      'Set in the vibrant heartlands of coastal Tamil Nadu, the story follows three generations of individuals whose lives are irrevocably shaped by street justice, musical tradition, and raw pride. As community loyalties clash and modern tensions flare, a relentless protagonist must protect his neighborhood, restore familial honor, and redefine what redemption means in a rapidly shifting world.',
    cast: [
      { name: 'Chaithra Achar', role: 'Actor', image: PORTRAITS.chaithraAchar },
      { name: 'Ketika Sharma', role: 'Actor', image: PORTRAITS.ketikaSharma },
      { name: 'Ramya Ranganathan', role: 'Actor', image: PORTRAITS.ramyaRanganathan },
      { name: 'Harshath Khan', role: 'Actor', image: PORTRAITS.harshathKhan },
      { name: 'Vijay Sethupathi', role: 'Actor', image: PORTRAITS.vijaySethupathi },
      { name: 'Lijomol Jose', role: 'Actor', image: PORTRAITS.lijomolJose },
    ],
    crew: [
      { name: 'Hiphop Tamizha', role: 'Director', image: PORTRAITS.hiphopTamizha },
      { name: 'Anirudh Ravichander', role: 'Music Director', image: PORTRAITS.anirudhRavichander },
      { name: 'Sathyan Sooryan', role: 'Cinematographer', image: PORTRAITS.cinematographer },
      { name: 'G. Dhananjayan', role: 'Producer', image: PORTRAITS.producer },
    ],
  },

  // Yezhu Kadal Yezhu Malai
  MOV002: {
    about:
      'An immortal poetic odyssey crafted across rolling seas and misty mountain ridges. The film recounts an undying romantic journey that transcends the boundaries of time, morality, and rebirth, examining the profound emotional resonance of soul-bound devotion.',
    cast: [
      { name: 'Nivin Pauly', role: 'Actor', image: PORTRAITS.nivinPauly },
      { name: 'Anjali', role: 'Actor', image: PORTRAITS.anjali },
      { name: 'Soori', role: 'Actor', image: PORTRAITS.soori },
      { name: 'Vijay Sethupathi', role: 'Narrator / Cameo', image: PORTRAITS.vijaySethupathi },
    ],
    crew: [
      { name: 'Ram', role: 'Director', image: PORTRAITS.lokeshKanagaraj },
      { name: 'Yuvan Shankar Raja', role: 'Music Director', image: PORTRAITS.arRahman },
      { name: 'NK Ekhambram', role: 'Cinematographer', image: PORTRAITS.cinematographer },
      { name: 'Suresh Kamatchi', role: 'Producer', image: PORTRAITS.producer },
    ],
  },

  // Anbil Avan
  MOV003: {
    about:
      'A deeply moving action romance centered on a quiet man whose steadfast commitment is put to the ultimate test against treacherous circumstances, uncovering the enduring power of devotion and sacrifice.',
    cast: [
      { name: 'Ashok Selvan', role: 'Actor', image: PORTRAITS.ashokSelvan },
      { name: 'Preity Mukhundhan', role: 'Actor', image: PORTRAITS.ketikaSharma },
      { name: 'Chaithra Achar', role: 'Actor', image: PORTRAITS.chaithraAchar },
      { name: 'Harshath Khan', role: 'Actor', image: PORTRAITS.harshathKhan },
    ],
    crew: [
      { name: 'Gowtham Raj', role: 'Director', image: PORTRAITS.nelsonDilipkumar },
      { name: 'Sean Roldan', role: 'Music Director', image: PORTRAITS.anirudhRavichander },
      { name: 'Dinesh Krishnan', role: 'Cinematographer', image: PORTRAITS.cinematographer },
    ],
  },

  // Sigma
  MOV004: {
    about:
      'A high-octane modern vigilante thriller capturing the daring exploits of a lone renegade fighting to systematically dismantle a syndicate that has compromised urban safety and political governance.',
    cast: [
      { name: 'Sundeep Kishan', role: 'Actor', image: PORTRAITS.sundeepKishan },
      { name: 'Faria Abdullah', role: 'Actor', image: PORTRAITS.ramyaRanganathan },
      { name: 'Vijay Sethupathi', role: 'Actor', image: PORTRAITS.vijaySethupathi },
      { name: 'Ketika Sharma', role: 'Actor', image: PORTRAITS.ketikaSharma },
    ],
    crew: [
      { name: 'Lokesh Kanagaraj', role: 'Director', image: PORTRAITS.lokeshKanagaraj },
      { name: 'Anirudh Ravichander', role: 'Music Director', image: PORTRAITS.anirudhRavichander },
      { name: 'Girish Gangadharan', role: 'Cinematographer', image: PORTRAITS.cinematographer },
    ],
  },

  // Vikram (LCU Legacy)
  MOV020: {
    about:
      'A special high-stakes black-ops investigation following a ruthless squad of covert operatives assigned to eliminate a drug mafia syndicate led by dangerous cartels in the southern corridors.',
    cast: [
      { name: 'Kamal Haasan', role: 'Actor', image: PORTRAITS.kamalHaasan },
      { name: 'Vijay Sethupathi', role: 'Actor', image: PORTRAITS.vijaySethupathi },
      { name: 'Fahadh Faasil', role: 'Actor', image: PORTRAITS.nivinPauly },
      { name: 'Suriya', role: 'Actor (Rolex)', image: PORTRAITS.thalapathyVijay },
    ],
    crew: [
      { name: 'Lokesh Kanagaraj', role: 'Director', image: PORTRAITS.lokeshKanagaraj },
      { name: 'Anirudh Ravichander', role: 'Music Director', image: PORTRAITS.anirudhRavichander },
      { name: 'Girish Gangadharan', role: 'Cinematographer', image: PORTRAITS.cinematographer },
    ],
  },

  // Jailer (Kollywood Blockbuster)
  MOV021: {
    about:
      'A retired prison superintendent must don his tactical armor once more when an antique idol smuggling syndicate threatens to eliminate his family, unleashing calculated fury on the underworld.',
    cast: [
      { name: 'Rajinikanth', role: 'Actor', image: PORTRAITS.rajinikanth },
      { name: 'Mohanlal', role: 'Actor', image: PORTRAITS.kamalHaasan },
      { name: 'Shiva Rajkumar', role: 'Actor', image: PORTRAITS.nivinPauly },
      { name: 'Ramya Krishnan', role: 'Actor', image: PORTRAITS.chaithraAchar },
    ],
    crew: [
      { name: 'Nelson Dilipkumar', role: 'Director', image: PORTRAITS.nelsonDilipkumar },
      { name: 'Anirudh Ravichander', role: 'Music Director', image: PORTRAITS.anirudhRavichander },
      { name: 'Vijay Kartik Kannan', role: 'Cinematographer', image: PORTRAITS.cinematographer },
    ],
  },

  // Leo (Bloody Sweet)
  MOV022: {
    about:
      'A mild-mannered cafe owner living a tranquil life in the snowy hills of Himachal finds his quiet sanctuary shattered when a gang of dangerous drug lords claim he is a feared kingpin named Leo Das.',
    cast: [
      { name: 'Thalapathy Vijay', role: 'Actor', image: PORTRAITS.thalapathyVijay },
      { name: 'Trisha Krishnan', role: 'Actor', image: PORTRAITS.trishaKrishnan },
      { name: 'Sanjay Dutt', role: 'Actor', image: PORTRAITS.kamalHaasan },
      { name: 'Arjun Sarja', role: 'Actor', image: PORTRAITS.nivinPauly },
    ],
    crew: [
      { name: 'Lokesh Kanagaraj', role: 'Director', image: PORTRAITS.lokeshKanagaraj },
      { name: 'Anirudh Ravichander', role: 'Music Director', image: PORTRAITS.anirudhRavichander },
      { name: 'Manoj Paramahamsa', role: 'Cinematographer', image: PORTRAITS.cinematographer },
    ],
  },

  // Oppenheimer
  MOV025: {
    about:
      'The pulse-pounding biographical drama tracing the brilliant mind of J. Robert Oppenheimer as he leads the Manhattan Project to invent the atomic bomb, and grapples with the terrifying moral fallout that reshaped humanity.',
    cast: [
      { name: 'Cillian Murphy', role: 'Actor', image: PORTRAITS.cillianMurphy },
      { name: 'Emily Blunt', role: 'Actor', image: PORTRAITS.emilyBlunt },
      { name: 'Robert Downey Jr.', role: 'Actor', image: PORTRAITS.matthewMcConaughey },
      { name: 'Matt Damon', role: 'Actor', image: PORTRAITS.ashokSelvan },
    ],
    crew: [
      { name: 'Christopher Nolan', role: 'Director', image: PORTRAITS.christopherNolan },
      { name: 'Ludwig Göransson', role: 'Music Director', image: PORTRAITS.hansZimmer },
      { name: 'Hoyte van Hoytema', role: 'Cinematographer', image: PORTRAITS.cinematographer },
      { name: 'Emma Thomas', role: 'Producer', image: PORTRAITS.producer },
    ],
  },

  // Interstellar
  MOV026: {
    about:
      'When Earth becomes increasingly uninhabitable, a crew of astronauts embarks through a newly discovered wormhole in search of a future home for mankind across the boundless expanse of space and time.',
    cast: [
      { name: 'Matthew McConaughey', role: 'Actor', image: PORTRAITS.matthewMcConaughey },
      { name: 'Anne Hathaway', role: 'Actor', image: PORTRAITS.anneHathaway },
      { name: 'Jessica Chastain', role: 'Actor', image: PORTRAITS.ketikaSharma },
      { name: 'Michael Caine', role: 'Actor', image: PORTRAITS.cillianMurphy },
    ],
    crew: [
      { name: 'Christopher Nolan', role: 'Director', image: PORTRAITS.christopherNolan },
      { name: 'Hans Zimmer', role: 'Music Director', image: PORTRAITS.hansZimmer },
      { name: 'Hoyte van Hoytema', role: 'Cinematographer', image: PORTRAITS.cinematographer },
    ],
  },

  // Amaran
  MOV027: {
    about:
      'An inspiring real-life biographical tribute honoring the valor, bravery, and immense sacrifice of Major Mukund Varadarajan of the Indian Army, showcasing supreme devotion to the motherland.',
    cast: [
      { name: 'Sivakarthikeyan', role: 'Actor', image: PORTRAITS.sivaKarthikeyan },
      { name: 'Sai Pallavi', role: 'Actor', image: PORTRAITS.saiPallavi },
      { name: 'Bhuvan Arora', role: 'Actor', image: PORTRAITS.harshathKhan },
      { name: 'Rahul Bose', role: 'Actor', image: PORTRAITS.nivinPauly },
    ],
    crew: [
      { name: 'Rajkumar Periasamy', role: 'Director', image: PORTRAITS.lokeshKanagaraj },
      { name: 'G.V. Prakash Kumar', role: 'Music Director', image: PORTRAITS.anirudhRavichander },
      { name: 'CH Sai', role: 'Cinematographer', image: PORTRAITS.cinematographer },
      { name: 'Kamal Haasan', role: 'Producer', image: PORTRAITS.kamalHaasan },
    ],
  },
};

// Generic Fallback Generator to ensure 100% of movies have rich Cast & Crew cards
export function getMovieCreditDetails(
  movieId: string,
  title: string,
  castList: string[] = [],
  shortDesc: string = '',
  language: string = 'Tamil'
): MovieCreditInfo {
  // If we have hand-curated details, return them
  if (CURATED_CREDITS[movieId]) {
    return CURATED_CREDITS[movieId];
  }

  // Fallback headshot images list
  const fallbackPhotos = [
    PORTRAITS.chaithraAchar,
    PORTRAITS.ketikaSharma,
    PORTRAITS.ramyaRanganathan,
    PORTRAITS.harshathKhan,
    PORTRAITS.vijaySethupathi,
    PORTRAITS.nivinPauly,
    PORTRAITS.ashokSelvan,
    PORTRAITS.lijomolJose,
  ];

  // Build Cast members from the movie's own cast list or defaults
  const names = castList.length > 0 ? castList : ['Lead Actor', 'Supporting Cast', 'Character Artist'];
  const generatedCast: Person[] = names.map((name, idx) => ({
    name: name.trim(),
    role: 'Actor',
    image: fallbackPhotos[idx % fallbackPhotos.length],
  }));

  // Ensure at least 4 cast cards for beautiful BookMyShow layout
  if (generatedCast.length < 4) {
    const extraNames = ['Chaithra Achar', 'Ketika Sharma', 'Harshath Khan', 'Ramya Ranganathan'];
    extraNames.forEach((exName, idx) => {
      if (generatedCast.length < 4 && !generatedCast.some((c) => c.name === exName)) {
        generatedCast.push({
          name: exName,
          role: 'Actor',
          image: fallbackPhotos[(generatedCast.length + idx) % fallbackPhotos.length],
        });
      }
    });
  }

  // Build Crew members
  const generatedCrew: Person[] = [
    {
      name: language === 'English' ? 'Christopher Nolan' : 'Hiphop Tamizha',
      role: 'Director',
      image: language === 'English' ? PORTRAITS.christopherNolan : PORTRAITS.hiphopTamizha,
    },
    {
      name: language === 'English' ? 'Hans Zimmer' : 'Anirudh Ravichander',
      role: 'Music Director',
      image: language === 'English' ? PORTRAITS.hansZimmer : PORTRAITS.anirudhRavichander,
    },
    {
      name: 'Sathyan Sooryan',
      role: 'Cinematographer',
      image: PORTRAITS.cinematographer,
    },
    {
      name: 'Kalanithi Maran',
      role: 'Producer',
      image: PORTRAITS.producer,
    },
  ];

  const fullAbout =
    shortDesc ||
    `Experience the cinematic spectacle of ${title}. Set against dramatic backdrops, the narrative weaves together compelling personal journeys, intense drama, and unforgettable emotional payoffs on the big screen.`;

  return {
    about: fullAbout,
    cast: generatedCast,
    crew: generatedCrew,
  };
}
