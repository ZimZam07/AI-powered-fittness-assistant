import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList } from "lucide-react";

interface LogEntry {
  id: string;
  date: string;
  weight_kg: number;
  sleep_hours: number;
  water_litre: number;
  workout_minutes: number;
  calories_burned: number;
  steps: number;
}

function getLogs(userId: string): LogEntry[] {
  const raw = localStorage.getItem(`fitness_logs_${userId}`);
  return raw ? JSON.parse(raw) : [];
}

function saveLogs(userId: string, logs: LogEntry[]) {
  localStorage.setItem(`fitness_logs_${userId}`, JSON.stringify(logs));
}

const DailyLog = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weight_kg: "", sleep_hours: "", water_litre: "",
    workout_minutes: "", calories_burned: "", steps: "",
  });

  useEffect(() => {
    if (user) setLogs(getLogs(user.id));
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      date: form.date,
      weight_kg: parseFloat(form.weight_kg),
      sleep_hours: parseFloat(form.sleep_hours),
      water_litre: parseFloat(form.water_litre),
      workout_minutes: parseInt(form.workout_minutes),
      calories_burned: parseInt(form.calories_burned),
      steps: parseInt(form.steps),
    };
    const updated = [entry, ...logs];
    saveLogs(user.id, updated);
    setLogs(updated);
    toast({ title: "Log added!", description: `Entry for ${form.date} saved.` });
    setForm({ ...form, weight_kg: "", sleep_hours: "", water_litre: "", workout_minutes: "", calories_burned: "", steps: "" });
  };

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">Daily Fitness Log</h1>
        <p className="page-subtitle">Track your daily progress</p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><ClipboardList className="h-4 w-4 text-primary" />New Entry</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <Label className="text-xs">Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="space-y-1"><Label className="text-xs">Weight (kg)</Label><Input type="number" step="0.1" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs">Sleep (hrs)</Label><Input type="number" step="0.1" value={form.sleep_hours} onChange={(e) => setForm({ ...form, sleep_hours: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs">Water (L)</Label><Input type="number" step="0.1" value={form.water_litre} onChange={(e) => setForm({ ...form, water_litre: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs">Workout (min)</Label><Input type="number" value={form.workout_minutes} onChange={(e) => setForm({ ...form, workout_minutes: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs">Calories Burned</Label><Input type="number" value={form.calories_burned} onChange={(e) => setForm({ ...form, calories_burned: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs">Steps</Label><Input type="number" value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} /></div>
            <div className="col-span-2 sm:col-span-4 pt-1">
              <Button type="submit" className="gradient-primary border-0 text-primary-foreground">Save Entry</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {logs.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Your Log History</CardTitle></CardHeader>
          <CardContent className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead><TableHead>Weight</TableHead><TableHead>Sleep</TableHead>
                  <TableHead>Water</TableHead><TableHead>Workout</TableHead><TableHead>Calories</TableHead><TableHead>Steps</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="text-xs">{l.date}</TableCell>
                    <TableCell>{l.weight_kg}</TableCell><TableCell>{l.sleep_hours}h</TableCell>
                    <TableCell>{l.water_litre}L</TableCell><TableCell>{l.workout_minutes}m</TableCell>
                    <TableCell>{l.calories_burned}</TableCell><TableCell>{l.steps}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DailyLog;
