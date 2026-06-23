import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'no', label: 'Norsk', flag: '🇳🇴' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = LANGS.find((l) => l.code === i18n.language) ?? LANGS[0];

  function pick(code: string) {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        className="flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-ink"
      >
        <Globe className="h-3.5 w-3.5 text-muted" />
        <span>{current.flag}</span>
        <span className="uppercase">{current.code}</span>
      </button>

      {open && (
        <>
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-surface shadow-xl">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => pick(l.code)}
                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm hover:bg-surface-2 ${
                  l.code === current.code ? 'text-brand' : 'text-ink'
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}