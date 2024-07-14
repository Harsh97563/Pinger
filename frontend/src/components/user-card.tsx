import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
  socket
}: {
  items: {
    username: string;
    userId: number
  }[];
  className?: string;
  socket: WebSocket | null;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4  py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.userId}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => {
            socket?.send(JSON.stringify({type: 'SELECTED_PERSON', payload: {to: item.userId}}))
          }}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-cyan-600/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.username}</CardTitle>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      className={cn(
        "rounded-2xl block cursor-pointer items-center justify-center max-h-[25vh] w-full border overflow-hidden border-black dark:border-white/[0.2] relative z-20",
        className
      )}
      initial= "initial"
      whileHover="hovered"
    >
      <motion.div className="flex items-center justify-center text-white h-[25vh]"
      variants={{
        initial: {y:0},
        hovered: {y: -250},
      }}
      >{children}</motion.div>
      <motion.div className="flex bg-gray-900 text-xl font-bold items-center justify-center text-white h-[25vh]"
      variants={{
        initial: {y:235},
        hovered: {y: -235}
      }}
      whileTap={{scale: 1.35}}
      >Click here to ping the user.</motion.div>
    </motion.div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
