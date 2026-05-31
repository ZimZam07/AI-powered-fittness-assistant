import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getBMI, getBMIStatus, getCalories, getWaterIntake, predictFitnessLevel, getWorkoutPlan, getMealSuggestion } from "@/lib/fitness-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Droplets, Flame, Dumbbell, UtensilsCrossed, Scale, Heart } from "lucide-react";

const FitnessReport = () => {
  const { profile } = useAuth();

  const report = useMemo(() => {
    if (!profile) return null;
    const bmi = getBMI(profile.weight_kg!, profile.height_cm!);
    const bmiStatus = getBMIStatus(bmi);
    const calories = getCalories(profile.age!, profile.gender!, profile.height_cm!, profile.weight_kg!, profile.activity_level!, profile.goal!);
    const water = getWaterIntake(profile.weight_kg!);
    const user = {
      id: profile.id, name: profile.name, age: profile.age!, gender: profile.gender as "male" | "female",
      height_cm: profile.height_cm!, weight_kg: profile.weight_kg!, goal: profile.goal as any,
      activity_level: profile.activity_level as any, workout_place: profile.workout_place as any,
    };
    const level = predictFitnessLevel(user);
    const workout = getWorkoutPlan(profile.goal!, level.toLowerCase(), profile.workout_place!);
    const meals = getMealSuggestion(profile.goal!);
    return { bmi, bmiStatus, calories, water, level, workout, meals };
  }, [profile]);

  if (!report || !profile) return null;

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">Your Fitness Report</h1>
        <p className="page-subtitle">Complete health analysis for {profile.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Heart className="h-4 w-4 text-primary" />Profile</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Name:</span> {profile.name}</p>
            <p><span className="text-muted-foreground">Age:</span> {profile.age}</p>
            <p><span className="text-muted-foreground">Gender:</span> {profile.gender}</p>
            <p><span className="text-muted-foreground">Height:</span> {profile.height_cm} cm</p>
            <p><span className="text-muted-foreground">Weight:</span> {profile.weight_kg} kg</p>
            <p><span className="text-muted-foreground">Goal:</span> <Badge variant="outline">{profile.goal?.replace("_", " ")}</Badge></p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Scale className="h-4 w-4 text-primary" />BMI</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{report.bmi.toFixed(1)}</p>
            <Badge className="mt-1">{report.bmiStatus}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Flame className="h-4 w-4 text-destructive" />Daily Calories</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{report.calories}</p>
            <p className="text-xs text-muted-foreground">kcal/day recommended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Droplets className="h-4 w-4 text-accent" />Water Intake</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{report.water} L</p>
            <p className="text-xs text-muted-foreground">daily recommendation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Activity className="h-4 w-4 text-primary" />Predicted Level</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{report.level}</p>
            <p className="text-xs text-muted-foreground">via Random Forest model</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Dumbbell className="h-4 w-4 text-primary" />Workout Plan</CardTitle></CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {report.workout.map((w, i) => <li key={i}>{w}</li>)}
            </ol>
            <p className="text-xs text-muted-foreground mt-2 capitalize">{profile.workout_place} exercises</p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-3">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><UtensilsCrossed className="h-4 w-4 text-primary" />Meal Suggestions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(report.meals).map(([key, val]) => (
                <div key={key} className="bg-muted rounded-lg p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">{key}</p>
                  <p className="text-sm">{val}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FitnessReport;
