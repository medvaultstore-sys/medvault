import "./globals.css";

export const metadata = {
  title: "MedVault — Premium Medical Essentials",
  description: "Smart medical kits for healthcare students and professionals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}