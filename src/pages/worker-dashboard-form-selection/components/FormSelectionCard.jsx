import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FormSelectionCard = ({ 
  type, 
  title, 
  description, 
  icon, 
  color, 
  bgColor, 
  borderColor, 
  onClick,
  shortcut 
}) => {
  return (
    <div className={`${bgColor} ${borderColor} border-2 rounded-xl p-8 hover:shadow-lg industrial-transition cursor-pointer group`}
         onClick={onClick}>
      <div className="flex flex-col items-center text-center space-y-6">
        <div className={`w-20 h-20 ${color} rounded-full flex items-center justify-center group-hover:scale-110 industrial-transition`}>
          <Icon name={icon} size={40} className="text-white" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">{title}</h3>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
            {description}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full max-w-xs group-hover:bg-foreground group-hover:text-background"
        >
          Select {title}
        </Button>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Keyboard" size={16} />
          <span>Press "{shortcut}" for quick access</span>
        </div>
      </div>
    </div>
  );
};

export default FormSelectionCard;