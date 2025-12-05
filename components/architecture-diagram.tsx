import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, Cpu, Database, Monitor } from "lucide-react";

export function ArchitectureDiagram() {
  const layers = [
    {
      title: "Frontend (Next.js)",
      icon: Monitor,
      description: ["User Interface", "Controls", "Settings / Configurations"],
      accent: "bg-muted",
    },
    {
      title: "LiveKit Real-time",
      icon: Cpu,
      description: ["Audio", "STT", "TTS"],
      accent: "bg-muted",
    },
    {
      title: "AI Processing",
      icon: Cpu,
      description: ["Mistral AI", "Question Generator", "Result Analyzer"],
      accent: "bg-muted",
    },
    {
      title: "Backend Storage",
      icon: Database,
      description: ["Local Storage", "Database", "File Storage"],
      accent: "bg-muted",
    },
  ] as const;

  return (
    <div className="flex flex-col items-center gap-4">
      {layers.map((layer, index) => {
        const LayerIcon = layer.icon;
        return (
          <div
            key={layer.title}
            className="flex w-full max-w-3xl flex-col items-center gap-4"
          >
            <Card className="w-full border-2 shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-2">
                  <LayerIcon className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-semibold">{layer.title}</h3>
                </div>
                <div
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns: `repeat(${layer.description.length}, minmax(0, 1fr))`,
                  }}
                >
                  {layer.description.map((item) => (
                    <div
                      key={item}
                      className={`rounded-lg border bg-background p-3 text-sm font-medium text-center ${layer.accent}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {index < layers.length - 1 && (
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
        );
      })}
    </div>
  );
}
