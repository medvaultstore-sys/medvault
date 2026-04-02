import "./globals.css";
import ChatWidget from "./components/ChatWidget";

export const metadata = {
  title: "MedVault — Premium Medical Essentials",
  description: "Smart medical kits for healthcare students and professionals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
