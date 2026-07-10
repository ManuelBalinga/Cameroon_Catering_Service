"use client";

import { useI18n } from "@/context/I18nContext";

/** WhatsApp is the default way Cameroonians reach a business — make it one tap. */
export function WhatsAppButton({
  phone,
  message,
  className = "",
  compact = false,
}: {
  phone: string; // international digits, no +
  message?: string;
  className?: string;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const href = `https://wa.me/${phone}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-whatsapp ${compact ? "btn-sm" : ""} ${className}`}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6 2 .8 2.7.9 3.6.8.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
        <path d="M12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.5A10 10 0 1012 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-2.9.9.9-2.8-.2-.3A8.2 8.2 0 1120.2 12 8.2 8.2 0 0112 20.2z" />
      </svg>
      {t("cta.contactWhatsapp")}
    </a>
  );
}
