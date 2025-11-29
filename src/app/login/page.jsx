"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { FcGoogle } from "react-icons/fc";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({ identifier: "", password: "" });

  React.useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "User not found") {
      setError("User not found");
    } else if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);

  const validateIdentifier = (identifier) => {
    if (!identifier) return "Username or Email is required";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    return "";
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();

    const identifierError = validateIdentifier(formData.identifier);
    const passwordError = validatePassword(formData.password);

    setFieldErrors({ identifier: identifierError, password: passwordError });
    if (identifierError || passwordError) return;

    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      identifier: formData.identifier,
      password: formData.password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/backoffice");
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    await signIn("google", { callbackUrl: "/backoffice" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-none shadow-none border-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Username or Email</Label>
              <Input
                id="identifier"
                type="text"
                value={formData.identifier}
                onChange={(e) => handleInputChange("identifier", e.target.value)}
              />
              {fieldErrors.identifier && (
                <p className="text-sm text-red-500">{fieldErrors.identifier}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
              {fieldErrors.password && (
                <p className="text-sm text-red-500">{fieldErrors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "loading..." : "Sign in"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-2 text-xs">
            <hr className="flex-1 border-t border-gray-300" />
            <span className="px-2 text-gray-500">or</span>
            <hr className="flex-1 border-t border-gray-300" />
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <FcGoogle size={20} />
            {isLoading ? "Redirecting..." : "Sign in with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
