import { useMemo } from "react";
import { getClusterData } from "@/lib/fitness-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const clusterColors = ["#ef4444", "#f59e0b", "#10b981"];
const clusterLabels = ["Low Activity Group", "Moderate Activity Group", "Active Group"];

const Clustering = () => {
  const data = useMemo(() => getClusterData(), []);

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">K-Means Clustering</h1>
        <p className="page-subtitle">Users grouped into 3 clusters by activity patterns</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Weight vs Workout Minutes (K=3)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="weight_kg" name="Weight (kg)" tick={{ fontSize: 11 }} />
              <YAxis dataKey="workout_minutes" name="Workout (min)" tick={{ fontSize: 11 }} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Scatter data={data} name="Users">
                {data.map((d, i) => <Cell key={i} fill={clusterColors[d.cluster]} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {clusterLabels.map((label, i) => {
          const count = data.filter((d) => d.cluster === i).length;
          return (
            <Card key={i}>
              <CardContent className="p-5 flex items-center gap-3">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: clusterColors[i] }} />
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{count} users in this cluster</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">K-Means clustering with K=3 on features: weight, activity level, workout minutes, sleep hours.</p>
    </div>
  );
};

export default Clustering;
