import { useEffect } from "react";

// Adds a Google Website Translator "Select Language" dropdown that translates
// the whole site into any language. Renders a container; the script populates it.
let scriptRequested = false;

export default function GoogleTranslate({ id = "google_translate_element", className = "" }) {
  useEffect(() => {
    // Initialise every translate container that isn't populated yet.
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      document.querySelectorAll(".gt-el").forEach((el) => {
        if (el.childElementCount === 0) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            el.id
          );
        }
      });
    };

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    } else if (!scriptRequested && !document.getElementById("google-translate-script")) {
      scriptRequested = true;
      const s = document.createElement("script");
      s.id = "google-translate-script";
      s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(s);
    }
  }, []);

  return <div id={id} className={`gt-el ${className}`} />;
}
