import React from 'react';

function AuthForm() {
  return (
    <form className="flex flex-col gap-4 w-full max-w-xs">
      <input type="email" placeholder="Email" className="input input-bordered" />
      <input type="password" placeholder="Password" className="input input-bordered" />
      <button className="btn btn-primary" type="submit">Sign In</button>
    </form>
  );
}

export default AuthForm;
