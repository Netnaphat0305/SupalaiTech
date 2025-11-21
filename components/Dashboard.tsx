import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Candidate, CandidateStatus } from '../types';

interface DashboardProps {
    candidates: Candidate[];
}

const Dashboard: React.FC<DashboardProps> = ({ candidates }) => {
  // Instagram Brand Palette
  const COLORS = {
      purple: '#833ab4',
      pink: '#fd1d1d',
      orange: '#f56040',
      yellow: '#fcb045',
      blue: '#405de6'
  };

  const statusData = [
    { name: 'Received', value: candidates.filter(c => c.status === CandidateStatus.RECEIVED).length, color: '#94a3b8' },
    { name: 'Review', value: candidates.filter(c => c.status === CandidateStatus.DEPARTMENT_REVIEW).length, color: COLORS.blue },
    { name: 'Interview', value: candidates.filter(c => c.status === CandidateStatus.INTERVIEW_SCHEDULED).length, color: COLORS.orange },
    { name: 'Hired', value: candidates.filter(c => c.status === CandidateStatus.HIRED).length, color: COLORS.pink },
    { name: 'Rejected', value: candidates.filter(c => c.status === CandidateStatus.REJECTED).length, color: '#ef4444' },
  ];

  const skillCounts: Record<string, number> = {};
  candidates.forEach(c => {
    c.skills?.forEach(s => {
        skillCounts[s] = (skillCounts[s] || 0) + 1;
    });
  });

  const skillData = Object.entries(skillCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 skills

  const pieColors = [COLORS.blue, COLORS.purple, COLORS.pink, COLORS.orange, COLORS.yellow];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-lg shadow-purple-500/5 border border-purple-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-ig-gradient"></div>
            <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase tracking-wider mb-6">Pipeline Volume</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#64748b'}} />
                        <YAxis hide />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                            cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg shadow-orange-500/5 border border-orange-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-ig-gradient"></div>
             <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 uppercase tracking-wider mb-6">Top Detected Skills (AI Analyzed)</h3>
             {skillData.length > 0 ? (
                <div className="h-64">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={skillData}
                                innerRadius={65}
                                outerRadius={85}
                                paddingAngle={4}
                                dataKey="count"
                                stroke="none"
                            >
                                {skillData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="flex justify-center gap-4 flex-wrap text-xs text-gray-600 mt-2">
                        {skillData.map((s, i) => (
                            <span key={s.name} className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{backgroundColor: pieColors[i % pieColors.length]}}></div>
                                <span className="font-medium">{s.name}</span>
                            </span>
                        ))}
                     </div>
                </div>
             ) : (
                 <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                     Not enough data to analyze trends.
                 </div>
             )}
        </div>
    </div>
  );
};

export default Dashboard;