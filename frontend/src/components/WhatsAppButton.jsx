import { site } from "../data/site.js";
import Icon from "./ui/Icon.jsx";

// Floating WhatsApp contact button.
export default function WhatsAppButton() {
  const number = site.whatsapp.replace(/[^0-9]/g, "");
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-110"
    >
      <Icon name="whatsapp" className="h-7 w-7" />
    </a>
  );
}
