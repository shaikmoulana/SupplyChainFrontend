import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Warehouse, Store, Building2, LogIn, Package, Box, Ship } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import './login.css';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return false;
    }
    if (!email.endsWith('@miraclesoft.com')) {
      setErrors(prev => ({ ...prev, email: 'Email must end with @miraclesoft.com' }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: '' }));
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return false;
    }
    if (password.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: '' }));
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      // Store login state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      onLogin();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Animation */}
        <div className="hidden lg:block">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                SmartChain AI
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Supply Chain Optimization Platform
              </p>
            </div>

            {/* Supply Chain Animation */}
            <div className="supply-chain-animation">
              <div className="supply-chain-cycle">
                {/* Supplier */}
                <div className="stage stage-1">
                  <div className="stage-icon">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="stage-label">Supplier</p>
                </div>

                {/* Warehouse */}
                <div className="stage stage-2">
                  <div className="stage-icon">
                    <Warehouse className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="stage-label">Warehouse</p>
                </div>

                {/* Order */}
                <div className="stage stage-3">
                  <div className="stage-icon">
                    <Package className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="stage-label">Order</p>
                </div>

                {/* Packing */}
                <div className="stage stage-4">
                  <div className="stage-icon">
                    <Box className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="stage-label">Packing</p>
                </div>

                {/* Shipping */}
                <div className="stage stage-5">
                  <div className="stage-icon">
                    <Ship className="w-6 h-6 text-cyan-600" />
                  </div>
                  <p className="stage-label">Shipping</p>
                </div>

                {/* Customer */}
                <div className="stage stage-6">
                  <div className="stage-icon">
                    <Store className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="stage-label">Customer</p>
                </div>

                {/* Connection Lines */}
                <svg className="connection-lines" viewBox="0 0 500 500">
                  <circle cx="250" cy="250" r="200" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" className="cycle-path" />
                </svg>

                {/* Animated Truck */}
                <div className="truck-cycle-container">
                  <Truck className="truck-cycle-icon" />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">AI</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Powered</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">7-Day</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Forecasting</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">Real-time</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Analytics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <LogIn className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Sign in to access your supply chain dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@miraclesoft.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateEmail(email)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => validatePassword(password)}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Minimum 8 characters required
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    Demo Credentials: <br />
                    <span className="font-mono">demo@miraclesoft.com</span> / 
                    <span className="font-mono"> password123</span>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Mobile - Show title */}
          <div className="lg:hidden text-center mt-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              SmartChain AI
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Supply Chain Optimization Platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}