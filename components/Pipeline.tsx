import React, { useState } from 'react';
import { Candidate, CandidateStatus } from '../types';
import { analyzeResume, generateInterviewEmail, generateInterviewReport } from '../services/geminiService';
import { Mail, RefreshCw, Check, BrainCircuit, UserCheck, Calendar, FileText, Database, Clock, ChevronDown, ChevronUp, Play, Layers } from 'lucide-react';

interface PipelineProps {
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  addLog: (source: any, message: string, type: any) => void;
}

const Pipeline: React.FC<PipelineProps> = ({ candidates, setCandidates, addLog }) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  const departments = ['All', 'Engineering', 'Design', 'Product'];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const simulateEmailScraping = () => {
    addLog('SELENIUM', 'Connecting to IMAP Server (hr@supalai-tech.com)...', 'INFO');
    setTimeout(() => {
        addLog('SELENIUM', 'Found 3 unread application emails.', 'SUCCESS');
        addLog('LANGCHAIN', 'Parsing email body and attachments...', 'INFO');
    }, 1000);

    setTimeout(() => {
        const newCandidates: Candidate[] = [
            {
                id: Math.random().toString(36).substr(2, 9),
                name: "Somchai Techwiz",
                email: "somchai.dev@example.com",
                position: "Senior React Developer",
                department: "Engineering",
                resumeText: "Experienced React developer with 5 years in fintech. Expert in Tailwind, Redux, and Node.js. Led a team of 4.",
                aiScore: 0,
                status: CandidateStatus.RECEIVED,
                appliedDate: new Date().toISOString().split('T')[0]
            },
            {
                id: Math.random().toString(36).substr(2, 9),
                name: "Jane Designer",
                email: "jane.ui@example.com",
                position: "UX/UI Designer",
                department: "Design",
                resumeText: "Creative designer focused on Figma and Adobe Suite. 2 years experience. No coding skills. Strong portfolio in E-commerce.",
                aiScore: 0,
                status: CandidateStatus.RECEIVED,
                appliedDate: new Date().toISOString().split('T')[0]
            },
            {
                id: Math.random().toString(36).substr(2, 9),
                name: "David Backend",
                email: "david.go@example.com",
                position: "Golang Engineer",
                department: "Engineering",
                resumeText: "Backend specialist. Go, Python, Docker, Kubernetes. 7 years experience in high-load systems. Bachelors in CS.",
                aiScore: 0,
                status: CandidateStatus.RECEIVED,
                appliedDate: new Date().toISOString().split('T')[0]
            }
        ];
        setCandidates(prev => [...prev, ...newCandidates]);
        addLog('OLLAMA', 'Data extracted and structured. Assigned to respective departments.', 'SUCCESS');
    }, 2500);
  };

  const handleAiScreening = async (candidate: Candidate) => {
    setProcessingId(candidate.id);
    addLog('LANGCHAIN', `Retrieving resume context for ${candidate.name}...`, 'INFO');
    addLog('OLLAMA', `Evaluating detailed criteria for ${candidate.position}...`, 'INFO');

    const result = await analyzeResume(candidate.resumeText, candidate.position);
    
    setCandidates(prev => prev.map(c => {
        if (c.id === candidate.id) {
            return {
                ...c,
                aiScore: result.score,
                detailedScore: result.detailedScore,
                summary: result.summary,
                skills: result.skills,
                status: result.score > 60 ? CandidateStatus.DEPARTMENT_REVIEW : CandidateStatus.REJECTED
            };
        }
        return c;
    }));

    addLog('OLLAMA', `Evaluation Complete. Score: ${result.score}/100.`, result.score > 60 ? 'SUCCESS' : 'WARNING');
    setProcessingId(null);
  };

  const handleBatchScreening = async () => {
    setIsBatchProcessing(true);
    const pendingCandidates = candidates.filter(c => c.status === CandidateStatus.RECEIVED);
    
    addLog('SYSTEM', `Starting Batch Processing for ${pendingCandidates.length} candidates...`, 'INFO');
    
    for (const candidate of pendingCandidates) {
        await handleAiScreening(candidate);
        // Small delay to visualize the process in the log
        await new Promise(r => setTimeout(r, 800)); 
    }
    
    setIsBatchProcessing(false);
    addLog('SYSTEM', 'Batch Processing Complete.', 'SUCCESS');
  };

  const handleDepartmentConfirm = async (candidate: Candidate) => {
      setProcessingId(candidate.id);
      addLog('SYSTEM', `Forwarding profile to ${candidate.department} Head...`, 'INFO');
      
      setTimeout(async () => {
          addLog('SYSTEM', 'Department Head confirmed interest.', 'SUCCESS');
          
          // Simulate finding a slot
          const nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 3);
          nextWeek.setHours(14, 0, 0, 0);
          const interviewTime = nextWeek.toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' });

          addLog('LANGCHAIN', `Scheduling: Found available slot ${interviewTime}.`, 'INFO');
          addLog('LANGCHAIN', 'Drafting interview invitation email...', 'INFO');
          
          await generateInterviewEmail(candidate.name, candidate.position, interviewTime);
          
          addLog('OLLAMA', 'Email drafted.', 'SUCCESS');
          
          setTimeout(() => {
              addLog('SELENIUM', `Sending email to ${candidate.email} via SMTP...`, 'INFO');
              setCandidates(prev => prev.map(c => 
                c.id === candidate.id ? { 
                    ...c, 
                    status: CandidateStatus.INTERVIEW_SCHEDULED,
                    interviewDate: interviewTime
                } : c
              ));
              addLog('SYSTEM', 'Interview Invite Sent.', 'SUCCESS');
              setProcessingId(null);
          }, 1500);
      }, 1500);
  };

  const handlePassInterview = (candidate: Candidate) => {
    if (!window.confirm(`Mark ${candidate.name} as passed interview?`)) return;
    
    setCandidates(prev => prev.map(c => 
        c.id === candidate.id ? { ...c, status: CandidateStatus.HIRED } : c
    ));
    addLog('SYSTEM', `${candidate.name} marked as HIRED/PASSED.`, 'SUCCESS');
    // Auto expand to encourage report generation
    setExpandedId(candidate.id);
  };

  const handleGenerateReport = async (candidate: Candidate) => {
    setProcessingId(candidate.id);
    addLog('LANGCHAIN', 'Collating interview feedback nodes...', 'INFO');
    addLog('OLLAMA', 'Generating formal Interview Evaluation Report...', 'INFO');

    const report = await generateInterviewReport(candidate.name, candidate.position);

    setCandidates(prev => prev.map(c => 
        c.id === candidate.id ? { ...c, interviewReport: report } : c
    ));

    addLog('OLLAMA', 'Report Generated.', 'SUCCESS');
    setProcessingId(null);
  };

  const handleFinalizeDb = (candidate: Candidate) => {
    setProcessingId(candidate.id);
    addLog('SYSTEM', 'Initiating Final Record Archival...', 'INFO');
    
    setTimeout(() => {
        addLog('SELENIUM', 'Opening HR Database Portal (PeopleSoft/SAP)...', 'INFO');
    }, 500);

    setTimeout(() => {
        addLog('LANGCHAIN', 'Packaging: Resume + AI Score + Interview Report...', 'INFO');
    }, 1500);

    setTimeout(() => {
        setCandidates(prev => prev.map(c => 
            c.id === candidate.id ? { ...c, isFinalized: true } : c
        ));
        addLog('SELENIUM', 'Record Inserted Successfully (ID: EMP-' + Math.floor(Math.random() * 10000) + ').', 'SUCCESS');
        setProcessingId(null);
    }, 2500);
  };

  const getStatusColor = (status: CandidateStatus) => {
    switch(status) {
        case CandidateStatus.RECEIVED: return 'bg-gray-100 text-gray-700 border-gray-200';
        case CandidateStatus.AI_SCREENING: return 'bg-blue-50 text-blue-700 border-blue-200';
        case CandidateStatus.DEPARTMENT_REVIEW: return 'bg-purple-50 text-purple-700 border-purple-200';
        case CandidateStatus.INTERVIEW_SCHEDULED: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        case CandidateStatus.HIRED: return 'bg-green-50 text-green-700 border-green-200';
        case CandidateStatus.REJECTED: return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const filteredCandidates = candidates.filter(c => 
    selectedDepartment === 'All' || c.department === selectedDepartment
  );

  const renderProgressBar = (label: string, value: number | undefined) => (
      <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 font-medium">{label}</span>
              <span className="text-gray-900 font-bold">{value || 0}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 rounded-full transition-all duration-500 bg-ig-gradient" 
                style={{ width: `${value || 0}%` }}
              ></div>
          </div>
      </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-xl font-bold text-gradient">Candidate Pipeline</h2>
            <p className="text-sm text-gray-500">Real-time application flow processing</p>
        </div>
        <div className="flex gap-3">
            {candidates.some(c => c.status === CandidateStatus.RECEIVED) && (
                <button 
                    onClick={handleBatchScreening}
                    disabled={isBatchProcessing}
                    className="flex items-center gap-2 px-4 py-2 bg-ig-gradient text-white rounded-lg shadow-lg shadow-purple-500/30 hover:opacity-90 text-sm font-medium transition-all disabled:opacity-50 transform hover:scale-105"
                >
                    <Layers className="w-4 h-4" />
                    {isBatchProcessing ? 'Processing Batch...' : 'Batch AI Screen'}
                </button>
            )}
            <button 
                onClick={simulateEmailScraping}
                disabled={isBatchProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors hover:border-pink-300 hover:text-pink-600 group"
            >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                Pull from Email (Selenium)
            </button>
        </div>
      </div>

      {/* Department Tabs */}
      <div className="flex space-x-1 bg-white p-1.5 rounded-xl border border-gray-200 w-fit shadow-sm">
        {departments.map(dept => (
            <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                    selectedDepartment === dept 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
                {dept}
            </button>
        ))}
      </div>

      {/* Pipeline Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase">
                    <tr>
                        <th className="w-8 px-4"></th>
                        <th className="px-6 py-4 font-semibold">Candidate</th>
                        <th className="px-6 py-4 font-semibold">Role & Dept</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-center">AI Score</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredCandidates.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                <div className="flex flex-col items-center gap-2">
                                    <UserCheck className="w-8 h-8 text-gray-300" />
                                    <p>No candidates in this view.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        filteredCandidates.map((c) => (
                            <React.Fragment key={c.id}>
                                <tr className={`hover:bg-pink-50/30 transition-colors ${expandedId === c.id ? 'bg-purple-50/30' : ''}`}>
                                    <td className="pl-4">
                                        <button onClick={() => toggleExpand(c.id)} className="text-gray-400 hover:text-purple-600 transition-colors">
                                            {expandedId === c.id ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{c.name}</div>
                                        <div className="text-xs text-gray-500">{c.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900">{c.position}</div>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 mt-1 border border-gray-200">
                                            {c.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border w-fit ${getStatusColor(c.status)}`}>
                                                {c.status.replace('_', ' ')}
                                            </span>
                                            {c.status === CandidateStatus.INTERVIEW_SCHEDULED && c.interviewDate && (
                                                <div className="flex items-center gap-1 text-xs text-orange-600 font-medium mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {c.interviewDate}
                                                </div>
                                            )}
                                            {c.isFinalized && (
                                                 <div className="flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
                                                    <Database className="w-3 h-3" />
                                                    Saved to DB
                                                 </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {c.aiScore > 0 ? (
                                            <div className={`font-bold ${c.aiScore > 70 ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600' : c.aiScore > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {c.aiScore}/100
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {processingId === c.id ? (
                                            <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse font-bold">Processing...</span>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                {c.status === CandidateStatus.RECEIVED && (
                                                    <button 
                                                        onClick={() => handleAiScreening(c)}
                                                        disabled={isBatchProcessing}
                                                        className="p-2 hover:bg-purple-50 text-purple-600 rounded transition flex items-center gap-1 border border-transparent hover:border-purple-200"
                                                        title="Run AI Screening"
                                                    >
                                                        <BrainCircuit className="w-4 h-4" />
                                                        <span className="text-xs font-medium hidden xl:inline">Screen</span>
                                                    </button>
                                                )}
                                                {c.status === CandidateStatus.DEPARTMENT_REVIEW && (
                                                    <button 
                                                        onClick={() => handleDepartmentConfirm(c)}
                                                        className="p-2 hover:bg-green-50 text-green-600 rounded transition flex items-center gap-1 border border-transparent hover:border-green-200"
                                                        title="Approve & Invite"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                        <span className="text-xs font-medium hidden xl:inline">Approve</span>
                                                    </button>
                                                )}
                                                {c.status === CandidateStatus.INTERVIEW_SCHEDULED && (
                                                    <button 
                                                        onClick={() => handlePassInterview(c)}
                                                        className="p-2 hover:bg-green-50 text-green-600 rounded transition flex items-center gap-1 border border-transparent hover:border-green-200"
                                                        title="Mark Interview Passed"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        <span className="text-xs font-medium hidden xl:inline">Pass</span>
                                                    </button>
                                                )}
                                                {c.status === CandidateStatus.HIRED && !c.interviewReport && (
                                                     <button 
                                                        onClick={() => handleGenerateReport(c)}
                                                        className="p-2 hover:bg-indigo-50 text-indigo-600 rounded transition flex items-center gap-1 border border-transparent hover:border-indigo-200"
                                                        title="Generate AI Report"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        <span className="text-xs font-medium hidden xl:inline">Report</span>
                                                    </button>
                                                )}
                                                {c.status === CandidateStatus.HIRED && c.interviewReport && !c.isFinalized && (
                                                     <button 
                                                        onClick={() => handleFinalizeDb(c)}
                                                        className="p-2 hover:bg-slate-100 text-slate-700 rounded transition flex items-center gap-1 border border-slate-200"
                                                        title="Save Final Record"
                                                    >
                                                        <Database className="w-4 h-4" />
                                                        <span className="text-xs font-medium hidden xl:inline">Save</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                                {expandedId === c.id && (
                                    <tr className="bg-gray-50/50">
                                        <td colSpan={6} className="px-6 py-4 border-t border-gray-100 relative">
                                            {/* Decorative left border */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-ig-gradient"></div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Detailed Analysis Column */}
                                                <div className="md:col-span-1 border-r border-gray-200 pr-6">
                                                    <h4 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase mb-3 flex items-center gap-2">
                                                        <BrainCircuit className="w-3 h-3 text-purple-500" /> AI Analysis Breakdown
                                                    </h4>
                                                    {c.detailedScore ? (
                                                        <div className="space-y-1">
                                                            {renderProgressBar("Technical Skills", c.detailedScore.technical)}
                                                            {renderProgressBar("Experience Fit", c.detailedScore.experience)}
                                                            {renderProgressBar("Soft Skills", c.detailedScore.softSkills)}
                                                            {renderProgressBar("Education", c.detailedScore.education)}
                                                            <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100 text-sm text-blue-800 italic">
                                                                "{c.summary}"
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-gray-400 italic">Analysis pending...</div>
                                                    )}
                                                </div>

                                                {/* Skills & Resume Snippet */}
                                                <div className="md:col-span-1 border-r border-gray-200 pr-6">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Extracted Skills</h4>
                                                    {c.skills && c.skills.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {c.skills.map(skill => (
                                                                <span key={skill} className="px-2 py-1 bg-white border border-purple-100 text-purple-700 text-xs rounded-md shadow-sm">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-gray-400 italic mb-4">No skills extracted yet.</div>
                                                    )}
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Resume Snippet</h4>
                                                    <p className="text-xs text-gray-500 bg-white p-2 rounded border border-gray-200 font-mono line-clamp-4 shadow-inner">
                                                        {c.resumeText}
                                                    </p>
                                                </div>

                                                {/* Interview Report Column */}
                                                <div className="md:col-span-1">
                                                    <h4 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 uppercase mb-3 flex items-center gap-2">
                                                        <FileText className="w-3 h-3 text-orange-500" /> Interview Evaluation
                                                    </h4>
                                                    {c.interviewReport ? (
                                                        <div className="h-full">
                                                            <div className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200 whitespace-pre-line prose prose-sm max-w-none h-48 overflow-y-auto custom-scrollbar shadow-sm">
                                                                {c.interviewReport}
                                                            </div>
                                                            {c.isFinalized && (
                                                                <div className="mt-2 flex items-center gap-2 text-green-600 text-xs font-bold justify-end">
                                                                    <Database className="w-3 h-3" />
                                                                    Archived in Corporate DB
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="h-32 flex flex-col items-center justify-center text-gray-400 text-sm border border-dashed border-gray-300 rounded bg-gray-50/50">
                                                            {c.status === CandidateStatus.HIRED 
                                                                ? <span className="text-center text-purple-500 font-medium">Interview passed.<br/>Ready to generate report.</span>
                                                                : "Pending Interview completion."}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Pipeline;