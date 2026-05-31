import { useAuth } from "@/contexts/AuthContext";
import { getBMI, getBMIStatus, getCalories, getWaterIntake, getWorkoutPlan, getMealSuggestion, predictFitnessLevel } from "@/lib/fitness-utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Scale, Flame, Droplets, Dumbbell, UtensilsCrossed } from "lucide-react";

type Message = { command: string; content: string };

const commands = [
  { key: "bmi", label: "BMI", icon: Scale },
  { key: "calories", label: "Calories", icon: Flame },
  { key: "water", label: "Water", icon: Droplets },
  { key: "workout", label: "Workout", icon: Dumbbell },
  { key: "meals", label: "Meals", icon: UtensilsCrossed },
];

const QuickAssistant = () => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  const handleCommand = (cmd: string) => {
    if (!profile) return;

    const user = {
      id: profile.id, name: profile.name, age: profile.age!, gender: profile.gender as "male" | "female",
      height_cm: profile.height_cm!, weight_kg: profile.weight_kg!, goal: profile.goal as any,
      activity_level: profile.activity_level as any, workout_place: profile.workout_place as any,
    };

    let content = "";
    if (cmd === "bmi") {
      const bmi = getBMI(user.weight_kg, user.height_cm);
      content = `BMI = ${bmi.toFixed(2)} (${getBMIStatus(bmi)})`;
    } else if (cmd === "calories") {
      content = `Daily calories needed = ${getCalories(user.age, user.gender, user.height_cm, user.weight_kg, user.activity_level, user.goal)} kcal`;
    } else if (cmd === "water") {
      content = `Recommended water intake = ${getWaterIntake(user.weight_kg)} L/day`;
    } else if (cmd === "workout") {
      const level = predictFitnessLevel(user);
      const plan = getWorkoutPlan(user.goal, level.toLowerCase(), user.workout_place);
      content = `Workout Plan (${level}):\n${plan.map((p, i) => `${i + 1}. ${p}`).join("\n")}`;
    } else if (cmd === "meals") {
      const meals = getMealSuggestion(user.goal);
      content = Object.entries(meals).map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`).join("\n");
    }
    setMessages((prev) => [...prev, { command: cmd.toUpperCase(), content }]);
  };

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">Quick Fitness Assistant</h1>
        <p className="page-subtitle">Get instant fitness insights</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {commands.map((c) => (
          <Button key={c.key} variant="outline" size="sm" onClick={() => handleCommand(c.key)} className="gap-1.5">
            <c.icon className="h-3.5 w-3.5" /> {c.label}
          </Button>
        ))}
      </div>

      <div className="space-y-3 max-w-2xl">
        {messages.map((m, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex gap-3">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <MessageSquare className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary mb-1">{m.command}</p>
                <p className="text-sm whitespace-pre-line">{m.content}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {messages.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">Click a command above to get instant results.</p>
        )}
      </div>
    </div>
  );
};

export default QuickAssistant;
