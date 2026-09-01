// Central place for company details shown across the site.
// Contact details taken from the official Vihaana Engineering business card.
export const site = {
  name: "Vihaana Engineering",
  shortName: "Vihaana",
  tagline: "Your Testing Partner",
  businessLine: "Manufacturer & Exporter of Plastic Testing Machinery",
  description:
    "Manufacturer and exporter of plastic testing machinery — precision material-testing instruments for plastics, polymers, pipes, films and geosynthetics.",
  logo: "/logo.png",
  logoHeader: "/logo-header.png",
  // Background removed — for use on any non-white surface (e.g. the light-grey
  // footer), where logo.png's opaque white would show as a pale rectangle.
  // Regenerate with _scripts/make-logo-transparent.mjs.
  logoTransparent: "/logo-transparent.png",
  contactPerson: "Mr. Chirag Pawar",
  contactPersonRole: "Business Head",
  email: "info@vihaanaengineering.com",
  salesEmail: "info@vihaanaengineering.com",
  website: "www.vihaanaengineering.com",
  phone: "+91 70960 11126",
  whatsapp: "+91 70960 11126",
  address: "Vatva, Ahmedabad, Gujarat, India",
  addressLong:
    "28, Pushkar Mahadev Industrial Estate - 2, Nr. Ramol Vatva Railway Bridge, Phase - 1, G.I.D.C., Vatva, Ahmedabad - 382 445, Gujarat, India",
  // Location the Google Map on the Contact page searches for. If the pin doesn't
  // land exactly on the works, replace this with coordinates ("23.0012,72.6291")
  // or the Google Maps Plus Code — both are accepted here and are exact.
  mapQuery:
    "Pushkar Mahadev Industrial Estate 2, Nr. Ramol Vatva Railway Bridge, Phase 1, GIDC Vatva, Ahmedabad, Gujarat 382445, India",
  hours: "Mon – Sat: 9:30 AM – 6:30 PM",
  social: {
    linkedin: "#",
    facebook: "#",
    instagram: "#",
    youtube: "#",
  },
  stats: [
    { value: "25+", label: "Testing Instruments" },
    { value: "15+", label: "Years of Expertise" },
    { value: "500+", label: "Installations" },
    { value: "8", label: "Testing Domains" },
  ],
};

export const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Contact", path: "/contact" },
];

export default site;
