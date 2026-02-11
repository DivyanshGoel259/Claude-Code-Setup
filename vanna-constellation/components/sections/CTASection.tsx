"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

// Pre-computed particle configs to avoid random on each render
const particleConfigs = Array.from({ length: 30 }, (_, i) => ({
  size: 2 + (((i * 7 + 3) % 10) / 10) * 3,
  left: (i * 13 + 5) % 100,
  duration: 12 + (((i * 11 + 2) % 10) / 10) * 15,
  delay: (i * 3 + 1) % 10,
  maxOpacity: 0.08 + (((i * 9 + 4) % 10) / 10) * 0.1,
  travelX: ((i * 17 + 7) % 100) - 50,
}));

function FloatingParticle({ index }: { index: number }) {
  const config = particleConfigs[index];

  return (
    <div
      className="absolute rounded-full animate-float-particle"
      style={{
        width: `${config.size}px`,
        height: `${config.size}px`,
        left: `${config.left}%`,
        bottom: "-5%",
        background: index % 2 === 0 ? "#703AE6" : "#FC5457",
        ["--duration" as string]: `${config.duration}s`,
        ["--delay" as string]: `${config.delay}s`,
        ["--travel-y" as string]: -900,
        ["--travel-x" as string]: config.travelX,
        ["--max-opacity" as string]: config.maxOpacity,
      }}
    />
  );
}

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 px-5 py-3.5 rounded-xl text-body-1 bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-violet-500/50 transition-colors"
        required
      />
      <motion.button
        type="submit"
        className="px-6 py-3.5 rounded-xl text-btn-md bg-white text-base-dark hover:bg-white/90 transition-colors shrink-0"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {submitted ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            ✓
          </motion.span>
        ) : (
          "Join Waitlist"
        )}
      </motion.button>
    </form>
  );
}

export default function CTASection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-base-dark"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 animate-gradient"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(112, 58, 230, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(252, 84, 87, 0.1) 0%, transparent 60%)",
            backgroundSize: "200% 200%",
          }}
        />
        {/* Secondary glow */}
        <div
          className="absolute inset-0 animate-gradient"
          style={{
            background:
              "radial-gradient(circle at 50% 80%, rgba(112, 58, 230, 0.08) 0%, transparent 50%)",
            backgroundSize: "150% 150%",
            animationDelay: "-4s",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <FloatingParticle key={i} index={i} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
        {/* Headline */}
        <motion.h2
          className="text-h2 text-white mb-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
        >
          {["The", "Future", "of", "DeFi", "is"].map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-3"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {word}
            </motion.span>
          ))}
          <br />
          <motion.span
            className="inline-block text-gradient"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            Composable
          </motion.span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className="text-subtext text-gray-400 mb-12 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Stop gambling. Start strategizing.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.a
            href="#"
            className="px-10 py-4 rounded-xl text-btn-md bg-white text-base-dark font-bold hover:shadow-lg hover:shadow-white/10 transition-shadow"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Launch App
          </motion.a>
          <motion.a
            href="#"
            className="px-10 py-4 rounded-xl text-btn-md text-white border border-white/20 hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Join Discord
          </motion.a>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="flex items-center gap-4 mb-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-body-3 text-white/30 uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </motion.div>

        {/* Email Capture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <EmailCapture />
          <p className="text-body-3 text-white/30 mt-4">
            Join 40,000+ subscribers. No spam.
          </p>
        </motion.div>

        {/* Stats bar */}
        {/* <motion.div
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          {[
            { value: '$350K+', label: 'Raised' },
            { value: '40K+', label: 'Subscribers' },
            { value: '15+', label: 'Integrations' },
            { value: '5', label: 'Chains' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <span className="text-h5 text-gradient font-mono block mb-1">
                {stat.value}
              </span>
              <span className="text-body-3 text-white/40">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div> */}
      </div>
    </section>
  );
}
