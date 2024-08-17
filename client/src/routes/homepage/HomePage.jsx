import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const HomePage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");
  return (
    <div className="flex items-center gap-0 h-full flex-col lg:flex-row lg:gap-24">
      <img
        src="/orbital.png"
        alt=""
        className="absolute left-0 bottom-0 opacity-5 -z-10"
      ></img>
      <div className="left flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="font-semibold text-6xl lg:text-9xl">
          <span className="bg-clip-text   bg-gradient-to-r from-purple-500 to-pink-500 text-transparent ">
            VISH
          </span>
          <span className="bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 text-transparent">
            {" "}
            AI
          </span>
        </h1>
        <h2>Supercharge your creativity and productivity</h2>
        <h3 className="font-light lg:max-w-lg max-w-3xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur,
          nesciunt cumque omnis eos tenetur dolorum.
        </h3>
        <Link
          to={"/dashboard"}
          className="px-6 py-4 bg-purple-500 rounded-md text-sm text-white hover:bg-purple-600 active:bg-purple-700 mt-5"
        >
          Get Started
        </Link>
      </div>
      <div className="right flex-1 flex items-center justify-center h-full">
        <div className="imgContainer flex items-center justify-center bg-slate-950 rounded-lg w-4/5 h-1/2 relative">
          <div className="bg-container w-full h-full overflow-hidden absolute top-0 left-0 rounded-lg">
            <div className="bg bg-[url('/bg.png')] opacity-20 w-[200%] h-full bg-auto-100 animate-slideBg"></div>
          </div>
          <img
            src="/bot.png"
            alt=""
            className="w-full h-full object-contain animate-rotateScale"
          />
          <div className="chat absolute -bottom-7 -right-12 items-center gap-2 p-3 bg-slate-800 rounded-lg hidden lg:flex  max-[1280px]:right-0">
            <img
              src={
                typingStatus === "human1"
                  ? "/human1.jpeg"
                  : typingStatus === "human2"
                  ? "/human2.jpeg"
                  : "/bot.png"
              }
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
            <TypeAnimation
              sequence={[
                "Human: We produce food for Mice",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "Bot : We produce food for Hamsters",
                2000,
                () => {
                  setTypingStatus("human2");
                },
                "Human : We produce food for Guinea Pigs",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "Bot : We produce food for Chinchillas",
                2000,
                () => {
                  setTypingStatus("human1");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="terms absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5">
        <img src="/logo.png" className="w-4 h-4" alt=""></img>
        <div className="links flex gap-3 text-gray-600 text-xs">
          <Link to="/">Terms of service</Link>
          <span> | </span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
