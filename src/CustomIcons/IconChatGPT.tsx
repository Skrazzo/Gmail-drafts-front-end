import React from 'react';

interface IconChatGPTProps {
  size?: number | string;
  color?: string;
  stroke?: number;
}

export function IconChatGPT({
  size = 24,
  color = 'currentColor',
  stroke = 2,
  ...props
}: IconChatGPTProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
      <path d="M9.5 13.5c.5.5 1.5 1 2.5 1s2-.5 2.5-1" />
      <path d="M7 16c1.5 1 3 1.5 5 1.5s3.5-.5 5-1.5" />
    </svg>
  );
}