import { useEffect } from "react";

// Native Google Website Translator "Select Language" dropdown (same as the
// reference site). Renders a visible container that Google populates with the
// full language list. Supports multiple instances (desktop + mobile).
let requested = false;

export default function GoogleTranslate({ id = "google_translate_element", className = "" }) {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      document.querySelectorAll(".gt-el").forEach((el) => {
        if (!el.childElementCount) {
          // Default combo layout = the "Select Language" dropdown with all languages.
          new window.google.translate.TranslateElement({ pageLanguage: "en", autoDisplay: false }, el.id);
        }
      });
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

  return <div id={id} className={`gt-el ${className}`} />;
}
