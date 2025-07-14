/* eslint-disable no-unused-vars */
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

function ScrollSection({ children }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        hidden: { opacity: 0, y: 50 },
      }}
      className="mb-20"
    >
      {children}
    </motion.div>
  );
}
export default ScrollSection;