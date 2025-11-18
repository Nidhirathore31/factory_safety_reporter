import React from 'react';
import Icon from '../../../components/AppIcon';

const FactoryHeader = ({ factoryName = "Aspen planers ltd. - Plant A", isOnline = true }) => {
  const currentDate = new Date()?.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date()?.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="text-center mb-12">
      {/* Factory Name */}
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
        {factoryName}
      </h1>
      
      {/* Factory Status and Info */}
      <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 mb-6">
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success' : 'bg-error'}`}></div>
          <span className="text-muted-foreground font-medium">
            {isOnline ? 'Systems Online' : 'Offline Mode'}
          </span>
        </div>

        {/* Current Date */}
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <span className="text-muted-foreground">{currentDate}</span>
        </div>

        {/* Current Time */}
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} className="text-muted-foreground" />
          <span className="text-muted-foreground">{currentTime}</span>
        </div>
      </div>

      {/* Shift Information */}
      <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-lg">
        <Icon name="Users" size={16} />
        <span className="font-medium">Shift A - Day Shift Active</span>
      </div>
    </div>
  );
};

export default FactoryHeader;