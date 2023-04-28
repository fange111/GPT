import Image from "next/image";
import Link from "next/link";
import Github from "../components/GitHub";

export default function Header() {
  return (
    <header className="md:flex text-center justify-between items-center w-full mt-5 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-3 mb-10 md:mb-0 justify-center">
        <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
         🧑🏼‍🏫 回答任何问题 <small className=" font-medium text-base px-2 inline-block bg-fuchsia-500 text-white  rounded-full">GPT- 4.0</small>
        </h1>
      </Link>
      
    </header>
  );
}
