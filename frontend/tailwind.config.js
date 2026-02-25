/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
        extend: {
            colors: {
                background: "hsl(240 10% 4%)", // Deep Black-Blue
                foreground: "hsl(0 0% 98%)",
                card: {
                    DEFAULT: "hsl(240 10% 6%)",
                    foreground: "hsl(0 0% 98%)",
                },
                popover: {
                    DEFAULT: "hsl(240 10% 4%)",
                    foreground: "hsl(0 0% 98%)",
                },
                primary: {
                    DEFAULT: "hsl(263.4 70% 50.4%)", // Purple
                    foreground: "hsl(210 40% 98%)",
                },
                secondary: {
                    DEFAULT: "hsl(240 4.8% 15.9%)",
                    foreground: "hsl(0 0% 98%)",
                },
                muted: {
                    DEFAULT: "hsl(240 4.8% 15.9%)",
                    foreground: "hsl(240 5% 64.9%)",
                },
                accent: {
                    DEFAULT: "hsl(263.4 70% 30%)", // Dark Purple
                    foreground: "hsl(0 0% 98%)",
                },
                destructive: {
                    DEFAULT: "hsl(0 62.8% 30.6%)",
                    foreground: "hsl(0 0% 98%)",
                },
                border: "hsl(240 3.7% 15.9%)",
                input: "hsl(240 3.7% 15.9%)",
                ring: "hsl(263.4 70% 50.4%)",
            },
            borderRadius: {
                lg: "0.5rem",
                md: "calc(0.5rem - 2px)",
                sm: "calc(0.5rem - 4px)",
            },
        },
    },
    plugins: [],
}
