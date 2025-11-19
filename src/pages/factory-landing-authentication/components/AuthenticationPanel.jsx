import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const AuthenticationPanel = ({ onAuthenticate, isLoading }) => {
  const [authMethod, setAuthMethod] = useState('sso');
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    mfaCode: ''
  });
  const [showMFA, setShowMFA] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [errors, setErrors] = useState({});

  const mockCredentials = {
    worker: { username: 'worker@aspen.com', password: 'Worker123!' },
    supervisor: { username: 'supervisor@aspen.com', password: 'Super123!' },
    // admin: { username: 'admin@aspen.com', password: 'Admin123!', mfa: '123456' }
  };

  const handleCredentialChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCredentials = () => {
    const newErrors = {};
    
    if (!credentials?.username) {
      newErrors.username = 'Username is required';
    }
    
    if (!credentials?.password) {
      newErrors.password = 'Password is required';
    }
    
    if (showMFA && !credentials?.mfaCode) {
      newErrors.mfaCode = 'MFA code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleLogin = async () => {
    if (!validateCredentials()) return;

    // Check credentials against mock data
    const role = Object.keys(mockCredentials)?.find(role => 
      mockCredentials?.[role]?.username === credentials?.username &&
      mockCredentials?.[role]?.password === credentials?.password
    );

    if (!role) {
      setErrors({ general: 'Invalid username or password. Use: worker@aspen.com/Worker123!, supervisor@aspen.com/Super123!, or admin@aspen.com/Admin123!' });
      return;
    }

    // Check if admin role requires MFA
    if (role === 'admin' && !showMFA) {
      setShowMFA(true);
      setSelectedRole(role);
      return;
    }

    // Validate MFA for admin
    if (role === 'admin' && showMFA) {
      if (credentials?.mfaCode !== mockCredentials?.admin?.mfa) {
        setErrors({ mfaCode: 'Invalid MFA code. Use: 123456' });
        return;
      }
    }

    onAuthenticate(role);
  };

  const handleSSOLogin = (provider) => {
    // Simulate SSO login - in real app would redirect to SSO provider
    onAuthenticate('worker');
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg industrial-shadow p-8 w-full max-w-md">
      <div className="text-center mb-8">
        
        <div className="w-20 h-20 rounded-lg flex items-center justify-center mx-auto mb-4">
  <img
    src="/assets/images/logo.png"
    alt="Logo"
    className="w-16 h-16 object-contain"
  />
</div>

        <h2 className="text-2xl font-bold text-foreground mb-2">Aspen planers ltd.</h2>
        <p className="text-muted-foreground">Safety Management System</p>
      </div>
      {/* Authentication Method Selection */}
      <div className="mb-6">
        <div className="flex space-x-2 p-1 bg-muted rounded-lg">
          {/* <button
            onClick={() => setAuthMethod('sso')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium industrial-transition ${
              authMethod === 'sso' ?'bg-card text-foreground industrial-shadow' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Shield" size={16} className="inline mr-2" />
            SSO Login
          </button> */}
          <button
            onClick={() => setAuthMethod('manual')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium industrial-transition ${
              authMethod === 'manual' ?'bg-card text-foreground industrial-shadow' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="User" size={16} className="inline mr-2" />
            Login
          </button>
        </div>
      </div>
      {/* {authMethod === 'sso' ? (
        <div className="space-y-4">
          <Button
            variant="outline"
            fullWidth
            onClick={() => handleSSOLogin('microsoft')}
            iconName="Building"
            iconPosition="left"
            disabled={isLoading}
          >
            Sign in with Microsoft
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => handleSSOLogin('google')}
            iconName="Chrome"
            iconPosition="left"
            disabled={isLoading}
          >
            Sign in with Google
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => handleSSOLogin('okta')}
            iconName="Key"
            iconPosition="left"
            disabled={isLoading}
          >
            Sign in with Okta
          </Button>
        </div>
      ) : ( */}
        <div className="space-y-4">
          {errors?.general && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-error text-sm">{errors?.general}</p>
            </div>
          )}

          <Input
            label="Username"
            type="email"
            placeholder="Enter your email"
            value={credentials?.username}
            onChange={(e) => handleCredentialChange('username', e?.target?.value)}
            onKeyPress={handleKeyPress}
            error={errors?.username}
            required
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={credentials?.password}
            onChange={(e) => handleCredentialChange('password', e?.target?.value)}
            onKeyPress={handleKeyPress}
            error={errors?.password}
            required
            disabled={isLoading}
          />

          {showMFA && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center mb-3">
                <Icon name="Shield" size={20} className="text-warning mr-2" />
                <span className="font-medium text-foreground">Multi-Factor Authentication Required</span>
              </div>
              <Input
                label="MFA Code"
                type="text"
                placeholder="Enter 6-digit code"
                value={credentials?.mfaCode}
                onChange={(e) => handleCredentialChange('mfaCode', e?.target?.value)}
                onKeyPress={handleKeyPress}
                error={errors?.mfaCode}
                required
                disabled={isLoading}
                maxLength={6}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
          )}

          <Button
            variant="default"
            fullWidth
            onClick={handleLogin}
            loading={isLoading}
            iconName="LogIn"
            iconPosition="left"
          >
            {showMFA ? 'Verify & Sign In' : 'Sign In'}
          </Button>

          {showMFA && (
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setShowMFA(false);
                setCredentials(prev => ({ ...prev, mfaCode: '' }));
                setErrors({});
              }}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Back to Login
            </Button>
          )}
        </div>
      {/* )} */}
      {/* Security Indicators */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Icon name="Shield" size={14} className="mr-1 text-success" />
            SSL Secured
          </div>
          <div className="flex items-center">
            <Icon name="CheckCircle" size={14} className="mr-1 text-success" />
            OSHA Compliant
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPanel;