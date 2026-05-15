import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Connect } from "@stacks/connect-react";
import { userSession } from "@/lib/stacks-auth";

createRoot(document.getElementById("root")!).render(
    <Connect
        authOptions={{
            appDetails: {
                name: "Loopin",
                icon: window.location.origin + "/logo.svg",
            },
            redirectTo: "/",
            onFinish: () => {
                window.location.reload();
            },
            userSession,
        }}
    >
        <App />
    </Connect>
);
