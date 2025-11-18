import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentSubmissionsTable = ({ submissions }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-warning text-warning-foreground', icon: 'Clock' },
      'approved': { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      'rejected': { color: 'bg-error text-error-foreground', icon: 'XCircle' },
      'under_review': { color: 'bg-accent text-accent-foreground', icon: 'Eye' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{status?.replace('_', ' ')}</span>
      </span>
    );
  };

  const getFormTypeColor = (type) => {
    return type === 'operational' ? 'text-success' : 'text-warning';
  };

  return (
    <div className="bg-card rounded-lg border border-border industrial-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Submissions</h3>
          <Icon name="History" size={20} className="text-muted-foreground" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Form Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Supervisor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {submissions?.map((submission) => (
              <tr key={submission?.id} className="hover:bg-muted/50 industrial-transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={submission?.type === 'operational' ? 'Settings' : (submission?.type === 'hot work permit' ? 'Flame' : 'Wrench')} 
                      size={16} 
                      className={getFormTypeColor(submission?.type)}
                    />
                    <span className="text-sm font-medium text-foreground capitalize">
                      {submission?.type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">{submission?.date}</div>
                  <div className="text-xs text-muted-foreground">{submission?.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(submission?.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">{submission?.supervisor}</div>
                  {submission?.feedback && (
                    <div className="text-xs text-muted-foreground truncate max-w-32">
                      {submission?.feedback}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-accent hover:text-accent/80 industrial-transition">
                    <Icon name="Eye" size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {submissions?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No recent submissions found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your form submissions will appear here once you start reporting
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentSubmissionsTable;