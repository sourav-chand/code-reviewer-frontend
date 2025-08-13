import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Code,
  AlertCircle,
  CheckCircle,
  X,
  Copy,
  RotateCcw,
  Settings,
  Moon,
  Sun,
  CloudSnow,
} from "lucide-react";
import axios from "axios";

const App = () => {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`);
  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const textareaRef = useRef(null);

  // Mock AI review function - replace with your actual API call
  const getAIReview = async (code) => {
 try {
  setIsLoading(true);
  const response = await axios.post(import.meta.env.VITE_API_URL, { code });

  // response.data is coming like "```json {...} ```"
  let rawData = response.data;

  // Remove ```json and ``` if present
  rawData = rawData.replace(/```json|```/g, "").trim();

  // Convert string to JS object
  const parsedData = JSON.parse(rawData);

  console.log("Parsed API Response as object:", parsedData);

  // Now you can use parsedData.status, parsedData.issues, etc.
  setIsLoading(false);
  console.log(parsedData)
  return parsedData; // <-- returning object instead of raw response
} catch (error) {
  setIsLoading(false);
  console.error(error);
}

    
//     // Simulating API call delay
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     // Mock review response based on the code
//     return {
//       status: "issues_found",
//       issues: [
//         {
//           type: "error",
//           title: "Lack of documentation",
//           description:
//             "There is no documentation explaining the function's purpose, inputs, or outputs.",
//           line: 1,
//         },
//         {
//           type: "error",
//           title: "Inflexibility",
//           description:
//             "The function only returns the sum of 1 + 1. It cannot be used to sum other numbers.",
//           line: 2,
//         },
//         {
//           type: "warning",
//           title: "No clear return type",
//           description:
//             "While JavaScript is dynamically typed, it's good practice to consider what the function returns.",
//           line: 2,
//         },
//       ],
//       suggestions: `/**
//  * Calculates the sum of two numbers.
//  * @param {number} a - The first number.
//  * @param {number} b - The second number.
//  * @returns {number} The sum of a and b.
//  */
// function sum(a, b) {
//   return a + b;
// }`,
//     };
  };

  const handleReview = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const reviewResult = await getAIReview(code);
      setReview(reviewResult);
    } catch (error) {
      console.error("Review failed:", error);
      setReview({
        status: "error",
        message: "Failed to review code. Please try again.",
      });
    }
    setIsLoading(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleCopySuggestion = () => {
    if (review?.suggestions) {
      navigator.clipboard.writeText(review.suggestions);
    }
  };

  const handleApplySuggestion = () => {
    if (review?.suggestions) {
      setCode(review.suggestions);
      setReview(null);
    }
  };

  const clearEditor = () => {
    setCode("");
    setReview(null);
  };

  const getIssueIcon = (type) => {
    switch (type) {
      case "error":
        return <X className="w-4 h-4 text-red-400" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case "info":
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  useEffect(() => {
    // Auto-resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.max(200, textarea.scrollHeight) + "px";
    }
  }, [code]);

  const themeClasses = isDarkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-gray-50 text-gray-900";

  const cardClasses = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-300";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${themeClasses}`}
    >
      {/* Header */}
      <header
        className={`border-b transition-colors ${
          isDarkMode ? "border-gray-700" : "border-gray-300"
        } sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Code className="w-8 h-8 text-blue-500" />
              <h1 className="text-xl font-bold">AI Code Reviewer</h1>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="typescript">TypeScript</option>
              </select>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
          {/* Code Editor Panel */}
          <div
            className={`border rounded-xl transition-colors ${cardClasses} flex flex-col`}
          >
            <div className="flex items-center justify-between p-4 border-b border-opacity-50">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">Code Editor</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {language}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyCode}
                  className={`p-2 rounded-lg transition-colors hover:scale-105 ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                  }`}
                  title="Copy code"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={clearEditor}
                  className={`p-2 rounded-lg transition-colors hover:scale-105 ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                  }`}
                  title="Clear editor"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here..."
                className={`w-full h-full min-h-[200px] font-mono text-sm resize-none border-none outline-none transition-colors ${
                  isDarkMode
                    ? "bg-gray-900 text-gray-100 placeholder-gray-500"
                    : "bg-gray-50 text-gray-900 placeholder-gray-400"
                } rounded-lg p-4`}
                spellCheck={false}
              />
            </div>

            <div className="p-4 border-t border-opacity-50">
              <button
                onClick={handleReview}
                disabled={isLoading || !code.trim()}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:scale-100 disabled:opacity-50 ${
                  isLoading
                    ? "bg-blue-400 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Reviewing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Review Code</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Review Results Panel */}
          <div
            className={`border rounded-xl transition-colors ${cardClasses} flex flex-col`}
          >
            <div className="flex items-center justify-between p-4 border-b border-opacity-50">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">Review Results</span>
              </div>

              {review && (
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    review.status === "issues_found"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : review.status === "good"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {review.status === "issues_found"
                    ? "Issues Found"
                    : "Good Code"}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {!review ? (
                <div className="flex items-center justify-center h-full text-center p-8">
                  <div
                    className={`${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      Ready to Review
                    </h3>
                    <p className="text-sm">
                      Write your code and click "Review Code" to get AI-powered
                      feedback
                    </p>
                  </div>
                </div>
              ) : review.status === "error" ? (
                <div className="p-4">
                  <div className="text-red-500 text-center">
                    <X className="w-12 h-12 mx-auto mb-2" />
                    <p>{review.message}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {/* Issues Section */}
                  {review.issues && review.issues.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-400 mb-3 flex items-center">
                        <X className="w-4 h-4 mr-2" />
                        Issues ({review.issues.length})
                      </h4>
                      <div className="space-y-3">
                        {review.issues.map((issue, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border-l-4 transition-colors ${
                              issue.type === "error"
                                ? `border-red-500 ${
                                    isDarkMode
                                      ? "bg-red-900 bg-opacity-20"
                                      : "bg-red-50"
                                  }`
                                : issue.type === "warning"
                                ? `border-yellow-500 ${
                                    isDarkMode
                                      ? "bg-yellow-900 bg-opacity-20"
                                      : "bg-yellow-50"
                                  }`
                                : `border-blue-500 ${
                                    isDarkMode
                                      ? "bg-blue-900 bg-opacity-20"
                                      : "bg-blue-50"
                                  }`
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              {getIssueIcon(issue.type)}
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-sm">
                                  {issue.title}
                                </h5>
                                <p
                                  className={`text-sm mt-1 ${
                                    isDarkMode
                                      ? "text-gray-300"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {issue.description}
                                </p>
                                {issue.line && (
                                  <span
                                    className={`text-xs mt-2 inline-block ${
                                      isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    Line {issue.line}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions Section */}
                  {review.suggestions && (
                    <div>
                      <h4 className="font-semibold text-green-400 mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Recommended Fix
                      </h4>
                      <div
                        className={`rounded-lg border transition-colors ${
                          isDarkMode
                            ? "bg-gray-900 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                      >
                        <div className="p-3 border-b border-opacity-50 flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Improved Code
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleCopySuggestion}
                              className={`p-1 rounded transition-colors ${
                                isDarkMode
                                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                              }`}
                              title="Copy suggestion"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <pre
                          className={`p-3 text-xs font-mono overflow-x-auto ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {review.suggestions}
                        </pre>
                        <div className="p-3 border-t border-opacity-50">
                          <button
                            onClick={handleApplySuggestion}
                            className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                          >
                            Apply Suggestion
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
