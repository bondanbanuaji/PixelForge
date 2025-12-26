import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
            <div className="w-full max-w-md">
                <SignIn
                    routing="path"
                    path="/sign-in"
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "bg-black/80 backdrop-blur-xl shadow-2xl border border-white/10",
                            headerTitle: "text-indigo-400",
                            headerSubtitle: "text-gray-400",
                            socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 text-white",
                            formFieldLabel: "text-gray-300",
                            formFieldInput: "bg-black/50 border-white/10 text-white focus:border-indigo-500",
                            footerActionLink: "text-indigo-400 hover:text-indigo-300",
                        },
                    }}
                />
            </div>
        </div>
    );
}
