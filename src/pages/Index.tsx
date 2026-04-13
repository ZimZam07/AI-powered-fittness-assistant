import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Brain, MessageSquare, ClipboardList } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getBMI, getBMIStatus, getCalories, getWaterIntake } from "@/lib/fitness-utils";

const features = [
  { icon: Activity, title: "Smart Fitness Tracking", desc: "Log workouts, meals, and daily progress with personalized insights" },
  { icon: Brain, title: "ML-Powered Analysis", desc: "Logistic Regression, Decision Trees, Random Forest & ANN models" },
  { icon: ClipboardList, title: "Daily Fitness Log", desc: "Track weight, sleep, water, workouts, calories and steps" },
  { icon: MessageSquare, title: "AI Chatbot", desc: "Ask anything about your fitness journey powered by AI" },
];

const Index = () => {
  const { profile } = useAuth();

  const bmi = profile?.weight_kg && profile?.height_cm ? getBMI(profile.weight_kg, profile.height_cm) : null;
  const calories = profile ? getCalories(profile.age!, profile.gender!, profile.height_cm!, profile.weight_kg!, profile.activity_level!, profile.goal!) : null;
  const water = profile?.weight_kg ? getWaterIntake(profile.weight_kg) : null;

  return (
    <div className="page-container">
      <div className="gradient-hero rounded-2xl p-8 md:p-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-2">
          <Activity className="h-3 w-3" /> Welcome back, {profile?.name}!
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground leading-tight">
          AI Powered Fitness<br />Assistant
        </h1>
        <p className="text-sidebar-foreground max-w-xl mx-auto text-sm md:text-base">
          Your personalized fitness guidance using machine learning and AI.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button asChild size="lg" className="gradient-primary border-0 text-primary-foreground font-semibold">
            <Link to="/report">View Report</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-sidebar-foreground/30 text-primary-foreground hover:bg-sidebar-accent">
            <Link to="/chatbot">Ask AI</Link>
          </Button>
        </div>
      </div>

      {bmi && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card">
            <p className="text-xs text-muted-foreground">Your BMI</p>
            <p className="text-2xl font-bold text-primary">{bmi.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">{getBMIStatus(bmi)}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-muted-foreground">Daily Calories</p>
            <p className="text-2xl font-bold text-foreground">{calories} kcal</p>
            <p className="text-xs text-muted-foreground">recommended</p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-muted-foreground">Water Intake</p>
            <p className="text-2xl font-bold text-foreground">{water} L</p>
            <p className="text-xs text-muted-foreground">daily target</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f) => (
          <div key={f.title} className="stat-card group">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm text-card-foreground">{f.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground pt-4">
        AI Powered Fitness Assistant — AIML College Project
      </p>
    </div>
  );
};

export default Index;
