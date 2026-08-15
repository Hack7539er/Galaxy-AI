import { useEffect, useRef, useState } from "react";
import {
    ArrowRightIcon,
    CloudUploadIcon,
    Loader2Icon,
    MicIcon,
} from "lucide-react";

const PromptInput = ({
    onSubmit,
    loading = false,
    placeholder = "Describe The Website You Want To Build...",
    large = false,
    autoFocus = false,
    variant = "default",
}) => {
    const [value, setValue] = useState("");

    const textAreaRef = useRef(null);

    const submitHandler = (Event) => {
        if (Event) Event.preventDefault();

        const trimmed = value.trim();

        if (!trimmed || loading) return;

        onSubmit(trimmed);

        setValue("");
    };

    const keyDownHandler = (Event) => {
        if (Event.key === "Enter" && !Event.shiftKey) {
            Event.preventDefault();

            submitHandler();
        }
    };

    useEffect(() => {
        if (autoFocus && textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, [autoFocus]);

    if (variant === "glass")
        return (
            <form
                className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-xl ring-1 ring-white/25 focus-within:ring-2 focus-within:ring-white/30 overflow-hidden mt-6 transition"
                onSubmit={submitHandler}
            >
                <textarea
                    className="w-full p-4 pb-2 resize-none placeholder:text-white/60 outline-none bg-transparent text-white text-base"
                    ref={textAreaRef}
                    value={value}
                    placeholder={placeholder}
                    rows={3}
                    disabled={loading}
                    onChange={(Event) => setValue(Event.target.value)}
                    onKeyDown={keyDownHandler}
                />
                <div className="flex items-center justify-between pb-3 px-3 gap-2">
                    <label
                        htmlFor="file"
                        className="border border-white/20 text-whie/80 hover:text-white hover:bordwer-white/30 p-1.5 rounded-md cursor-pointer flex items-center justify-center"
                    >
                        <input type="file" id="file" hidden />
                        <CloudUploadIcon size={18} />
                    </label>
                    <div className="flex items-center justify-end gap-2">
                        <button
                            className="flex items-center justify-center p-1 text-white/70 hover:text-white cursor-pointer"
                            type="button"
                        >
                            <MicIcon size={18} />
                        </button>
                        <button
                            className="flex items-center justify-center p-1.5 rounded-full bg-red-600 text-white hover:bg-ref-700 disabled:opacity-40 cursor-pointer"
                            disabled={!value.trim() || loading}
                            type="submit"
                        >
                            {loading ? (
                                <Loader2Icon
                                    className="animate-spin"
                                    size={18}
                                />
                            ) : (
                                <ArrowRightIcon size={18} />
                            )}
                        </button>
                    </div>
                </div>
            </form>
        );

    return (
        <div
            className={`bg-white border border-zinc-200 rounded-xl felx items-end gap-2 focus-within:ring-1 focus-within:ring-zinc-300 transition ${large ? "p-4" : "p-3"}`}
        >
            <textarea
                className={`flex-1 bg-transparent border-none outline-none resize-none text-zinc-900 placeholder:text-zinc-400 ${large ? "text-base" : "text-sm"}`}
                ref={textAreaRef}
                value={value}
                placeholder={placeholder}
                rows={large ? 5 : 1}
                disabled={loading}
                onChange={(Event) => setValue(Event.target.value)}
                onKeyDown={keyDownHandler}
            />
            <button
                className="inline-flex items-center justify-center bg-zinc-950 text-white hover:bg-zinc-800 disabled:opacity-40 cursor-pointer rounded-full shrink-0"
                style={{
                    width: large ? 36 : 24,
                    height: large ? 36 : 24,
                }}
                onClick={() => submitHandler()}
                disabled={!value.trim() || loading}
            >
                {loading ? (
                    <Loader2Icon
                        className="animate-spin"
                        size={large ? 20 : 15}
                    />
                ) : (
                    <ArrowRightIcon size={large ? 20 : 15} />
                )}
            </button>
        </div>
    );
};

export default PromptInput;
