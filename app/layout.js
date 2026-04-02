import "./globals.css";
import ChatWidget from "./components/ChatWidget";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  metadataBase: new URL("https://medvault.store"),
  title: {
    default: "MedVault — Medical Pouch & Kit for MBBS Students | SRM Campus",
    template: "%s | MedVault",
  },
  description: "MedVault sells premium medical pouches, diagnostic kits, and clinical instruments for MBBS & nursing students at SRM campus. Stethoscope, BP cuff, reflex hammer & more. Order on WhatsApp.",
  keywords: [
    "medical pouch", "MBBS kit", "SRM medical store", "medical kit for students",
    "stethoscope pouch", "clinical kit", "diagnostic kit", "medical instruments",
    "nursing kit", "SRM campus", "medvault", "medical essentials", "doctor kit",
    "medical bag", "clinical examination kit", "BP cuff", "reflex hammer", "penlight",
  ],
  authors: [{ name: "MedVault", url: "https://medvault.store" }],
  creator: "MedVault",
  publisher: "MedVault",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://medvault.store",
    siteName: "MedVault",
    title: "MedVault — Premium Medical Kits for MBBS Students",
    description: "Premium medical pouches, diagnostic kits & instruments for healthcare students. Trusted by 4000+ students at SRM campus.",
    images: [
      {
        url: "/pouch.jpg",
        width: 1080,
        height: 1080,
        alt: "MedVault Premium Medical Pouch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MedVault — Premium Medical Kits for MBBS Students",
    description: "Premium medical pouches, diagnostic kits & instruments for healthcare students at SRM campus.",
    images: ["/pouch.jpg"],
  },
  alternates: {
    canonical: "https://medvault.store",
  },
  category: "medical supplies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "MedVault",
              description: "Premium medical pouches, diagnostic kits and clinical instruments for MBBS and nursing students.",
              url: "https://medvault.store",
              logo: "https://medvault.store/pouch.jpg",
              image: "https://medvault.store/pouch.jpg",
              telephone: "+918248613274",
              address: {
                "@type": "PostalAddress",
                addressLocality: "SRM Campus",
                addressRegion: "Tamil Nadu",
                addressCountry: "IN",
              },
              priceRange: "₹999 - ₹4299",
              currenciesAccepted: "INR",
              paymentAccepted: "WhatsApp Order",
              openingHours: "Mo-Su 09:00-21:00",
              sameAs: [],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Medical Kits & Instruments",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "MedVault Pouch — Premium",
                      description: "All-in-one structured storage for medical instruments",
                      image: "https://medvault.store/pouch.jpg",
                      brand: { "@type": "Brand", name: "MedVault" },
                      offers: {
                        "@type": "Offer",
                        price: "2499",
                        priceCurrency: "INR",
                        availability: "https://schema.org/InStock",
                        url: "https://medvault.store",
                      },
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "MedVault Diagnostic Kit",
                      description: "Complete first-year MBBS bundle with instruments",
                      brand: { "@type": "Brand", name: "MedVault" },
                      offers: {
                        "@type": "Offer",
                        price: "4299",
                        priceCurrency: "INR",
                        availability: "https://schema.org/InStock",
                        url: "https://medvault.store",
                      },
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
