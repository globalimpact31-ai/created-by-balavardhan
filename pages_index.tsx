import React, { useState } from "react";
import FlamesVisualizer from "../components/FlamesVisualizer";

export default function Home() {
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [result, setResult] = useState<string | null>(null);

  return (
    <div className="container">
      <header className="mb-8 text-center">
        <h1 className="text-4xl">FLAMES — Classic Elegance</h1>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Enter two names and press Check. The UI elegantly eliminates FLAMES letters until the final relationship type appears.
        </p>
      </header>

      <main>
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Name A</label>
              <input
                value={nameA}
                onChange={(e) => setNameA(e.target.value)}
                placeholder="e.g. Alice"
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-warm-200"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Name B</label>
              <input
                value={nameB}
                onChange={(e) => setNameB(e.target.value)}
                placeholder="e.g. Bob"
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-warm-200"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setNameA(""); setNameB(""); setResult(null);
              }}
              className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>

        <FlamesVisualizer
          nameA={nameA}
          nameB={nameB}
          onFinish={(res) => setResult(res)}
        />

        {result && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Computation finished: result letter is <span className="font-semibold">{result}</span>
          </div>
        )}
      </main>

      <footer className="mt-10 text-center text-xs text-gray-400">
        Classic FLAMES algorithm. Symbols map to letters: F=Friendship, L=Love, A=Affection, M=Marriage, E=Enemy, S=Sibling.
      </footer>
    </div>
  );
}