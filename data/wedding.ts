export interface WeddingConfig {
  couple: {
    groom: {
      firstName: string;
      fullName: string;
      parents: string;
    };
    bride: {
      firstName: string;
      fullName: string;
      parents: string;
    };
    monogram: string;
    hashtag: string;
    invitationPreamble: string;
    invitationTagline: string;
  };
  event: {
    dateISO: string; // YYYY-MM-DDTHH:mm:ss+offset
    dayOfWeek: string;
    dateFormatted: string;
    timeFormatted: string;
    city: string;
    country: string;
    displayLocation: string;
  };
  story: {
    title: string;
    subtitle: string;
    quote: string;
    author: string;
    milestones: Array<{
      year: string;
      title: string;
      description: string;
      tag?: string;
    }>;
  };
  details: {
    structure?: "two_places" | "single_combined" | "reception_only" | "ceremony_only";
    ceremony: {
      enabled?: boolean;
      title: string;
      badge: string;
      time: string;
      venue: string;
      address: string;
      city: string;
      description: string;
      googleCalendarUrl: string;
      mapsUrl: string;
    };
    reception: {
      enabled?: boolean;
      title: string;
      badge: string;
      time: string;
      venue: string;
      address: string;
      city: string;
      description: string;
      googleCalendarUrl: string;
      mapsUrl: string;
    };
  };
  timeline: Array<{
    time: string;
    title: string;
    description: string;
    icon: "arrival" | "ceremony" | "photos" | "reception" | "dinner" | "party";
  }>;
  gallery: Array<{
    id: string;
    title: string;
    subtitle: string;
    src: string;
    aspect: "tall" | "wide" | "square";
    blurDataUrl?: string;
  }>;
  venue: {
    name: string;
    subname: string;
    address: string;
    city: string;
    description: string;
    image: string;
    mapsUrl: string;
    mapsEmbedQuery: string;
    parkingNote: string;
    valetNote: string;
  };
  dressCode: {
    title: string;
    attire: string;
    subtitle: string;
    description: string;
    palette: Array<{
      name: string;
      hex: string;
    }>;
    notes: string[];
  };
  rsvp: {
    deadline: string;
    deadlineNote: string;
    maxGuests: number;
    attendanceOptions: {
      accept: string;
      decline: string;
    };
    mealOptions: string[];
    contactPhone: string;
    contactEmail: string;
  };
  guestBook: {
    title: string;
    subtitle: string;
    initialMessages: Array<{
      id: string;
      name: string;
      message: string;
      date: string;
    }>;
  };
  music: {
    title: string;
    artist: string;
    audioSrc: string;
  };
  meta: {
    title: string;
    description: string;
    ogImage: string;
    siteUrl: string;
  };
}

