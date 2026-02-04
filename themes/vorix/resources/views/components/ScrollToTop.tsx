/**
 * Vorix Theme - Scroll To Top Component
 * Floating scroll to top button with smooth animation
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ScrollToTopProps {
  threshold?: number;
  bottom?: number;
  right?: number;
  className?: string;
}

export default function ScrollToTop({
  threshold = 300,
  bottom = 20,
  right = 20,
  className = ''
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Button variants for animations
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.button
      variants={buttonVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover="hover"
      whileTap="tap"
      onClick={scrollToTop}
      className={`fixed z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      style={{ bottom: `${bottom}px`, right: `${right}px` }}
      aria-label="Scroll to top"
    >
      {/* Icon */}
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>

      {/* Animated pulse effect */}
      <motion.div
        className="absolute inset-0 bg-blue-600 rounded-full"
        initial={false}
        animate={{ scale: isVisible ? [1, 1.2, 1] : 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ opacity: 0.3 }}
      />
    </motion.button>
  );
}

// Enhanced scroll to top with progress indicator
interface ProgressScrollToTopProps extends ScrollToTopProps {
  showProgress?: boolean;
}

export function ProgressScrollToTop({
  threshold = 300,
  bottom = 20,
  right = 20,
  className = '',
  showProgress = true
}: ProgressScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / docHeight) * 100;

      setIsVisible(scrollTop > threshold);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="relative">
      {/* Progress ring */}
      {showProgress && (
        <div className="fixed z-40" style={{ bottom: `${bottom + 30}px`, right: `${right}px` }}>
          <svg className="w-12 h-12 transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="126"
              strokeDashoffset={126 - (126 * scrollProgress) / 100}
              className="text-blue-600 transition-all duration-300 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              {Math.round(scrollProgress)}%
            </span>
          </div>
        </div>
      )}

      {/* Scroll to top button */}
      <motion.button
        variants={buttonVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        whileHover="hover"
        whileTap="tap"
        onClick={scrollToTop}
        className={`fixed z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
        style={{ bottom: `${bottom}px`, right: `${right}px` }}
        aria-label="Scroll to top"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    </div>
  );
}

// Scroll to top that appears at different positions based on scroll
class AdaptiveScrollToTop extends React.Component<ScrollToTopProps> {
  state = {
    isVisible: false,
    position: 'bottom-right'
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const { threshold = 300 } = this.props;

    this.setState({
      isVisible: scrollTop > threshold,
      position: scrollTop > window.innerHeight * 2 ? 'fixed-center' : 'bottom-right'
    });
  };

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  render() {
    const { isVisible, position } = this.state;
    const { bottom = 20, right = 20, className = '' } = this.props;

    if (!isVisible) return null;

    let style: React.CSSProperties = {
      position: 'fixed',
      zIndex: 50,
    };

    if (position === 'fixed-center') {
      style = {
        ...style,
        bottom: '50%',
        transform: 'translateY(50%)',
        right: '20px',
      };
    } else {
      style = {
        ...style,
        bottom: `${bottom}px`,
        right: `${right}px`,
      };
    }

    return (
      <motion.button
        style={style}
        className={`p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
        onClick={this.scrollToTop}
        aria-label="Scroll to top"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    );
  }
}