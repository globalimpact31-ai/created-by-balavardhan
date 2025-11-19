import React, { useEffect, useMemo, useState } from "react";
import { IconFor } from "./Icons";

type Step = {
  remaining: string[];
  removed?: string;
};

export default function FlamesVisualizer({ nameA, nameB, onFinish }: { nameA: string; nameB: string; onFinish?: (result: string) => void }) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [running, setRunning] = useState(false);

  // build initial flames array
  const flamesInit = useMemo(() => ["F","L","A","M","E","S"], []);

  // compute count after removing common letters
  function prepareCount(a: string, b: string) {
    const sanitize = (s:string) => s.toLowerCase().replace(/[^a-z]/g,'');
    let sa = sanitize(a).split('');
    let sb = sanitize(b).split('');
    // remove common letters one-by-one
    for (let i = 0; i < sa.length; i++) {
      const idx = sb.indexOf(sa[i]);
      if (idx !== -1) {
        sa[i] = ''; sb[idx] = '';
      }
    }
    const remaining = sa.concat(sb).filter(Boolean);
    return remaining.length;
  }

  // run the elimination steps
  function run() {
    setRunning(true);
    const count = prepareCount(nameA, nameB);
    if (count === 0) {
      // if identical, treat as "S" (soulmates) maybe; we'll just return "S"
      const final = "S";
      setSteps([{ remaining: flamesInit, removed: undefined }]);
      setTimeout(() => {
        setSteps(prev => [...prev, { remaining: [final], removed: undefined }]);
        setRunning(false);
        onFinish?.(final);
      }, 600);
      return;
    }

    let arr = [...flamesInit];
    const newSteps: Step[] = [{ remaining: [...arr] }];

    while (arr.length > 1) {
      // count is 1-based circular removal
      const removeIndex = (count - 1) % arr.length;
      const removed = arr.splice(removeIndex, 1)[0];
      newSteps.push({ remaining: [...arr], removed });
      // rotate so counting starts where removal occurred
      // but in classic FLAMES, next count starts at next index (same index in shorter array)
      // we'll rotate the array to make the logic clearer
      arr = [...arr.slice(removeIndex), ...arr.slice(0, removeIndex)];
    }

    setSteps(newSteps);
    // animate through steps
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= newSteps.length) {
        clearInterval(interval);
        setRunning(false);
        onFinish?.(newSteps[newSteps.length - 1].remaining[0]);
      }
      setCurrentIndex(i);
    }, 600);
    setCurrentIndex(0);
  }

  useEffect(() => {
    // whenever names change, reset
    setSteps([]);
    setCurrentIndex(0);
    setRunning(false);
  }, [nameA, nameB]);

  const current = steps[currentIndex] ?? steps[steps.length - 1];

  return (
    <div className="mt-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl">FLAMES result</h3>
            <p className="text-sm text-gray-500 mt-1">Classic FLAMES with graceful elimination and final symbol.</p>
          </div>
          <div>
            <button
              onClick={run}
              disabled={running || !nameA.trim() || !nameB.trim()}
              className="inline-flex items-center px-4 py-2 bg-warm-500 hover:bg-warm-600 disabled:opacity-60 text-white rounded-md shadow-sm"
            >
              {running ? "Running..." : "Check"}
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            { (current?.remaining ?? []).map((l) => {
              // highlight the one removed in the current step if any
              const removed = steps[currentIndex]?.removed;
              const isRemoved = removed === l;
              return (
                <div
                  key={l}
                  className={`w-20 h-20 flex items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm elim ${isRemoved ? 'removed' : ''}`}
                  aria-hidden
                >
                  <div className="text-lg font-semibold text-gray-700">{l}</div>
                </div>
              );
            })}
          </div>

          {/* Final result preview */}
          {steps.length > 0 && (
            <div className="mt-6 flex items-center gap-4 justify-center">
              <div className="text-center">
                <div className="text-sm text-gray-500">Final</div>
                <div className="mt-2 card inline-flex items-center gap-4 px-6 py-4">
                  <div className="w-16 h-16 flex items-center justify-center">
                    { IconFor((steps[steps.length - 1].remaining[0]) || '') }
                  </div>
                  <div>
                    <div className="text-lg font-medium">
                      {(() => {
                        const key = steps[steps.length - 1].remaining[0];
                        switch (key) {
                          case "F": return "Friendship";
                          case "L": return "Love";
                          case "A": return "Affection";
                          case "M": return "Marriage";
                          case "E": return "Enemy";
                          case "S": return "Sibling";
                          default: return "—";
                        }
                      })()}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Letter: <span className="font-semibold">{steps[steps.length - 1].remaining[0]}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}