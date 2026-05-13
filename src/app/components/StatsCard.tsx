import { motion } from "motion/react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  valueColor?: string;
  subtitleColor?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  valueColor = "#0b1f1a",
  subtitleColor = "#1a6b58"
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-[10px] border border-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      style={{ fontFamily: 'Manrope, sans-serif' }}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-[#1a6b58] text-[20px] font-bold leading-[22px]">
          {title}
        </h3>
        <p
          className="text-[36px] font-bold leading-[22px] mt-2"
          style={{ color: valueColor }}
        >
          {value}
        </p>
        <p
          className="text-[20px] font-bold leading-[22px] mt-2"
          style={{ color: subtitleColor }}
        >
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
}
