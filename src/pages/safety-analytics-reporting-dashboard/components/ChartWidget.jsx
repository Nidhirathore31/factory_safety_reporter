import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const ChartWidget = ({ title, type, data, height = 300, showLegend = true, onExpand }) => {
  const COLORS = ['#2E7D32', '#E65100', '#1565C0', '#D32F2F', '#388E3C', '#F57C00'];

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="name" stroke="#616161" fontSize={12} />
              <YAxis stroke="#616161" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="value" fill="#2E7D32" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="name" stroke="#616161" fontSize={12} />
              <YAxis stroke="#616161" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px'
                }} 
              />
              <Line type="monotone" dataKey="value" stroke="#2E7D32" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div className="flex items-center justify-center h-full text-muted-foreground">No chart type specified</div>;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 industrial-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="flex items-center space-x-2">
          {onExpand && (
            <button
              onClick={onExpand}
              className="p-2 hover:bg-muted rounded-lg industrial-transition"
              title="Expand chart"
            >
              <Icon name="Expand" size={16} />
            </button>
          )}
          <button className="p-2 hover:bg-muted rounded-lg industrial-transition" title="More options">
            <Icon name="MoreVertical" size={16} />
          </button>
        </div>
      </div>
      <div className="w-full">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartWidget;