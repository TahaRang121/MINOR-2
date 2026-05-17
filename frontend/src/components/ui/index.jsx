import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const baseClass = 'font-semibold rounded-lg transition-all duration-300 focus:outline-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-glow hover:scale-105 active:scale-95',
    secondary: 'glass text-current hover:border-primary-400 hover:shadow-glow-sm',
    ghost: 'text-current/80 hover:text-current',
    danger: 'bg-red-500/80 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Card = ({
  children,
  className = '',
  hoverable = true,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4 } : {}}
      onClick={onClick}
      className={`card-glass ${className} ${hoverable ? 'cursor-pointer' : ''} overflow-hidden text-break`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const Badge = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-500/20 text-primary-300 border border-primary-500/30',
    secondary: 'bg-secondary-500/20 text-secondary-300 border border-secondary-500/30',
    success: 'bg-green-500/20 text-green-300 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export const Input = React.forwardRef(({
  type = 'text',
  placeholder = '',
  className = '',
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      className={`input-field ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export const Textarea = React.forwardRef(({
  placeholder = '',
  className = '',
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      placeholder={placeholder}
      className={`input-field resize-none ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export const Select = React.forwardRef(({
  options = [],
  placeholder = 'Select an option',
  className = '',
  ...props
}, ref) => {
  return (
    <select
      ref={ref}
      className={`input-field appearance-none pr-10 ${className}`}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

Select.displayName = 'Select';

export const Loading = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`${sizes[size]} rounded-full border-2 border-primary-500/20 border-t-primary-500 animate-spin`} />
  );
};

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`shimmer rounded-lg ${className}`}
        />
      ))}
    </>
  );
};

export const Tooltip = ({
  children,
  content,
  position = 'top',
  ...props
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  const positions = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      {...props}
    >
      {children}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 2 }}
          className={`absolute ${positions[position]} z-50 px-2 py-1 glass text-current text-sm rounded whitespace-nowrap`}
        >
          {content}
        </motion.div>
      )}
    </div>
  );
};
