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
      { name: "theme-color", content: "#821111" },
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
            __html: `(function(){try{var t=JSON.parse(localStorage.getItem("theos-logos-hybrid")||"{}").theme||"auto";var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);var standalone=matchMedia("(display-mode: standalone)").matches||matchMedia("(display-mode: fullscreen)").matches||!!navigator.standalone;document.documentElement.classList.toggle("tl-standalone",standalone);var metas=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<metas.length;i++){if(metas[i].hasAttribute("media"))metas[i].parentNode&&metas[i].parentNode.removeChild(metas[i]);else metas[i].setAttribute("content","#821111");}if(standalone){var s=document.documentElement.style;s.setProperty("--app-h","100%");s.setProperty("--app-top","0px");s.setProperty("--app-left","0px");}else{var vv=window.visualViewport;var h=Math.round((vv&&vv.height)||window.innerHeight);var top=Math.round((vv&&vv.offsetTop)||0);var left=Math.round((vv&&vv.offsetLeft)||0);var s=document.documentElement.style;s.setProperty("--app-h",h+"px");s.setProperty("--app-top",top+"px");s.setProperty("--app-left",left+"px");}}catch(e){}})();`,
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
