/**
 * Temporary scaffold placeholder used while the route tree is wired up. Each
 * stub is replaced by its real page in the milestone that owns that feature.
 */
export function RouteStub({ title }: { title: string }) {
  return (
    <div className="container py-16">
      <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
        Coming up
      </p>
      <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
    </div>
  );
}
