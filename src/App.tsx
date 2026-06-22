import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

/**
 * Commit 1 placeholder: a small design-system smoke screen that proves the
 * token pipeline (Tailwind config -> CSS variables -> semantic utilities)
 * renders before any feature code is layered on top. Replaced by the router
 * in the next stage.
 */
function App() {
  return (
    <div className="min-h-dvh">
      <div className="container flex max-w-3xl flex-col gap-8 py-16">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
              Multi-Partner Insurance
            </p>
            <h1 className="text-2xl font-bold">Onboarding</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Design system online</CardTitle>
              <Badge variant="success">Ready</Badge>
            </div>
            <CardDescription>
              Semantic tokens are wired through the Tailwind theme and resolve to
              CSS custom properties, ready for partner theming.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
