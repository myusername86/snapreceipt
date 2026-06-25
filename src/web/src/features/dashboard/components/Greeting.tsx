import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../../auth/useCurrentUser';

export function Greeting() {
  const { t } = useTranslation();
  const { name } = useCurrentUser();
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