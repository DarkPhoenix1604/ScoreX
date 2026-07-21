import { useState } from "react";
import FileUpload from "./components/fileupload";
import Dashboard from "./components/dashboard";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = () => {
    setAnalysisData(null);
    setError("");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-4 overflow-hidden">
      {/* 3D Background Glow Circles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-96 h-96 bg-purple-600/30 blur-[120px] rounded-full top-10 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/30 blur-[120px] rounded-full bottom-10 right-10 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <SignedIn>
          <header className="absolute top-6 right-6">
            <UserButton />
          </header>
          <main className="w-full">
            {!analysisData ? (
              <FileUpload
                setAnalysisData={setAnalysisData}
                setIsLoading={setIsLoading}
                setError={setError}
                isLoading={isLoading}
              />
            ) : (
              <Dashboard data={analysisData} onReset={handleReset} />
            )}

            {error && !isLoading && (
              <div className="mt-4 text-sm text-red-400 border border-red-500/50 bg-red-500/10 p-3 rounded-lg text-center">
                <strong>Analysis Failed:</strong> {error}
              </div>
            )}
          </main>
        </SignedIn>

        <SignedOut>
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl text-center transform transition hover:scale-[1.015] hover:shadow-cyan-500/20 duration-300">
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Welcome to Score-X
            </h1>
            <p className="text-gray-300 mb-8">
              Let our AI analyze and score your resume with precision.
              <br />
              Elevate your career prospects.
            </p>

            <SignInButton mode="modal">
              <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
                Sign In & Get Started
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}

export default App;