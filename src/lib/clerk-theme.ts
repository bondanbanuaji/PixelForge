import { Theme } from "@clerk/types";

export const clerkAppearance: Theme = {
    variables: {
        colorPrimary: "#6366F1", // Indigo 500
        colorBackground: "#000000",
        colorInputBackground: "rgba(255, 255, 255, 0.05)",
        colorInputText: "#ffffff",
        colorText: "#ffffff",
        colorTextSecondary: "#94a3b8", // Slate 400
        colorTextOnPrimaryBackground: "#ffffff",
        borderRadius: "0.75rem",
    },
    elements: {
        card: "bg-black/80 backdrop-blur-xl shadow-2xl border border-white/10",
        headerTitle: "text-indigo-400 font-bold text-2xl tracking-tight",
        headerSubtitle: "text-gray-400",
        socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all duration-200",
        socialButtonsBlockButtonText: "text-white font-medium",
        formFieldLabel: "text-gray-300 font-medium pb-1",
        formFieldInput: "bg-black/50 border-white/10 text-white focus:border-indigo-500 transition-all",
        footerActionLink: "text-indigo-400 hover:text-indigo-300 font-semibold",
        formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all",
        dividerLine: "bg-white/10",
        dividerText: "text-gray-500",
        formFieldAction: "text-indigo-400 hover:text-indigo-300",
        identityPreviewText: "text-white",
        identityPreviewEditButtonIcon: "text-indigo-400",

        // Deep customization for UserButton and Profile Modal
        userButtonPopoverCard: "bg-black/90 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden",
        userButtonPopoverFooter: "hidden",
        userButtonPopoverActionButton: "hover:bg-white/5 transition-colors",
        userButtonPopoverActionButtonText: "text-gray-300",
        userButtonPopoverActionButtonIcon: "text-indigo-400",

        userProfileCard: "bg-black/90 backdrop-blur-2xl border border-white/10 shadow-2xl",
        userProfileNavbar: "border-r border-white/5 bg-black/50",
        userProfileNavbarButton: "text-gray-400 hover:text-white hover:bg-white/5",
        userProfileNavbarButtonActive: "text-indigo-400 bg-indigo-500/10",

        modalBackdrop: "backdrop-blur-md bg-black/40",
        modalCloseButton: "text-gray-400 hover:text-white",

        // Specific cleanup to hide Clerk branding where possible via appearance
        footer: "hidden",
        internal: "hidden",
    }
};
