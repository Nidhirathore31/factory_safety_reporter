import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SafetyTipCard = ({ tips }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips?.length);
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(interval);
  }, [tips?.length]);

  const currentTip = tips?.[currentTipIndex];

  const nextTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips?.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex - 1 + tips?.length) % tips?.length);
  };

  return (
    // <div className="bg-card rounded-lg border border-border p-6 industrial-shadow">
    //   <div className="flex items-center justify-between mb-4">
    //     <div className="flex items-center space-x-2">
    //       <Icon name="Lightbulb" size={20} className="text-warning" />
    //       <h3 className="text-lg font-semibold text-foreground">Safety Tip</h3>
    //     </div>
    //     <div className="flex items-center space-x-2">
    //       <button 
    //         onClick={prevTip}
    //         className="p-1 hover:bg-muted rounded industrial-transition"
    //       >
    //         <Icon name="ChevronLeft" size={16} className="text-muted-foreground" />
    //       </button>
    //       <span className="text-xs text-muted-foreground">
    //         {currentTipIndex + 1} of {tips?.length}
    //       </span>
    //       <button 
    //         onClick={nextTip}
    //         className="p-1 hover:bg-muted rounded industrial-transition"
    //       >
    //         <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
    //       </button>
    //     </div>
    //   </div>
    //   <div className="space-y-3">
    //     <h4 className="font-medium text-foreground">{currentTip?.title}</h4>
    //     <p className="text-sm text-muted-foreground leading-relaxed">
    //       {currentTip?.description}
    //     </p>
        
    //     {currentTip?.category && (
    //       <div className="flex items-center space-x-2">
    //         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
    //           <Icon name="Tag" size={12} className="mr-1" />
    //           {currentTip?.category}
    //         </span>
    //       </div>
    //     )}
    //   </div>
    //   <div className="flex space-x-1 mt-4">
    //     {tips?.map((_, index) => (
    //       <div
    //         key={index}
    //         className={`h-1 rounded-full flex-1 ${
    //           index === currentTipIndex ? 'bg-accent' : 'bg-muted'
    //         }`}
    //       />
    //     ))}
    //   </div>
    // </div>
    <></>
  );
};

export default SafetyTipCard;