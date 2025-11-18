import Image from "next/image";
import * as React from "react";

interface YoloLogoProps {
    className?: string;
}

// Renders the real logo image from the public folder.
// Make sure you add /apps/web/public/images/logo-yolo.png
const YoloLogo = ({ className }: YoloLogoProps) => {
    return (
        <Image
            src="/images/logo-yolo.png"
            alt="Yolo logo"
            width={500}
            height={500}
            priority
            className={className}
        />
    );
};

export default YoloLogo;

