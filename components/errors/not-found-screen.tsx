import Link from "next/link";
import { Home, Radar, SearchX } from "lucide-react";

export function NotFoundScreen() {
  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-primary-700 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(126,78,172,0.36),transparent_28%),radial-gradient(circle_at_14%_78%,rgba(83,45,132,0.36),transparent_34%),linear-gradient(135deg,#02000a_0%,#120632_46%,#1a0c35_100%)]" />
      <div className="absolute -right-28 top-16 h-80 w-80 rounded-full bg-primary-450/35 blur-3xl sm:h-[32rem] sm:w-[32rem]" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-primary-300/20 blur-3xl sm:h-[28rem] sm:w-[28rem]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary-100/50 to-transparent" />

      <section className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:px-8">
        <div className="order-2 flex justify-center lg:order-1">
          <div className="relative w-full max-w-[560px]">
            <div className="absolute -right-4 top-8 z-10 hidden rounded-2xl border border-primary-100/25 bg-white/8 px-4 py-3 shadow-[0_18px_70px_rgba(84,44,133,0.32)] backdrop-blur-xl sm:flex">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-450/70">
                  <Radar className="h-5 w-5 text-primary-100" />
                </span>
                <div className="text-right">
                  <p className="text-xs text-font-light">وضعیت مسیر</p>
                  <p className="text-sm font-bold text-white">سیگنال قطع شده</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] border border-primary-300/35 bg-primary-650/55 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.5),0_0_80px_rgba(84,44,133,0.22)] backdrop-blur-xl sm:p-7">
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-primary-100/70 to-transparent" />
              <div className="absolute -left-24 -top-20 h-56 w-56 rounded-full bg-primary-300/25 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-primary-450/20 blur-3xl" />
              <div className="relative rounded-[1.5rem] border border-white/10 bg-black/25 p-4 sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400 shadow-[0_0_18px_rgba(248,113,113,0.8)]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
                  </div>
                  <span className="rounded-full border border-primary-300/40 bg-primary-450/20 px-3 py-1 text-xs font-bold text-primary-100">
                    Lost Signal
                  </span>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-primary-300/25 bg-[#050011]">
                  <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:34px_34px]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(84,44,133,0.22),transparent_55%)]" />
                  <div className="absolute left-1/2 top-1/2 text-[8rem] font-black leading-none text-white/[0.035] sm:text-[10rem] -translate-x-1/2 -translate-y-1/2">
                    404
                  </div>
                  <svg
                    viewBox="0 0 520 350"
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full"
                  >
                    <defs>
                      <linearGradient id="brokenLine" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="48%" stopColor="#22c55e" />
                        <stop offset="52%" stopColor="#fb7185" />
                        <stop offset="100%" stopColor="#fb7185" />
                      </linearGradient>
                      <filter id="lineGlow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <path
                      d="M42 232 L88 196 L126 216 L168 148 L210 174 L246 116"
                      fill="none"
                      stroke="url(#brokenLine)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="6"
                      filter="url(#lineGlow)"
                    />
                    <path
                      d="M294 118 L334 166 L372 142 L420 206 L478 174"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeDasharray="14 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="6"
                      opacity="0.85"
                    />
                    <line
                      x1="260"
                      x2="260"
                      y1="82"
                      y2="246"
                      stroke="#fb7185"
                      strokeDasharray="8 12"
                      strokeLinecap="round"
                      strokeWidth="3"
                      opacity="0.75"
                    />
                    {[80, 134, 188, 328, 392, 452].map((x, index) => (
                      <g key={x} opacity="0.92">
                        <line
                          x1={x}
                          x2={x}
                          y1={index % 2 === 0 ? 138 : 170}
                          y2={index % 2 === 0 ? 234 : 260}
                          stroke={index < 3 ? "#22c55e" : "#fb7185"}
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                        <rect
                          x={x - 10}
                          y={index % 2 === 0 ? 164 : 198}
                          width="20"
                          height="46"
                          rx="5"
                          fill={index < 3 ? "#10b981" : "#f43f5e"}
                        />
                      </g>
                    ))}
                  </svg>
                  <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary-100/30 bg-primary-700/65 shadow-[0_0_60px_rgba(174,119,213,0.28)] backdrop-blur-md sm:h-28 sm:w-28">
                    <SearchX className="h-10 w-10 text-primary-100 sm:h-12 sm:w-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 flex flex-col items-center text-center lg:order-2 lg:items-start lg:text-right">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-300/40 bg-primary-450/15 px-4 py-2 text-xs font-bold text-primary-100">
            <span className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_16px_rgba(248,113,113,0.8)]" />
            خطای ۴۰۴
          </div>
          <div className="relative mb-5">
            <span className="absolute -right-4 -top-8 hidden text-[9rem] font-black leading-none text-white/[0.035] lg:block">
              404
            </span>
            <h1 className="relative text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              سیگنال پیدا نشد
            </h1>
          </div>
          <p className="max-w-xl text-base font-semibold leading-8 text-white/80 sm:text-lg">
            مسیر مورد نظر وجود ندارد یا ممکن است حذف شده باشد.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-7 text-font-light sm:text-base">
            به نظر می‌رسد وارد یک آدرس نامعتبر شده‌اید. از مسیرهای زیر می‌توانید به نقطه درست برگردید.
          </p>
          <div className="mt-9 w-full max-w-xs">
            <Link
              href="/"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary-450 px-5 py-3 text-sm font-extrabold text-white shadow-[0_18px_50px_rgba(84,44,133,0.42)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary-300 hover:shadow-[0_24px_70px_rgba(126,78,172,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100"
            >
              <Home className="h-5 w-5" />
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
