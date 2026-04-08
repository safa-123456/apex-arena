export interface Trainer {
  id: string;
  name: string;
  role: string;
  image: string;
  price: number;
  sports?: string[];
}

export const trainers: Trainer[] = [
  { 
    id: "marcus", 
    name: "Coach Marcus", 
    role: "Head Tennis Pro", 
    price: 3500, 
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=400&h=500",
    sports: ["Tennis"]
  },
  { 
    id: "sarah", 
    name: "Sarah Jenkins", 
    role: "Padel Specialist", 
    price: 3000, 
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=400&h=500",
    sports: ["Padel"]
  },
  { 
    id: "david", 
    name: "David Chen", 
    role: "Basketball Performance", 
    price: 4500, 
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400&h=500",
    sports: ["Basketball"]
  },
  { 
    id: "elena", 
    name: "Elena Rossi", 
    role: "Yoga & Recovery", 
    price: 2500, 
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400&h=500",
    sports: ["Yoga", "Recovery"]
  },
  { 
    id: "james", 
    name: "James Wilson", 
    role: "Strength & Conditioning", 
    price: 3200, 
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400&h=500",
    sports: ["Fitness"]
  },
  { 
    id: "maria", 
    name: "Maria Garcia", 
    role: "Squash Master", 
    price: 2800, 
    image: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&q=80&w=400&h=500",
    sports: ["Squash"]
  },
  { 
    id: "tom", 
    name: "Tom Baker", 
    role: "Nutrition Specialist", 
    price: 2000, 
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400&h=500",
    sports: ["Nutrition"]
  },
  { 
    id: "anna", 
    name: "Anna Smith", 
    role: "Mental Performance", 
    price: 3800, 
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400&h=500",
    sports: ["Mental"]
  }
];
