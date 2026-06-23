import { useTranslation } from 'react-i18next';

type GreetingProps = { name: string };

export function Greeting({ name }: GreetingProps) {
  const { t } = useTranslation();
  const hour = new Date().getHours();
  const key =
    hour < 12 ? 'greeting_morning' : hour < 18 ? 'greeting_afternoon' : 'greeting_evening';

  return (
    <div className="mt-6">
      <p className="text-sm text-muted">{t(key)},</p>
      <h1 className="text-2xl font-semibold">{name}</h1>
    </div>
  );
}