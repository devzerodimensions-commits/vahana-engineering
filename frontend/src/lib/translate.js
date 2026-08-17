// Curated languages for the site's language switcher (value = Google Translate code).
export const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "mr", label: "मराठी" },
  { code: "bn", label: "বাংলা" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ar", label: "العربية" },
  { code: "zh-CN", label: "中文" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ru", label: "Русский" },
  { code: "pt", label: "Português" },
  { code: "id", label: "Indonesia" },
  { code: "th", label: "ไทย" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "tr", label: "Türkçe" },
];

// Switches the page language via the (hidden) Google Translate engine.
export function translateTo(lang) {
  const apply = () => {
    const combo = document.querySelector("select.goog-te-combo");
    if (!combo) return false;
    combo.value = lang;
    combo.dispatchEvent(new Event("change"));
    return true;
  };
  if (!apply()) {
    // Widget may still be loading — retry briefly.
    let tries = 0;
    const iv = setInterval(() => {
      if (apply() || ++tries > 40) clearInterval(iv);
    }, 200);
  }
}
