import React, { useState, useEffect, useCallback } from 'react';
import { CalculationHistoryItem } from '../types';
import { Calculator as CalcIcon, History, Trash2, Delete, RotateCcw, AlertTriangle } from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  const [currentInput, setCurrentInput] = useState<string>('0');
  const [previousInput, setPreviousInput] = useState<string>('');
  const [operation, setOperation] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [history, setHistory] = useState<CalculationHistoryItem[]>([
    { expression: '10 + 20', result: '30', timestamp: 'Initial Sample' },
    { expression: '50 - 20', result: '30', timestamp: 'Initial Sample' },
    { expression: '5 × 6', result: '30', timestamp: 'Initial Sample' },
    { expression: '100 ÷ 4', result: '25', timestamp: 'Initial Sample' },
  ]);

  const clearAll = useCallback(() => {
    setCurrentInput('0');
    setPreviousInput('');
    setOperation(null);
    setIsError(false);
  }, []);

  const deleteLast = useCallback(() => {
    if (isError) {
      clearAll();
      return;
    }
    setCurrentInput((prev) => {
      if (prev.length <= 1 || (prev.length === 2 && prev.startsWith('-'))) {
        return '0';
      }
      return prev.slice(0, -1);
    });
  }, [isError, clearAll]);

  const appendNumber = useCallback((char: string) => {
    setIsError(false);
    setCurrentInput((prev) => {
      if (prev === 'Cannot divide by zero') {
        return char === '.' ? '0.' : char;
      }
      if (char === '.' && prev.includes('.')) {
        return prev;
      }
      if (prev === '0' && char !== '.') {
        return char;
      }
      return prev + char;
    });
  }, []);

  const calculateResult = useCallback(() => {
    if (operation === null || previousInput === '' || isError) {
      return;
    }

    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(curr)) {
      return;
    }

    let res = 0;
    if (operation === '+') {
      res = prev + curr;
    } else if (operation === '-') {
      res = prev - curr;
    } else if (operation === '×' || operation === '*') {
      res = prev * curr;
    } else if (operation === '÷' || operation === '/') {
      if (curr === 0) {
        setIsError(true);
        setCurrentInput('Cannot divide by zero');
        setPreviousInput('');
        setOperation(null);
        return;
      }
      res = prev / curr;
    }

    // Format clean result
    const formatted = Number(res.toFixed(6)).toString();
    const newEntry: CalculationHistoryItem = {
      expression: `${prev} ${operation} ${curr}`,
      result: formatted,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setHistory((prevHistory) => [newEntry, ...prevHistory.slice(0, 9)]);
    setCurrentInput(formatted);
    setPreviousInput('');
    setOperation(null);
  }, [currentInput, isError, operation, previousInput]);

  const selectOperation = useCallback((op: string) => {
    if (isError) {
      clearAll();
      return;
    }

    if (operation !== null && previousInput !== '') {
      calculateResult();
    }

    setOperation(op);
    setPreviousInput(currentInput);
    setCurrentInput('0');
  }, [calculateResult, clearAll, currentInput, isError, operation, previousInput]);

  const toggleSign = useCallback(() => {
    if (isError) return;
    setCurrentInput((prev) => {
      if (prev === '0') return prev;
      return prev.startsWith('-') ? prev.substring(1) : '-' + prev;
    });
  }, [isError]);

  // Keyboard support for realistic testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
      } else if (e.key === '.') {
        appendNumber('.');
      } else if (e.key === '+' || e.key === '-') {
        selectOperation(e.key);
      } else if (e.key === '*') {
        selectOperation('×');
      } else if (e.key === '/') {
        e.preventDefault();
        selectOperation('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculateResult();
      } else if (e.key === 'Backspace') {
        deleteLast();
      } else if (e.key === 'Escape') {
        clearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appendNumber, calculateResult, clearAll, deleteLast, selectOperation]);

  const runQuickTest = (a: number, op: string, b: number) => {
    setPreviousInput(a.toString());
    setOperation(op);
    setCurrentInput(b.toString());
    setTimeout(() => {
      let res = 0;
      if (op === '+') res = a + b;
      if (op === '-') res = a - b;
      if (op === '×') res = a * b;
      if (op === '÷') {
        if (b === 0) {
          setIsError(true);
          setCurrentInput('Cannot divide by zero');
          setPreviousInput('');
          setOperation(null);
          return;
        }
        res = a / b;
      }
      const formatted = Number(res.toFixed(6)).toString();
      setHistory((prev) => [
        {
          expression: `${a} ${op} ${b}`,
          result: formatted,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        ...prev,
      ]);
      setCurrentInput(formatted);
      setPreviousInput('');
      setOperation(null);
    }, 150);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Title Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-3 shadow-sm">
          <CalcIcon className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Calculator Service
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-lg mx-auto">
          Demonstrating TypeScript event handling, mathematical state management, and edge-case validation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* The Calculator Hardware UI */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 text-white">
            
            {/* Screen Display */}
            <div className="bg-slate-950 rounded-2xl p-5 mb-5 border border-slate-800/80 shadow-inner flex flex-col justify-between min-h-[110px] text-right">
              <div className="text-xs text-slate-400 font-mono tracking-wider h-5 flex items-center justify-end">
                {previousInput && (
                  <span>
                    {previousInput} <span className="text-amber-400 font-bold">{operation}</span>
                  </span>
                )}
              </div>
              <div 
                className={`font-mono font-bold tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none transition-colors ${
                  isError ? 'text-red-400 text-lg sm:text-xl' : 'text-white text-3xl sm:text-4xl'
                }`}
              >
                {currentInput}
              </div>
            </div>

            {/* Error banner if divide by zero */}
            {isError && (
              <div className="mb-4 bg-red-950/80 border border-red-800 text-red-300 text-xs px-3 py-2 rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Division by zero is undefined! Press <strong>C</strong> to reset.</span>
              </div>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {/* Row 1 */}
              <button
                onClick={clearAll}
                className="h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-lg active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer"
                title="Clear All (Escape)"
              >
                C
              </button>
              <button
                onClick={deleteLast}
                className="h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-lg active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer"
                title="Backspace"
              >
                ⌫
              </button>
              <button
                onClick={toggleSign}
                className="h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-lg active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer"
                title="Toggle Sign"
              >
                ±
              </button>
              <button
                onClick={() => selectOperation('÷')}
                className={`h-14 rounded-2xl font-bold text-xl active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer ${
                  operation === '÷' ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300' : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                ÷
              </button>

              {/* Row 2 */}
              <button
                onClick={() => appendNumber('7')}
                className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xl active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                7
              </button>
              <button
                onClick={() => appendNumber('8')}
                className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xl active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                8
              </button>
              <button
                onClick={() => appendNumber('9')}
                className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xl active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                9
              </button>
              <button
                onClick={() => selectOperation('×')}
                className={`h-14 rounded-2xl font-bold text-xl active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer ${
                  operation === '×' ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300' : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                ×
              </button>

              {/* Row 3 */}
              <button
                onClick={() => appendNumber('4')}
                className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xl active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                4
              </button>
              <button
                onClick={() => appendNumber('5')}
                className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xl active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                5
              </button>
              <button
                onClick={() => appendNumber('6')}
                className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xl active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                6
              </button>
              <button
                onClick={() => selectOperation('-')}
                className={`h-14 rounded-2xl font-bold text-2xl active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer ${
                  operation === '-' ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300' : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                -
              </button>

              {/* Row 4 */}
              <button
                onClick={() => appendNumber('1')}
                className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xl active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                1
              </button>
              <button
                onClick={() => appendNumber('2')}
                className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xl active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                2
              </button>
              <button
                onClick={() => appendNumber('3')}
                className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xl active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                3
              </button>
              <button
                onClick={() => selectOperation('+')}
                className={`h-14 rounded-2xl font-bold text-2xl active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer ${
                  operation === '+' ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300' : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                +
              </button>

              {/* Row 5 */}
              <button
                onClick={() => appendNumber('0')}
                className="col-span-2 h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xl active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer"
              >
                0
              </button>
              <button
                onClick={() => appendNumber('.')}
                className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-2xl active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                .
              </button>
              <button
                onClick={calculateResult}
                className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-2xl active:scale-95 transition-all shadow-md shadow-blue-600/30 flex items-center justify-center cursor-pointer"
                title="Calculate (Enter)"
              >
                =
              </button>
            </div>

            <p className="text-[11px] text-slate-500 text-center mt-4">
              Physical keyboard input supported (0-9, +, -, *, /, Enter, Backspace)
            </p>
          </div>
        </div>

        {/* Lab Testing Shortcuts & History Roll */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* College Lab Sample Operations quick clicks */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Lab Practical Quick Tests
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              One-click execute the exact test cases specified in the experiment requirements:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => runQuickTest(10, '+', 20)}
                className="text-xs font-mono font-medium p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <span>10 + 20</span>
                <span className="text-slate-400 font-bold">&rarr; 30</span>
              </button>
              <button
                onClick={() => runQuickTest(50, '-', 20)}
                className="text-xs font-mono font-medium p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <span>50 - 20</span>
                <span className="text-slate-400 font-bold">&rarr; 30</span>
              </button>
              <button
                onClick={() => runQuickTest(5, '×', 6)}
                className="text-xs font-mono font-medium p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <span>5 × 6</span>
                <span className="text-slate-400 font-bold">&rarr; 30</span>
              </button>
              <button
                onClick={() => runQuickTest(100, '÷', 4)}
                className="text-xs font-mono font-medium p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <span>100 ÷ 4</span>
                <span className="text-slate-400 font-bold">&rarr; 25</span>
              </button>
              <button
                onClick={() => runQuickTest(10, '÷', 0)}
                className="col-span-2 text-xs font-mono font-medium p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <span>10 ÷ 0 (Divide by Zero)</span>
                <span className="text-red-600 font-bold">&rarr; Error Guard</span>
              </button>
            </div>
          </div>

          {/* History Roll */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Calculation History
                </h3>
              </div>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No calculations recorded yet. Perform an operation on the keypad.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-slate-600">{item.expression} =</span>
                    <span className="text-blue-600 font-bold">{item.result}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
