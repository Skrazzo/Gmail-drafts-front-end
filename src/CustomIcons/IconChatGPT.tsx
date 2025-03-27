interface IconChatGPTProps {
    size?: number | string;
    color?: string;
    stroke?: number;
}

export function IconChatGPT({ size = 24, color = "currentColor", stroke = 2, ...props }: IconChatGPTProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48" {...props}>
            <path
                fill="none"
                stroke={color}
                strokeLinejoin="round"
                d="M18.38 27.94v-14.4l11.19-6.46c6.2-3.58 17.3 5.25 12.64 13.33"
                strokeWidth={stroke}
            ></path>
            <path
                fill="none"
                stroke={color}
                strokeLinejoin="round"
                d="m18.38 20.94l12.47-7.2l11.19 6.46c6.2 3.58 4.1 17.61-5.23 17.61"
                strokeWidth={stroke}
            ></path>
            <path
                fill="none"
                stroke={color}
                strokeLinejoin="round"
                d="m24.44 17.44l12.47 7.2v12.93c0 7.16-13.2 12.36-17.86 4.28"
                strokeWidth={stroke}
            ></path>
            <path
                fill="none"
                stroke={color}
                strokeLinejoin="round"
                d="M30.5 21.2v14.14L19.31 41.8c-6.2 3.58-17.3-5.25-12.64-13.33"
                strokeWidth={stroke}
            ></path>
            <path
                fill="none"
                stroke={color}
                strokeLinejoin="round"
                d="m30.5 27.94l-12.47 7.2l-11.19-6.46c-6.21-3.59-4.11-17.61 5.22-17.61"
                strokeWidth={stroke}
            ></path>
            <path
                fill="none"
                stroke={color}
                strokeLinejoin="round"
                d="m24.44 31.44l-12.47-7.2V11.31c0-7.16 13.2-12.36 17.86-4.28"
                strokeWidth={stroke}
            ></path>
        </svg>
    );
}
