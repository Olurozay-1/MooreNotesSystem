import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function AuthPage() {
  const { register: registerUser, login } = useUser();
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm();
  const [isLogin, setIsLogin] = useState(true);

  const onSubmit = async (data: any) => {
    try {
      const result = isLogin 
        ? await login(data)
        : await registerUser(data);

      if (!result.ok) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
      reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a73e8]">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Moore Notes</CardTitle>
          <p className="text-sm text-[#1a73e8] mt-1">Smock Walk</p>
          <p className="text-lg mt-4">{isLogin ? 'Login' : 'Register'}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    {...register("firstName")}
                    placeholder="First Name"
                    required
                  />
                  <Input
                    {...register("lastName")}
                    placeholder="Last Name"
                    required
                  />
                </div>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email Address"
                  required
                />
                <Select {...register("role")} defaultValue="carer">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carer">Carer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            <Input
              {...register("username")}
              placeholder="Username"
              required
            />
            <Input
              {...register("password")}
              type="password"
              placeholder="Password"
              required
            />
            <Button type="submit" className="w-full">
              {isLogin ? 'Login' : 'Register'}
            </Button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-[#1a73e8] hover:underline"
              >
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}