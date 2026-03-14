import { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";

const BACKEND_URL = `${window.location.protocol}//${window.location.hostname}:3001`;
const socket = io(BACKEND_URL);

/* ─── Google Fonts injected once ─── */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Creepster&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=VT323&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
};

/* ─── Global keyframe styles ─── */
const GlobalStyles = () => (
  <style>{`
    @keyframes scanline   { 0%{top:-30%} 100%{top:110%} }
    @keyframes flicker    { 0%,94%,100%{opacity:1} 95%{opacity:.25} 97%{opacity:.7} }
    @keyframes blink-r    { 0%,100%{opacity:1} 50%{opacity:.2} }
    @keyframes blink-a    { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes pulse-r    { 0%,100%{box-shadow:0 0 10px #ff000044,0 0 20px #ff000022} 50%{box-shadow:0 0 30px #ff0000aa,0 0 60px #ff000055} }
    @keyframes spin-slow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes wave       { 0%,100%{transform:scaleY(.25)} 50%{transform:scaleY(1)} }
    @keyframes glitch1    { 0%,89%,100%{transform:translate(0)} 90%{transform:translate(-3px,1px)} 92%{transform:translate(3px,-1px)} }
    @keyframes glitch2    { 0%,89%,100%{transform:translate(0)} 91%{transform:translate(3px,-1px)} 93%{transform:translate(-3px,1px)} }
    @keyframes slideIn    { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
    @keyframes entrance   { from{opacity:0;transform:perspective(900px) rotateX(18deg) translateY(36px)} to{opacity:1;transform:perspective(900px) rotateX(0) translateY(0)} }
    @keyframes connpulse  { 0%,100%{opacity:.25} 50%{opacity:1} }
    @keyframes vu-anim    { from{transform:scaleY(.2)} to{transform:scaleY(1)} }
    @keyframes float-p    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

    *{box-sizing:border-box;cursor:crosshair!important}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:#050000}
    ::-webkit-scrollbar-thumb{background:#440000;border-radius:2px}

    .font-creepster { font-family:'Creepster',cursive }
    .font-orbitron  { font-family:'Orbitron',monospace }
    .font-mono-st   { font-family:'Share Tech Mono',monospace }
    .font-vt323     { font-family:'VT323',monospace }

    .glow-r   { text-shadow:0 0 8px #ff0000,0 0 20px #ff000088 }
    .glow-a   { text-shadow:0 0 8px #ff6600,0 0 20px #ff660088 }
    .glow-g   { text-shadow:0 0 8px #00ff41,0 0 16px #00ff4166 }
    .box-r    { box-shadow:0 0 18px #ff000033,0 0 36px #ff000018,inset 0 0 14px #ff000010 }
    .box-a    { box-shadow:0 0 18px #ff660033,0 0 36px #ff660018,inset 0 0 14px #ff660010 }

    .title3d  { text-shadow:1px 1px 0 #800000,2px 2px 0 #600000,3px 3px 0 #400000,4px 4px 0 #200000,0 0 24px #ff0000,0 0 48px #ff000066 }

    .glitch         { position:relative }
    .glitch::before { content:attr(data-text);position:absolute;inset:0;color:#ff2200;clip-path:polygon(0 0,100% 0,100% 45%,0 45%);animation:glitch1 5s infinite }
    .glitch::after  { content:attr(data-text);position:absolute;inset:0;color:#ff8800;clip-path:polygon(0 55%,100% 55%,100% 100%,0 100%);animation:glitch2 5s infinite }

    .flicker        { animation:flicker 4s infinite }
    .led-r          { width:8px;height:8px;border-radius:50%;background:#ff0000;box-shadow:0 0 6px #ff0000,0 0 14px #ff000088;animation:blink-r 1.5s ease-in-out infinite }
    .led-g          { width:8px;height:8px;border-radius:50%;background:#00ff41;box-shadow:0 0 6px #00ff41,0 0 14px #00ff4188 }
    .led-a          { width:8px;height:8px;border-radius:50%;background:#ff6600;box-shadow:0 0 6px #ff6600,0 0 14px #ff660088;animation:blink-a 2s ease-in-out infinite }

    .panel-card {
      background:linear-gradient(135deg,#0d0000,#0a0505,#080000);
      border:1px solid #1a0000;
      position:relative;
      overflow:hidden;
    }
    .panel-card::after {
      content:'';position:absolute;top:0;left:0;right:0;height:1px;
      background:linear-gradient(90deg,transparent,#ff000055,transparent);
    }
    .panel-card-a {
      background:linear-gradient(135deg,#000d0d,#000a0a,#000808);
      border:1px solid #001a1a;
      position:relative;overflow:hidden;
    }
    .panel-card-a::after {
      content:'';position:absolute;top:0;left:0;right:0;height:1px;
      background:linear-gradient(90deg,transparent,#23C9C855,transparent);
    }

    .btn-r {
      background:linear-gradient(135deg,#1a0000,#2d0000);
      border:1px solid #880000;color:#ff4444;
      font-family:'Orbitron',monospace;font-size:.85rem;letter-spacing:.2em;text-transform:uppercase;
      padding:12px 24px;position:relative;overflow:hidden;cursor:pointer;
      transition:all .2s;box-shadow:0 0 10px #ff000022,inset 0 0 8px #ff000010;
    }
    .btn-r::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,0,0,.08),transparent);transition:left .35s}
    .btn-r:hover::before{left:100%}
    .btn-r:hover{background:linear-gradient(135deg,#2d0000,#400000);box-shadow:0 0 22px #ff000066,0 0 44px #ff000033;border-color:#ff4444;transform:translateY(-1px)}
    .btn-r:active{transform:translateY(0)}

    .btn-a {
      background:linear-gradient(135deg,#001a1a,#002d2d);
      border:1px solid #008888;color:#23C9C8;
      font-family:'Orbitron',monospace;font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;
      padding:10px 20px;position:relative;overflow:hidden;cursor:pointer;
      transition:all .2s;box-shadow:0 0 10px #23C9C822,inset 0 0 8px #23C9C810;
    }
    .btn-a::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(35,201,200,.08),transparent);transition:left .35s}
    .btn-a:hover::before{left:100%}
    .btn-a:hover{box-shadow:0 0 22px #23C9C866,0 0 44px #23C9C833;border-color:#23C9C8;transform:translateY(-1px);background:linear-gradient(135deg,#002d2d,#004444)}

    .inp {
      background:#050000;border:1px solid #330000;border-bottom:2px solid #880000;
      color:#ff5555;font-family:'Share Tech Mono',monospace;font-size:1.1rem;
      padding:12px 16px;outline:none;width:100%;transition:all .2s;letter-spacing:.04em;
    }
    .inp:focus{border-color:#880000;border-bottom-color:#ff3333;box-shadow:0 0 14px #ff000022;background:#0a0000}
    .inp::placeholder{color:#330000}

    .inp-a {
      background:#000505;border:1px solid #003333;border-bottom:2px solid #008888;
      color:#23C9C8;font-family:'Share Tech Mono',monospace;font-size:.85rem;
      padding:9px 12px;outline:none;width:100%;transition:all .2s;letter-spacing:.04em;
    }
    .inp-a:focus{border-color:#008888;border-bottom-color:#23C9C8;box-shadow:0 0 14px #23C9C822;background:#000a0a}
    .inp-a::placeholder{color:#003333}

    .progress-track{height:4px;background:#0a0000;border:1px solid #220000;position:relative;cursor:pointer}
    .progress-fill-r{height:100%;background:linear-gradient(90deg,#880000,#ff3333);box-shadow:0 0 8px #ff0000;position:relative;transition:width .1s linear}
    .progress-fill-r::after{content:'';position:absolute;right:-5px;top:-4px;width:10px;height:10px;background:#ff3333;border-radius:50%;box-shadow:0 0 8px #ff3333}
    .progress-fill-a{height:100%;background:linear-gradient(90deg,#008888,#23C9C8);box-shadow:0 0 8px #23C9C8;position:relative;transition:width .1s linear}
    .progress-fill-a::after{content:'';position:absolute;right:-5px;top:-4px;width:10px;height:10px;background:#23C9C8;border-radius:50%;box-shadow:0 0 8px #23C9C8}

    .corner-dec::before,.corner-dec::after,
    .corner-dec > span::before,.corner-dec > span::after {
      content:'';position:absolute;width:14px;height:14px;border-color:#ff000033;border-style:solid;
    }
    .entrance { animation:entrance .7s cubic-bezier(.23,1,.32,1) both }

    .wave-bar {
      width:3px;border-radius:2px 2px 0 0;transform-origin:bottom;
      background:linear-gradient(to top,#880000,#ff4444);
      box-shadow:0 0 4px #ff000055;
      animation:wave .5s ease infinite alternate;
    }
    .conn-line {
      height:1px;background:linear-gradient(90deg,transparent,#ff000044,transparent);
      animation:connpulse 2s ease-in-out infinite;
    }
    .conn-line-a {
      height:1px;background:linear-gradient(90deg,transparent,#ff660044,transparent);
      animation:connpulse 2s ease-in-out infinite;
    }
    .spin-ring {
      border-radius:50%;border:2px solid #ff0000;position:relative;
      animation:spin-slow 3s linear infinite;
      box-shadow:0 0 14px #ff000055;
    }
    .spin-ring::before{
      content:'';position:absolute;top:-4px;left:calc(50% - 3px);
      width:6px;height:6px;background:#ff3333;border-radius:50%;box-shadow:0 0 8px #ff3333;
    }
    .dial {
      width:54px;height:54px;border-radius:50%;
      background:radial-gradient(circle at 35% 35%,#1a0000,#050000);
      border:2px solid #330000;position:relative;cursor:pointer;
      box-shadow:0 0 10px #ff000022,inset 0 2px 4px rgba(255,0,0,.08);
      transition:transform .3s,box-shadow .3s;
    }
    .dial::after{content:'';position:absolute;top:7px;left:calc(50% - 1.5px);width:3px;height:16px;background:#ff3333;border-radius:2px;box-shadow:0 0 6px #ff3333}
    .dial:hover{box-shadow:0 0 20px #ff000055;transform:rotate(30deg)}
    .crt-lines {
      position:fixed;inset:0;pointer-events:none;z-index:9000;
      background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.13) 2px,rgba(0,0,0,.13) 4px);
    }
    .crt-sweep {
      position:fixed;top:-30%;left:0;right:0;height:30%;pointer-events:none;z-index:8999;
      background:linear-gradient(transparent,rgba(35,201,200,.03),transparent);
      animation:scanline 9s linear infinite;
    }
    .hex-bg {
      background-image:radial-gradient(circle,rgba(35,201,200,.04) 1px,transparent 1px);
      background-size:28px 28px;
    }

    .role-hover { transition:all .3s; }
    .role-hover:hover { transform:rotateY(4deg) rotateX(-4deg) scale(1.03); }

    .pulse-btn { animation:pulse-r 2s ease-in-out infinite; }
    .slide-in  { animation:slideIn .3s ease both; }
  `}</style>
);

