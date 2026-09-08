const particles = [
  { left: "4%", top: "10%", size: 2, opacity: 0.28, duration: 11, delay: 0.2 },
  { left: "8%", top: "24%", size: 2.5, opacity: 0.46, duration: 14, delay: 1.1 },
  { left: "12%", top: "38%", size: 1.8, opacity: 0.32, duration: 10, delay: 2.3 },
  { left: "16%", top: "58%", size: 3.2, opacity: 0.52, duration: 13, delay: 1.6 },
  { left: "20%", top: "18%", size: 2.4, opacity: 0.38, duration: 16, delay: 3.4 },
  { left: "26%", top: "72%", size: 2.1, opacity: 0.36, duration: 12, delay: 0.9 },
  { left: "30%", top: "12%", size: 3.6, opacity: 0.6, duration: 15, delay: 2.6 },
  { left: "35%", top: "46%", size: 2.5, opacity: 0.42, duration: 9, delay: 3.8 },
  { left: "41%", top: "22%", size: 1.8, opacity: 0.28, duration: 18, delay: 1.3 },
  { left: "46%", top: "64%", size: 2.7, opacity: 0.46, duration: 11, delay: 4.5 },
  { left: "50%", top: "14%", size: 2.2, opacity: 0.34, duration: 17, delay: 5.1 },
  { left: "54%", top: "30%", size: 3.3, opacity: 0.58, duration: 12, delay: 2.9 },
  { left: "58%", top: "78%", size: 2.5, opacity: 0.4, duration: 10, delay: 0.8 },
  { left: "62%", top: "18%", size: 1.7, opacity: 0.3, duration: 15, delay: 3.2 },
  { left: "68%", top: "46%", size: 2.8, opacity: 0.52, duration: 13, delay: 1.7 },
  { left: "72%", top: "12%", size: 2.4, opacity: 0.38, duration: 16, delay: 4.8 },
  { left: "76%", top: "62%", size: 3.5, opacity: 0.66, duration: 9, delay: 2.2 },
  { left: "80%", top: "28%", size: 2.2, opacity: 0.34, duration: 14, delay: 5.2 },
  { left: "84%", top: "82%", size: 2.8, opacity: 0.48, duration: 11, delay: 1.9 },
  { left: "88%", top: "16%", size: 1.9, opacity: 0.26, duration: 18, delay: 3.7 },
  { left: "92%", top: "52%", size: 3.2, opacity: 0.56, duration: 12, delay: 4.4 },
  { left: "96%", top: "34%", size: 2.1, opacity: 0.32, duration: 17, delay: 0.5 },
  { left: "6%", top: "86%", size: 2.6, opacity: 0.4, duration: 15, delay: 2.1 },
  { left: "22%", top: "88%", size: 1.9, opacity: 0.28, duration: 19, delay: 5.9 },
  { left: "34%", top: "84%", size: 2.7, opacity: 0.44, duration: 13, delay: 2.7 },
  { left: "40%", top: "90%", size: 2.1, opacity: 0.3, duration: 18, delay: 4.2 },
  { left: "52%", top: "92%", size: 3, opacity: 0.5, duration: 10, delay: 1.4 },
  { left: "60%", top: "86%", size: 2.4, opacity: 0.36, delay: 6.1, duration: 15 },
  { left: "70%", top: "90%", size: 2.2, opacity: 0.33, duration: 17, delay: 3.9 },
  { left: "82%", top: "92%", size: 2.9, opacity: 0.48, duration: 11, delay: 2.8 },
  { left: "94%", top: "82%", size: 2.3, opacity: 0.34, duration: 16, delay: 5.4 },
  { left: "14%", top: "48%", size: 2, opacity: 0.3, duration: 13, delay: 7.1 },
  { left: "24%", top: "34%", size: 2.5, opacity: 0.42, duration: 15, delay: 6.7 },
  { left: "38%", top: "68%", size: 2.1, opacity: 0.32, duration: 12, delay: 8.4 },
  { left: "44%", top: "42%", size: 2.8, opacity: 0.52, duration: 10, delay: 6.2 },
  { left: "56%", top: "52%", size: 2.4, opacity: 0.38, duration: 14, delay: 7.9 },
  { left: "64%", top: "34%", size: 1.8, opacity: 0.28, duration: 16, delay: 9.2 },
  { left: "74%", top: "74%", size: 2.3, opacity: 0.35, duration: 15, delay: 8.1 },
  { left: "86%", top: "42%", size: 2.6, opacity: 0.43, duration: 11, delay: 7.5 },
  { left: "2%", top: "72%", size: 3, opacity: 0.5, duration: 13, delay: 8.8 },
  { left: "18%", top: "8%", size: 2.3, opacity: 0.34, duration: 17, delay: 7.4 },
  { left: "32%", top: "56%", size: 2.2, opacity: 0.36, duration: 12, delay: 10.2 },
  { left: "48%", top: "80%", size: 2.8, opacity: 0.5, duration: 9, delay: 9.6 },
  { left: "66%", top: "62%", size: 2.1, opacity: 0.3, duration: 18, delay: 8.7 },
  { left: "78%", top: "8%", size: 3.1, opacity: 0.54, duration: 10, delay: 11.3 },
  { left: "90%", top: "66%", size: 2.7, opacity: 0.45, duration: 12, delay: 10.5 },
  { left: "54%", top: "4%", size: 2.4, opacity: 0.36, duration: 17, delay: 9.8 },
  { left: "42%", top: "8%", size: 2.5, opacity: 0.4, duration: 14, delay: 10.8 },
  { left: "28%", top: "92%", size: 2.1, opacity: 0.29, duration: 19, delay: 7.7 },
  { left: "8%", top: "64%", size: 2.9, opacity: 0.47, duration: 11, delay: 11.8 },
  { left: "96%", top: "12%", size: 2.7, opacity: 0.42, duration: 15, delay: 10.1 },
  { left: "74%", top: "28%", size: 1.9, opacity: 0.3, duration: 16, delay: 11.2 },
  { left: "56%", top: "74%", size: 2.2, opacity: 0.32, duration: 14, delay: 12.4 },
  { left: "12%", top: "30%", size: 2.6, opacity: 0.4, duration: 13, delay: 12.1 },
  { left: "64%", top: "84%", size: 2.8, opacity: 0.46, duration: 10, delay: 8.5 },
  { left: "92%", top: "26%", size: 2.4, opacity: 0.35, duration: 17, delay: 12.7 },
  { left: "48%", top: "58%", size: 3.4, opacity: 0.62, duration: 9, delay: 10.9 },
];