export const wedding: WeddingConfig = {
  couple: {
    groom: {
      firstName: "Amal",
      fullName: "Amal Senanayake",
      parents: "Son of Mr. & Mrs. Rohan Senanayake",
    },
    bride: {
      firstName: "Nethmi",
      fullName: "Nethmi Wickramasinghe",
      parents: "Daughter of Dr. & Mrs. Janaka Wickramasinghe",
    },
    monogram: "A & N",
    hashtag: "#AmalAndNethmi",
    invitationPreamble: "Together with their families",
    invitationTagline: "invite you to celebrate their wedding and the beginning of forever",
  },

  event: {
    dateISO: "2026-12-18T10:00:00+05:30",
    dayOfWeek: "Wednesday",
    dateFormatted: "18 December 2026",
    timeFormatted: "10:00 AM onwards",
    city: "Colombo",
    country: "Sri Lanka",
    displayLocation: "Colombo, Sri Lanka",
  },

  story: {
    title: "Our Story",
    subtitle: "A serendipitous encounter that blossomed into a lifetime promise",
    quote: "Whatever our souls are made of, his and mine are the same.",
    author: "Emily Brontë",
    milestones: [
      {
        year: "2019",
        title: "We first met...",
        description:
          "A quiet afternoon at a beachside café in Mount Lavinia. Over cold brews and endless conversations on art, cinema, and life, hours slipped away effortlessly.",
        tag: "First Glance",
      },
      {
        year: "2021",
        title: "Our journey began...",
        description:
          "From spontaneous midnight drives across the city to exploring tea-draped hills in Nuwara Eliya, our bond grew into an inseparable companionship of laughter and unwavering support.",
        tag: "Deepening Love",
      },
      {
        year: "2024",
        title: "A new chapter...",
        description:
          "Beneath the golden sunset over the Indian Ocean, Amal asked the question that made eternity feel real. With teary eyes and overflowing joy, Nethmi said yes.",
        tag: "The Proposal",
      },
      {
        year: "2026",
        title: "Forever begins.",
        description:
          "Surrounded by the warmth of our cherished families and dearest friends, we join hands in marriage and embark on the most sacred journey of our lives.",
        tag: "Our Wedding Day",
      },
    ],
  },

  details: {
    ceremony: {
      title: "Wedding Ceremony",
      badge: "Morning Rituals",
      time: "10:00 AM",
      venue: "Shangri-La Colombo",
      address: "1 Galle Face, Colombo 02",
      city: "Colombo, Sri Lanka",
      description:
        "The sacred Poruwa ceremony followed by exchange of vows and floral blessings in the presence of family.",
      googleCalendarUrl:
        "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Amal+%26+Nethmi+Wedding+Ceremony&dates=20261218T043000Z/20261218T070000Z&details=Wedding+Ceremony+of+Amal+and+Nethmi&location=Shangri-La+Colombo,+1+Galle+Face,+Colombo",
      mapsUrl: "https://maps.google.com/?q=Shangri-La+Colombo+1+Galle+Face",
    },
    reception: {
      title: "Wedding Reception",
      badge: "Evening Celebration",
      time: "6:30 PM",
      venue: "Lotus Ballroom, Shangri-La",
      address: "1 Galle Face, Colombo 02",
      city: "Colombo, Sri Lanka",
      description:
        "An enchanting evening of signature cocktails, gourmet dining, toasts, and dancing under the chandeliers.",
      googleCalendarUrl:
        "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Amal+%26+Nethmi+Wedding+Reception&dates=20261218T130000Z/20261218T180000Z&details=Wedding+Reception+and+Dinner+of+Amal+and+Nethmi&location=Shangri-La+Colombo,+1+Galle+Face,+Colombo",
      mapsUrl: "https://maps.google.com/?q=Shangri-La+Colombo+1+Galle+Face",
    },
  },

  timeline: [
    {
      time: "09:30 AM",
      title: "Guest Arrival",
      description: "Welcome refreshments, traditional drumming, and guest seating in the grand foyer.",
      icon: "arrival",
    },
    {
      time: "10:00 AM",
      title: "Wedding Ceremony",
      description: "Auspicious Poruwa traditions, Jayamangala Gatha blessings, and exchange of rings.",
      icon: "ceremony",
    },
    {
      time: "12:00 PM",
      title: "Photography & Felicitation",
      description: "Formal portraiture with the newlyweds, family photographs, and congratulations.",
      icon: "photos",
    },
    {
      time: "06:30 PM",
      title: "Reception & Cocktails",
      description: "Sunset drinks overlooking the Indian Ocean with live acoustic accompaniment.",
      icon: "reception",
    },
    {
      time: "07:30 PM",
      title: "Grand Dinner & Toasts",
      description: "A curated multi-course banquet dinner, heartfelt speeches, and cake cutting.",
      icon: "dinner",
    },
    {
      time: "09:00 PM",
      title: "Celebration & Dancing",
      description: "The first dance, dessert lounge, and dancing late into the night.",
      icon: "party",
    },
  ],

  gallery: [
    {
      id: "photo-1",
      title: "Golden Hour Glow",
      subtitle: "Galle Face Promenade",
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
      aspect: "tall",
    },
    {
      id: "photo-2",
      title: "The Gentle Touch",
      subtitle: "Whispered Promises",
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
      aspect: "wide",
    },
    {
      id: "photo-3",
      title: "Timeless Elegance",
      subtitle: "Portraits in Ivory",
      src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85",
      aspect: "tall",
    },
    {
      id: "photo-4",
      title: "Botanical Whimsy",
      subtitle: "The Botanical Gardens",
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
      aspect: "square",
    },
    {
      id: "photo-5",
      title: "Serenade in Gold",
      subtitle: "Evening Light",
      src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85",
      aspect: "wide",
    },
    {
      id: "photo-6",
      title: "Hand in Hand",
      subtitle: "Step by Step",
      src: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85",
      aspect: "tall",
    },
    {
      id: "photo-7",
      title: "Sacred Vows",
      subtitle: "Rings of Eternity",
      src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85",
      aspect: "square",
    },
    {
      id: "photo-8",
      title: "Dancing Under Stars",
      subtitle: "Joyful Celebration",
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85",
      aspect: "wide",
    },
    {
      id: "photo-9",
      title: "Candid Laughter",
      subtitle: "Unscripted Joy",
      src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85",
      aspect: "tall",
    },
  ],

  venue: {
    name: "Shangri-La Colombo",
    subname: "Grand Ballroom & Ocean Lawn",
    address: "1 Galle Face, Colombo 00200",
    city: "Colombo, Sri Lanka",
    description:
      "Perched elegantly on the prestigious Galle Face oceanfront, Shangri-La Colombo blends contemporary Asian luxury with legendary Sri Lankan hospitality. Our ceremony and reception will be held amidst breathtaking coastal vistas and opulent ballrooms.",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=85",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Shangri-La+Hotel+Colombo+1+Galle+Face",
    mapsEmbedQuery: "Shangri-La+Hotel+Colombo",
    parkingNote: "Complimentary valet parking available at the main porte-cochère.",
    valetNote: "Dedicated chauffeur lounge and concierge assistance provided.",
  },

  dressCode: {
    title: "Dress Code",
    attire: "Elegant Formal",
    subtitle: "Black Tie Optional / Formal Traditional Attire",
    description:
      "We invite our guests to dress in sophisticated formal attire. Ladies are welcomed in floor-length gowns, cocktail attire, or traditional silk sarees. Gentlemen are invited in formal suits, tuxedos, or traditional national dress.",
    palette: [
      { name: "Forest Green", hex: "#1A3026" },
      { name: "Emerald", hex: "#2C4C3E" },
      { name: "Champagne Gold", hex: "#C5A880" },
      { name: "Warm Sand", hex: "#E8DFD3" },
      { name: "Midnight Navy", hex: "#1D2A3A" },
    ],
    notes: [
      "We kindly request guests to refrain from wearing all-white or ivory attire.",
      "The ballroom is fully climate-controlled; shawls or wraps are welcome for the ocean breeze outside.",
    ],
  },

  rsvp: {
    deadline: "15 November 2026",
    deadlineNote: "Please confirm your presence on or before November 15, 2026 to assist us with table arrangements.",
    maxGuests: 4,
    attendanceOptions: {
      accept: "Joyfully Accept",
      decline: "Regretfully Decline",
    },
    mealOptions: ["Vegetarian", "Non-Vegetarian"],
    contactPhone: "+94 77 123 4567",
    contactEmail: "rsvp@amal-nethmi.wedding",
  },

  guestBook: {
    title: "Words of Love",
    subtitle: "Leave a warm message, blessing, or wish for the couple",
    initialMessages: [
      {
        id: "msg-1",
        name: "Uncle Rohan & Auntie Sunila",
        message:
          "Dearest Amal and Nethmi, may your marriage be blessed with endless joy, deep laughter, and unwavering love across all seasons of life!",
        date: "October 2026",
      },
      {
        id: "msg-2",
        name: "Kavinda & Dinithi",
        message:
          "Counting down the days to celebrate the sweetest love story! We cannot wait to dance the night away with you both.",
        date: "October 2026",
      },
      {
        id: "msg-3",
        name: "Dr. Priyantha Sen",
        message:
          "Heartiest congratulations! May the warmth of your companionship illuminate every step of your wonderful journey ahead.",
        date: "October 2026",
      },
    ],
  },

  music: {
    title: "Canon in D (Strings & Piano)",
    artist: "Romantic Chamber Orchestra",
    audioSrc: "/audio/wedding-melody.mp3",
  },

  meta: {
    title: "Amal & Nethmi — Wedding Invitation | 18.12.2026",
    description:
      "Together with their families, Amal & Nethmi invite you to celebrate their wedding on Wednesday, 18 December 2026 at Shangri-La Colombo, Sri Lanka.",
    ogImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
    siteUrl: "https://amal-and-nethmi.wedding",
  },
};
