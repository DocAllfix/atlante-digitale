export const THEMATIC_TOPICS = [
  {
    id: "magic",
    label: "Onirismo",
    countries: ["Italia"],
    links: [
      { author: "Federico Fellini", city: "rome", cityName: "Roma", periodId: "1961-1970", lat: 41.9028, lng: 12.4964 },
    ],
  },
  {
    id: "feminism",
    label: "Femminismo",
    countries: ["Regno Unito", "Stati Uniti", "Belgio"],
    links: [
      { author: "Luce Irigaray", city: "blaton", cityName: "Blaton", periodId: "1971-1980", lat: 50.5139, lng: 3.6531 },
      { author: "Laura Mulvey", city: "london", cityName: "Londra", periodId: "1971-1980", lat: 51.5074, lng: -0.1278 },
      { author: "Mary Ann Doane", city: "berkeley", cityName: "Berkeley", periodId: "1981-1990", lat: 37.8716, lng: -122.2727 },
      { author: "Judith Butler", city: "cleveland", cityName: "Cleveland", periodId: "1991-1999", lat: 41.4993, lng: -81.6944 },
      { author: "Donna Haraway", city: "denver", cityName: "Denver", periodId: "1981-1990", lat: 39.7392, lng: -104.9903 },
      { author: "Evelyn Fox Keller", city: "newyork", cityName: "New York", periodId: "1981-1990", lat: 40.7128, lng: -74.006 },
      { author: "Elisabeth Grosz", city: "sydney", cityName: "Sydney", periodId: "1991-1999", lat: -33.8688, lng: 151.2093 },
      { author: "bell hooks", city: "hopkinsville", cityName: "Hopkinsville", periodId: "1981-1990", lat: 36.8566, lng: -87.4886 },
      { author: "Tina Campt", city: "princeton", cityName: "Princeton", periodId: "2001-2010", lat: 40.3573, lng: -74.6672 },
    ],
  },
  {
    id: "structuralism",
    label: "Strutturalismo",
    countries: ["Stati Uniti"],
    links: [
      { author: "Judith Butler", city: "cleveland", cityName: "Cleveland", periodId: "1991-1999", lat: 41.4993, lng: -81.6944 },
    ],
  },
  {
    id: "semiotics",
    label: "Semiotica",
    countries: [],
  },
  {
    id: "colonial",
    label: "Colonial Studies",
    countries: [],
    subtopics: [
      {
        id: "black_studies",
        label: "Black Studies",
        countries: ["Stati Uniti", "Sudafrica"],
        links: [
          { author: "bell hooks", city: "hopkinsville", cityName: "Hopkinsville", periodId: "1981-1990", lat: 36.8566, lng: -87.4886 },
          { author: "Santu Mofokeng", city: "johannesburg", cityName: "Johannesburg", periodId: "1991-1999", lat: -26.2041, lng: 28.0473 },
          { author: "Tina Campt", city: "princeton", cityName: "Princeton", periodId: "2001-2010", lat: 40.3573, lng: -74.6672 },
          { author: "Kahlil Joseph", city: "seattle", cityName: "Seattle", periodId: "2011-2020", lat: 47.6062, lng: -122.3321 },
          { author: "Deana Lawson", city: "newyork", cityName: "New York", periodId: "2021-2026", lat: 40.7128, lng: -74.006 },
        ],
      },
    ],
  },
];

export function getAllTopics() {
  const result = [];
  for (const topic of THEMATIC_TOPICS) {
    result.push(topic);
    if (topic.subtopics) {
      for (const sub of topic.subtopics) result.push(sub);
    }
  }
  return result;
}

export function findTopic(id) {
  for (const topic of THEMATIC_TOPICS) {
    if (topic.id === id) return topic;
    if (topic.subtopics) {
      for (const sub of topic.subtopics) if (sub.id === id) return sub;
    }
  }
  return null;
}