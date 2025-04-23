"use client";

import { useState } from "react";
import Boardpage from "./board/page";
import SubjectPage from "./subjects/page";
import RoundPage from "./round/page";

type page = {
  params: { page: string };
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [page, setPage] = useState<page>({ params: { page: "home" } });


  
const renderPage = () => {
  switch (page.params.page) {
    case "home":
      return (
        <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <div className="bg-white p-4 rounded shadow">
          {children || <p>Here’s your data display area.</p>}
        </div>


      </div>
      );
    case "board":
      return <Boardpage />;
    case "subject":
      return (
        <SubjectPage/>
      );
      case "round":
      return (
        <RoundPage />
      );
    default:
      return <p>Page not found</p>;
  }
};


  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 bg-gray-800 text-white p-4 ${
          sidebarOpen ? "w-1/5" : "w-[60px]"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-4 text-white bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
        >
          {sidebarOpen ? "←" : "→"}
        </button>

        <nav className="space-y-2 mt-4">
          <button className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded" onClick={() => setPage({ params: { page: "home" } })}>
            Dashboard
          </button>
          <button
            className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded"
            onClick={() => setPage({ params: { page: "board" } })}
          >
            Add Board
          </button>
          <button
            className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded"
            onClick={() => setPage({ params: { page: "subject" } })}
          >
            Add Subjects
          </button>
          <button
            className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded"
            onClick={() => setPage({ params: { page: "round" } })}
          >
            Add Rounds
          </button>

          <button className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">
            Settings
          </button>
        </nav>
      </div>

     

      {/* {page.params.page === "home" ? (
       <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <div className="bg-white p-4 rounded shadow">
          {children || <p>Here’s your data display area.</p>}
        </div>


      </div>) : (
        <Boardpage/>
      )} */}




{/* return (
  <div className="flex-1 bg-gray-100 p-6 overflow-auto"> */}
    {renderPage()}
  {/* </div>
); */}

    </div>
  );
}
