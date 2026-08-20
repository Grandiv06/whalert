import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "والرت | پلتفرم سیگنال معاملاتی",
  description: "پلتفرمی پیشرو برای ارائه سیگنال‌های معاملاتی",
  icons: {
    icon: "/icon.svg?v=1",
    apple: "/icon.svg?v=1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wu3m2qxjgk");
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S52CBMEZ9K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S52CBMEZ9K');
          `}
        </Script>
        <Script id="raychat-widget" strategy="afterInteractive">
          {`
            window.RAYCHAT_TOKEN = "757731e6-1e56-4b1f-ba75-f512a58c7f6e";
            (function () {
              function setRaychatLeft() {
                if (window.Raychat && typeof window.Raychat.setPosition === "function") {
                  window.Raychat.setPosition({
                    left: "24px",
                    bottom: "24px"
                  });
                }
              }
              window.addEventListener("raychat_ready", setRaychatLeft);

              var count = 0;
              var interval = setInterval(function () {
                count++;
                if (window.Raychat && typeof window.Raychat.setPosition === "function") {
                  setRaychatLeft();
                  clearInterval(interval);
                }
                if (count > 50) clearInterval(interval);
              }, 200);

              var d = document;
              var s = d.createElement("script");
              s.src = "https://widget-react.raychat.io/install/widget.js";
              s.async = 1;
              d.getElementsByTagName("head")[0].appendChild(s);
            })();
          `}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
