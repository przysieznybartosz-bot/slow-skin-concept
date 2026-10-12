import React, { ReactNode } from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface DiscreetSectionProps extends Omit<HTMLMotionProps<"section">, "children"> {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  direction?: "up" | "down" | "none";
  duration?: number;
  amount?: number | "some" | "all";
}

/**
 * DiscreetSection provides a subtle, refined "Quiet Luxury" fade and gentle vertical motion
 * when entering the viewport, without disruptive layout shifts.
 */
export const DiscreetSection: React.FC<DiscreetSectionProps> = ({
  children,
  className = "",
  id,
  delay = 0,
  direction = "up",
  duration = 0.65,
  amount = 0.1,
  ...rest
}) => {
  const yOffset = direction === "up" ? 16 : direction === "down" ? -16 : 0;

  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: "0px 0px -40px 0px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Smooth, high-end deceleration
      }}
      {...rest}
    >
      {children}
    </motion.section>
  );
};

interface DiscreetDivProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  direction?: "up" | "down" | "none";
  duration?: number;
  amount?: number | "some" | "all";
}

export const DiscreetDiv: React.FC<DiscreetDivProps> = ({
  children,
  className = "",
  id,
  delay = 0,
  direction = "up",
  duration = 0.65,
  amount = 0.1,
  ...rest
}) => {
  const yOffset = direction === "up" ? 16 : direction === "down" ? -16 : 0;

  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: "0px 0px -40px 0px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

interface DiscreetCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  index?: number;
  className?: string;
  delayOffset?: number;
}

export const DiscreetCard: React.FC<DiscreetCardProps> = ({
  children,
  index = 0,
  className = "",
  delayOffset = 0,
  ...rest
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.55,
        delay: delayOffset + Math.min((index % 6) * 0.08, 0.35),
        ease: [0.22, 1, 0.36, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
