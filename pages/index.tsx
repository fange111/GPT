import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import DropDown2, { VibeType2 } from "../components/DropDown2";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Github from "../components/GitHub";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [desc, setDesc] = useState("");
  const [lang, setLang] = useState<VibeType>("中文");
  const [difficulty, setDifficulty] = useState<VibeType2>("简单");
  const [generatedDescs, setGeneratedDescs] = useState<string>("");
  const defultDesc = '例如：如何解释相对论?'

  console.log("Streamed response: ", {generatedDescs});
  let promptObj = {
    'English': "UK English",
    "中文": "Simplified Chinese",
    "繁體中文": "Traditional Chinese",
    "日本語": "Japanese",
    "Italiano": "Italian",
    "Deutsch": "German",
    "Español": "Spanish",
    "Français": "French",
    "Nederlands": "Dutch",
    "한국어": "Korean",
    "ភាសាខ្មែរ":"Khmer",
    "हिंदी" : "Hindi",
    "Indonesian" : "Indonesian"
  }
  let difficultyObj = {
    '简单': "Easy",
    '专业': "Professional",
  }
  let text = desc||defultDesc
  
  const generateDesc = async (e: any) => {
    let prompt;
    if (difficultyObj[difficulty]=="Easy"){
      prompt = `Explain ${text}${text.slice(-1) === "." ? "" : "."} to a 6nd grader in ${promptObj[lang]} with a simple example.`;
    } else{
      prompt = `Explain ${text}${text.slice(-1) === "." ? "" : "."} in ${promptObj[lang]}  in technical terms, divided into two paragraphs, principles and applications. Output format, Principle:, Application.`;
    }
    e.preventDefault();
    setGeneratedDescs("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      setError(true);
      setLoading(false);
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedDescs((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Teach Anything</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>

      <Header/>

      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-2 sm:my-16">
        <h1 className="sm:text-4xl text-2xl max-w-1xl font-bold text-slate-900">
        在几秒钟内解决你<span className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">任何问题</span> 
        </h1>
        <p className="text-slate-500 my-5"> 以产生720,000多个答案</p>
        <div className="max-w-xl w-full">
          <div className="flex mt-4 items-center space-x-3 mb-3">
            <span className="w-7 h-7 rounded-full bg-black text-white text-center leading-7">1</span>
            <p className="text-left font-medium">
            写下你的问题
            </p>
          </div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black block"
            placeholder={
              "e.g. "+defultDesc
            }
          />
          <div className="flex my-4 items-center space-x-3">
            <span className="w-7 h-7 rounded-full bg-black text-white text-center leading-7">2</span>
            <p className="text-left font-medium">选择你的语言</p>
          </div>
          <div className="block">
            <DropDown vibe={lang} setVibe={(newLang) => setLang(newLang)} />
          </div>

          <div className="flex my-4 items-center space-x-3">
            <span className="w-7 h-7 rounded-full bg-black text-white text-center leading-7">3</span>
            <p className="text-left font-medium">选择回答类型</p>
          </div>
          <div className="block">
            <DropDown2 vibe2={difficulty} setVibe2={(newDifficulty) => setDifficulty(newDifficulty)} />
          </div>

          <div className="md:flex sm:mt-6 mt-4 space-y-4 md:space-y-0 gap-4">
            {!loading && (  
              <button
                className="bg-black md:flex-1 rounded-xl text-white font-medium px-4 py-2 hover:bg-black/80 w-full"
                onClick={(e) => generateDesc(e)}
              >
                生成答案
              </button>
            )}
            {loading && (
              <button
                className="bg-black md:flex-1 rounded-xl text-white font-medium px-4 py-2 hover:bg-black/80 w-full"
                disabled
              >
                <LoadingDots color="white" style="large" />
              </button>
            )}
          </div>
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-4">
              {generatedDescs && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      The answer is
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto  whitespace-pre-wrap">

                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border text-left"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedDescs);
                        toast("Text copied to clipboard", {
                          icon: "✂️",
                        });
                      }}
                    >
                      <p>{generatedDescs}</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
        { error && (
          <p className="text-gray-400 my-5">🚨 Server error, please try again later, or you can <a href="https://twitter.com/lvwzhen" className=" underline hover:text-black">contact us</a>. </p>
        )}
        <div className="my-5 max-w-xl w-full">
          <h2 className=" text-slate-400 mb-4">AI.Club</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          </ul>
        </div>
      </main>
      <Footer />          
    </div>
  );
};

export default Home;
