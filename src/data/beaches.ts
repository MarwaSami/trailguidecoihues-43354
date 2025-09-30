
import { Beach } from "../types/beach";

export const beaches: Beach[] = [
  {
    id: "b1",
    name: "Playa Del Viento",
    location: "Lago Moreno",
    description: {
      en: "A beautiful sandy beach on Nahuel Huapi Lake, known for windy conditions that make it perfect for windsurfing and kitesurfing enthusiasts. Located just minutes from Camping Los Coihues.",
      es: "Desde Playa del Viento, en el lago Moreno, se tienen vistas impresionantes del Cerro López, con sus imponentes paredes rocosas al fondo, y de los densos bosques que rodean el lago. Hacia el otro lado, se pueden ver las suaves laderas de la península San Pedro. Es un lugar muy popular para practicar kitesurf debido a los fuertes vientos que suelen soplar en la zona."
    },
    imageUrl: "/lovable-uploads/7cd264e6-e8b5-4596-afba-7ee9212621d5.png",
    beachType: "sandy",
    waterTemp: {
      summer: 16,
      winter: 8
    },
    activities: ["swimming", "kayaking", "sunbathing", "picnic"],
    facilities: ["parkingAvailable"],
    distanceFromCampsite: 1.5,
    travelTime: 20,
    transportation: ["bus", "taxi"],
    bestTimeToVisit: "December-February"
  },
  {
    id: "b2",
    name: "Playa Con Viento",
    location: "Lago Moreno",
    description: {
      en: "True to its name ('Beach With Wind'), this beach offers consistent winds perfect for sailing and windsurfing activities. It features a mix of sand and pebbles with spectacular mountain views.",
      es: "Fiel a su nombre, esta playa ofrece vientos constantes, perfectos para actividades de vela y windsurf. Presenta una mezcla de arena y guijarros con espectaculares vistas a la montaña."
    },
    imageUrl: "/lovable-uploads/766c5132-06c1-4fd6-a836-f12e481271c2.png",
    beachType: "mixed",
    waterTemp: {
      summer: 17,
      winter: 9
    },
    activities: ["swimming", "kayaking", "fishing", "viewpoint"],
    facilities: ["parkingAvailable", "foodVendors"],
    distanceFromCampsite: 6,
    travelTime: 25,
    transportation: ["bus", "taxi"],
    bestTimeToVisit: "November-March"
  },
  {
    id: "b3",
    name: "Playa Sin Viento",
    location: "Lago Moreno",
    description: {
      en: "A sheltered beach ('Beach Without Wind') offering calm waters, ideal for families with children and swimming. Located in a protected bay area with beautiful surroundings.",
      es: "Una playa protegida que ofrece aguas tranquilas, ideal para familias con niños y para nadar. Ubicada en un área de bahía protegida con hermosos alrededores."
    },
    imageUrl: "/lovable-uploads/11f6c604-dd7e-4971-8d55-a247159bc234.png",
    beachType: "sandy",
    waterTemp: {
      summer: 18,
      winter: 10
    },
    activities: ["swimming", "picnic", "sunbathing", "kayaking"],
    facilities: ["parkingAvailable", "restrooms", "foodVendors"],
    distanceFromCampsite: 12,
    travelTime: 35,
    transportation: ["bus", "taxi"],
    bestTimeToVisit: "December-February"
  },
  {
    id: "b4",
    name: "Playa Muñoz",
    location: "Lago Gutiérrez",
    description: {
      en: "A tranquil beach with pristine blue waters surrounded by mountains, perfect for relaxation and enjoying the peaceful atmosphere. The clear waters invite swimming and the beach offers a great spot for photography.",
      es: "Una playa tranquila con aguas azules prístinas rodeada de montañas, perfecta para relajarse y disfrutar de la atmósfera pacífica. Las aguas cristalinas invitan a nadar y la playa ofrece un gran lugar para la fotografía."
    },
    imageUrl: "/lovable-uploads/07820408-8592-401d-91e6-a1c25deb1cef.png",
    beachType: "sandy",
    waterTemp: {
      summer: 17,
      winter: 9
    },
    activities: ["swimming", "picnic", "sunbathing", "viewpoint"],
    facilities: ["parkingAvailable"],
    distanceFromCampsite: 5,
    travelTime: 90,
    transportation: ["walking"],
    bestTimeToVisit: "December-March"
  },
  {
    id: "b5",
    name: "Playa Bonita",
    location: "Lago Nahuel Huapi, Km 7.5 Av. Bustillo",
    description: {
      en: "As its name suggests ('Beautiful Beach'), this is one of the most scenic beaches in Bariloche. It offers crystal clear waters and is surrounded by native forest, providing a picture-perfect setting.",
      es: "Como su nombre lo indica, esta es una de las playas más pintorescas de Bariloche. Ofrece aguas cristalinas y está rodeada de bosque nativo, proporcionando un entorno perfecto para fotografías."
    },
    imageUrl: "/lovable-uploads/8e60626c-f42a-44a4-b340-02d07588b487.png",
    beachType: "sandy",
    waterTemp: {
      summer: 17,
      winter: 9
    },
    activities: ["swimming", "picnic", "sunbathing", "kayaking", "viewpoint"],
    facilities: ["parkingAvailable", "restrooms", "foodVendors"],
    distanceFromCampsite: 10,
    travelTime: 10,
    transportation: ["bus", "taxi"],
    bestTimeToVisit: "December-March"
  },
  {
    id: "b6",
    name: "Bahía Serena",
    location: "Lago Nahuel Huapi, Km 13 Av. Bustillo",
    description: {
      en: "A tranquil bay offering peaceful surroundings and relatively warmer waters. Perfect for a quiet day by the lake with the family.",
      es: "Una bahía tranquila que ofrece un entorno pacífico y aguas relativamente más cálidas. Perfecta para un día tranquilo junto al lago con la familia."
    },
    imageUrl: "/lovable-uploads/4efa557c-610b-494e-b344-4d12e15b9324.png",
    beachType: "pebbly",
    waterTemp: {
      summer: 19,
      winter: 11
    },
    activities: ["swimming", "kayaking", "fishing", "picnic", "sunbathing"],
    facilities: ["parkingAvailable", "restrooms"],
    distanceFromCampsite: 3,
    travelTime: 15,
    transportation: ["walking", "bus", "taxi"],
    bestTimeToVisit: "December-February"
  },
  {
    id: "b7",
    name: "Bahia Lopez",
    location: "Circuito Chico, Km 33 Av. Bustillo",
    description: {
      en: "A stunning bay with clear waters and mountain views. Located along the famous Circuito Chico route, this beach offers a perfect combination of forest and lake scenery.",
      es: "Una bahía impresionante con aguas claras y vistas a las montañas. Ubicada a lo largo de la famosa ruta del Circuito Chico, esta playa ofrece una combinación perfecta de bosque y paisaje lacustre."
    },
    imageUrl: "/lovable-uploads/a69a606d-fe54-4813-9b77-84e0c718c189.png",
    beachType: "rocky",
    waterTemp: {
      summer: 16,
      winter: 8
    },
    activities: ["swimming", "kayaking", "viewpoint", "picnic"],
    facilities: ["parkingAvailable"],
    distanceFromCampsite: 18,
    travelTime: 40,
    transportation: ["bus", "taxi"],
    bestTimeToVisit: "December-February"
  },
  {
    id: "b8",
    name: "Villa Tacul",
    location: "Circuito Chico, Km 29 Av. Bustillo",
    description: {
      en: "A hidden gem with turquoise waters surrounded by cypress trees. This small beach offers one of the most picturesque settings in the Bariloche area, with clear water perfect for swimming.",
      es: "Una joya escondida con aguas turquesas rodeada de cipreses. Esta pequeña playa ofrece uno de los entornos más pintorescos de la zona de Bariloche, con agua clara perfecta para nadar."
    },
    imageUrl: "/lovable-uploads/32ba33c7-35da-4613-9e0b-de943231a1bd.png",
    beachType: "mixed",
    waterTemp: {
      summer: 17,
      winter: 9
    },
    activities: ["swimming", "kayaking", "viewpoint", "picnic", "sunbathing"],
    facilities: ["parkingAvailable"],
    distanceFromCampsite: 20,
    travelTime: 30,
    transportation: ["bus", "taxi"],
    bestTimeToVisit: "December-February"
  },
  {
    id: "b9",
    name: "Playa Melipal",
    location: "Km 4 Av. Bustillo",
    description: {
      en: "A convenient beach located at Km 4 of Avenida Bustillo, close to the city center. With easy access and beautiful views of Nahuel Huapi Lake, it's perfect for a quick escape without traveling far from town.",
      es: "Una playa conveniente ubicada en el Km 4 de la Avenida Bustillo, cerca del centro de la ciudad. Con fácil acceso y hermosas vistas del Lago Nahuel Huapi, es perfecta para una escapada rápida sin viajar lejos de la ciudad."
    },
    imageUrl: "/lovable-uploads/63e730c2-2308-4d75-8212-b63d66f8574b.png",
    beachType: "sandy",
    waterTemp: {
      summer: 17,
      winter: 9
    },
    activities: ["swimming", "picnic", "sunbathing", "viewpoint"],
    facilities: ["parkingAvailable", "restrooms", "foodVendors"],
    distanceFromCampsite: 8,
    travelTime: 15,
    transportation: ["bus", "taxi"],
    bestTimeToVisit: "December-February"
  }
];
