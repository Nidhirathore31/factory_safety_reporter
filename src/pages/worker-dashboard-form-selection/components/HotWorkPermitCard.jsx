import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HotWorkPermitCard = ({
  title = "Hot Work Permit",
  description = "Required for operations involving open flames, sparks, or heat-producing work such as welding or grinding.",
  icon = "Flame",
  color = "bg-destructive",
  bgColor = "bg-destructive/5",
  borderColor = "border-destructive/20"
}) => {
  const navigate = useNavigate();

  return (
    <div 
      className={`${bgColor} ${borderColor} border-2 rounded-xl p-8 hover:shadow-lg industrial-transition cursor-pointer group`}
      onClick={() => navigate('/hot-work-permit')}
    >
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
          Open Permit
        </Button>
      </div>
    </div>
  );
};

export default HotWorkPermitCard;
