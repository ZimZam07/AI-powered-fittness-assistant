import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getModelResults } from "@/lib/fitness-utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Brain } from "lucide-react";

const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];

const MLModels = () => {
  const models = getModelResults();

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">ML Model Comparison</h1>
        <p className="page-subtitle">Supervised learning models trained on fitness data</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Accuracy Comparison</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={models}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                {models.map((_, i) => <Cell key={i} fill={colors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {models.map((m, i) => (
          <Card key={m.name}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" style={{ color: colors[i] }} />
                  <p className="font-semibold text-sm">{m.name}</p>
                </div>
                <Badge style={{ backgroundColor: colors[i], color: "white" }}>{m.accuracy}%</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{m.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Models trained with 70/30 train-test split on sample fitness dataset. Classes: beginner, intermediate, advanced.
      </p>
    </div>
  );
};

export default MLModels;
