// Animation utilities
export const staggerContainerVariants = (staggerDelay = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.3,
    },
  },
});

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const slideInRightVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const hoverScaleVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export const floatingVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const glowVariants = {
  initial: {
    boxShadow: '0 0 5px rgba(96, 132, 255, 0.5)',
  },
  animate: {
    boxShadow: [
      '0 0 5px rgba(96, 132, 255, 0.5)',
      '0 0 20px rgba(96, 132, 255, 0.8)',
      '0 0 5px rgba(96, 132, 255, 0.5)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Format utilities
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Class utilities
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
    case 'high':
      return 'text-red-400';
    case 'medium':
      return 'text-yellow-400';
    case 'low':
      return 'text-green-400';
    default:
      return 'text-blue-400';
  }
};

export const getSeverityBgColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
    case 'high':
      return 'bg-red-500/20';
    case 'medium':
      return 'bg-yellow-500/20';
    case 'low':
      return 'bg-green-500/20';
    default:
      return 'bg-blue-500/20';
  }
};

export const getCategoryColor = (category) => {
  const colors = {
    geopolitical: 'text-blue-400',
    economic: 'text-yellow-400',
    'natural disaster': 'text-orange-400',
    energy: 'text-purple-400',
    health: 'text-red-400',
  };
  return colors[category?.toLowerCase()] || 'text-white';
};

export const getDirectionColor = (direction) => {
  switch (direction?.toLowerCase()) {
    case 'rise':
      return 'text-green-400';
    case 'fall':
      return 'text-red-400';
    case 'neutral':
      return 'text-gray-400';
    default:
      return 'text-blue-400';
  }
};
