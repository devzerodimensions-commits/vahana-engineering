import { useState } from "react";
import { LANGS, translateTo } from "../lib/translate.js";
import Icon from "./ui/Icon.jsx";

// Visible, branded "Select Language" dropdown (drives the hidden Google engine).
export default function LanguageSelect({ dark = false }) {
  const [lang, setLang] = useState("en");
  const onChange = (e) => {
    const v = e.target.value;
    setLang(v);
    translateTo(v);
  };
  return (
    <label
      className={`notranslate flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
        dark ? "bg-white/10 text-white ring-1 ring-white/20" : "bg-slate-100 text-brand-navy"
      }`}
      title="Select language"
    >
      <Icon name="globe" className="h-4 w-4 shrink-0" />
      <select
        value={lang}
        onChange={onChange}
        aria-label="Select language"
        className={`cursor-pointer border-0 bg-transparent pr-1 text-xs font-semibold outline-none ${
          dark ? "text-white [&>option]:text-brand-navy" : "text-brand-navy"
        }`}
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
