import { useEffect, useState } from "react";

function measure(): string {
  const vv = window.visualViewport;
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;top:0;left:0;visibility:hidden;pointer-events:none;height:100lvh;width:0;";
  document.body.appendChild(probe);
  const lvh = probe.getBoundingClientRect().height;
  probe.remove();
  const body = document.body.getBoundingClientRect();
  const shell = document
    .querySelector(".tl-shell")
    ?.getBoundingClientRect();
  const scroll = document.querySelector(".tl-scroll") as HTMLElement | null;
  const read = document.querySelector(".tl-read") as HTMLElement | null;
  const readBottom =
    (read && getComputedStyle(read).getPropertyValue("--read-bottom")) ||
    getComputedStyle(document.documentElement).getPropertyValue("--read-bottom");
  const lines = [
    `innerHeight=${window.innerHeight}`,
    `vv.height=${vv ? Math.round(vv.height) : "n/a"} vv.offsetTop=${vv ? Math.round(vv.offsetTop) : "n/a"}`,
    `screen.height=${window.screen.height} dpr=${window.devicePixelRatio}`,
    `docEl.clientHeight=${document.documentElement.clientHeight}`,
    `body h=${Math.round(body.height)} top=${Math.round(body.top)}`,
    `100lvh=${Math.round(lvh)}px`,
    `standalone mq=${window.matchMedia("(display-mode: standalone)").matches}`,
    `tl-standalone class=${document.documentElement.classList.contains("tl-standalone")}`,
    `tl-shell h=${shell ? Math.round(shell.height) : "n/a"}`,
    `tl-scroll clientH=${scroll ? scroll.clientHeight : "n/a"}`,
    `--read-bottom=${(readBottom || "n/a").trim()}`,
  ];
  return lines.join("\n");
}

/** Hidden on-device diagnostic. Toggle with 5 quick taps on the top bar. */
export function DiagOverlay() {
  const [text, setText] = useState(() => measure());
  useEffect(() => {
    const update = () => setText(measure());
    const id = window.setInterval(update, 1000);
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        top: 8,
        left: 8,
        zIndex: 9999,
        background: "rgba(0,0,0,0.88)",
        color: "#4ade80",
        font: "11px/1.6 monospace",
        padding: "10px 12px",
        borderRadius: 8,
        maxWidth: "94vw",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
}
