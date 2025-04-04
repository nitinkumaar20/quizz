import React from "react";
import Link from "next/link";
const FooterMobile = () => {
  return (
    <div className="bg-[--background] border-t h-[3.5rem] w-full fixed bottom-0 left-0 text-[--font-color]">
      {/* home  */}
      <div className="flex justify-around items-center h-full">
        <div className=" flex flex-col items-center justify-center">
          <Link href="/">
          <svg
            className="h-10 w-10  hover:stroke-[--secondary] stroke-[#130F26] hover:fill-[--secondary]"
            viewBox="0 -0.5 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g strokeWidth="1.5" strokeLinecap="round">
              <path
                clipRule="evenodd"
                d="M5.5 10.967v4.645A3.312 3.312 0 0 0 8.733 19h7.538a3.312 3.312 0 0 0 3.23-3.388v-4.645a4.38 4.38 0 0 0-1.727-3.493l-3.06-1.855a4.262 4.262 0 0 0-4.425 0l-3.06 1.855a4.381 4.381 0 0 0-1.727 3.493Z"
                strokeLinejoin="round"
              />
              <path d="M14.655 15.183a2.678 2.678 0 0 1-4.308 0" />
            </g>
          </svg>
          </Link>
          <p className="text-[10px] font-bold mt-[-5px] ">Home</p>
        </div>
        {/* ai  */}

        <div className="flex flex-col items-center justify-center mt-2">
          <Link className="" href="/askbyai">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="h-6 w-6 hover:fill-[--secondary] hover:stroke-[--secondary] stroke-[#130F26]"
          >
            <path d="M225.514 225.514h60.969v60.969h-60.969z" />
            <path d="M239.304 192.124V21.076C223.419 7.922 203.056 0 180.867 0c-50.635 0-91.828 41.194-91.828 91.828 0 2.794.145 5.565.397 8.313-18.359 4.808-35.075 14.719-48.274 28.848-17.578 18.819-27.257 43.37-27.257 69.132 0 21.486 6.731 41.427 18.185 57.837-11.804 16.895-18.185 37.001-18.185 57.919 0 46.95 32.11 86.538 75.522 97.967a92.67 92.67 0 0 0-.39 8.327c0 50.635 41.194 91.828 91.828 91.828 22.19 0 42.553-7.922 58.437-21.076V343.088h.001v-23.211h-13.79v23.211h-33.391v-23.211h-23.211v-33.391h23.211v-13.789h-23.211v-33.391h23.211v-13.79h-23.211v-33.391h23.211v-23.211h33.391v23.211h13.791zM498.095 198.122c0-25.763-9.68-50.313-27.257-69.131-13.197-14.129-29.915-24.039-48.274-28.848.253-2.749.397-5.521.397-8.313C422.962 41.194 381.768 0 331.133 0c-22.189 0-42.552 7.922-58.437 21.076v171.048h13.789v-23.211h33.391v23.211h23.211v33.391h-23.211v13.79h23.211v33.391h-23.211v13.789h23.211v33.391h-23.211v23.211h-33.391v-23.211h-13.789v171.048C288.581 504.078 308.944 512 331.133 512c50.635 0 91.828-41.194 91.828-91.828 0-2.788-.14-5.565-.39-8.327 43.412-11.429 75.522-51.016 75.522-97.967 0-20.919-6.382-41.025-18.185-57.919 11.457-16.41 18.187-36.351 18.187-57.837z" />
          </svg>
          </Link>
          <p className="text-[10px] font-bold  ">Ask</p>

        </div>

        {/* profile */}
        <div className=" flex flex-col items-center justify-center mt-2">
          <Link  href="/profile" className="">
          <svg
            className="h-7 w-7 hover:fill-[--secondary] hover:stroke-[--secondary] stroke-[#130F26]"
            viewBox="0 0 24 24"
            // fill=""
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              clipRule="evenodd"
              // stroke="#130F26"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11.845 21.662C8.152 21.662 5 21.087 5 18.787c0-2.301 3.133-4.425 6.845-4.425 3.691 0 6.844 2.103 6.844 4.404 0 2.3-3.133 2.896-6.845 2.896ZM11.837 11.174a4.386 4.386 0 1 0 0-8.774A4.388 4.388 0 0 0 7.45 6.787a4.37 4.37 0 0 0 4.356 4.387h.031Z" />
            </g>
          </svg>
          </Link>
          <p className="text-[10px] font-bold  ">You</p>

        </div>
      </div>
    </div>
  );
};

export default FooterMobile;
