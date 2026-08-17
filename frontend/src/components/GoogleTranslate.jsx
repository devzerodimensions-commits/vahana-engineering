import { useEffect } from "react";

// Loads the Google Translate engine into a HIDDEN container. The visible UI is
// the custom LanguageSelect dropdown, which drives this engine. Render once.
let requested = false;

export default function GoogleTranslate() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      const el = document.getElementById("google_translate_element");
      if (el && !el.childElementCount) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      }
    };

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    } else if (!requested && !document.getElementById("google-translate-script")) {
      requested = true;
      const s = document.createElement("script");
      s.id = "google-translate-script";
      s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(s);
    }
  }, []);

  return <div id="google_translate_element" aria-hidden="true" className="gt-hidden" />;
}
