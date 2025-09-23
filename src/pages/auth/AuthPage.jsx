import { useState } from "react";



function AuthPage() {
  const [mode, setMode] = useState('login');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body">
          <div role="tablist" className="tabs tabs-boxed mb-4">
            <button
              role="tab"
              className={`tab flex-1 ${mode === 'login' ? 'tab-active' : ''}`}
              onClick={() => setMode('login')}
              type="button"
            >
              Login
            </button>
            <button
              role="tab"
              className={`tab flex-1 ${mode === 'register' ? 'tab-active' : ''}`}
              onClick={() => setMode('register')}
              type="button"
            >
              Register
            </button>
          </div>
          <h2 className="card-title justify-center mb-2">{mode === 'login' ? 'Login to QuizUp' : 'Register for QuizUp'}</h2>
          <form className="flex flex-col gap-4">
            {mode === 'register' && (
              <input type="text" placeholder="Name" className="input input-bordered w-full" required />
            )}
            <input type="email" placeholder="Email" className="input input-bordered w-full" required />
            <input type="password" placeholder="Password" className="input input-bordered w-full" required />
            {mode === 'register' && (
              <input type="password" placeholder="Confirm Password" className="input input-bordered w-full" required />
            )}
            <button className="btn btn-primary mt-2" type="submit">
              {mode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
