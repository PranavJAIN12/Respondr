/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useState, useEffect } from "react";
import logo from "../assests/logo/black-logo.svg";
// import './Home.css'
// import ring from '../assests/media/ringing.mp3'
import Male30 from "../assests/male/male-30.jpg";
import Male15 from "../assests/male/male-15.jpg";
import venkat from "../assests/male/venkat.jpg";
import aaron from "../assests/male/aaron.jpg";

import belinda from "../assests/female/belinda.jpg";
import jane from "../assests/female/jane.png";
import sarah from "../assests/female/sarah.png";
import female36 from "../assests/female/female-36.jpg";
import { useNavigate } from "react-router-dom";

function Home() {
  const [selectedBuyer, setSelectedBuyer] = useState(true);
  const [isBuyerBotsVisible, setIsBuyerBotsVisible] = useState(false);
  const [isCallHistoryVisible, setIsCallHistoryVisible] = useState(false);
  const [isCallCoachingVisible, setIsCallCoachingVisible] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [callStatus] = useState("Start");

  const api = process.env.REACT_APP_OPENAI_API_KEY;
  // console.log(api)

  let recognition; // Move recognition outside the useEffect

  // const ringtone = new Audio("ringing.mp3")

  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("btnclicked");
    sessionStorage.clear();
    alert("You have been logged out");
    navigate("/login");
  };

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.onresult = async (event) => {
        const newTranscript = event.results[0][0].transcript;
        setTranscript(newTranscript);
        recognition.stop(); // Stop recognition after receiving the transcript
        setIsRecognizing(false);
        // ringtone.pause(); 
        // ringtone.currentTime = 0;
        try {
          const response = await fetchAIResponse(newTranscript);
          setAiResponse(response);
          speakText(response);
          if (
            
            response.toString().includes("cut") ||
            response.toString().includes("Cut")
            
          ) {
            stopRecognition();
            stopSpeaking();
            console.log("call cut")
            return;

          }
          else{
            console.log("statement cont..")
            console.log(response);
          }

        } catch (error) {
          setAiResponse(`Error: ${error.message}`);
          speakText(error.message);
        }
      };
      recognition.onend = () => {
        setIsRecognizing(false);
        console.log("Recognition ended");
      };
      const startRecognition = () => {
        if (!isRecognizing) {
          recognition.start();
          setIsRecognizing(true);
          // setCallStatus('End')
          console.log("Recognition started");
          // ringtone.loop=true;
          // ringtone.play();
        } else {
          console.log("Recognition is already active");
        }
      };

      const stopSpeaking = () => {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel(); // Stop any ongoing speech synthesis
          console.log("Speech synthesis manually stopped");
        } else {
          console.error("Text-to-Speech is not supported by your browser.");
        }
      };
      const stopRecognition = () => {
        if (isRecognizing) {
          console.log("Stopping recognition");
          recognition.stop();
          setIsRecognizing(false);
          console.log("Recognition manually stopped");
          // ringtone.pause();
      // ringtone.currentTime = 0; 
          stopSpeaking();
        }
      };
      // if(callStatus==='End'){
      //   document.getElementById('start-call-btn').onClick(stopRecognition);
      // }
      const startButton = document.getElementById("start-call-btn");
      const endButton = document.getElementById("end-call-btn");

      if (startButton) {
        startButton.addEventListener("click", startRecognition);
      }

      if (endButton) {
        endButton.addEventListener("click", stopRecognition);
      }

      // Cleanup event listener when the component unmounts or is updated
      return () => {
        if (startButton) {
          startButton.removeEventListener("click", startRecognition);
        }
        if (recognition) {
          recognition.stop();
        }
      };
    } else {
      console.error("Speech Recognition is not supported by your browser.");
    }
  }, [isRecognizing]); // Dependency array to track recognition status
  const fetchAIResponse = async (query) => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + api,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            // messages: [{ role: "user", content: query }],
            messages: [
              {
                role: "system",
                content:
                  "You are an AI buyer discussing project details. Follow these rules: 1) Only talk about project-related topics. 2) If the user mentions anything irrelevant or unnecessary, respond with 'cut the call, don't waste my time' and stop the conversation. 3) Keep your responses short and precise. 4) Do not engage in small talk or personal discussions. 5) Remember you have to talk Rude but Less Inquisitive",
              },
              {
                role: "user",
                content: query, 
              },
            ],
            max_tokens: 150,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      throw new Error(`Failed to fetch AI response: ${error.message}`);
    }
  };
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.pitch = 2.5;
      utterance.onend = () => {
        console.log("Speech synthesis finished, restarting recognition");
        if (!isRecognizing && recognition) {
          recognition.start(); // Use the existing recognition instance to start recognition
          setIsRecognizing(true);
        }
      };
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Text-to-Speech is not supported by your browser.");
    }
  };

  const buyers = [
    {
      id: 1,
      name: "Alex Dupont",
      title: "VP of Sales Operations",
      company: "CustomerCenter",
      bookRate: 10.1,
      Image: Male30,
      roleplayInstructions:
        "Alex is having issues with his current contact data provider, chat with him and try to sell him a data solution.",
    },
    {
      name: "Richard Morrison",
      title: "Director of Customer Support",
      company: "Bolthouse",
      bookRate: 9.2,
      Image: Male15,
      roleplayInstructions:
        "Bolthouse is a EV Manufacturer that sells their cars directly to consumer without dealerships. You'll be speaking to Richard Morrison, the Director of Customer Support at Bolthouse..",
    },
    {
      name: "Aaron Smith",
      title: "Marketing Ops Manager",
      company: "James Enterprises",
      bookRate: 14.4,
      Image: aaron,
      roleplayInstructions:
        "You are a sales rep at Mailchimp. Start a cold call simulation with Aaron from James Enterprises, a B2B SaaS company that provides a Legal CRM solution, and learn how to do a cold call effectively. Wear headphones for the best experience.",
    },

    {
      name: "Jane bowen",
      title: "Director of sales",
      company: "Agile Solutions",
      bookRate: 15.2,
      Image: jane,
      roleplayInstructions:
        "You are a sales rep selling anything you want to Jane. Start a cold call simulation with Jane from Agile Solutions, a B2B SaaS company that sells project management software, and learn how to do a cold call effectively. Wear headphones for the best experience.",
    },

    {
      name: "Nicole Lieber",
      title: "VP of Customer Success",
      company: "Agile Solutions",
      bookRate: 22.3,
      Image: sarah,
      roleplayInstructions:
        "You are a sales rep selling Gainsight's customer success platform. Start a cold call simulation with Nicole from Agile Solutions, a B2B SaaS company that sells project management software. Wear headphones for the best experience.",
    },
    {
      name: "Belinda Secas",
      title: "VP of InfoSec",
      company: "Agile Solutions",
      bookRate: 16.3,
      Image: belinda,
      roleplayInstructions:
        "You are a sales rep at a a Security and Compliance Automation company (i.e Vanta or Drata). Start a cold call simulation with Belinda from Agile Solutions, a B2B SaaS company that sells project management software. Wear headphones for the best experience",
    },
    {
      name: "Venkat Natrajan",
      title: "VP of HR",
      company: "James Enterprises",
      bookRate: 15,
      Image: venkat,
      roleplayInstructions:
        "You are a sales rep at Workday. Start a cold call simulation with Venkat from James Enterprises, a B2B SaaS company that provides a Legal CRM solution, and learn how to do a cold call effectively. Wear headphones for the best experience.",
    },
    {
      name: "Anna Bowen",
      title: "Director of Sales ",
      company: "Innovative Leaders",
      bookRate: 17.5,
      Image: female36,
      roleplayInstructions:
        "You are a sales rep selling Linkedin Sales Navigator. Start a cold call simulation with Anna from Innovative Leaders, a B2B SaaS company that provides leadership development programs. Wear headphones for the best experience.",
    },
  ];

  const handleBuyerSelect = (buyer) => {
    setSelectedBuyer(buyer);
  };
  const toggleBuyerBots = () => {
    setIsBuyerBotsVisible(!isBuyerBotsVisible);
  };
  const toggleCallHistory = () => {
    setIsCallHistoryVisible(!isCallHistoryVisible);
  };
  const toggleCallCoaching = () => {
    setIsCallCoachingVisible(!isCallCoachingVisible);
  };

  return (
    <section className="flex w-full relative h-screen mt-16 ">
      <div className="fixed z-50 w-[254px] md:flex md:flex-col bottom-0 h-full bg-[#FBFBFB] border-line-primary border-r hidden max-h-screen top-16 logo-area">
        <div className="space-x-3  pb-2 px-2 pt-4 logo-area">
          <div className="flex justify-between items-center logo-area ">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-muted-foreground/10 hover:text-accent-foreground h-[34px] pointer-events-none p-2 cursor-pointer">
              <div className="flex space-x-2 items-center logo-area">
                <a href>
                  <img
                    alt="square black logo"
                    src={logo}
                    className="h-5 w-5 rounded-md flex-shrink-0"
                  ></img>
                </a>
                <p className="text-[15px] font-medium ">Respondr</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-down w-3 h-3"
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </div>
            </button>
          </div>
        </div>

        <div className="px-2">
          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-[34px] px-4 py-2 w-full rounded-lg shadow-md shadow-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-circle-plus mr-2 w-3 h-3"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 12h8"></path>
              <path d="M12 8v8"></path>
            </svg>
            Create new
          </button>
        </div>

        <div className="flex flex-col justify-between pb-4 mt-4 h-full navbar">
          <ul className="flex-none px-2">
            <li className="px-2 py-[7px] mb-[2px] z-40 text-[#878789]">
              <span>
                <a
                  className="flex justify-start items-center space-x-2 pointer-events-none"
                  href
                >
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-home w-4 h-4"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <p className="text-md font-medium">Leaderboard</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-lock w-4 h-4 text-[#878789]"
                  >
                    <rect
                      width="18"
                      height="11"
                      x="3"
                      y="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </a>
              </span>
            </li>

            {/* buyer bots data state-open or closed */}
            <div data-state="open">
              <div className="w-full">
                <button className="flex px-2 py-[7px] mb-[2px] z-40 w-full text-[#2e3035] rounded-lg hover:bg-[#EDEDED] hover:duration-200 duration-300 hover:text-foreground">
                  <div className="flex justify-start items-center space-x-2 w-full">
                    <div className="flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-bot w-4 h-4"
                      >
                        <path d="M12 8V4H8"></path>
                        <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                        <path d="M2 14h2"></path>
                        <path d="M20 14h2"></path>
                        <path d="M15 13v2"></path>
                        <path d="M9 13v2"></path>
                      </svg>
                    </div>
                    <p
                      className="text-md font-medium"
                      onClick={toggleBuyerBots}
                    >
                      Buyer Bots
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-chevron-down w-4 h-4"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </div>
                </button>

                {/* cold call */}
                {isBuyerBotsVisible && (
                  <div data-state="open">
                    <ul>
                      <li className="px-2 py-[7px] mb-[2px] z-40 ml-6 bg-[#EDEDED] rounded-lg text-[#2e3035]">
                        <a
                          className="flex justify-start items-center space-x-2 text-foreground"
                          href="/buyers?callType=cold"
                        >
                          <div className="flex items-center justify-center text-accent-foreground">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-snowflake w-4 h-4"
                            >
                              <line x1="2" x2="22" y1="12" y2="12"></line>
                              <line x1="12" x2="12" y1="2" y2="22"></line>
                              <path d="m20 16-4-4 4-4"></path>
                              <path d="m4 8 4 4-4 4"></path>
                              <path d="m16 4-4 4-4-4"></path>
                              <path d="m8 20 4-4 4 4"></path>
                            </svg>
                          </div>
                          <p className="text-md font-medium">Cold Calls</p>
                        </a>
                      </li>

                      {/* gatekeeper call */}
                      <li className="px-2 py-[7px] mb-[2px] z-40 ml-6 text-[#878789]">
                        <span
                          tabindex="0"
                          data-state="delayed-open"
                          disabled
                          aria-describedby="radix-:r9:"
                        >
                          <a
                            className="flex justify-start items-center space-x-2 pointer-events-none"
                            href
                          >
                            <div className="flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-door-open w-4 h-4"
                              >
                                <path d="M13 4h3a2 2 0 0 1 2 2v14"></path>
                                <path d="M2 20h3"></path>
                                <path d="M13 20h9"></path>
                                <path d="M10 12v.01"></path>
                                <path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"></path>
                              </svg>
                            </div>
                            <p className="text-md font-medium">
                              Gatekeeper Calls
                            </p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-lock w-4 h-4 text-[#878789]"
                            >
                              <rect
                                width="18"
                                height="11"
                                x="3"
                                y="11"
                                rx="2"
                                ry="2"
                              ></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </a>
                        </span>
                      </li>

                      {/* warn call */}
                      <li className='class="px-2 py-[7px] mb-[2px] z-40 ml-6 text-[#878789]"'>
                        <span tabindex="0" data-state="closed" disabled>
                          <a
                            className="flex justify-start items-center space-x-2 pointer-events-none"
                            href
                          >
                            <div className="flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-flame-kindling w-4 h-4"
                              >
                                <path d="M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z"></path>
                                <path d="m5 22 14-4"></path>
                                <path d="m5 18 14 4"></path>
                              </svg>
                            </div>
                            <p className="text-md font-medium">Warm Calls</p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-lock w-4 h-4 text-[#878789]"
                            >
                              <rect
                                width="18"
                                height="11"
                                x="3"
                                y="11"
                                rx="2"
                                ry="2"
                              ></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </a>
                        </span>
                      </li>

                      {/*Discovery Calls  */}
                      <li className='class="px-2 py-[7px] mb-[2px] z-40 ml-6 text-[#878789]"'>
                        <span tabindex="0" data-state="closed" disabled>
                          <a
                            className="flex justify-start items-center space-x-2 pointer-events-none"
                            href
                          >
                            <div className="flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-search w-4 h-4"
                              >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                              </svg>
                            </div>
                            <p className="text-md font-medium">
                              Discovery Calls
                            </p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-lock w-4 h-4 text-[#878789]"
                            >
                              <rect
                                width="18"
                                height="11"
                                x="3"
                                y="11"
                                rx="2"
                                ry="2"
                              ></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </a>
                        </span>
                      </li>

                      {/*Focus Calls  */}
                      <li className='class="px-2 py-[7px] mb-[2px] z-40 ml-6 text-[#878789]"'>
                        <span tabindex="0" data-state="closed" disabled>
                          <a
                            className="flex justify-start items-center space-x-2 pointer-events-none"
                            href
                          >
                            <div className="flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-scan-eye w-4 h-4"
                              >
                                <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                                <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                                <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                                <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                                <circle cx="12" cy="12" r="1"></circle>
                                <path d="M5 12s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5"></path>
                              </svg>
                            </div>
                            <p className="text-md font-medium">Focus Calls</p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-lock w-4 h-4 text-[#878789]"
                            >
                              <rect
                                width="18"
                                height="11"
                                x="3"
                                y="11"
                                rx="2"
                                ry="2"
                              ></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </a>
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* call history */}
            <div data-state="open">
              <div className="w-full">
                <button
                  aria-controls="radix-:rd:"
                  aria-expanded="true"
                  data-state="open"
                  className="flex px-2 py-[7px] mb-[2px] z-40 w-full text-[#2e3035] rounded-lg hover:bg-[#EDEDED] hover:duration-200 duration-300 hover:text-foreground"
                >
                  <div className="flex justify-start items-center space-x-2 w-full">
                    <div className="flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-layout-list w-4 h-4"
                      >
                        <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                        <rect width="7" height="7" x="3" y="14" rx="1"></rect>
                        <path d="M14 4h7"></path>
                        <path d="M14 9h7"></path>
                        <path d="M14 15h7"></path>
                        <path d="M14 20h7"></path>
                      </svg>
                    </div>
                    <p
                      className="text-md font-medium"
                      onClick={toggleCallHistory}
                    >
                      Call History
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-chevron-down w-4 h-4"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </div>
                </button>

                {/* Simulated Calls style= transition-duration: 0s; animation-name: none; --radix-collapsible-content-height: 106px; --radix-collapsible-content-width: 237px; */}
                {isCallHistoryVisible && (
                  <div data-state="open" id="radix-:rd:">
                    <ul>
                      <li className="px-2 py-[7px] mb-[2px] z-40 ml-6 text-[#2e3035] rounded-lg hover:bg-[#EDEDED] hover:duration-200 duration-300 hover:text-foreground">
                        <a
                          className="flex justify-start items-center space-x-2"
                          href
                        >
                          <div className="flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-phone w-4 h-4"
                            >
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                          </div>
                          <p className="text-md font-medium">Simulated Calls</p>
                        </a>
                      </li>

                      {/* real calls */}
                      <li className="px-2 py-[7px] mb-[2px] z-40 ml-6 text-[#878789]">
                        <span tabindex="0" data-state="closed" disabled>
                          <a
                            className="flex justify-start items-center space-x-2 pointer-events-none"
                            href
                          >
                            <div className="flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-headset w-4 h-4"
                              >
                                <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"></path>
                                <path d="M21 16v2a4 4 0 0 1-4 4h-5"></path>
                              </svg>
                            </div>
                            <p className="text-md font-medium">Real Calls</p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-lock w-4 h-4 text-[#878789]"
                            >
                              <rect
                                width="18"
                                height="11"
                                x="3"
                                y="11"
                                rx="2"
                                ry="2"
                              ></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </a>
                        </span>
                      </li>

                      {/* Playlists */}
                      <li className="px-2 py-[7px] mb-[2px] z-40 ml-6 text-[#878789]">
                        <span tabindex="0" data-state="closed" disabled>
                          <a
                            className="flex justify-start items-center space-x-2 pointer-events-none"
                            href
                          >
                            <div className="flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-list-video w-4 h-4"
                              >
                                <path d="M12 12H3"></path>
                                <path d="M16 6H3"></path>
                                <path d="M12 18H3"></path>
                                <path d="m16 12 5 3-5 3v-6Z"></path>
                              </svg>
                            </div>
                            <p className="text-md font-medium">Playlists</p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-lock w-4 h-4 text-[#878789]"
                            >
                              <rect
                                width="18"
                                height="11"
                                x="3"
                                y="11"
                                rx="2"
                                ry="2"
                              ></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </a>
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Training Plans */}
            <li className="px-2 py-[7px] mb-[2px] z-40 ml-6 text-[#878789]">
              <span tabindex="0" data-state="closed" disabled>
                <a
                  className="flex justify-start items-center space-x-2 pointer-events-none"
                  href
                >
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-goal w-4 h-4"
                    >
                      <path d="M12 13V2l8 4-8 4"></path>
                      <path d="M20.561 10.222a9 9 0 1 1-12.55-5.29"></path>
                      <path d="M8.002 9.997a5 5 0 1 0 8.9 2.02"></path>
                    </svg>
                  </div>
                  <p className="text-md font-medium">Training Plans</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-lock w-4 h-4 text-[#878789]"
                  >
                    <rect
                      width="18"
                      height="11"
                      x="3"
                      y="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </a>
              </span>
            </li>

            {/* Simulated Dialer */}
            <li className="px-2 py-[7px] mb-[2px] z-40 ml-6 text-[#878789]">
              <span tabindex="0" data-state="closed" disabled>
                <a
                  className="flex justify-start items-center space-x-2 pointer-events-none"
                  href
                >
                  <div className="flex items-center justify-center">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4"
                    >
                      <path
                        d="M8.69667 0.0403541C8.90859 0.131038 9.03106 0.354857 8.99316 0.582235L8.0902 6.00001H12.5C12.6893 6.00001 12.8625 6.10701 12.9472 6.27641C13.0319 6.4458 13.0136 6.6485 12.8999 6.80001L6.89997 14.8C6.76167 14.9844 6.51521 15.0503 6.30328 14.9597C6.09135 14.869 5.96888 14.6452 6.00678 14.4178L6.90974 9H2.49999C2.31061 9 2.13748 8.893 2.05278 8.72361C1.96809 8.55422 1.98636 8.35151 2.09999 8.2L8.09997 0.200038C8.23828 0.0156255 8.48474 -0.0503301 8.69667 0.0403541ZM3.49999 8.00001H7.49997C7.64695 8.00001 7.78648 8.06467 7.88148 8.17682C7.97648 8.28896 8.01733 8.43723 7.99317 8.5822L7.33027 12.5596L11.5 7.00001H7.49997C7.353 7.00001 7.21347 6.93534 7.11846 6.8232C7.02346 6.71105 6.98261 6.56279 7.00678 6.41781L7.66968 2.44042L3.49999 8.00001Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-md font-medium">Simulated Dialer</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-lock w-4 h-4 text-[#878789]"
                  >
                    <rect
                      width="18"
                      height="11"
                      x="3"
                      y="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </a>
              </span>
            </li>

            {/* Custom Scorecards */}
            <li className="px-2 py-[7px] mb-[2px] z-40 ml-6 text-[#878789]">
              <span tabindex="0" data-state="closed" disabled>
                <a
                  className="flex justify-start items-center space-x-2 pointer-events-none"
                  href
                >
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-target w-4 h-4"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="6"></circle>
                      <circle cx="12" cy="12" r="2"></circle>
                    </svg>
                  </div>
                  <p className="text-md font-medium">Custom Scorecards</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-lock w-4 h-4 text-[#878789]"
                  >
                    <rect
                      width="18"
                      height="11"
                      x="3"
                      y="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </a>
              </span>
            </li>

            {/*  Analytics*/}
            <li className="px-2 py-[7px] mb-[2px] z-40 ml-6 text-[#878789]">
              <span tabindex="0" data-state="closed" disabled>
                <a
                  className="flex justify-start items-center space-x-2 pointer-events-none"
                  href
                >
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-bar-chart2 w-4 h-4"
                    >
                      <line x1="18" x2="18" y1="20" y2="10"></line>
                      <line x1="12" x2="12" y1="20" y2="4"></line>
                      <line x1="6" x2="6" y1="20" y2="14"></line>
                    </svg>
                  </div>
                  <p className="text-md font-medium">Analytics</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-lock w-4 h-4 text-[#878789]"
                  >
                    <rect
                      width="18"
                      height="11"
                      x="3"
                      y="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </a>
              </span>
            </li>

            {/* Coaching */}
            <div data-state="closed">
              <div className="w-full">
                <button
                  data-state="closed"
                  aria-expanded="false"
                  aria-controls="radix-:rk:"
                  className="flex px-2 py-[7px] mb-[2px] z-40 w-full text-[#2e3035] rounded-lg hover:bg-[#EDEDED] hover:duration-200 duration-300 hover:text-foreground"
                >
                  <div className="flex justify-start items-center space-x-2 w-full">
                    <div className="flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-book w-4 h-4"
                      >
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                      </svg>
                    </div>
                    <p
                      className="text-md font-medium"
                      onClick={toggleCallCoaching}
                    >
                      Coaching
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-chevron-right w-4 h-4"
                    >
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </div>
                </button>

                {isCallCoachingVisible && (
                  <div className="">
                    <ul>
                      <li className="px-2 py-[7px] mb-[2px] z-40 ml-6 text-[#2e3035] rounded-lg hover:bg-[#EDEDED] hover:duration-200 duration-300 hover:text-foregroundc">
                        <a
                          className="flex justify-start items-center space-x-2"
                          href
                        >
                          <div className="flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-notebook-tabs w-4 h-4"
                            >
                              <path d="M2 6h4"></path>
                              <path d="M2 10h4"></path>
                              <path d="M2 14h4"></path>
                              <path d="M2 18h4"></path>
                              <rect
                                width="16"
                                height="20"
                                x="4"
                                y="2"
                                rx="2"
                              ></rect>
                              <path d="M15 2v20"></path>
                              <path d="M15 7h5"></path>
                              <path d="M15 12h5"></path>
                              <path d="M15 17h5"></path>
                            </svg>
                          </div>
                          <p className="text-md font-medium">Knowledge Gap</p>
                        </a>
                      </li>
                      <li className="px-2 py-[7px] mb-[2px] z-40 ml-6 text-[#878789]">
                        <span tabindex="0" data-state="closed" disabled>
                          <a
                            className="flex justify-start items-center space-x-2 pointer-events-none"
                            href
                          >
                            <div className="flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-list-todo w-4 h-4"
                              >
                                <rect
                                  x="3"
                                  y="5"
                                  width="6"
                                  height="6"
                                  rx="1"
                                ></rect>
                                <path d="m3 17 2 2 4-4"></path>
                                <path d="M13 6h8"></path>
                                <path d="M13 12h8"></path>
                                <path d="M13 18h8"></path>
                              </svg>
                            </div>
                            <p className="text-md font-medium">Assignments</p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-lock w-4 h-4 text-[#878789]"
                            >
                              <rect
                                width="18"
                                height="11"
                                x="3"
                                y="11"
                                rx="2"
                                ry="2"
                              ></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </a>
                        </span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Integrations   /style=--radix-collapsible-content-height: 70px; --radix-collapsible-content-width: 237px; */}
                <div data-state="closed" id="radix-:rk:" hidden>
                  {" "}
                </div>
              </div>
            </div>

            <li className='class="px-2 py-[7px] mb-[2px] z-40 text-[#2e3035] rounded-lg hover:bg-[#EDEDED] hover:duration-200 duration-300 hover:text-foreground"'>
              <a className="flex justify-start items-center space-x-2" href>
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-blocks w-4 h-4"
                  >
                    <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                    <path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"></path>
                  </svg>
                </div>
                <p className="text-md font-medium">Integrations</p>
              </a>
            </li>

            <li className='class="px-2 py-[7px] mb-[2px] z-40 text-[#2e3035] rounded-lg hover:bg-[#EDEDED] hover:duration-200 duration-300 hover:text-foreground"'>
              <a className="flex justify-start items-center space-x-2" href>
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-blocks w-4 h-4"
                  >
                    <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                    <path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"></path>
                  </svg>
                </div>
                <button onClick={handleLogout} className="text-md font-medium">
                  Logout
                </button>
              </a>
            </li>
          </ul>
        </div>
        <div className="Toastify"></div>
      </div>

      {/* new  */}
      <div className="flex-1 z-10 ml-[0px] md:ml-[254px]">
        <div className="flex justify-center items-center w-full">
          <div className="w-full">
            <div>
              {/* top navbar area */}
              <nav className="bg-white z-10 border-b top-14 logo-area">
                <div className="flex flex-wrap justify-between items-center px-8 py-2">
                  <div className="flex space-x-4 items-start">
                    <div className="">
                      <div className="flex items-center space-x-2">
                        <nav aria-label="breadcrumb">
                          <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
                            <li className="inline-flex items-center gap-1.5">
                              <a
                                className="transition-colors hover:text-foreground"
                                href
                              >
                                Buyer Bots
                              </a>
                            </li>
                            <li
                              role="presentation"
                              aria-hidden="true"
                              className="[&>svg]:size-3.5"
                            >
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                                  fill="currentColor"
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </li>
                            <li className="inline-flex items-center gap-1.5">
                              <span className="text-foreground text-base font-semibold">
                                Cold Calls
                              </span>
                            </li>
                          </ol>
                        </nav>

                        {/* free demo */}
                        <div className="flex items-center space-x-2 logo-area">
                          <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                            FREE DEMO
                          </div>
                        </div>
                      </div>
                      <p className="mt-2">
                        Choose an AI buyer & start a roleplay conversation in 10
                        secs
                      </p>
                    </div>
                  </div>
                </div>
              </nav>

              {/* varation */}
              <div>
                <div className="flex">
                  <div className="flex flex-col pt-4 px-4 border-r w-full md:w-[475px]">
                    <div className="flex">
                      <div className="flex-1">
                        <input
                          placeholder=" Search buyer bots by name, job title, or company..."
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-md"
                        ></input>
                      </div>
                      <div className="">
                        <button className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-lock w-4 h-4 mr-2"
                          >
                            <rect
                              width="18"
                              height="11"
                              x="3"
                              y="11"
                              rx="2"
                              ry="2"
                            ></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                          Choose a variation
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 opacity-50"
                            aria-hidden="true"
                          >
                            <path
                              d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                              fill="currentColor"
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="text-muted-foreground mb-3">
                        82 buyer bots
                      </p>

                      {/* open menu */}

                      <div>
                        {buyers.map((buyer) => (
                          <div
                            className="rounded-xl  border bg-card text-card-foreground w-full md:w-[430px] ml-0 flex items-center relative shadow-sm transition-shadow duration-300 cursor-pointer hover:shadow-xl"
                            onClick={() => handleBuyerSelect(buyer)}
                          >
                            <button
                              aria-expanded="false"
                              id="radix-:rq:"
                              aria-haspopup="menu"
                              data-state="closed"
                              className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-muted-foreground/10 hover:text-accent-foreground text-xs w-8 h-8 rounded-full p-0 absolute top-4 right-4 "
                            >
                              <span className="sr-only">Open menu</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-ellipsis-vertical h-4 w-4"
                              >
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="12" cy="5" r="1"></circle>
                                <circle cx="12" cy="19" r="1"></circle>
                              </svg>
                            </button>

                            <div className="space-y-1.5 p-6 flex flex-col py-4">
                              <div className="flex flex-row items-start space-x-4">
                                <div className="relative">
                                  <span className="flex shrink-0 overflow-hidden rounded-full w-[52px] h-[52px] relative">
                                    <img
                                      alt=" male"
                                      className="aspect-square h-full w-full"
                                      src={buyer.Image}
                                    ></img>
                                  </span>
                                  <div className="rounded-full p-1 w-4 h-4 border-white border-[3px] absolute bottom-0 right-1 bg-green-500"></div>
                                </div>

                                <div className="">
                                  <h3 className="font-semibold leading-none tracking-tight">
                                    {buyer.name}
                                  </h3>
                                  <p className="text-muted-foreground text-[0.76rem]">
                                    {buyer.title} @ {buyer.company}
                                  </p>

                                  <div>
                                    <div className="flex flex-wrap mt-2 space-x-1">
                                      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mt-1">
                                        {" "}
                                        Cold Call
                                      </div>
                                      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground mt-1">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          stroke-width="2"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          class="lucide lucide-brain w-3 h-3 mr-1"
                                        >
                                          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
                                          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path>
                                          <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path>
                                          <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path>
                                          <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path>
                                          <path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path>
                                          <path d="M19.938 10.5a4 4 0 0 1 .585.396"></path>
                                          <path d="M6 18a4 4 0 0 1-1.967-.516"></path>
                                          <path d="M19.967 17.484A4 4 0 0 1 18 18"></path>
                                        </svg>
                                        Rude but Less Inquisitive
                                      </div>

                                      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80 mt-1">
                                        Book Rate:{buyer.bookRate}%
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="p-6 pt-0"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* right side */}

                  <div className="hidden md:flex flex-col items-center flex-grow">
                    {selectedBuyer && (
                      <div className="pt-4 fixed z-0">
                        <div className="flex items-center justify-center mb-4 w-full">
                          <div className="flex flex-1 justify-between space-x-4">
                            <span data-state="closed" tabindex="0">
                              <button
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-[34px] px-4 py-2"
                                disabled
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-square-pen w-4 h-4 mr-2"
                                >
                                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"></path>
                                </svg>
                                Customize buyer bot
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-lock w-4 h-4 ml-2"
                                >
                                  <rect
                                    width="18"
                                    height="11"
                                    x="3"
                                    y="11"
                                    rx="2"
                                    ry="2"
                                  ></rect>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                              </button>
                            </span>
                            <a className="h-min" href>
                              <button
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-[34px] px-4 py-2"
                                disabled={true}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-layout-list w-4 h-4 mr-2"
                                >
                                  <rect
                                    width="7"
                                    height="7"
                                    x="3"
                                    y="3"
                                    rx="1"
                                  ></rect>
                                  <rect
                                    width="7"
                                    height="7"
                                    x="3"
                                    y="14"
                                    rx="1"
                                  ></rect>
                                  <path d="M14 4h7"></path>
                                  <path d="M14 9h7"></path>
                                  <path d="M14 15h7"></path>
                                  <path d="M14 20h7"></path>
                                </svg>
                                View calls
                              </button>
                            </a>
                          </div>
                        </div>

                        <div>
                          <div className="will-change: auto; transform: none;">
                            <div className="rounded-xl border bg-card text-card-foreground w-full md:w-[450px] shadow-md">
                              <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="font-semibold leading-none tracking-tight">
                                  AI Roleplay Instructions
                                </h3>
                                <p className="text-sm text-primary">
                                  {selectedBuyer.roleplayInstructions}
                                </p>
                              </div>

                              <div className="p-6 pt-0 flex items-center justify-center">
                                <div className="flex flex-col items-center text-center">
                                  <div className="relative mb-4 ">
                                    <div className="animation_animateCircle__lBdoU w-32 h-32 opacity-0"></div>
                                    {/* st=tyle  */}
                                    <span className="relative flex h-32 w-32 shrink-0 overflow-hidden rounded-full ">
                                      <img
                                        alt="ok"
                                        src={selectedBuyer.Image || Male30}
                                        className="aspect-square h-full w-full"
                                      ></img>
                                    </span>
                                    <div className="rounded-full p-1 w-6 h-6 border-white border-[3px] absolute bottom-1 right-2 bg-green-500"></div>
                                  </div>
                                  <p className="text-lg">
                                    {selectedBuyer.name}
                                  </p>
                                  <p className="text-md text-muted-foreground">
                                    {selectedBuyer.title} @{" "}
                                    {selectedBuyer.company}
                                  </p>
                                  <div>
                                    <div className="flex mt-2 space-x-1">
                                      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mt-1">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          stroke-width="2"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          class="lucide lucide-snowflake mr-1 h-3 w-3"
                                        >
                                          <line
                                            x1="2"
                                            x2="22"
                                            y1="12"
                                            y2="12"
                                          ></line>
                                          <line
                                            x1="12"
                                            x2="12"
                                            y1="2"
                                            y2="22"
                                          ></line>
                                          <path d="m20 16-4-4 4-4"></path>
                                          <path d="m4 8 4 4-4 4"></path>
                                          <path d="m16 4-4 4-4-4"></path>
                                          <path d="m8 20 4-4 4 4"></path>
                                        </svg>
                                        Cold Call
                                      </div>

                                      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground mt-1">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          stroke-width="2"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          class="lucide lucide-brain w-3 h-3 mr-1"
                                        >
                                          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
                                          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path>
                                          <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path>
                                          <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path>
                                          <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path>
                                          <path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path>
                                          <path d="M19.938 10.5a4 4 0 0 1 .585.396"></path>
                                          <path d="M6 18a4 4 0 0 1-1.967-.516"></path>
                                          <path d="M19.967 17.484A4 4 0 0 1 18 18"></path>
                                        </svg>
                                        Rude but Less Inquisitive
                                      </div>
                                      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                                        Book Rate:
                                        {selectedBuyer.bookRate}%
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center p-6 pt-0">
                                <div className="flex w-full justify-between relative">
                                  <span
                                    tabindex="0"
                                    data-state="closed"
                                    className="w-full"
                                  >
                                    <button
                                      className=" bg-gradient-custom inline-flex items-center justify-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 px-8 w-full text-white hover:text-white shadow-md text-base h-[52px] rounded-2xl cursor-pointer drop-shadow-2xl hover:opacity-80 transition-opacity duration-200 border border-white/50"
                                      id="start-call-btn"
                                      disabled={isRecognizing}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="lucide lucide-phone mr-2 h-5 w-5"
                                      >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                      </svg>
                                      <span>{callStatus} Call</span>
                                    </button>
                                    <button
                                      className="bg-gradient-red inline-flex items-center justify-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-red-600 px-8 w-full text-white hover:text-white shadow-md text-base h-[52px] rounded-2xl cursor-pointer drop-shadow-2xl hover:opacity-80 transition-opacity duration-200 border border-white/50 my-3"
                                      id="end-call-btn"
                                    >
                                      <span>End Call</span>
                                    </button>
                                  </span>
                                </div>
                              </div>
                              <div className="responseData">
                                <p className="mx-3 md:font-bold text-lg">
                                  Transcript:{" "}
                                  <span className="font-normal">
                                    {transcript}
                                  </span>
                                </p>
                                <p className="mx-3 md:font-bold text-md">
                                  AI Response:{" "}
                                  <span className="font-normal">
                                    {aiResponse}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="Toastify"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
