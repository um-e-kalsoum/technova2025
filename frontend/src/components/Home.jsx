import logo from "../assets/logo.png";
import logoDark from "../assets/logoDark.png";
import helpVid from "../assets/videos/Help.mp4";
import loveVid from "../assets/videos/love.mp4";
import moreVid from "../assets/videos/more.mp4";


export const Home = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-start text-center text-black dark:text-white"
    >
      
      <div className="h-16" />

      {/* logo */}
      <img src={logo} alt="Signify logo (light mode" className="w-60 h-auto mb-6 object-contain block dark:hidden" />
      <img src={logoDark} alt="Signify logo (dark mode" className="w-60 h-auto mb-6 object-contain hidden dark:block" />

      {/* title */}
      <h1 className=" font-mono text-6xl font-extrabold tracking-tight">
        Welcome to Signify.
      </h1>

      {/* blurb (left) */}
      <div className="w-full flex justify-start mt-16 pl-12">
        <div className="max-w-2xl text-left">
          <h2 className="text-4xl font-bold mb-4">Our mission</h2>
          <div className="textbox mt-8">
            <p className="text-lg">
            With Signify, we aim to break down the barriers surrounding communication by making sign language more accessible and 
            widely understood. According to the Canadian Association of the Deaf, there are an estimated 357,000 culturally Deaf 
            individuals and 3.21 million hard-of-hearing Canadians.
            </p>
          </div>
        </div>
      </div>

      {/* blurb (right) */}
      <div className="w-full flex justify-end mt-16 pr-12">
        <div className="max-w-2xl text-right">
          <div className="textbox">
            <p className="text-lg">
            Too often, culturally Deaf and hard-of-hearing individuals are expected to adapt to the needs of hearing people—while comparatively 
            few hearing individuals take the initiative to learn or understand sign language. Signify seeks to challenge this imbalance by 
            providing tools that empower inclusivity, mutual understanding, and equal access to communication.
            </p>
          </div>
        </div>
      </div>

      {/* header */}
      <div className="w-full flex justify-start mt-24 pl-12 ">
        <div className="max-w-2xl text-left">
          <h2 className="text-4xl font-bold mb-12">Common gestures</h2>
        </div>
      </div>

      {/* gesture cards */}
      <div className="w-full flex items-start justify-center gap-16">
        <div className="textbox w-96 h-72 flex flex-col items-center">
          <video autoPlay loop muted playsInline className="w-72 rounded-lg shadow-lg mb-4">
            <source src={helpVid} type="video/mp4" />
          </video>
          <p className="text-lg mt-5">Help</p>
        </div>

        <div className="textbox w-96 h-72 flex flex-col items-center">
          <video autoPlay loop muted playsInline className="w-64 rounded-lg shadow-lg mb-4">
            <source src={loveVid} type="video/mp4" />
          </video>
          <p className="text-lg mt-7">Love</p>
        </div>

        <div className="textbox w-96 h-72 flex flex-col items-center">
          <video autoPlay loop muted playsInline className="w-64 rounded-lg shadow-lg mb-4">
            <source src={moreVid} type="video/mp4" />
          </video>
          <p className="text-lg mt-7">More</p>
        </div>
      </div>

     
      <a
        href="#project"
        className="mt-20 inline-block rounded-lg bg-[#788AA3] px-6 py-3 text-black font-medium transition-colors
                   hover:bg-[#92B6B1] dark:bg-[#212a39] dark:text-white dark:hover:opacity-90">
        Get Started
      </a>
    </section>
  );
};
