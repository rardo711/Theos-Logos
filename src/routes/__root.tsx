import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Theos Logos";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content",
      },
      { title: APP_NAME },
      {
        name: "theme-color",
        content: "#fffdf8",
        media: "(prefers-color-scheme: light)",
      },
      {
        name: "theme-color",
        content: "#1c1814",
        media: "(prefers-color-scheme: dark)",
      },
      { name: "color-scheme", content: "light dark" },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      {
        name: "description",
        content:
          "A scholarly Bible study desk. Scripture first. Reception from Fathers, Reformers, and confessions.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/icon-512.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=JSON.parse(localStorage.getItem("theos-logos-hybrid")||"{}").theme||"auto";var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=t==="auto"?"light dark":d?"dark":"light";document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.remove();});function add(c,media){var el=document.createElement("meta");el.setAttribute("name","theme-color");el.setAttribute("content",c);if(media)el.setAttribute("media",media);document.head.appendChild(el);}if(t==="light")add("#fffdf8");else if(t==="dark")add("#1c1814");else{add("#fffdf8","(prefers-color-scheme: light)");add("#1c1814","(prefers-color-scheme: dark)");}var standalone=matchMedia("(display-mode: standalone)").matches||matchMedia("(display-mode: fullscreen)").matches||!!navigator.standalone;document.documentElement.classList.toggle("tl-standalone",standalone);if(standalone){var s=document.documentElement.style;s.setProperty("--app-h","100%");s.setProperty("--app-top","0px");s.setProperty("--app-left","0px");}else{var vv=window.visualViewport;var h=Math.round((vv&&vv.height)||window.innerHeight);var top=Math.round((vv&&vv.offsetTop)||0);var left=Math.round((vv&&vv.offsetLeft)||0);var s=document.documentElement.style;s.setProperty("--app-h",h+"px");s.setProperty("--app-top",top+"px");s.setProperty("--app-left",left+"px");}}catch(e){}})();`,
          }}
        />
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
