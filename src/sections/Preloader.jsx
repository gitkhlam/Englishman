import { useState, useEffect, useRef } from 'react';

export default function Preloader({ onComplete, loadingData }) {
    
    

    const [text, setText] = useState("");
    const [fullText] = useState(() =>
        window.innerWidth <= 640 ? "<EnglishMan />" : "<This is EnglishMan />"
    );

    const loadingDataRef = useRef(loadingData);

    useEffect(() => {
        loadingDataRef.current = loadingData; // Обновляем ref при изменении loadingData
    }, [loadingData]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setText(fullText.substring(0, index));
            index++;

            if (index > fullText.length) {
                if (!loadingDataRef.current) {
                    onComplete();
                }
                index = 0;
            }
        }, 100);

        return () => clearInterval(interval);
    }, [onComplete]);  

    return (
        <div className="min-w-[320px] fixed inset-0 z-999 bg-[var(--light)] text-[var(--dark)] dark:bg-[var(--dark)] dark:text-[var(--light)] flex flex-col items-center justify-center p-10">
            <div className="mb-4 text-3xl sm:text-4xl font-mono font-bold select-none">
                {text} <span className="animate-blink"> | </span>
            </div>
            <div className="w-[200px] h-[2px] bg-[var(--dark)] dark:bg-[var(--light)] rounded relative overflow-hidden">
                <div className="w-[40%] h-full bg-amber-50 dark:bg-gray-800 animate-loading-bar"></div>
            </div>
        </div>
    );
}