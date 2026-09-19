"use client";

import { motion } from "framer-motion";

export default function FeatureCard({ feature, index }) {
  const Icon = feature.icon;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        }),
      }}
    >
      <div className="group flex h-full items-center gap-4 rounded-2xl border border-sky-200/80 bg-white p-4 text-left shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-slate-800 dark:border-slate-700">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-[#FF6584] transition-transform duration-300 group-hover:scale-110 border border-pink-100 dark:bg-slate-700">
          <Icon className="size-6 text-[#FF6584]" strokeWidth={2} />
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
            {feature.title}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
