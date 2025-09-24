import { useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMessage } from "../../contexts/MessageContext";
import { useNavigate, useLocation } from "react-router-dom";



function AuthPage() {
  const [mode, setMode] = useState('login');
  const { login, register, loading } = useAuth();
  const { showMessage } = useMessage();
  const navigate = useNavigate();
  const location = useLocation();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();

  // Get the location the user tried to access before auth
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = emailRef.current.value; // Actually username field
    const password = passwordRef.current.value;
    if (mode === 'register') {
      const name = nameRef.current.value;
      const confirm = confirmRef.current.value;
      if (password !== confirm) {
        showMessage("Passwords do not match", "error");
        return;
      }
      const email = username; // Not ideal, but matches current UI
      const res = await register(username, name, email, password);
      if (res.success) {
        showMessage("Registration successful!", "success");
        navigate(from, { replace: true });
      } else {
        showMessage(res.error || "Registration failed", "error");
      }
    } else {
      // For login, username and password
      const res = await login(username, password);
      if (res.success) {
        showMessage("Login successful!", "success");
        navigate(from, { replace: true });
      } else {
        showMessage(res.error || "Login failed", "error");
      }
    }
  };

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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
            {mode === 'register' && (
              <input ref={nameRef} type="text" placeholder="Name" className="input input-bordered w-full" required />
            )}
            <input ref={emailRef} type="text" placeholder="Username" className="input input-bordered w-full" required />
            <input ref={passwordRef} type="password" placeholder="Password" className="input input-bordered w-full" required />
            {mode === 'register' && (
              <input ref={confirmRef} type="password" placeholder="Confirm Password" className="input input-bordered w-full" required />
            )}
            <button className="btn btn-primary mt-2" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
