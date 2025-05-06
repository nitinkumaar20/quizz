/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  TopicType,
  SubjectType,
  ExamBoardType,
  QuestionType,
  RoundType,
} from "../stores/globalDataStores";

interface PropType {
  topics?: TopicType[];
  subjects?: SubjectType[];
  examBoards?: ExamBoardType[];
  questions?: QuestionType[];
  rounds?: RoundType[];
  component: string;
  handleEdit: (id: string | undefined) => void;
}

export const TablePagination = ({
  topics,
  subjects,
  examBoards,
  questions,
  rounds,
  component,
  handleEdit,
}: PropType) => {
  const [currentPage, setCurrentPage] = useState(1);
  const PerPage = 7;

  const getData = () => {
    switch (component) {
      case "topic":
        return topics ?? [];
      case "subject":
        return subjects ?? [];
      case "board":
        return examBoards ?? [];
      case "question":
        return questions ?? [];
      case "round":
        return rounds ?? [];
      default:
        return [];
    }
  };

  const data = getData();
  const totalPages = Math.ceil(data.length / PerPage);
  const currentData = data.slice(
    (currentPage - 1) * PerPage,
    currentPage * PerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const renderTableHeaders = () => {
    switch (component) {
      case "topic":
        return (
          <tr>
            <th className="p-2 border">Topic</th>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Board</th>
            <th className="p-2 border">Exam</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Edit</th>
          </tr>
        );
      case "subject":
        return (
          <tr>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Exam</th>
            <th className="p-2 border">Board</th>
            <th className="p-2 border">Access</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Edit</th>
          </tr>
        );
      case "board":
        return (
          <tr>
            <th className="p-2 border">Board Short Name</th>
            <th className="p-2 border">Board Long Name</th>
            <th className="p-2 border">Exam</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Edit</th>
          </tr>
        );
      case "round":
        return (
          <tr>
            <th className="p-2 border">Round</th>
            <th className="p-2 border">Section</th>
            <th className="p-2 border">Board</th>
            <th className="p-2 border">Exam</th>

            <th className="p-2 border">Type</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Edit</th>
          </tr>
        );
      case "question":
        return (
          <tr>
            <th className="p-2 border">Question</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Board</th>
            <th className="p-2 border">Exam</th>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Topic</th>
            <th className="p-2 border">Round</th>
            <th className="p-2 border">Year</th>
            <th className="p-2 border">Edit</th>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTableRow = (item: any, i: number) => {
    const topic = topics?.find((t) => Number(t.id) === item.topicId);
    const subject = subjects?.find((s) => s.id === topic?.subjectId);
    switch (component) {
      case "topic": {
        const subject = subjects?.find((s) => s.id === item.subjectId);
        const board = examBoards?.find((b) => b.id === subject?.examId);

        return (
          <tr key={i} className="hover:bg-gray-50">
            <td className="p-2 border">
              {item?.topicName?.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">
              {subject?.subjectName?.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">
              {board?.examBoardShortName?.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">
              {board?.examName?.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">{item?.active ? "Yes" : "No"}</td>
            <td className="p-2 border">{renderEditIcon(item)}</td>
          </tr>
        );
      }
      case "subject": {
        const board = examBoards?.find((b) => b.id === item.examId);
        return (
          <tr key={i} className="hover:bg-gray-50">
            <td className="p-2 border">
              {item?.subjectName?.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">
              {board?.examName?.toUpperCase() || "N/A"}
            </td>

            <td className="p-2 border">
              {board?.examBoardShortName?.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">{item?.accessType}</td>
            <td className="p-2 border">{item?.active ? "Yes" : "No"}</td>
            <td className="p-2 border">{renderEditIcon(item)}</td>
          </tr>
        );
      }
      case "board":
        return (
          <tr key={i} className="hover:bg-gray-50">
            <td className="p-2 border">
              {item?.examBoardShortName?.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">
              {item?.examBoardLongName?.toUpperCase() || "N/A"}
            </td>

            <td className="p-2 border">
              {item?.examName?.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">{item?.examBoardType}</td>
            <td className="p-2 border">{item?.active ? "Yes" : "No"}</td>
            <td className="p-2 border">{renderEditIcon(item)}</td>
          </tr>
        );
      case "round":
        return (
          <tr key={i} className="hover:bg-gray-50">
            <td className="p-2 border">
              {item?.roundName?.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">
              {item?.sectionName?.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">
              {examBoards
                ?.find((eb) => Number(eb.id) === item.examId)
                ?.examBoardShortName.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">
              {examBoards
                ?.find((eb) => Number(eb.id) === item.examId)
                ?.examName.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">{item.roundType}</td>
            <td className="p-2 border">{item?.active ? "Yes" : "No"}</td>
            <td className="p-2 border">{renderEditIcon(item)}</td>
          </tr>
        );
      case "question":
        return (
          <tr key={i} className="hover:bg-gray-50">
            <td className="p-2 border">
              {item?.questionText?.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">
              {item?.questionTitle?.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">
              {examBoards
                ?.find((eb) => eb.id === subject?.examId)
                ?.examBoardShortName.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">
              {examBoards
                ?.find((eb) => eb.id === subject?.examId)
                ?.examName.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">
              {" "}
              {subject?.subjectName.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">
              {" "}
              {topic?.topicName.toUpperCase() || "N/A"}
            </td>
            <td className="p-2 border">
              {" "}
              {rounds?.find((r) => Number(r.id) === item.roundId)?.roundName ||
                "N/A"}
            </td>
            <td className="p-2 border">{item.questionYear}</td>
            <td className="p-2 border">{renderEditIcon(item)}</td>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderEditIcon = (item: { id: string | undefined }) => (
    <svg
      className="w-6 h-6 text-black hover:text-red-600 cursor-pointer"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => handleEdit(item.id)}
    >
      <path
        d="M18.945 9.188l-4-4m4 4l-4.999 4.998a6.22 6.22 0 01-2.376 1.337c-.927.16-2.077.213-2.626-.335-.548-.549-.495-1.7-.335-2.626a6.22 6.22 0 011.337-2.376l4.998-4.998m4 4s3-3 1-5-5 1-5 1M20.5 12c0 6.5-2 8.5-8.5 8.5S3.5 18.5 3.5 12 5.5 3.5 12 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div>
      <table className="w-full text-left">
        <thead className="bg-gray-100">{renderTableHeaders()}</thead>
        <tbody>{currentData.map((item, i) => renderTableRow(item, i))}</tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[--primary] rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-7 py-2 bg-[--primary] rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
