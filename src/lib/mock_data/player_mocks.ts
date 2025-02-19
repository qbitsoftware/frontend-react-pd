import { PlayerProfile } from "@/types/types";

export const mockPlayers: PlayerProfile[] = [
  {
    id: 1,
    name: "Mart Vaarpu",
    birthYear: 1991,
    club: "Viimsi Lauatenniseklubi",
    description:
      "A skilled forward known for his agility and goal-scoring ability.",
    photo: "../../../public/test/mart.png",
    coverPhoto: "/images/cover_photo.jpg",
    stats: {
      matches: 71,
      goals: 12,
      assists: 14,
      winRate: 68,
    },
    achievements: ["Rahvapinks 7. etapp", "Mustvee karikasarja 24. etapp"],
    rivals: [
      {
        id: 2,
        name: "Adamus Õunapuu",
        photo: "../../../public/test/ahuja.png",
      },
      {
        id: 3,
        name: "Carlo Accorsi",
        photo: "../../../public/test/carlo.png",
      },
      {
        id: 4,
        name: "Nikita Aksjonov",
        photo: "../../../public/test/nikita.png",
      },
      {
        id: 5,
        name: "Erik Laan",
        photo: "../../../public/test/abalmas.png",
      },
      {
        id: 6,
        name: "Edvinas Albamus",
        photo: "../../../public/test/adamus.png",
      },
      {
        id: 4,
        name: "Karli Välja",
        photo: "../../../public/test/nikita.png",
      },
      {
        id: 5,
        name: "Oskar Luts",
        photo: "../../../public/test/abalmas.png",
      },
      {
        id: 6,
        name: "Silver Hanenikkuja",
        photo: "../../../public/test/adamus.png",
      },
    ],
    socials: {
      twitter: "https://twitter.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      website: "https://johndoe.com",
    },
  },
  {
    id: 2,
    name: "Adamus Õunapuu",
    birthYear: 1999,
    club: "Maardu Lauatenniseklubi",
    description:
      "A skilled forward known for his agility and goal-scoring ability.",
    photo: "../../../public/test/adamus.png",
    coverPhoto: "/images/cover_photo.jpg",
    stats: {
      matches: 51,
      goals: 19,
      assists: 23,
      winRate: 54,
    },
    achievements: ["Rahvapinks 7. etapp", "Mustvee karikasarja 24. etapp"],
    rivals: [
      {
        id: 1,
        name: "Mart Vaarpu",
        photo: "../../../public/test/mart.png",
      },
      {
        id: 3,
        name: "Carlo Accorsi",
        photo: "../../../public/test/carlo.png",
      },
      {
        id: 4,
        name: "Nikita Aksjonov",
        photo: "../../../public/test/nikita.png",
      },
      {
        id: 5,
        name: "Erik Laan",
        photo: "../../../public/test/abalmas.png",
      },
      {
        id: 6,
        name: "Edvinas Albamus",
        photo: "../../../public/test/adamus.png",
      },
      {
        id: 4,
        name: "Karli Välja",
        photo: "../../../public/test/nikita.png",
      },
      {
        id: 5,
        name: "Oskar Luts",
        photo: "../../../public/test/abalmas.png",
      },
      {
        id: 6,
        name: "Silver Hanenikkuja",
        photo: "../../../public/test/adamus.png",
      },
    ],
    socials: {
      twitter: "https://twitter.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      website: "https://johndoe.com",
    },
  },
];
