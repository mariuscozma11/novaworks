"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiClient } from "@/lib/api";
import { AuthService } from "@/lib/auth";
import { getDictionary } from "@/lib/get-dictionary-client";
import type { Locale } from "@/lib/i18n-config";

function AuthPageContent({ params }: { params: Promise<{ lang: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Locale>("en");
  const [dict, setDict] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "login"
  );

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    params.then(({ lang: langParam }) => {
      setLang(langParam as Locale);
      getDictionary(langParam as Locale).then(setDict);
    });
  }, [params]);

  if (!dict) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const response = await ApiClient.login(
        loginData.email,
        loginData.password
      );

      // Log response for debugging
      console.log("Login response:", {
        user: response.user,
        role: response.user.role,
        isAdmin: response.user.role === "admin",
      });

      AuthService.setAuth(response.access_token, response.user);

      // Force a full page reload to ensure AuthProvider re-initializes
      if (response.user.role === "admin") {
        window.location.href = `/${lang}/admin/dashboard`;
      } else {
        window.location.href = `/${lang}`;
      }
    } catch (err: any) {
      setLoginError(err.message || dict.auth.loginError);
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterLoading(true);

    try {
      const response = await ApiClient.register(registerData);

      // Log response for debugging
      console.log("Register response:", {
        user: response.user,
        role: response.user.role,
      });

      AuthService.setAuth(response.access_token, response.user);

      // Force a full page reload to ensure AuthProvider re-initializes
      window.location.href = `/${lang}`;
    } catch (err: any) {
      setRegisterError(err.message || dict.auth.registerError);
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">NovaWorks</CardTitle>
          <CardDescription>{dict.auth.loginDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{dict.auth.login}</TabsTrigger>
                <TabsTrigger value="register">{dict.auth.register}</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4 mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{dict.auth.email}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder={dict.auth.emailPlaceholder}
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{dict.auth.password}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder={dict.auth.passwordPlaceholder}
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  {loginError && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      {loginError}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginLoading}
                  >
                    {loginLoading ? dict.auth.loggingIn : dict.auth.loginButton}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4 mt-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{dict.auth.firstName}</Label>
                      <Input
                        id="firstName"
                        placeholder={dict.auth.firstNamePlaceholder}
                        value={registerData.firstName}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            firstName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{dict.auth.lastName}</Label>
                      <Input
                        id="lastName"
                        placeholder={dict.auth.lastNamePlaceholder}
                        value={registerData.lastName}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            lastName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">{dict.auth.email}</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder={dict.auth.emailPlaceholder}
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">
                      {dict.auth.password}
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder={dict.auth.passwordPlaceholder}
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {registerError && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      {registerError}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerLoading}
                  >
                    {registerLoading
                      ? dict.auth.registering
                      : dict.auth.registerButton}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div>Loading...</div>
        </div>
      }
    >
      <AuthPageContent params={params} />
    </Suspense>
  );
}
