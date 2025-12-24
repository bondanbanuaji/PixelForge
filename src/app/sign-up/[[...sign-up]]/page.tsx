import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
            <div className="w-full max-w-md">
                <SignUp
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "bg-base-200 shadow-xl border border-slate-700",
                            headerTitle: "text-primary-400",
                            headerSubtitle: "text-slate-400",
                            socialButtonsBlockButton: "bg-base-300 border-slate-600 hover:bg-base-200",
                            formFieldLabel: "text-slate-300",
                            formFieldInput: "bg-base-300 border-slate-600 text-white",
                            footerActionLink: "text-primary-400 hover:text-primary-300",
                        },
                    }}
                />
            </div>
        </div>
    );
}
