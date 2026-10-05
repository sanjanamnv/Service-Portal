import React, { useState } from 'react';
import { ANGULAR_FILES } from '../angular-source/files';
import { AngularFileDefinition } from '../types';
import JSZip from 'jszip';
import { 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  X, 
  FolderTree, 
  Terminal, 
  FileText, 
  ShieldCheck, 
  Layers, 
  Search,
  ExternalLink
} from 'lucide-react';

interface AngularCodeExplorerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AngularCodeExplorer: React.FC<AngularCodeExplorerProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<AngularFileDefinition>(ANGULAR_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Service', 'Guard', 'Component', 'Config', 'Styles', 'Documentation'];

  const filteredFiles = ANGULAR_FILES.filter((file) => {
    const matchesSearch = file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          file.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add each file to the zip
      ANGULAR_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Generate zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);

      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'angular-auth-services-app.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating ZIP', err);
      alert('Failed to generate ZIP file.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-7xl h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Angular 18 Project Source Files</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  {ANGULAR_FILES.length} Files Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Inspect, copy, or download the full standalone Angular codebase for your college submission
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>{isZipping ? 'Packaging ZIP...' : 'Download Project (.ZIP)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Sidebar + Code Viewer */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar: File Tree & Filters */}
          <div className="w-80 shrink-0 border-r border-slate-800 bg-slate-950/60 flex flex-col">
            
            {/* Search */}
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category tabs */}
            <div className="p-2 border-b border-slate-800 flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* File List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white font-medium shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                    <div className="overflow-hidden">
                      <span className="block truncate font-mono text-xs">{file.name}</span>
                      <span className={`block truncate text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        {file.path}
                      </span>
                    </div>
                  </button>
                );
              })}

              {filteredFiles.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-500">
                  No files match your query
                </div>
              )}
            </div>

            {/* Quick terminal instructions summary */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              <span className="text-slate-300 font-semibold block mb-1">Run Commands:</span>
              <div className="bg-slate-900 p-2 rounded border border-slate-800 space-y-0.5 text-[10px]">
                <div>$ npm install</div>
                <div>$ ng serve</div>
                <div className="text-blue-400">http://localhost:4200</div>
              </div>
            </div>

          </div>

          {/* Right Main: Code Display */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            
            {/* File info bar */}
            <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-blue-400">
                    {selectedFile.path}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedFile.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedFile.description}
                </p>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code container */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
              <pre className="whitespace-pre overflow-x-auto">
                <code>{selectedFile.content}</code>
              </pre>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
