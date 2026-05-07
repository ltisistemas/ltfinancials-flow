import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <motion.div 
        className="relative w-11 h-11 flex items-center justify-center"
        initial={{ rotate: -10, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Layered background with glass effect */}
        <div className="absolute inset-0 bg-[#007acc]/20 rounded-2xl rotate-6 blur-[2px]" />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl -rotate-3 transition-transform group-hover:rotate-0" />
        
        {/* Core Icon Symbol */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-6 h-6 text-[#007acc] relative z-10 drop-shadow-[0_0_8px_rgba(0,122,204,0.5)]"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>

        {/* Decorative corner accent */}
        <div className="absolute top-1 right-1 w-2 h-2 bg-[#007acc] rounded-full animate-pulse blur-[1px]" />
      </motion.div>
      
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-black tracking-tighter text-white flex items-baseline">
          Flow<span className="text-[#007acc] ml-0.5 text-2xl">.</span>
        </span>
        <div className="flex items-center gap-2">
          <div className="h-[1px] w-4 bg-[#007acc]/40"></div>
          <span className="text-[9px] font-mono font-bold text-[#8e9299] uppercase tracking-[0.3em]">
            Financials
          </span>
        </div>
      </div>
    </div>
  )
}
