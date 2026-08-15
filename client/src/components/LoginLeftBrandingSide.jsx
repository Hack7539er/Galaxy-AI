const LoginLeftBrandingSide = () => {
    return (
        <div className="hidden lg:flex lg:w-2/5 bg-[url('bg-img.png')] bg-cover bg-center bg-no-repeat flex-col justify-between p-12 shrink-0 select-none">
            <div>
                <img className="m-5" src="/logo.svg" alt="Brand Logo" />
            </div>

            <div>
                <h2 className="text-3xl text-white font-medium leading-snug mb-3 tracking-tight">
                    Build Your Presence On Web
                </h2>
                <p className="text-zinc-300">
                    Describe What You Need, Preview Instantly, And Customize
                    Your Side In Real-Time. React With Clean JSX, Verified
                    Layouts And Instant Code Exports.
                </p>
                <p className="text-zinc-300 text-sm mt-12">
                    Copyright {new Date().getFullYear()} Galaxy AI
                </p>
            </div>
        </div>
    );
};

export default LoginLeftBrandingSide;
