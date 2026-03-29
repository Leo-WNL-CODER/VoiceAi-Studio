import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent mb-2">
          VoiceAI Studio
        </h1>
        <p className="text-muted text-sm mb-8">
          Create your account to get started
        </p>
        <SignUp />
      </div>
    </div>
  );
}