/* ─── Particle Canvas ─── */
const ParticleCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + .4,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      a: Math.random() * .5 + .1,
      c: Math.random() > .65 ? "#23C9C8" : "#ff0000",
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + Math.floor(p.a * 255).toString(16).padStart(2, "0");
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = p.c + "0d";
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
};

/* ─── Oscilloscope ─── */
const Oscilloscope = ({ color = "#ff3333", height = 60 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let t = 0, raf;
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.fillStyle = "#020000";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#0a0000"; ctx.lineWidth = .5;
      for (let x = 0; x < w; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 12) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.shadowColor = color; ctx.shadowBlur = 7;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const f = .05 + Math.sin(t * .012) * .02;
        const a = h * .28 + Math.sin(t * .018) * h * .07;
        const y = h / 2 + Math.sin(x * f + t * .1) * a + Math.sin(x * f * 2.1 + t * .14) * a * .2 + (Math.random() - .5) * 1.5;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke(); ctx.shadowBlur = 0; t++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [color]);
  return (
    <canvas ref={ref} width={240} height={height}
      style={{ width: "100%", display: "block", border: "1px solid #1a0000", background: "#020000" }} />
  );
};

/* ─── LED ─── */
const Led = ({ variant = "r" }) => <div className={`led-${variant}`} />;

/* ─── Corner brackets ─── */
const Corners = ({ color = "#ff000033" }) => (
  <>
    {[["top-0 left-0", "border-t border-l"], ["top-0 right-0", "border-t border-r"],
    ["bottom-0 left-0", "border-b border-l"], ["bottom-0 right-0", "border-b border-r"]].map(([pos, bdr], i) => (
      <span key={i} className={`absolute ${pos} w-4 h-4 ${bdr}`} style={{ borderColor: color }} />
    ))}
  </>
);

/* ─── Waveform ─── */
const Waveform = ({ color = "#ff4444", shadow = "#ff000055" }) => (
  <div className="flex items-end gap-px justify-center" style={{ height: 32 }}>
    {Array.from({ length: 38 }, (_, i) => (
      <div key={i} className="wave-bar"
        style={{
          height: Math.random() * 22 + 4,
          animationDuration: (.3 + Math.random() * .5) + "s",
          animationDelay: (Math.random() * .3) + "s",
          background: `linear-gradient(to top,${color}88,${color})`,
          boxShadow: `0 0 4px ${shadow}`,
        }} />
    ))}
  </div>
);

/* ─── VU Meter ─── */
const VuMeter = ({ variant = "r" }) => {
  const ref = useRef(null);
  useEffect(() => {
    const bars = ref.current?.querySelectorAll("div");
    if (!bars) return;
    const iv = setInterval(() => {
      bars.forEach(bar => {
        const max = parseFloat(bar.dataset.max);
        bar.style.height = (max * (.2 + Math.random() * .8)) + "px";
      });
    }, 130);
    return () => clearInterval(iv);
  }, []);
  return (
    <div ref={ref} className="flex items-end gap-px" style={{ height: 40 }}>
      {Array.from({ length: 28 }, (_, i) => {
        const maxH = Math.min(38, (i + 1) * 1.4);
        const c = variant === "a"
          ? (i < 19 ? "#cc5500" : i < 25 ? "#ff8800" : "#ff0000")
          : (i < 19 ? "#cc0000" : i < 25 ? "#ff4400" : "#ff0000");
        return (
          <div key={i} data-max={maxH}
            style={{ width: 4, height: maxH, background: c, boxShadow: `0 0 4px ${c}66`, borderRadius: "1px 1px 0 0", transition: "height .1s" }} />
        );
      })}
    </div>
  );
};

