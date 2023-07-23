import { useState, useEffect } from "react";

export const useOrigin = () => {
    const [mounted, seetMounted] = useState(false);
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : '';

    useEffect(() => {
        seetMounted(true);
    }, []);

    if (!mounted) {
        return '';
    }

    return origin;
}