import LeadForm from "../../components/LeadForm";
import ladyWithLetter from "../../assets/lady_with_letter.svg";
import { CheckCircle, Hexagon } from "lucide-react";

export default function LandingPage() {
  return (
    <div 
      className="min-h-screen font-sans text-gray-900 flex flex-col relative"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle at top left, #eef4ff, transparent 40%), radial-gradient(circle at bottom right, #f5f3ff, transparent 35%)"
      }}
    >
      {/* ── Brand Navbar ── */}
      <nav className="absolute top-0 left-0 w-full p-6 lg:px-12 flex items-center gap-2 z-20">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 text-white">
          <Hexagon className="w-6 h-6 fill-white/20" strokeWidth={2} />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">Aura</span>
      </nav>

      <main className="flex-grow flex flex-col lg:flex-row w-full min-h-screen pt-20 lg:pt-0">
        
        {/* ── Left Column: Emotion & Value ─────────────── */}
        <div className="w-full lg:w-1/2 bg-white/30 flex flex-col justify-center p-8 sm:p-16 lg:p-20 xl:p-24 border-b lg:border-b-0 lg:border-r border-gray-200/40">
          
          <div className="max-w-xl mx-auto lg:mx-0 lg:ml-auto lg:mr-8 xl:mr-16 w-full flex flex-col">
            
            {/* ── SVG Asset (Larger, tighter gap, hover animation) ── */}
            <div className="w-full max-w-[380px] sm:max-w-[420px] xl:max-w-[460px] mb-3 sm:mb-4">
              <img
                src={ladyWithLetter}
                alt="Illustration of a lady holding a letter"
                className="w-full h-auto object-contain drop-shadow-sm transition-transform duration-300 hover:-translate-y-2 cursor-default"
              />
            </div>
            
            <h1 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 lg:text-4xl xl:text-5xl">
              Let's build something
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block sm:inline">
                {" "}great together.
              </span>
            </h1>

            {/* Expanded copy to better balance the column width */}
            <p className="mb-7 text-base text-gray-600 leading-relaxed max-w-lg">
              Share your project goals, timeline, and current challenges. Our team will review your requirements and map out the perfect technical solution tailored to your needs.
            </p>

            {/* Consistent Lucide icons replacing the mixed emojis */}
            <ul className="space-y-3 text-sm font-medium text-gray-600">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500" strokeWidth={2.5} /> Proposal within 24 hours
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500" strokeWidth={2.5} /> Free consultation
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500" strokeWidth={2.5} /> No commitment required
              </li>
            </ul>
            
          </div>
        </div>

        {/* ── Right Column: Action (Form) ──────────────── */}
        <div className="w-full lg:w-1/2 bg-white/60 flex flex-col p-8 sm:p-16 lg:p-20 xl:p-24">
          <div className="max-w-md mx-auto lg:mx-0 lg:mr-auto lg:ml-8 xl:ml-16 w-full">
            
            {/* ── Trust Badge ── */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6 text-xs font-semibold tracking-wide text-gray-500">
              <span className="flex items-center gap-1.5"><span className="text-blue-500 text-sm">✓</span> No spam</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><span className="text-blue-500 text-sm">✓</span> 24h Response</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><span className="text-blue-500 text-sm">✓</span> Free consult</span>
            </div>

            {/* Action-oriented headline */}
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              Request a proposal
            </h2>
            <p className="mb-8 text-base text-gray-600">
              Fill in the details below and we'll reach out.
            </p>
            
            <LeadForm />
            
          </div>
        </div>
        
      </main>

      {/* ── Social proof strip ─────── */}
      <section className="bg-gray-900 py-10 text-white w-full border-t border-gray-800 relative z-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-16">
            {[
              "Trusted by 200+ founders",
              "4.9 ★ average rating",
              "98% project success rate",
            ].map((t) => (
              <span
                key={t}
                className="text-center text-sm font-medium uppercase tracking-wider text-gray-400"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Floating Credit Badge (Always Visible) ─────── */}
      <a 
        href="https://digitalheroesco.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-full shadow-lg border border-gray-700 hover:bg-gray-800 hover:scale-105 transition-all duration-200 text-xs font-semibold tracking-wide"
      >
        Built for Digital Heroes Training Task
      </a>
    </div>
  );
}