import { useState } from "react";
import { useAuth, CreateAccountData } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

interface CreateAccountProps {
  onSwitchToLogin: (message?: string) => void;
}

const CreateAccount = ({ onSwitchToLogin }: CreateAccountProps) => {
  const { toast } = useToast();
  const { createAccount } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", username: "", email: "", password: "",
    age: "", gender: "", height_cm: "", weight_kg: "",
    goal: "", workout_level: "", activity_level: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required = Object.entries(form);
    for (const [k, v] of required) {
      if (!String(v).trim()) {
        toast({ title: "Missing fields", description: "Please fill all fields", variant: "destructive" });
        return;
      }
    }
    if (form.password.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) {
      toast({ title: "Invalid username", description: "3-20 chars, letters/numbers/underscore only", variant: "destructive" });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast({ title: "Invalid email", variant: "destructive" });
      return;
    }
    setLoading(true);
    const data: CreateAccountData = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      name: form.name.trim(),
      age: parseInt(form.age),
      gender: form.gender,
      height_cm: parseFloat(form.height_cm),
      weight_kg: parseFloat(form.weight_kg),
      goal: form.goal,
      workout_level: form.workout_level,
      activity_level: form.activity_level,
    };
    const error = await createAccount(data);
    setLoading(false);
    if (error) {
      toast({ title: error, variant: "destructive" });
    } else {
      onSwitchToLogin("Verification email sent. Please verify your email, then login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="h-5 w-5 text-primary" /> Create Account
          </CardTitle>
          <p className="text-sm text-muted-foreground">Your account works across all your devices</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Full Name</Label>
              <Input placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Username</Label>
              <Input placeholder="Unique username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Password</Label>
              <Input type="password" placeholder="At least 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" />
            </div>
            <div className="space-y-1.5">
              <Label>Age</Label>
              <Input type="number" placeholder="e.g. 22" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Height (cm)</Label>
              <Input type="number" placeholder="e.g. 175" value={form.height_cm} onChange={(e) => setForm({ ...form, height_cm: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Weight (kg)</Label>
              <Input type="number" placeholder="e.g. 72" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Fitness Goal</Label>
              <Select value={form.goal} onValueChange={(v) => setForm({ ...form, goal: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Workout Level</Label>
              <Select value={form.workout_level} onValueChange={(v) => setForm({ ...form, workout_level: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Daily Activity Level</Label>
              <Select value={form.activity_level} onValueChange={(v) => setForm({ ...form, activity_level: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 pt-2 space-y-3">
              <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button type="button" onClick={() => onSwitchToLogin()} className="text-primary font-medium hover:underline">
                  Back to Login
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAccount;
