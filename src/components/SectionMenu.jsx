import ModeButton from './ModeButton'
import { useMemo, useState, useEffect } from "react";

export default function MainSection({
    setInputMode,
    setUniqueParts,
    wordsData,
    inputMode,
    uniqueParts,
    selectedPart,
    selectedTheme,
    setSelectedPart,
    setSelectedTheme,
    currentItem,
    setCurrentItem,
    trigger
}) {

    const [input, setInput] = useState("");
    const [randomFourWords, setRandomFourWords] = useState([]);
    //const [workArray, setWorkArray] = useState([]);

    
    // processes click on one of mode buttons
    const handleClickMode = useMemo(() => (mode) => {
        setInputMode(mode);
        setUniqueParts([...new Set(wordsData.map(word => word.partOfSpeech))]);
    }, [wordsData]);

    // sets array of selected parts of speech
    const filteredWords = useMemo(() => {
        return selectedPart === "all"
            ? wordsData
            : wordsData.filter(word => word.partOfSpeech === selectedPart);
    }, [selectedPart, wordsData]);
    
    // sets final work array of selected theme
    const workArray = useMemo(() => {
        return selectedTheme === "all"
            // [...filteredWords] to prevent mutation of filteredWords!
            ? [...filteredWords].sort(() => 0.5 - Math.random()) 
            : [...filteredWords].sort(() => 0.5 - Math.random()).filter(word => word.theme === selectedTheme);
    }, [selectedTheme, filteredWords, trigger]); // trigger form App is a switcher value to recognize Logo is clicked or not

    // sets array of themes if filteredWords has changed
    const themeArray = useMemo(() =>
        [...new Set(filteredWords.map(word => word.theme))],
        [filteredWords]
    );
    
    // refreshes RandomFourWords if currentItem or workArray changed
    useEffect(() => {
        getRandomWords();
    }, [currentItem, workArray]);

    // function processes click on answer-button and/or manual input
    const processChoice = (word) => {
        if (inputMode === "manual" && input === "") return // exit if input is empty
        
        if (word.trim().toLowerCase() === workArray[currentItem].word.toLowerCase()) {
            setCurrentItem(cur => (cur + 1 >= workArray.length ? 0 : cur += 1));
            setInput("");

            // if user have done all words of selected theme
            if (currentItem + 1 >= workArray.length) {
                alert("Well done!");
                setSelectedPart("all");
                setSelectedTheme("all");
            } else {
                showResultWindow(); // show full-screen size window with answer
            }
        } else {
            alert("Wrong answer!❌");
        }
    }
    
    // function set RandomFourWords array
    const getRandomWords = () => {
        if (workArray.length <= 4) {
            setRandomFourWords(workArray);
            return;
        }

        const filteredArray = workArray.filter((_, index) => index !== currentItem);
        const shuffled = filteredArray.sort(() => 0.5 - Math.random()).slice(0, 3);

        shuffled.push(workArray[currentItem]); // add right answer
        setRandomFourWords(shuffled.sort(() => 0.5 - Math.random()));
    };

    // styles for buttons answer-words
    const buttonStyle = "p-2 self-center rounded-lg cursor-pointer hover:opacity-70 bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)]";


    const [visible, setVisible] = useState(false);

    // function shows full-sized window with result of answer
    const showResultWindow = () => {
        setVisible(true);
        setTimeout(() => {
            setVisible(false);
        }, 500); // 0.5 sec
    };

    return (
        <section className='container'>
            <div className="max-w-150 mx-auto flex flex-col space-y-4 justify-center items-center">
                {!inputMode && (
                    <>
                        <h1 className="text-2xl sm:text-3xl font-semibold dark:text-[var(--light)] text-[var(--dark)] text-center mb-5">
                            Hello! Glad to welcome you to EnglishMan! <br />
                            Start learning new words right now!
                        </h1>
                        <p className='text-[var(--dark)] dark:text-[var(--light)] text-2xl font-medium'>Choose mode:</p>
                    </>
                )}
                <div className="flex justify-center gap-5">
                    {["manual", "choice"].map(mode => (
                        <ModeButton
                            key={mode}
                            onClick={() => handleClickMode(mode)}
                            isActive={inputMode === mode}
                        >
                            {mode === "manual" ? "Manual Type" : "Choice Mode"}
                        </ModeButton>
                    ))}
                </div>
                {inputMode && uniqueParts.length > 1 && (
                    <div className='mt-5 w-full dark:text-[var(--light)] text-[var(--dark)] text-2xl rounded-lg bg-blue-200 dark:bg-gray-800 p-7'>
                        <div className='flex gap-2 font-medium flex-wrap items-center'>
                            <p>Choose part of speech:</p>
                            <select
                                className='flex-1 max-w-full min-w-20 truncate cursor-pointer bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)] p-1 rounded-lg outline-none hover:opacity-70'
                                value={selectedPart}
                                onChange={(e) => {
                                    setSelectedPart(e.target.value);
                                    setSelectedTheme("all");
                                    setCurrentItem(0);
                                }}
                            >
                                <option value="all">all</option>
                                {uniqueParts.map((part, index) => (
                                    <option key={index} value={part}>{part}</option>
                                ))}
                            </select>
                        </div>
                        {themeArray.length > 1 && (
                            <div className='mt-4 flex gap-2 flex-nowrap font-medium items-center'>
                                <p>Choose theme:</p>
                                <select
                                    className='flex-1 max-w-full min-w-20 truncate cursor-pointer bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)] p-1 rounded-lg outline-none hover:opacity-70'
                                    value={selectedTheme}
                                    onChange={(e) => { setSelectedTheme(e.target.value); setCurrentItem(0); }}
                                >
                                    <option value="all">all</option>
                                    {themeArray.map((theme, index) => (
                                        <option key={index} value={theme}>{theme}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <p className='my-4'>Total count of words {workArray.length > 1 && selectedTheme !== "all" && `in theme "${selectedTheme}"`}: {workArray.length}</p>

                        <p>{workArray[currentItem].translation}</p>


                        {inputMode === "manual" && <div>
                            <input
                                className='my-4 w-full border py-3 px-5 rounded-lg border-[var(--dark)] dark:border-[var(--light)] outline-blue-300'
                                type="text"
                                value={input}
                                placeholder='Type translation and press "Enter"'
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && processChoice(input)}

                            />
                            <div className='flex items-center gap-5'>
                                <button
                                    className={buttonStyle}
                                    onClick={() => processChoice(input)}
                                >
                                    Check
                                </button>
                                <p>{currentItem}/{workArray.length}</p>
                            </div>
                        </div> }
                        {
                            inputMode === "choice" && <><div className='mt-5 flex gap-4 flex-wrap justify-around sm:justify-start items-center'>
                                {randomFourWords.map((word, ind) => (
                                    <button 
                                    key={ind}
                                    className={buttonStyle}
                                    onClick={() => processChoice(word.word)}
                                    >{word.word}</button>
                                ))}
                            </div>
                            <p className='pt-4'>{currentItem}/{workArray.length}</p>
                            </>
                        }
                    
                    </div>
                )}
            </div>
            {visible && <div className='z-50 flex items-center justify-center fixed inset-0 min-h-screen w-full bg-[var(--dark)] text-[var(--light)] text-4xl overflow-hidden'>
                Correct! ✅ 
            </div>}
        </section>
    )
}