/* ─── formatters ─── */
const fmt = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60),
    ms = Math.floor((s % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
};
const fmtDur = (s) => {
  if (!s || isNaN(s)) return "--:--:--";
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

/* ══════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════ */
const LoginPage = ({ onEnter }) => {
  const [callsign, setCallsign] = useState("");
  const [session, setSession] = useState("");
  const [role, setRole] = useState(null);
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date().toTimeString().slice(0, 8)), 1000);
    return () => clearInterval(iv);
  }, []);

  const connect = () => {
    if (!callsign.trim()) { setError("CALLSIGN REQUIRED"); return; }
    if (!session.trim()) { setError("FREQUENCY CODE REQUIRED"); return; }
    if (!role) { setError("SELECT OPERATIVE ROLE"); return; }
    setError(""); setConnecting(true);
    setTimeout(() => { setConnecting(false); onEnter(role, callsign.trim().toUpperCase(), session.trim().toUpperCase()); }, 1600);
  };

  return (
    <div className="relative min-h-screen hex-bg flex flex-col items-center justify-center p-4" style={{ background: "#050505", zIndex: 1 }}>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-2 font-mono-st"
        style={{ background: "#050000ee", borderBottom: "1px solid #1a0000", zIndex: 100 }}>
        <div className="flex items-center gap-2"><Led /><span className="text-xs tracking-widest" style={{ color: "#660000" }}>HAWKINS LAB — SECTOR 7</span></div>
        <div className="flex items-center gap-3"><span className="text-xs" style={{ color: "#440000" }}>{time}</span><Led variant="a" /></div>
      </div>

      {/* Upside-down vine SVG */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <path d="M0,100 Q200,50 400,120 T800,80 T1200,100" stroke="#1a0000" strokeWidth="1" fill="none" opacity=".5" />
        <path d="M0,200 Q150,150 300,200 T600,150 T900,200 T1200,170" stroke="#220000" strokeWidth="1" fill="none" opacity=".4" />
        {[[200, 100], [600, 150], [900, 80], [100, 300], [700, 200]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={2 + i % 2} fill="#330000" opacity=".6" />
        ))}
        {[[150, 400], [450, 600], [850, 350], [1050, 500]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.5" fill="#ff000022" />
        ))}
      </svg>

      {/* Main card */}
      <div
        id="main-card"
        className="fixed inset-0 flex flex-col justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://wallpaperaccess.com/full/9213210.png')"
        }}
      >        {/* Hawkins-Radio title */}
        <div className="text-center mb-7">
          <div className="relative inline-block">
            <span className="font-orbitron text-xs absolute -top-2 -right-4 tracking-widest flicker"
              style={{ color: "#5a323296", border: "2px solid #ff000033", padding: "1px 6px", transform: "rotate(-12deg)", fontSize: ".55rem" }}>
              TOP SECRET
            </span>
            <h1 id="stranger-things" class=" font-serif bold  text-red-600 text-6xl tracking-widest">
              HAWKINS RADIO
            </h1>
          </div>
          <div className="font-orbitron text-xs tracking-widest mt-1" style={{ color: "#ff4545" }}>◈ CODE RED SYNCHRONIZER ◈</div>
          <div className="font-mono-st text-xs tracking-widest mt-1" style={{ color: "#ff8000" }}>HAWKINS NATIONAL LABORATORY // CLASSIFIED</div>
          <div className="conn-line mt-3" style={{ width: "75%", margin: "10px auto 0" }} />
        </div>

        {/* Panel */}
        <div className="panel-card box-r rounded-lg p-12 relative w-full max-w-2xl" style={{ perspective: "1000px" }}>
          <Corners />
          <div className="flex items-center gap-2 mb-8">
            <Led /><span className="font-mono-st text-sm tracking-widest" style={{ color: "#d80606ff" }}>AUTHENTICATION REQUIRED</span>
          </div>

          <div className="mb-6">
            <label className="font-mono-st text-sm tracking-widest block mb-2" style={{ color: "#d80606ff" }}>◈ OPERATIVE CALLSIGN</label>
            <input className="inp" placeholder="ENTER CALLSIGN..." value={callsign}
              onChange={e => setCallsign(e.target.value.toUpperCase())} maxLength={20} />
          </div>
          <div className="mb-8">
            <label className="font-mono-st text-sm tracking-widest block mb-2" style={{ color: "#d80606ff" }}>◈ SESSION FREQUENCY</label>
            <input className="inp" placeholder="ENTER FREQUENCY CODE..." value={session}
              onChange={e => setSession(e.target.value.toUpperCase())} maxLength={8} />
            <p className="font-mono-st text-xs mt-1" style={{ color: "#d80606ff" }}>BROADCASTER SETS // LISTENERS TUNE IN</p>
          </div>

          {/* Role cards */}
          <p className="font-mono-st text-sm tracking-widest mb-4" style={{ color: "#d80606ff" }}>◈ SELECT OPERATIVE ROLE</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              {
                id: "broadcaster", label: "BROADCASTER", sub: "CONTROL\nTRANSMISSION", borderOn: "#ff4444", shadowOn: "0 0 24px #ff000066,inset 0 0 14px #ff000018",
                icon: (
                  <svg viewBox="0 0 50 45" className="w-16 h-14">
                    <circle cx="25" cy="20" r="4.5" fill="#ff3333" style={{ filter: "drop-shadow(0 0 5px #ff3333)" }} />
                    <path d="M18,20 Q18,9 25,9 Q32,9 32,20" stroke="#ff000055" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M13,20 Q13,4 25,4 Q37,4 37,20" stroke="#ff000033" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <path d="M8,20 Q8,-1 25,-1 Q42,-1 42,20" stroke="#ff000022" strokeWidth="1" fill="none" strokeLinecap="round" />
                    <line x1="25" y1="25" x2="25" y2="40" stroke="#ff000055" strokeWidth="2" />
                    <line x1="18" y1="40" x2="32" y2="40" stroke="#ff000055" strokeWidth="2" />
                  </svg>
                )
              },
              {
                id: "listener", label: "LISTENER", sub: "RECEIVE\nSIGNAL", borderOn: "#ff8844", shadowOn: "0 0 24px #ff660066,inset 0 0 14px #ff660018",
                icon: (
                  <svg viewBox="0 0 50 50" className="w-16 h-14">
                    <rect x="8" y="14" width="34" height="22" rx="2" fill="none" stroke="#ff880055" strokeWidth="2" />
                    <rect x="12" y="17" width="26" height="16" rx="1" fill="#0a0000" />
                    <circle cx="34" cy="38" r="3" fill="#ff6600" style={{ filter: "drop-shadow(0 0 4px #ff6600)" }} />
                    <line x1="25" y1="14" x2="25" y2="6" stroke="#ff660055" strokeWidth="2" />
                    <line x1="18" y1="9" x2="25" y2="6" stroke="#ff660033" strokeWidth="1.5" />
                    <line x1="32" y1="9" x2="25" y2="6" stroke="#ff660033" strokeWidth="1.5" />
                    <line x1="14" y1="22" x2="38" y2="22" stroke="#ff660022" strokeWidth="1" />
                    <line x1="14" y1="27" x2="30" y2="27" stroke="#ff660022" strokeWidth="1" />
                  </svg>
                )
              },
            ].map(({ id, label, sub, borderOn, shadowOn, icon }) => (
              <div key={id} className="role-hover panel-card rounded-md p-6 cursor-pointer relative"
                style={{
                  border: `1px solid ${role === id ? borderOn : "#220000"}`,
                  boxShadow: role === id ? shadowOn : "none",
                  transition: "all .25s"
                }}
                onClick={() => setRole(id)}>
                <Corners color={role === id ? borderOn + "66" : "#ff000022"} />
                <div className="flex flex-col items-center text-center gap-3">
                  {icon}
                  <span className="font-orbitron text-sm font-bold tracking-widest"
                    style={{
                      color: id === "broadcaster" ? "#ff4444" : "#ff8844", fontSize: ".85rem",
                      textShadow: role === id ? `0 0 10px ${id === "broadcaster" ? "#ff0000" : "#ff6600"}` : "none"
                    }}>
                    {label}
                  </span>
                  <span className="font-mono-st text-xs whitespace-pre-line" style={{ color: "#330000", fontSize: ".75rem" }}>{sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Signal + role display */}
          <div className="flex items-center justify-between font-mono-st text-sm mb-6" style={{ color: "#330000" }}>
            <div className="flex items-end gap-1">
              {[8, 12, 16, 20, 24].map((h, i) => (
                <div key={i} style={{ width: 5, height: h * 1.2, background: "#660000", opacity: i < 3 ? 1 : .25, borderRadius: 1, boxShadow: "0 0 3px #ff000033" }} />
              ))}
              <span className="ml-1" style={{ color: "#eec613a7" }}>SIG: WEAK</span>
            </div>
            <span style={{ color: "#eec613a7" }}>ROLE: {role ? role.toUpperCase() : "---"}</span>
          </div>

          <button className="btn-r w-full" onClick={connect} disabled={connecting}>
            {connecting ? "◈ ESTABLISHING LINK..." : "▶ INITIATE CONNECTION"}
          </button>

          {error && (
            <p className="font-mono-st text-xs text-center mt-3" style={{ color: "#ff4444", textShadow: "0 0 8px #ff0000" }}>
              ⚠ {error}
            </p>
          )}
        </div>

        <div className="flex justify-between mt-3 px-1 font-mono-st text-xs" style={{ color: "#2a0000" }}>
          </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   BROADCASTER PAGE
══════════════════════════════════════════════ */
const BroadcasterPage = ({ callsign, session, onDisconnect }) => {
  const videoRef = useRef(null);
  const fileRef = useRef(null);
  const hasVideoRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [timecode, setTimecode] = useState("00:00:00.000");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("");
  const [hasVideo, setHasVideo] = useState(false);
  const [uptime, setUptime] = useState("00:00:00");
  const [latency, setLatency] = useState("12ms");
  const [drift, setDrift] = useState("±0.012s");
  const [listenerCount, setListenerCount] = useState(0);
  const [listeners, setListeners] = useState([]);
  const [playbackRate, setPlaybackRate] = useState(1);
  const uptimeRef = useRef(Date.now());
  const [time, setTime] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [log, setLog] = useState(["BROADCASTER READY — AWAITING COMMANDS"]);
  const [dialStates, setDialStates] = useState({ FREQ: 0, GAIN: 45, SYNC: -30 });

  const addLog = useCallback((msg) => {
    const ts = new Date().toTimeString().slice(0, 8);
    setLog(prev => [`[${ts}] ${msg}`, ...prev].slice(0, 20));
  }, []);

  const forceSync = () => {
    const v = videoRef.current; if (!v) return;
    socket.emit("broadcast_sync_pulse", {
      roomId: session,
      currentTime: v.currentTime,
      playing: !v.paused,
      playbackRate: v.playbackRate
    });
    addLog("SYNC PULSE CALIBRATED");
  };

  const changeRate = (newRate) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = newRate;
    setPlaybackRate(newRate);
    addLog(`TRANSMISSION RATE: ${newRate}x`);
    socket.emit("broadcast_rate", { roomId: session, playbackRate: newRate });
  };

  const handleDialClick = (label) => {
    setDialStates(prev => {
      const current = prev[label];
      const next = ((current + 30 + 180) % 360) - 180;

      if (label === "GAIN") {
        const volume = (next + 180) / 360;
        if (videoRef.current) videoRef.current.volume = volume;
        addLog(`GAIN ADJUSTED: ${Math.round(volume * 100)}%`);
      } else if (label === "FREQ") {
        const rate = Number((0.5 + ((next + 180) / 360) * 1.5).toFixed(2));
        changeRate(rate);
      } else if (label === "SYNC") {
        forceSync();
        addLog("SYNC PULSE CALIBRATED");
      }

      return { ...prev, [label]: next };
    });
  };

  useEffect(() => {
    socket.emit("join_room", { roomId: session, role: "broadcaster", callsign });

    const onRoomInfo = ({ listenerCount: count, listeners: list, videoSource }) => {
      setListenerCount(count);
      setListeners(list); // list is already an array of callsign strings from backend
      addLog(`SIGNAL DETECTED: ${count} LISTENERS TUNED IN`);

      // If we don't have a video loaded but the room has one, recover it
      if (!hasVideoRef.current && videoSource) {
        addLog("RECOVERING ACTIVE SIGNAL...");
        setVideoUrl(videoSource);
        loadVideoSource(videoSource, true);
      }
    };

    socket.on("room_info", onRoomInfo);
    socket.on("request_sync_from_listener", () => forceSync());

    const iv1 = setInterval(() => {
      const e = Date.now() - uptimeRef.current;
      const s = Math.floor(e / 1000) % 60, m = Math.floor(e / 60000) % 60, h = Math.floor(e / 3600000);
      setUptime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    }, 1000);

    const iv2 = setInterval(() => {
      setLatency((Math.floor(Math.random() * 18) + 8) + "ms");
      setDrift("±" + (Math.random() * .05).toFixed(3) + "s");
      forceSync(); // Periodic sync pulse
    }, 5000);

    const iv3 = setInterval(() => setTime(new Date().toTimeString().slice(0, 8)), 1000);

    return () => {
      socket.off("room_info", onRoomInfo);
      socket.off("request_sync_from_listener");
      clearInterval(iv1); clearInterval(iv2); clearInterval(iv3);
    };
  }, [session, callsign, addLog]);

  const loadVideoSource = (source, isUrl = true) => {
    const v = videoRef.current;
    if (!v || !source) {
      addLog("ERROR: PLAYER NOT READY OR SOURCE MISSING");
      return;
    }

    const prevTime = v.currentTime;
    const wasPlaying = !v.paused;

    setHasVideo(false);
    hasVideoRef.current = false;

    if (isUrl) {
      v.src = source;
    } else {
      v.src = URL.createObjectURL(source);
    }

    v.load();
    v.onloadedmetadata = () => {
      setHasVideo(true);
      hasVideoRef.current = true;
      setDuration(fmtDur(v.duration));

      if (isUrl && prevTime > 0) {
        v.currentTime = prevTime;
        if (wasPlaying) v.play();
      }

      addLog("SIGNAL ACQUIRED — READY TO BROADCAST");
      if (isUrl) {
        socket.emit("set_video_source", { roomId: session, videoSource: source });
        forceSync();
      }
    };

    v.onplay = () => {
      setPlaying(true);
      socket.emit("broadcast_play", { roomId: session, currentTime: v.currentTime });
    };

    v.onpause = () => {
      setPlaying(false);
      socket.emit("broadcast_pause", { roomId: session, currentTime: v.currentTime });
    };

    v.onseeking = () => {
      socket.emit("broadcast_seek", { roomId: session, currentTime: v.currentTime });
    };

    v.onratechange = () => {
      setPlaybackRate(v.playbackRate);
      socket.emit("broadcast_rate", { roomId: session, playbackRate: v.playbackRate });
    };

    v.onended = () => {
      setPlaying(false);
      socket.emit("broadcast_pause", { roomId: session, currentTime: v.currentTime });
    };
  };

  const loadUrl = () => {
    if (!videoUrl) return;
    addLog("TUNING TO NETWORK URL...");
    loadVideoSource(videoUrl, true);
  };

  const loadFile = (e) => {
    const f = e.target.files[0]; if (!f) return;

    addLog("UPLOADING LOCAL FILE: " + f.name);
    loadVideoSource(f, false);
    if (videoRef.current) videoRef.current.muted = false;

    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('video', f);

    const xhr = new XMLHttpRequest();
    const uploadUrl = `${BACKEND_URL}/upload`;

    addLog(`INITIATING UPLINK: ${uploadUrl}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
        if (percent % 10 === 0) {
          addLog(`TRANSMITTING SIGNAL: ${percent}%`);
        }
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.url) {
            addLog("UPLINK COMPLETE — SYNCING LISTENERS");
            setVideoUrl(data.url);
            loadVideoSource(data.url, true);
          }
        } catch (e) {
          addLog("ERROR: INVALID SERVER RESPONSE");
        }
      } else {
        addLog(`UPLINK FAILED: ${xhr.status}`);
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      addLog("CRITICAL: UPLINK CONNECTION SEVERED");
    };

    xhr.open('POST', uploadUrl, true);
    xhr.send(formData);
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setTimecode(fmt(v.currentTime));
    setProgress((v.currentTime / (v.duration || 1)) * 100);
  };

  const togglePlay = () => {
    const v = videoRef.current; if (!v || !hasVideo) return;
    if (playing) v.pause(); else v.play();
  };

  const stop = () => { const v = videoRef.current; if (!v) return; v.pause(); v.currentTime = 0; };

  const seek = (e) => {
    const v = videoRef.current; if (!v || !v.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - r.left) / r.width) * v.duration;
  };

  return (
    <div className="flex flex-col min-h-screen hex-bg font-mono-st" style={{ background: "#030303", zIndex: 1 }}>
      {/* Header */}
      <header className="sticky top-0 flex items-center justify-between px-6 py-3"
        style={{ background: "#050000f0", borderBottom: "1px solid #1a0000", zIndex: 100 }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2"><Led /><span className="font-orbitron text-xs glow-r tracking-widest" style={{ color: "#ff4444" }}>BROADCASTER</span></div>
          <div style={{ width: 1, height: 16, background: "#220000" }} />
          <span className="text-xs" style={{ color: "#f4d0d07d" }}>◈ TRANSMISSION ACTIVE</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-xs" style={{ color: "#ca0000ff" }}>FREQ: <span className="glow-r" style={{ color: "#fcbb08ff" }}>{session}</span></span>
          <span className="text-xs" style={{ color: "#11ba05ff" }}>LISTENERS: <span className="font-vt323 glow-r" style={{ color: "#ff3333", fontSize: "1.1rem" }}>{String(listenerCount).padStart(2, "0")}</span></span>
          <span className="text-xs" style={{ color: "#cd0000ff" }}>{time}</span>
          <button className="btn-r" style={{ padding: "6px 14px", fontSize: ".6rem" }} onClick={onDisconnect}>⏏ DISCONNECT</button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Main area */}
        <div className="flex-1 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Led /><span className="text-xs tracking-widest" style={{ color: "#bd0303ff" }}>Hawkins-Radio BROADCAST CONTROL — {callsign}</span>
            <div className="flex-1 conn-line" />
          </div>

          {/* Video panel */}
          <div className="panel-card box-r rounded-sm entrance relative">
            <Corners />
            <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid #1a0000" }}>
              <span className="text-xs tracking-widest" style={{ color: "#c20c0cff" }}>◈ VIDEO UPLINK FEED</span>
              <div className="flex items-center gap-2"><Led /><span className="text-xs glow-r flicker" style={{ color: "#ff3333" }}>● REC</span></div>
            </div>
            <div className="p-4">
              {/* Video */}
              <div className="relative mb-3" style={{ aspectRatio: "16/9", background: "#000", border: "1px solid #1a0000" }}>
                <video ref={videoRef} className="w-full h-full object-contain"
                  playsInline muted crossOrigin="anonymous"
                  style={{ display: hasVideo ? "block" : "none" }} onTimeUpdate={onTimeUpdate} />
                {!hasVideo && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg,#050000,#0a0000,#050000)" }}>
                    <div className="spin-ring mb-4" style={{ width: 56, height: 56 }} />
                    <p className="text-xs tracking-widest mt-2" style={{ color: "#f5e7e7ad" }}>NO SIGNAL</p>
                    <p className="text-xs mt-1" style={{ color: "#f5e7e7ad" }}>LOAD VIDEO TO BEGIN TRANSMISSION</p>

                    <div className="flex flex-col gap-2 w-full max-w-xs mt-4">
                      <div className="flex gap-2">
                        <input className="inp flex-1" style={{ fontSize: '.7rem', padding: '6px 10px' }}
                          placeholder="PASTE VIDEO URL..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
                        <button className="btn-r" style={{ padding: "6px 14px" }} onClick={loadUrl}>LOAD URL</button>
                      </div>
                      <p className="text-[9px] text-red-900/60 text-center uppercase tracking-widest font-vt323 mt-1">Direct Signal Only (.mp4, .webm)</p>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-px bg-red-900/30" />
                        <span className="text-[10px] text-red-900/40">OR</span>
                        <div className="flex-1 h-px bg-red-900/30" />
                      </div>

                      <button className="btn-r w-full" style={{ padding: "8px 22px" }}
                        disabled={isUploading}
                        onClick={() => fileRef.current?.click()}>
                        {isUploading ? "⚡ UPLOADING TO CEREBRO..." : "UPLOAD & SYNC LOCAL VIDEO"}
                      </button>
                    </div>

                    <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={loadFile} />
                    {/* CRT lines on placeholder */}
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(transparent 50%,rgba(0,0,0,.08) 50%)", backgroundSize: "100% 4px" }} />
                  </div>
                )}

                {hasVideo && (
                  <div className="mt-4">
                    {isUploading ? (
                      <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] text-red-500 uppercase tracking-widest font-vt323">TRANSMITTING UPLINK SIGNAL...</span>
                          <span className="text-xs text-red-400 font-vt323">{uploadProgress}%</span>
                        </div>
                        <div className="progress-track" style={{ height: 6 }}>
                          <div className="progress-fill-r" style={{ width: uploadProgress + "%" }} />
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 bg-red-900/10 border border-red-900/20 rounded-sm overflow-hidden animate-pulse">
                        <p className="text-[8px] text-red-900/40 uppercase mb-1 font-vt323 tracking-tighter">Broadcasting Live Stream:</p>
                        <p className="text-[9px] text-red-500 truncate font-vt323 lowercase">{videoUrl}</p>
                      </div>
                    )}
                  </div>
                )}
                {/* Bracket overlays */}
                {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((cls, i) => (
                  <span key={i} className={`absolute ${cls} w-5 h-5`} style={{ borderColor: "#ff000033" }} />
                ))}
              </div>

              {/* Timecode row */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-vt323 glow-r" style={{ color: "#ff4444", fontSize: "1.7rem" }}>{timecode}</span>
                <span className="font-vt323" style={{ color: "#a50505ff", fontSize: "1.3rem" }}>DUR: {duration || "--:--:--"}</span>
              </div>

              {/* Progress */}
              <div className="progress-track mb-4 cursor-pointer" onClick={seek}>
                <div className="progress-fill-r" style={{ width: progress + "%" }} />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <button className="btn-r" style={{ padding: "8px 14px" }} onClick={() => { if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10); }}>⏮ -10s</button>
                <button className="btn-r" style={{ padding: "8px 28px" }} onClick={togglePlay}>{playing ? "⏸ PAUSE" : "▶ PLAY"}</button>
                <button className="btn-r" style={{ padding: "8px 14px" }} onClick={() => { if (videoRef.current) videoRef.current.currentTime = Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + 10); }}>+10s ⏭</button>
                <button className="btn-r" style={{ padding: "8px 14px" }} onClick={stop}>⏹ STOP</button>
              </div>

              <Waveform />

              {/* Volume + Speed */}
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="text-xs tracking-widest block mb-1" style={{ color: "#f0d509ff" }}>◈ SIGNAL : <span  style = {{ color: "rgba(15, 240, 15, 0.91)"}}>STRENGTH </span> </label>
                  <input type="range" min="0" max="100" defaultValue="80" className="w-full"
                    style={{ accentColor: "#cc0000", height: 4 }}
                    onChange={e => { if (videoRef.current) videoRef.current.volume = e.target.value / 100; }} />
                </div>
                <div>
                  <label className="text-xs tracking-widest block mb-1" style={{ color: "#b31010ff" }}>◈ TRANSMISSION RATE</label>
                  <div className="flex gap-1">
                    {[0.5, 1, 1.5, 2].map(s => (
                      <button key={s} className="btn-r" style={{ padding: "4px 8px", fontSize: ".55rem", borderColor: s === playbackRate ? "#ff4444" : "#550000" }}
                        onClick={() => changeRate(s)}>{s}x</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Force sync */}
          <div className="panel-card box-r rounded-sm p-4 flex items-center gap-4 relative">
            <Corners />
            <div className="flex-1">
              <p className="text-xs tracking-widest mb-1" style={{ color: "#d10808ff" }}>◈ BROADCAST SYNC PULSE</p>
              <p className="text-xs" style={{ color: "#f0e3e38f" }}>Force all listeners to synchronize with current timestamp</p>
            </div>
            <button className="btn-r pulse-btn" style={{ whiteSpace: "nowrap", padding: "10px 24px" }} onClick={forceSync}>⚡ FORCE SYNC ALL</button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-64 flex flex-col" style={{ borderLeft: "1px solid #1a0000", background: "#030000" }}>
          {/* Session status */}
          <div className="p-4" style={{ borderBottom: "1px solid #1a0000" }}>
            <p className="text-xs tracking-widest mb-2" style={{ color: "#eccec9" }}>◈ SESSION STATUS</p>
            <div className="panel-card box-r rounded-sm p-3">
              {[["SESSION", session, "#eccec9a9", "1.1rem", "font-vt323 glow-r"],
              ["UPTIME", uptime, "#eccec9a9", "1rem", "font-vt323"],
              ["STATUS", "ONLINE", "#eccec9a9", "inherit", "font-mono-st glow-g text-xs"]].map(([k, v, c, fs, cls], i) => (
                <div key={i} className="flex items-center justify-between mb-2 last:mb-0">
                  <span className="text-xs" style={{ color: "#a70c0cff" }}>{k}</span>
                  {k === "STATUS"
                    ? <div className="flex items-center gap-1"><Led variant="g" /><span className={cls} style={{ color: c }}>{v}</span></div>
                    : <span className={cls} style={{ color: c, fontSize: fs }}>{v}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Listeners */}
          <div className="p-4 flex-1" style={{ borderBottom: "1px solid #1a0000", overflowY: "auto" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs tracking-widest" style={{ color: "#ecc9c9ff" }}>◈ ACTIVE LISTENERS</p>
              <span className="font-vt323 glow-r" style={{ color: "#ff3333", fontSize: "1.1rem" }}>{String(listenerCount).padStart(2, "0")}</span>
            </div>
            {listeners.map((name, i) => (
              <div key={i} className="slide-in flex items-center justify-between py-2 px-1"
                style={{ borderBottom: "1px solid #1a0000", animationDelay: i * .15 + "s", background: "rgba(255,0,0,0.02)" }}>
                <div className="flex items-center gap-2">
                  <Led variant="g" />
                  <span className="font-orbitron font-bold uppercase tracking-wider" style={{ color: "#00ff41", fontSize: "0.75rem", textShadow: "0 0 5px rgba(0,255,65,0.4)" }}>
                    {name}
                  </span>
                </div>
                <span className="font-vt323 glow-g" style={{ color: "#00ff41", fontSize: "1rem" }}>{Math.floor(Math.random() * 20 + 8)}ms</span>
              </div>
            ))}
          </div>

          {/* Oscilloscope */}
          <div className="p-4" style={{ borderBottom: "1px solid #1a0000" }}>
            <p className="text-xs tracking-widest mb-2" style={{ color: "#ecc9c9ff" }}>◈ SIGNAL MONITOR</p>
            <Oscilloscope color="#ff3333" />
          </div>

          {/* Sync health */}
          <div className="p-4" style={{ borderBottom: "1px solid #1a0000" }}>
            <p className="text-xs tracking-widest mb-2" style={{ color: "#ecc9c9ff" }}>◈ TRANSMISSION LOG</p>
            <div className="panel-card box-r rounded-sm p-3 overflow-y-auto" style={{ height: 120 }}>
              {log.map((entry, i) => (
                <p key={i} className="text-[10px] slide-in" style={{ color: i === 0 ? "#ff4444" : "#ebd1d1c7", borderBottom: "1px solid #f315157e" }}>{entry}</p>
              ))}
            </div>
          </div>

          {/* Dials */}
          <div className="p-4">
            <p className="text-xs tracking-widest mb-3" style={{ color: "#ecc9c9ff" }}>◈ CONTROL DIALS</p>
            <div className="flex justify-around">
              {Object.entries(dialStates).map(([label, rot]) => (
                <div key={label} className="text-center">
                  <div className="dial mx-auto mb-1"
                    style={{ transform: `rotate(${rot}deg)`, borderColor: "#004a4aff", boxShadow: "0 0 10px #004a4aff" }}
                    onClick={() => handleDialClick(label)} />
                  <span className="text-xs" style={{ color: "#dd0f0fff" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   LISTENER PAGE
══════════════════════════════════════════════ */
const ListenerPage = ({ callsign, session, onDisconnect }) => {
  const videoRef = useRef(null);
  const [hasVideo, setHasVideo] = useState(false);
  const hasVideoRef = useRef(false);
  const [timecode, setTimecode] = useState("00:00:00.000");
  const [progress, setProgress] = useState(0);
  const [offset, setOffset] = useState("±0.000s");
  const [synced, setSynced] = useState(false);
  const [log, setLog] = useState(["SYSTEM READY — AWAITING SIGNAL"]);
  const [latency, setLatency] = useState("--ms");
  const [time, setTime] = useState("");
  const [broadcasterName, setBroadcasterName] = useState("AWAITING...");
  const [isLinked, setIsLinked] = useState(socket.connected);
  const [dialStates, setDialStates] = useState({ TUNE: 60, VOL: 0, SYNC: -45 });
  const pendingSyncRef = useRef(null);

  const addLog = useCallback((msg) => {
    const ts = new Date().toTimeString().slice(0, 8);
    setLog(prev => [`[${ts}] ${msg}`, ...prev].slice(0, 20));
  }, []);

  const syncVideo = useCallback((time, playing, rate = null) => {
    const v = videoRef.current;
    if (!v) return;

    if (!hasVideoRef.current) {
      addLog("SIGNAL RECEIVED — BUFFERING...");
      pendingSyncRef.current = { time, playing, rate };
      return;
    }

    const drift = Math.abs(v.currentTime - time);
    if (time !== null && drift > 0.3) {
      v.currentTime = time;
      addLog(`SIGNAL CALIBRATED: ${drift.toFixed(3)}s DRIFT`);
    }

    if (rate !== null && v.playbackRate !== rate) {
      v.playbackRate = rate;
      addLog(`SIGNAL RATE ADJUSTED: ${rate}x`);
    }

    if (playing === true && v.paused) {
      v.play().then(() => {
        setSynced(true);
      }).catch(() => {
        addLog("AUTOPLAY BLOCKED — CLICK SYNC TO UNLOCK AUDIO");
        setSynced(false);
      });
    } else if (playing === false && !v.paused) {
      v.pause();
      setSynced(true);
    } else {
      setSynced(true);
    }
  }, [addLog]);

  const setVideoSource = useCallback((src) => {
    const v = videoRef.current;
    if (!v) return;

    addLog("INITIATING DOWNLINK: " + src);
    setHasVideo(false);
    hasVideoRef.current = false;
    setSynced(false);

    const finalSrc = src.includes('?') ? `${src}&t=${Date.now()}` : `${src}?t=${Date.now()}`;

    v.pause();
    v.src = finalSrc;
    v.load();

    // Auto-play attempt to kickstart the stream
    v.play().then(() => {
      addLog("SIGNAL STREAMING...");
    }).catch(() => {
      // Expected if no interaction yet
    });

    v.onloadedmetadata = () => {
      setHasVideo(true);
      hasVideoRef.current = true;
      addLog("VIDEO SIGNAL ACQUIRED — READY");

      if (pendingSyncRef.current) {
        const { time, playing, rate } = pendingSyncRef.current;
        addLog(`SYNCING TO OFFSET: ${time.toFixed(2)}s`);
        syncVideo(time, playing, rate);
        pendingSyncRef.current = null;
      }
    };

    v.onerror = (e) => {
      setHasVideo(false);
      hasVideoRef.current = false;
      const code = v.error ? v.error.code : 'unknown';
      addLog(`CRITICAL ERROR [CODE ${code}]: FAILED TO RENDER SIGNAL`);
      console.error("Downlink render error:", v.error);
    };
  }, [addLog, syncVideo]);

  useEffect(() => {
    socket.emit("join_room", { roomId: session, role: "listener", callsign });

    const onInitialState = (state) => {
      addLog("RECEIVED INITIAL STATE");
      if (state.videoSource) {
        addLog("SETTING VIDEO SOURCE: " + state.videoSource);
        setVideoSource(state.videoSource);
        // Store target state to apply after load
        pendingSyncRef.current = {
          time: state.currentTime,
          playing: state.playing,
          rate: state.playbackRate
        };
      } else {
        addLog("NO VIDEO SOURCE FROM BROADCASTER YET");
      }
    };

    const onRateEvent = ({ playbackRate }) => {
      const v = videoRef.current;
      if (v) {
        v.playbackRate = playbackRate;
        addLog(`BROADCASTER ADJUSTED RATE: ${playbackRate}x`);
      }
    };

    const onVideoSourceEvent = ({ videoSource }) => {
      addLog("NEW SIGNAL DETECTED — RE-TUNING...");
      setVideoSource(videoSource);
    };

    const onSyncPulse = ({ currentTime, playing, playbackRate }) => {
      syncVideo(currentTime, playing, playbackRate);
    };

    const onPlayEvent = ({ currentTime }) => {
      addLog("SIGNAL: START TRANSMISSION");
      syncVideo(currentTime, true);
    };

    const onPauseEvent = ({ currentTime }) => {
      addLog("SIGNAL: PAUSE TRANSMISSION");
      syncVideo(currentTime, false);
    };

    const onSeekEvent = ({ currentTime }) => {
      syncVideo(currentTime, null);
    };

    const onRoomInfo = ({ broadcaster, listenerCount: count }) => {
      setBroadcasterName(broadcaster ? broadcaster.callsign : "OFFLINE");
    };

    socket.on("initial_state", onInitialState);
    socket.on("rate_event", onRateEvent);
    socket.on("video_source_event", onVideoSourceEvent);
    socket.on("sync_pulse", onSyncPulse);
    socket.on("play_event", onPlayEvent);
    socket.on("pause_event", onPauseEvent);
    socket.on("seek_event", onSeekEvent);
    socket.on("room_info", onRoomInfo);

    const iv1 = setInterval(() => {
      setLatency((Math.floor(Math.random() * 22) + 10) + "ms");
      setOffset("±" + (Math.random() * .03).toFixed(3) + "s");
    }, 2000);
    const iv2 = setInterval(() => setTime(new Date().toTimeString().slice(0, 8)), 1000);

    return () => {
      socket.off("initial_state", onInitialState);
      socket.off("rate_event", onRateEvent);
      socket.off("video_source_event", onVideoSourceEvent);
      socket.off("sync_pulse", onSyncPulse);
      socket.off("play_event", onPlayEvent);
      socket.off("pause_event", onPauseEvent);
      socket.off("seek_event", onSeekEvent);
      socket.off("room_info", onRoomInfo);
      clearInterval(iv1); clearInterval(iv2);
    };
  }, [addLog, session, callsign, setVideoSource, syncVideo]);

  const manualSync = () => {
    addLog("MANUAL RE-SYNC INITIATED");
    socket.emit("request_sync", { roomId: session });

    const v = videoRef.current;
    if (v && hasVideoRef.current) {
      addLog("ATTEMPTING AUDIO UNLOCK...");
      v.muted = false;
      v.play().then(() => {
        addLog("SIGNAL SYNCED — AUDIO UNLOCKED");
        setSynced(true);
      }).catch(e => {
        addLog("SYNC PENDING BROADCASTER SIGNAL");
      });
    } else {
      addLog("NO SIGNAL DETECTED — AWAITING UPLINK");
    }
  };

  const handleDialClick = (label) => {
    setDialStates(prev => {
      const current = prev[label];
      const next = ((current + 30 + 180) % 360) - 180;

      if (label === "VOL") {
        const volume = (next + 180) / 360;
        if (videoRef.current) videoRef.current.volume = volume;
        addLog(`LOCAL VOLUME: ${Math.round(volume * 100)}%`);
      } else if (label === "SYNC") {
        manualSync();
      } else if (label === "TUNE") {
        addLog("RE-TUNING RECEIVER...");
        socket.emit("request_sync", { roomId: session });
      }

      return { ...prev, [label]: next };
    });
  };

  const onTimeUpdate = () => {
    const v = videoRef.current; if (!v) return;
    setTimecode(fmt(v.currentTime));
    setProgress((v.currentTime / (v.duration || 1)) * 100);
  };

  return (
    <div className="flex flex-col min-h-screen hex-bg font-mono-st" style={{ background: "#030200", zIndex: 1 }}>
      {/* Header */}
      <header className="sticky top-0 flex items-center justify-between px-6 py-3"
        style={{ background: "#050200f0", borderBottom: "1px solid #1a0500", zIndex: 100 }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2"><Led variant="a" />
            <span className="font-orbitron text-xs tracking-widest glow-a" style={{ color: "#ff8844" }}>LISTENER</span></div>
          <div style={{ width: 1, height: 16, background: "#221000" }} />
          <span className="text-xs" style={{ color: "#553300" }}>◈ RECEIVING TRANSMISSION</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-xs" style={{ color: "#442200" }}>TUNED TO: <span className="glow-a" style={{ color: "#884400" }}>{session}</span></span>
          <div className="flex items-center gap-2">
            <Led variant={synced ? "g" : "a"} />
            <span className="text-xs font-orbitron" style={{ color: synced ? "#00ff41" : "#ff8833", fontSize: ".6rem" }}>
              {synced ? "SYNCED" : "SYNCING..."}
            </span>
          </div>
          <span className="text-xs" style={{ color: "#331500" }}>{time}</span>
          <button className="btn-a" style={{ padding: "6px 14px", fontSize: ".6rem" }} onClick={onDisconnect}>⏏ DISCONNECT</button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Main */}
        <div className="flex-1 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Led variant="a" /><span className="text-xs tracking-widest" style={{ color: "#663300" }}>RECEIVING UPSIDE DOWN TRANSMISSION — {callsign}</span>
            <div className="flex-1 conn-line-a" />
          </div>

          {/* Video panel */}
          <div className="panel-card-a rounded-sm entrance relative" style={{ boxShadow: "0 0 18px #ff660033,0 0 36px #ff660018,inset 0 0 14px #ff660010" }}>
            <Corners color="#ff660033" />
            <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid #1a0500" }}>
              <span className="text-xs tracking-widest" style={{ color: "#552200" }}>◈ DOWNLINK VIDEO FEED</span>
              <div className="flex items-center gap-2"><Led variant="a" /><span className="text-xs glow-a" style={{ color: "#ff8833" }}>● LIVE</span></div>
            </div>
            <div className="p-4">
              {/* Video */}
              <div className="relative mb-3" style={{ aspectRatio: "16/9", background: "#000", border: "1px solid #1a0500" }}>
                {hasVideo && (
                  <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
                    <div className={`led-${synced ? 'g' : 'a'}`} />
                    <span className="text-[10px] font-vt323" style={{ color: synced ? "#00ff41" : "#23C9C8" }}>
                      {synced ? "SIGNAL SYNCED" : "SIGNAL DRIFT DETECTED"}
                    </span>
                    {!synced && (
                      <button className="btn-a" style={{ padding: "4px 10px", fontSize: ".5rem" }} onClick={manualSync}>
                        ⚡ RE-SYNC
                      </button>
                    )}
                  </div>
                )}
                <video ref={videoRef} className="w-full h-full object-contain"
                  playsInline muted crossOrigin="anonymous"
                  style={{ display: hasVideo ? "block" : "none" }} onTimeUpdate={onTimeUpdate} />
                {!hasVideo && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg,#050200,#0a0500,#050200)" }}>
                    <div className="spin-ring mb-4" style={{ width: 56, height: 56, borderColor: "#ff6600", boxShadow: "0 0 14px #ff660055" }} />
                    <p className="text-xs tracking-widest mt-2" style={{ color: "#442200" }}>AWAITING SIGNAL</p>
                    <p className="text-xs mt-1" style={{ color: "#331500" }}>BROADCASTER HAS NOT STARTED</p>
                    <div className="flex items-end gap-1 mt-3" style={{ height: 28 }}>
                      {[10, 20, 14, 24, 12, 20, 16].map((h, i) => (
                        <div key={i} style={{
                          width: 3, height: h, background: "linear-gradient(to top,#cc5500,#ff8833)",
                          borderRadius: 2, animation: `wave .5s ease ${i * .07}s infinite alternate`, transformOrigin: "bottom",
                          boxShadow: "0 0 4px #ff660044"
                        }} />
                      ))}
                    </div>

                    <button className="btn-a mt-6" style={{ padding: "10px 24px", animation: "connpulse 2s infinite" }}
                      onClick={manualSync}>
                      ▶ CLICK TO SYNC
                    </button>
                  </div>
                )}
                {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((cls, i) => (
                  <span key={i} className={`absolute ${cls} w-5 h-5`} style={{ borderColor: "#ff660022" }} />
                ))}
              </div>

              {/* Timecode row */}
              <div className="flex items-center justify-between mb-2">
                <div><p className="text-xs mb-1" style={{ color: "#552200" }}>RECEIVED TIMECODE</p>
                  <span className="font-vt323 glow-a" style={{ color: "#ff8833", fontSize: "1.7rem" }}>{timecode}</span></div>
                <div className="text-center"><p className="text-xs mb-1" style={{ color: "#552200" }}>SYNC OFFSET</p>
                  <span className="font-vt323 glow-a" style={{ color: "#ff6600", fontSize: "1.7rem" }}>{offset}</span></div>
                <div className="text-center"><p className="text-xs mb-1" style={{ color: "#552200" }}>STATE</p>
                  <span className="font-orbitron" style={{ color: "#ff8844", fontSize: ".6rem" }}>RECEIVING</span></div>
              </div>

              <div className="progress-track mb-4" style={{ cursor: "default", borderColor: "#2a0e00" }}>
                <div className="progress-fill-a" style={{ width: progress + "%" }} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["BROADCASTER", broadcasterName, "#ff8833", "font-vt323", "1rem"],
                  ["SIGNAL", "STRONG", "#ff8833", "font-vt323 glow-a", "1rem"],
                  ["LATENCY", latency, "#00ff41", "font-vt323 glow-g", "1rem"],
                ].map(([label, val, c, cls, fs], i) => (
                  <div key={i} className="panel-card-a rounded-sm p-3" style={{ boxShadow: "0 0 8px #ff660018" }}>
                    <p className="text-xs mb-1" style={{ color: "#442200" }}>{label}</p>
                    <span className={cls} style={{ color: c, fontSize: fs }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Click to Sync Action */}
              <div className="mt-4 flex flex-col items-center">
                <button className="btn-a w-full py-3 pulse-btn" onClick={manualSync}>
                  ⚡ CLICK TO SYNC TRANMISSION
                </button>
                <p className="text-[10px] mt-2 tracking-widest" style={{ color: "#442200" }}>◈ MANUAL RE-CALIBRATION REQUIRED IF SIGNAL DRIFTS ◈</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-64 flex flex-col" style={{ borderLeft: "1px solid #1a0500", background: "#020100" }}>
          {/* Connection */}
          <div className="p-4" style={{ borderBottom: "1px solid #1a0500" }}>
            <p className="text-xs tracking-widest mb-2" style={{ color: "#552200" }}>◈ CONNECTION DETAILS</p>
            <div className="panel-card-a rounded-sm p-3" style={{ boxShadow: "0 0 8px #ff660018" }}>
              {[["CALLSIGN", callsign, "#ff8833", "font-vt323", "1.1rem"],
              ["SESSION", session, "#ff6600", "font-vt323 glow-a", "1.1rem"],
              ["MODE", "PASSIVE", "#ff8833", "font-mono-st text-xs", "inherit"]].map(([k, v, c, cls, fs], i) => (
                <div key={i} className="flex items-center justify-between mb-2 last:mb-0">
                  <span className="text-xs" style={{ color: "#442200" }}>{k}</span>
                  <span className={cls} style={{ color: c, fontSize: fs }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Oscilloscope */}
          <div className="p-4" style={{ borderBottom: "1px solid #1a0500" }}>
            <p className="text-xs tracking-widest mb-2" style={{ color: "#552200" }}>◈ SIGNAL MONITOR</p>
            <Oscilloscope color="#ff8833" />
          </div>

          {/* Sync log */}
          <div className="p-4 flex-1 overflow-y-auto" style={{ borderBottom: "1px solid #1a0500" }}>
            <p className="text-xs tracking-widest mb-2" style={{ color: "#552200" }}>◈ SYNC EVENT LOG</p>
            <div className="space-y-1">
              {log.map((entry, i) => (
                <p key={i} className="text-xs slide-in" style={{ color: i === 0 ? "#664422" : "#331500", fontSize: ".65rem" }}>{entry}</p>
              ))}
            </div>
          </div>

          {/* VU */}
          <div className="p-4" style={{ borderBottom: "1px solid #1a0500" }}>
            <p className="text-xs tracking-widest mb-2" style={{ color: "#552200" }}>◈ AUDIO LEVEL</p>
            <VuMeter variant="a" />
          </div>

          {/* Dials */}
          <div className="p-4">
            <p className="text-xs tracking-widest mb-3" style={{ color: "#552200" }}>◈ RECEIVER DIALS</p>
            <div className="flex justify-around">
              {[["TUNE", 60], ["VOL", 0], ["SYNC", -45]].map(([label, rot], i) => (
                <div key={i} className="text-center">
                  <div className="dial mx-auto mb-1"
                    style={{ transform: `rotate(${rot}deg)`, borderColor: "#440e00", boxShadow: "0 0 10px #ff660022" }}
                  />
                  <span className="text-xs" style={{ color: "#331500" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("login"); // login | broadcaster | listener
  const [callsign, setCallsign] = useState("");
  const [session, setSession] = useState("");

  const handleEnter = (role, cs, sess) => {
    setCallsign(cs); setSession(sess);
    setPage(role === "broadcaster" ? "broadcaster" : "listener");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#030303", fontFamily: "'Share Tech Mono', monospace" }}>
      <FontLoader />
      <GlobalStyles />
      {/* CRT overlay */}
      <div className="crt-lines" />
      <div className="crt-sweep" />
      {/* Particles */}
      <ParticleCanvas />

      {page === "login" && <LoginPage onEnter={handleEnter} />}
      {page === "broadcaster" && <BroadcasterPage callsign={callsign} session={session} onDisconnect={() => setPage("login")} />}
      {page === "listener" && <ListenerPage callsign={callsign} session={session} onDisconnect={() => setPage("login")} />}
    </div>
  );
}