const sparks = [
  { left: "16%", top: "28%", delay: 0.5, duration: 11, size: 8 },
  { left: "34%", top: "58%", delay: 2.1, duration: 13, size: 9 },
  { left: "44%", top: "26%", delay: 4.6, duration: 12, size: 7 },
  { left: "61%", top: "48%", delay: 6.2, duration: 14, size: 9 },
  { left: "73%", top: "22%", delay: 8.4, duration: 12, size: 8 },
  { left: "84%", top: "64%", delay: 10.3, duration: 13, size: 10 },
  { left: "90%", top: "38%", delay: 12.1, duration: 15, size: 8 },
  { left: "24%", top: "78%", delay: 14.2, duration: 12, size: 8 },
];

export default function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(91,124,255,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.16),_transparent_28%)]" />

      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      <div className="ambient-glow ambient-glow-c" />

      {particles.map((particle, index) => (
        <span
          key={`particle-${index}`}
          className="ambient-particle"
          style={{
            left: particle.left,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            boxShadow: `0 0 ${Math.max(6, particle.size * 4)}px rgba(129, 140, 248, ${Math.min(0.8, particle.opacity + 0.2)})`,
          }}
        />
      ))}

      {sparks.map((spark, index) => (
        <span
          key={`spark-${index}`}
          className="ambient-spark"
          style={{
            left: spark.left,
            top: spark.top,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            animationDelay: `${spark.delay}s`,
            animationDuration: `${spark.duration}s`,
            boxShadow: `0 0 18px rgba(147, 197, 253, 0.75), 0 0 30px rgba(167, 139, 250, 0.45)`,
            ...( {
              "--spark-drift-x": `${(index % 2 === 0 ? 1 : -1) * (8 + index)}px`,
              "--spark-drift-y": `${-(8 + (index % 3) * 4)}px`,
            } as React.CSSProperties ),
          }}
        />
      ))}
    </div>
  );
}
