
import React from 'react';

export const BatIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || "w-6 h-6"}
  >
    <path
      fillRule="evenodd"
      d="M12.152 2.41c.27-.225.683-.225.952 0 3.864 3.213 6.9 7.42 6.9 11.09 0 3.878-3.122 7.02-7.378 7.02-4.257 0-7.379-3.142-7.379-7.02 0-3.67 3.036-7.877 6.905-11.09zM12.525 21c3.264 0 5.878-2.21 5.878-5.5 0-3.03-2.6-6.668-5.878-9.48-3.278 2.812-5.878 6.45-5.878 9.48 0 3.29 2.614 5.5 5.878 5.5z"
      clipRule="evenodd"
    />
  </svg>
);
