import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getBMI, getBMIStatus, getCalories, getWaterIntake, getWorkoutPlan, getMealSuggestion, predictFitnessLevel } from "@/lib/fitness-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

function generateReply(query: string, profile: any): string {
  const q = query.toLowerCase();
  if (!profile) return "Please complete your profile first.";

  const bmi = getBMI(profile.weight_kg, profile.height_cm);
  const calories = getCalories(profile.age, profile.gender, profile.height_cm, profile.weight_kg, profile.activity_level, profile.goal);
  const water = getWaterIntake(profile.weight_kg);
  const level = predictFitnessLevel({ id: profile.id, name: profile.name, age: profile.age, gender: profile.gender, height_cm: profile.height_cm, weight_kg: profile.weight_kg, goal: profile.goal, activity_level: profile.activity_level, workout_place: profile.workout_place });
  const workout = getWorkoutPlan(profile.goal, level.toLowerCase(), profile.workout_place);
  const meals = getMealSuggestion(profile.goal);

  if (q.includes("bmi")) return `Your BMI is ${bmi.toFixed(1)} (${getBMIStatus(bmi)}). ${bmi < 25 ? "You're in a healthy range!" : "Consider adjusting your diet and exercise."}`;
  if (q.includes("calorie")) return `Your recommended daily intake is ${calories} kcal based on your profile and ${profile.goal.replace("_", " ")} goal.`;
  if (q.includes("water")) return `You should drink about ${water} liters of water daily based on your weight of ${profile.weight_kg} kg.`;
  if (q.includes("workout") || q.includes("exercise")) return `Your workout plan (${level} level):\n${workout.map((w: string, i: number) => `${i + 1}. ${w}`).join("\n")}`;
  if (q.includes("meal") || q.includes("diet") || q.includes("food")) return `Meal suggestions for ${profile.goal.replace("_", " ")}:\n• Breakfast: ${meals.breakfast}\n• Lunch: ${meals.lunch}\n• Dinner: ${meals.dinner}`;
  if (q.includes("level") || q.includes("fitness")) return `Based on your activity level, you're predicted as: ${level}`;
  if (q.includes("hello") || q.includes("hi")) return `Hello ${profile.name}! 👋 How can I help with your fitness journey today? Try asking about BMI, calories, workout, meals, or water intake.`;
  return `Great question! Here's a quick summary:\n• BMI: ${bmi.toFixed(1)} (${getBMIStatus(bmi)})\n• Calories: ${calories} kcal/day\n• Water: ${water} L/day\n• Level: ${level}\n\nAsk me about specific topics like "workout plan", "meal suggestion", or "BMI"!`;
}

const Chatbot = () => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const reply = generateReply(input.trim(), profile);
    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: reply }]);
    setInput("");
  };

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">AI Fitness Chatbot</h1>
        <p className="page-subtitle">Ask anything about your fitness journey</p>
      </div>

      <Card className="flex flex-col h-[60vh] max-w-3xl">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12 space-y-2">
                <Bot className="h-10 w-10 text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Hi {profile?.name || "there"}! Ask me about your BMI, workout plan, diet tips, or fitness level.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-line ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <CardContent className="p-3 border-t">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              placeholder="Ask about your fitness..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" size="icon" disabled={!input.trim()} className="gradient-primary border-0 text-primary-foreground shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;
