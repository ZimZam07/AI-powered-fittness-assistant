export interface User {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  height_cm: number;
  weight_kg: number;
  goal: "weight_loss" | "muscle_gain" | "maintenance";
  activity_level: "low" | "medium" | "high";
  workout_place: "home" | "gym";
}

export interface FitnessLog {
  id: string;
  date: string;
  name: string;
  weight_kg: number;
  sleep_hours: number;
  water_litre: number;
  workout_minutes: number;
  calories_burned: number;
  steps: number;
}

export function getBMI(weight: number, height_cm: number): number {
  const h = height_cm / 100;
  return weight / (h * h);
}

export function getBMIStatus(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function getCalories(
  age: number, gender: string, height_cm: number,
  weight_kg: number, activity_level: string, goal: string
): number {
  let bmr: number;
  if (gender.toLowerCase() === "male") {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  }
  const levelMap: Record<string, number> = { low: 1.2, medium: 1.55, high: 1.75 };
  let calories = bmr * (levelMap[activity_level.toLowerCase()] || 1.2);
  if (goal.toLowerCase() === "weight_loss") calories -= 300;
  else if (goal.toLowerCase() === "muscle_gain") calories += 300;
  return Math.round(calories * 100) / 100;
}

export function getWaterIntake(weight_kg: number): number {
  return Math.round(weight_kg * 0.035 * 100) / 100;
}

export function getActivityNumber(activity: string): number {
  const data: Record<string, number> = { low: 1, medium: 2, high: 3 };
  return data[activity.toLowerCase()] || 1;
}

export function getWorkoutPlan(goal: string, level: string, place: string): string[] {
  const plans: Record<string, Record<string, string[]>> = {
    weight_loss: {
      beginner: ["Walking", "Jumping Jacks", "Bodyweight Squats", "Stretching"],
      intermediate: ["Jogging", "Burpees", "Lunges", "Mountain Climbers", "Plank"],
      advanced: ["HIIT", "Sprint Intervals", "Jump Squats", "Burpees", "Core Circuit"],
    },
    muscle_gain: {
      beginner: ["Push-ups", "Squats", "Glute Bridge", "Plank"],
      intermediate: ["Push-ups", "Lunges", "Dumbbell Press", "Rows", "Plank"],
      advanced: ["Bench Press", "Deadlift", "Squats", "Shoulder Press", "Pull-ups"],
    },
    maintenance: {
      beginner: ["Brisk Walk", "Yoga", "Light Squats", "Stretching"],
      intermediate: ["Cycling", "Push-ups", "Squats", "Core Work"],
      advanced: ["Mixed Cardio", "Strength Circuit", "Mobility", "Core Training"],
    },
  };
  let plan = plans[goal.toLowerCase()]?.[level.toLowerCase()] || ["Walking", "Stretching"];
  if (place.toLowerCase() === "home") {
    const gymOnly = new Set(["Bench Press", "Deadlift", "Shoulder Press", "Rows"]);
    const filtered = plan.filter((item) => !gymOnly.has(item));
    if (filtered.length > 0) plan = filtered;
  }
  return plan;
}

export function getMealSuggestion(goal: string): Record<string, string> {
  const meals: Record<string, Record<string, string>> = {
    weight_loss: {
      breakfast: "Oats + fruits + boiled eggs",
      lunch: "Grilled paneer/chicken + salad + roti",
      dinner: "Soup + vegetables + light protein",
    },
    muscle_gain: {
      breakfast: "Milk + banana + peanut butter sandwich",
      lunch: "Rice + dal + paneer/chicken + curd",
      dinner: "Chapati + vegetables + high protein source",
    },
    maintenance: {
      breakfast: "Poha/upma + fruit",
      lunch: "Balanced home meal with salad",
      dinner: "Light balanced meal with protein",
    },
  };
  return meals[goal.toLowerCase()] || meals.maintenance;
}

export function getModelResults() {
  return [
    { name: "Logistic Regression", accuracy: 66.67, description: "Linear model that finds decision boundaries using probability estimation. Good baseline for classification." },
    { name: "Decision Tree", accuracy: 83.33, description: "Tree-based model that splits data using feature thresholds. Interpretable but can overfit." },
    { name: "Random Forest", accuracy: 100.0, description: "Ensemble of decision trees that votes on the final prediction. Reduces overfitting." },
    { name: "ANN (MLP)", accuracy: 50.0, description: "Artificial Neural Network with hidden layers. Learns complex patterns but needs more data." },
  ];
}

export function predictFitnessLevel(user: User): string {
  const actNum = getActivityNumber(user.activity_level);
  if (actNum >= 3) return "Advanced";
  if (actNum >= 2) return "Intermediate";
  return "Beginner";
}

export interface ClusterPoint {
  weight_kg: number;
  workout_minutes: number;
  activity_level_num: number;
  sleep_hours: number;
  cluster: number;
  label: string;
}

export function getClusterData(): ClusterPoint[] {
  const raw = [
    { weight_kg: 52, workout_minutes: 20, activity_level_num: 1, sleep_hours: 5 },
    { weight_kg: 60, workout_minutes: 30, activity_level_num: 2, sleep_hours: 7 },
    { weight_kg: 72, workout_minutes: 45, activity_level_num: 3, sleep_hours: 8 },
    { weight_kg: 82, workout_minutes: 15, activity_level_num: 1, sleep_hours: 4 },
    { weight_kg: 88, workout_minutes: 25, activity_level_num: 2, sleep_hours: 6 },
    { weight_kg: 68, workout_minutes: 50, activity_level_num: 3, sleep_hours: 9 },
    { weight_kg: 75, workout_minutes: 35, activity_level_num: 2, sleep_hours: 7 },
    { weight_kg: 48, workout_minutes: 10, activity_level_num: 1, sleep_hours: 5 },
    { weight_kg: 57, workout_minutes: 20, activity_level_num: 2, sleep_hours: 6 },
    { weight_kg: 85, workout_minutes: 60, activity_level_num: 3, sleep_hours: 8 },
    { weight_kg: 79, workout_minutes: 40, activity_level_num: 2, sleep_hours: 7 },
    { weight_kg: 65, workout_minutes: 28, activity_level_num: 2, sleep_hours: 7 },
    { weight_kg: 90, workout_minutes: 12, activity_level_num: 1, sleep_hours: 4 },
    { weight_kg: 73, workout_minutes: 55, activity_level_num: 3, sleep_hours: 8 },
    { weight_kg: 62, workout_minutes: 32, activity_level_num: 2, sleep_hours: 7 },
    { weight_kg: 58, workout_minutes: 18, activity_level_num: 1, sleep_hours: 5 },
    { weight_kg: 77, workout_minutes: 52, activity_level_num: 3, sleep_hours: 8 },
    { weight_kg: 55, workout_minutes: 22, activity_level_num: 2, sleep_hours: 6 },
    { weight_kg: 81, workout_minutes: 38, activity_level_num: 2, sleep_hours: 7 },
    { weight_kg: 69, workout_minutes: 48, activity_level_num: 3, sleep_hours: 8 },
  ];

  const labels = ["Low Activity", "Moderate Activity", "Active"];
  return raw.map((r) => {
    let cluster: number;
    if (r.activity_level_num <= 1 && r.workout_minutes < 25) cluster = 0;
    else if (r.activity_level_num >= 3 || r.workout_minutes >= 45) cluster = 2;
    else cluster = 1;
    return { ...r, cluster, label: labels[cluster] };
  });
}
