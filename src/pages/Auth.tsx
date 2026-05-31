import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Activity, LogIn } from "lucide-react";

interface AuthProps {
  onSwitchToSignup: () => void;
  successMessage?: string;
}

const Auth = ({ onSwitchToSignup, successMessage }: AuthProps) => {
  const { toast } = useToast();
  const { login, resetPassword } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    const error = await login(identifier.trim(), password);
    setLoading(false);
    if (error) toast({ title: error, variant: "destructive" });
    else toast({ title: "Welcome back." });
  };

  const handleForgot = async () => {
    if (!identifier.trim() || !identifier.includes("@")) {
      toast({ title: "Enter your email above to reset password", variant: "destructive" });
      return;
    }
    const error = await resetPassword(identifier.trim());
    if (error) toast({ title: error, variant: "destructive" });
    else toast({ title: "Password reset email sent.", description: "Check your inbox." });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl gradient-primary mx-auto">
            <Activity className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">AI Powered Fitness Assistant</h1>
          <p className="text-sm text-muted-foreground">Login from any device with the same account</p>
        </div>

        {successMessage && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-primary">{successMessage}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <LogIn className="h-4 w-4 text-primary" /> Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Username or Email</Label>
                <Input
                  placeholder="Enter username or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </Button>
              <button
                type="button"
                onClick={handleForgot}
                className="text-xs text-muted-foreground hover:text-primary block mx-auto"
              >
                Forgot password?
              </button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          New user?{" "}
          <button onClick={onSwitchToSignup} className="text-primary font-medium hover:underline">
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
