import { TypewriterEffectSmooth } from "@/components/typewriter-effect";

const Banner = () => {

    const words = [
        {
            text: "Your",
            className: "text-white"
        },
        {
            text: "Hospital",
            className: "text-white"
        },
        {
            text: "Management,",
            className: "text-white"
        },
        {
            text: "Simplified",
            className: "text-blue-500 dark:text-blue-500",
        },
    ];
    return (
        <div className="h-[650px]">
            <div style={{ backgroundImage: "url('doctor.jpg')" }} className="h-[600px] bg-cover rounded-lg ">
                <div className="h-full w-[920px] flex flex-col items-center justify-center pl-[40px] gap-y-5 text-white">
                    <TypewriterEffectSmooth words={words} className="text-6xl" />
                    <div className="text-2xl">KayaHealth Connect is the only hospital management system that brings everything together in a single platform, so you can focus on what matters most. Your Patients.</div>
                </div>
            </div>
        </div>
    );
};
export default Banner;
