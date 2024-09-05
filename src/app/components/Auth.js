"use client"
import  useState  from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setuser } from '@/utils/userSlice';
import { emailRegex } from '@/utils/constant';


export default function Auth() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authType, setAuthType] = useState('login');
  const dispatch = useDispatch();

  const handleAuth = async () => {
    setLoading(true);
  
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      setLoading(false);
      return;
    }
  
    if (authType === 'login') {
      const { data: user, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Logged in successfully');
        console.log(user);
  

        localStorage.setItem('userSession', JSON.stringify(user));
  

        dispatch(setuser(user));
        

        router.push('/dashboard');
      }
    } else {
      const { data: user, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ id: user.user.id, name, email }]);
  
        if (insertError) {
          toast.error(insertError.message);
        } else {

          localStorage.setItem('userSession', JSON.stringify(user));
  

          toast.success('Signup successful! Please check your email to confirm your account.');

        }
      }
    }
  
    setLoading(false);
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent>
          <h2 className="text-xl font-semibold text-center">{authType === 'login' ? 'Login' : 'Sign Up'}</h2>
          <div className="mt-6 space-y-4">
            {authType === 'signup' && (
              <div>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required 
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={handleAuth} disabled={loading}>
            {loading ? 'Loading...' : authType === 'login' ? 'Login' : 'Sign Up'}
          </Button>
          <Button variant="link" onClick={() => setAuthType(authType === 'login' ? 'signup' : 'login')}>
            {authType === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}