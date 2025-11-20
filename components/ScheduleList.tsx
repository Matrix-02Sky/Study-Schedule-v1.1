import React, { useEffect, useRef } from 'react';
import { ScheduleItem } from '../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface Props {
  items: ScheduleItem[];
  activeId: string | null;
}

export const ScheduleList: React.FC<Props> = ({ items, activeId }) => {
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeId]);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700 flex items-center gap-2">
        <Clock className="w-5 h-5" /> Full Schedule
      </div>
      <div className="overflow-y-auto max-h-[500px] p-2 space-y-2">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <div
              key={item.id}
              ref={isActive ? activeRef : null}
              className={`
                relative flex items-center p-4 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-md scale-[1.02] z-10' 
                  : 'bg-white hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200'
                }
              `}
            >
              <div className="mr-4">
                {isActive ? (
                  <CheckCircle2 className="w-6 h-6 text-blue-200" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`font-bold text-lg ${isActive ? 'text-white' : 'text-gray-800'}`}>
                    {item.activity}
                  </h3>
                  <span className={`font-mono text-sm ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                    {item.duration}
                  </span>
                </div>
                <div className={`flex justify-between items-center text-sm ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                  <span className="font-mono">{item.displayTime}</span>
                  {item.details && (
                    <span className="text-xs opacity-80 truncate max-w-[150px]">
                      {item.details}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};