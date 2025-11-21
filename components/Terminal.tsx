import React, { useEffect, useRef } from 'react';
import { SystemLog } from '../types';
import { Terminal as TerminalIcon, Circle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface TerminalProps {
  logs: SystemLog[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'WARNING': return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      case 'ERROR': return <XCircle className="w-3 h-3 text-red-500" />;
      default: return <Circle className="w-3 h-3 text-blue-400" />;
    }
  };

  const getColor = (source: string) => {
    switch (source) {
      case 'SELENIUM': return 'text-purple-400';
      case 'LANGCHAIN': return 'text-pink-400';
      case 'OLLAMA': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden shadow-2xl relative bg-[#1e1e1e] group">
        {/* Animated Gradient Border Effect */}
        <div className="absolute inset-0 bg-ig-gradient opacity-50 group-hover:opacity-100 transition-opacity duration-500 -z-10 p-[1px]"></div>
        
        {/* Inner Content */}
        <div className="flex flex-col h-full bg-[#1e1e1e] m-[1px] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <TerminalIcon className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-mono text-gray-300">CORE_AUTOMATION_PROCESS</span>
            </div>
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
          </div>
          <div 
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto font-mono text-xs md:text-sm space-y-2 terminal-scroll"
          >
            {logs.length === 0 && (
              <div className="text-gray-600 italic">System ready. Waiting for tasks...</div>
            )}
            {logs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 hover:bg-white/5 p-1 rounded transition-colors">
                <span className="text-gray-500 shrink-0 min-w-[70px]">{log.timestamp}</span>
                <span className={`font-bold shrink-0 min-w-[80px] ${getColor(log.source)}`}>{log.source}</span>
                <div className="mt-0.5">{getIcon(log.type)}</div>
                <span className="text-gray-300 break-all">{log.message}</span>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default Terminal;