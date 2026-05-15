import { motion, AnimatePresence, useInView } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// --- CONFIGURATION ---
const VIEWPORT_CONFIG = { once: true, margin: "-10% 0px -10% 0px" as any }; // 10% from top/bottom

// --- GLITCH TEXT COMPONENT ---
export const GlitchText = ({
    text,
    className = "",
    delay = 0,
}: {
    text: string;
    className?: string;
    delay?: number;
}) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const [displayText, setDisplayText] = useState(text);
    const ref = useRef(null);
    const isInView = useInView(ref, VIEWPORT_CONFIG);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (isInView && !hasAnimated) {
            setHasAnimated(true);
            let iteration = 0;
            const interval = setInterval(() => {
                setDisplayText(
                    text
                        .split("")
                        .map((letter, index) => {
                            if (index < iteration) {
                                return text[index];
                            }
                            return characters[Math.floor(Math.random() * characters.length)];
                        })
                        .join("")
                );

                if (iteration >= text.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 2; // Speed of decoding
            }, 30);
            return () => clearInterval(interval);
        }
    }, [isInView, text, hasAnimated]);

    return (
        <span ref={ref} className={cn("inline-block", className)}>
            {displayText}
        </span>
    );
};

// --- MASK REVEAL COMPONENT ---
export const MaskReveal = ({
    children,
    className = "",
    delay = 0,
    overlayColor = "#D4FF00", // Loopin Lime
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    overlayColor?: string;
}) => {
    return (
        <div className={cn("relative overflow-hidden inline-block", className)}>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={VIEWPORT_CONFIG}
                transition={{ duration: 0.01, delay: delay }} // Instant visibility after delay
            >
                {children}
            </motion.div>
            <motion.div
                className="absolute inset-0 z-10"
                style={{ backgroundColor: overlayColor }}
                initial={{ x: "-100%" }}
                whileInView={{ x: ["-100%", "0%", "101%"] }} // Slide in then out
                viewport={VIEWPORT_CONFIG}
                transition={{
                    duration: 0.8,
                    times: [0, 0.4, 1], // Wait a bit then zip away
                    ease: "circInOut",
                    delay: delay,
                }}
            />
        </div>
    );
};

// --- KINETIC SLIDE (Replaces SlideUp) ---
// Skews the element as it slides up for a feeling of speed
export const SlideUp = ({
    children,
    className = "",
    delay = 0,
    duration = 0.5,
    yOffset = 60,
    skew = 5,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    yOffset?: number;
    skew?: number;
}) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: yOffset, skewY: skew, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, skewY: 0, filter: "blur(0px)" }}
            viewport={VIEWPORT_CONFIG}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.22, 1, 0.36, 1], // Custom "OutExpo" like ease
                type: "spring",
                stiffness: 70,
                damping: 12,
            }}
        >
            {children}
        </motion.div>
    );
};

// --- ELASTIC SCALE (Replaces ScaleIn) ---
// Flips 3D and snaps into place
export const ScaleIn = ({
    children,
    className = "",
    delay = 0,
    duration = 0.5,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
}) => {
    return (
        <motion.div
            className={className}
            initial={{
                opacity: 0,
                scale: 0.8,
                rotateX: 45, // 3D Tilt
                filter: "contrast(0.5) brightness(0.5)" // Dim initally
            }}
            whileInView={{
                opacity: 1,
                scale: 1,
                rotateX: 0,
                filter: "contrast(1) brightness(1)"
            }}
            viewport={VIEWPORT_CONFIG}
            transition={{
                delay,
                type: "spring",
                bounce: 0.5, // Bouncy!
                duration: 0.5
            }}
            style={{ transformPerspective: 1000 }} // Enable 3D perspective
        >
            {children}
        </motion.div>
    );
};

// --- STAGGER CONTAINER (Unchanged but uses new strict viewport) ---
export const StaggerContainer = ({
    children,
    className = "",
    delay = 0,
    staggerChildren = 0.08, // Faster stagger for kinetic feel
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    staggerChildren?: number;
}) => {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        delayChildren: delay,
                        staggerChildren: staggerChildren,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
};

// --- SIMPLE FADE (With a twist) ---
export const FadeIn = ({
    children,
    className = "",
    delay = 0,
    duration = 0.5,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
}) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, x: -20, filter: "blur(8px)" }} // Slide from left + blur
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={VIEWPORT_CONFIG}
            transition={{ duration, delay, ease: "circOut" }}
        >
            {children}
        </motion.div>
    );
};
