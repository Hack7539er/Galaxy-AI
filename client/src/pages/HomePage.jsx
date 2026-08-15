import PromptInput from "../components/PromptInput.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import homeTags from "../assets/assets.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClockIcon, ArrowRightIcon, Trash2Icon } from "lucide-react";
import moment from "moment";

const HomePage = () => {
    const {
        user,
        logOut,
        generateHandler,
        generatingProject,
        loadingProjects,
        projects,
        loadProjects,
        deleteHandler,
    } = useAppContext();

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const navigate = useNavigate();

    return (
        <div className="h-screen overflow-y-scroll text-white font-sans bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat">
            {/* Navbar */}
            <nav className="sticky top-0 z-10 flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2">
                    <img
                        className="size-1/2"
                        src="/logo.svg"
                        alt="Brand Logo"
                    />
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-zinc-300">
                    <span>{user?.name}</span>
                    <button
                        className="px-1.5 py-3 border border-white/30 text-white hover:bg-white/20 text-xs rounded-md cursor-pointer bg-transparent"
                        onClick={() => logOut()}
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20 mt-8 xl:mt-28">
                <div className="w-full max-w-xl flex flex-col items-center">
                    {/* Promo Badge */}
                    <div className="flex items-center gap-2 p-1.5 pr-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[13px] text-white/90">
                        <span className="px-3 py-1 text-[11px] bg-red-700 rounded-full font-medium tracking-wider">
                            PROMO
                        </span>
                        <span>Create Your First Project For Free.</span>
                    </div>

                    {/* Title  */}
                    <h1 className="text-center text-4xl md:text-6xl font-medium mt-4 max-w-2xl text-white">
                        Let's Build Your App Together
                    </h1>
                    <p className="text-center text-sm md:text-base max-w-xl mt-4 text-white/65 leading-relaxed">
                        Describe Your Idea And Watch AI Design, Structure And
                        Launch Your Website Instantly. No Coding Required.
                    </p>
                    <div className="w-full mt-6">
                        <PromptInput
                            onSubmit={() => generateHandler()}
                            loading={generatingProject}
                            placeholder="Create A Portfolio Website..."
                            variant="glass"
                            autoFocus
                        />
                    </div>

                    {/* Scrolling Marquee Tags */}
                    <div className="masked-marquee w-full mt-4 max-w-2xl overflow-hidden py-1">
                        <div className="animate-marquee gap-3">
                            {homeTags.map((tag, index) => (
                                <button
                                    className="px-4 py-1.5 border rounded-full text-sm text-white bg-white/10 border-white/25 hover:bg-white/20 transition cursor-pointer shrink-0 font-medium"
                                    key={index}
                                    onClick={() => generateHandler(tag)}
                                    disabled={generatingProject}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* All Previous Saved Projects List */}
                    {!loadingProjects && projects.length > 0 && (
                        <div className="mt-12 w-full">
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                                <p className="text-xs font-medium uppercase text-zinc-100 tracking-widest">
                                    All Projects
                                </p>
                                <span className="text-xs text-zinc-100 font-normal">
                                    {projects.length}{" "}
                                    {projects.length === 1
                                        ? "project"
                                        : "projects"}
                                </span>
                            </div>
                            <div className="space-y-2 max-h-[80vh] overflow-y-auto pr-1">
                                {projects.map((project) => (
                                    <div
                                        className="group bg-white/5 border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between hover:border-white/20 hover:bg-white/10 cursor-pointer backdrop-blur-md transition-all"
                                        key={project._id}
                                        onClick={() =>
                                            navigate(`/builder/${project._id}`)
                                        }
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">
                                                {project.name}
                                            </p>

                                            <div className="flex items-center gap-3 mt-0.5">
                                                <span className="text-xs text-zinc-300 flex items-center gap-1">
                                                    <ClockIcon size={10} />
                                                    {moment(
                                                        project.updatedAt ||
                                                            project.createdAt,
                                                    ).fromNow()}
                                                </span>

                                                <span className="text-xs text-white/60 font-medium">
                                                    v {project.version}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                className="p-1.5 rounded-md text-zinc-200 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-white/10 transition-opacity duration-200"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    deleteHandler(project._id);
                                                }}
                                            >
                                                <Trash2Icon size={14} />
                                            </button>

                                            <ArrowRightIcon
                                                className="text-zinc-200 group-hover:text-white"
                                                size={14}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
