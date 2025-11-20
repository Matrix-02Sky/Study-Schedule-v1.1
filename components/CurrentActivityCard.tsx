import React from 'react';
import { ScheduleItem } from '../types';
import { BookOpen, Coffee, Moon, RefreshCw, Clock } from 'lucide-react';

interface Props {
  item: ScheduleItem | null;
  nextItem: ScheduleItem | null;
}

const getActivityIcon = (type: ScheduleItem['type']) => {
  switch (type) {
    case 'study': return <BookOpen className="w-8 h-8 text-blue-500" />;
    case 'break': return <Coffee className="w-8 h-8 text-orange-500" />;
    case 'sleep': return <Moon className="w-8 h-8 text-indigo-500" />;
    case 'routine': return <RefreshCw className="w-8 h-8 text-green-500" />;
    default: return <Clock className="w-8 h-8 text-gray-500" />;
  }
};

export const CurrentActivityCard: React.FC<Props> = ({ item, nextItem }) => {
  if (!item) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 text-center border border-gray-100">
        <p className="text-gray-500 text-lg">No scheduled activity currently.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 border-l-8 border-blue-600 transform transition-all animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wide">
              Now Happening
            </span>
            <span className="text-sm text-gray-500 font-mono">
              {item.displayTime}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            {item.activity}
          </h2>
          {item.details && (
            <p className="text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg inline-block text-sm">
              {item.details}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          {getActivityIcon(item.type)}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Duration: <span className="font-medium text-gray-900">{item.duration}</span>
        </div>
        {nextItem && (
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase">Up Next</p>
            <p className="text-sm font-medium text-gray-700">{nextItem.activity}</p>
          </div>
        )}
      </div>
    </div>
  );
};