import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Loader
} from 'lucide-react';

export default function ResumeUploadPage() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, uploading, parsing, success, error
  const [progress, setProgress] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      alert('Only PDF files are supported.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit.');
      return;
    }
    setFile(selectedFile);
    uploadAndParse(selectedFile);
  };

  const uploadAndParse = (fileToUpload) => {
    setStatus('uploading');
    setProgress(20);
    
    // Simulate upload progress
    const uploadTimer = setTimeout(() => {
      setProgress(60);
      setStatus('parsing');
    }, 1500);

    const parseTimer = setTimeout(() => {
      setProgress(100);
      setStatus('success');
    }, 3500);
  };

  const handleDelete = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Upload Your Resume</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Upload your latest PDF resume. CareerIntel AI parses key components and skill catalogs.
        </p>
      </div>

      {status === 'idle' ? (
        /* Drag & Drop Box */
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            dragActive
              ? 'border-emerald-500 bg-emerald-500/5'
              : 'border-slate-300 hover:border-emerald-500 dark:border-slate-800 dark:hover:border-emerald-500 bg-white dark:bg-dark-900'
          }`}
        >
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
          />
          <UploadCloud className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-650" />
          <h3 className="mt-4 text-lg font-bold">Select Resume PDF</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Drag and drop your file here, or click to browse.
          </p>
          <label
            htmlFor="file-upload"
            className="mt-6 inline-flex cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold py-2 px-6 rounded-lg text-sm transition-all"
          >
            Browse Files
          </label>
          <p className="mt-4 text-xs text-slate-400">Supports PDF format up to 5MB.</p>
        </div>
      ) : (
        /* Processing / Success State Display Card */
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <FileText className="h-8 w-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold truncate">{file?.name}</h3>
              <p className="text-xs text-slate-400">{(file?.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
            </div>

            {/* Actions for uploaded active state */}
            {status === 'success' && (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => uploadAndParse(file)}
                  className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  title="Re-analyze"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
                <button
                  className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-500 hover:bg-red-500/5 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Loader bar */}
          {(status === 'uploading' || status === 'parsing') && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center gap-2 text-slate-500">
                  <Loader className="h-3.5 w-3.5 animate-spin text-emerald-500" />
                  {status === 'uploading' ? 'Uploading PDF resume to server...' : 'AI parsing resume components...'}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {status === 'success' && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 rounded-xl flex items-center gap-3 text-sm">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <span>Resume parsed and saved successfully. Resume score calculated.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
