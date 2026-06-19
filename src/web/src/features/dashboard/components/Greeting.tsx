type GreetingProps = { name: string };

export function Greeting({ name }: GreetingProps) {
  return (
    <div className="mt-6">
      <p className="text-sm text-muted">Good morning,</p>
      <h1 className="text-2xl font-semibold">{name}</h1>
    </div>
  );
}