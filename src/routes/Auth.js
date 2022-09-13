import { useState } from 'react';
import { createUser, signInUser, GoogleAuthProvider, GithubAuthProvider, authService, signInWithPopup } from 'fbase';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');
  const toggleAccount = () => setNewAccount((prev) => !prev);

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      let data;
      if (newAccount) {
        // create account
        data = await createUser(email, password);
      } else {
        // log in
        data = await signInUser(email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === 'google') {
      provider = new GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new GithubAuthProvider();
    }
    try {
      await signInWithPopup(authService, provider);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name='email' type='email' placeholder='Email' value={email} onChange={onChange} required />
        <input name='password' type='password' placeholder='Password' value={password} onChange={onChange} required />
        <button type='submit'>{newAccount ? 'Create Account' : 'Log In'}</button>
        <div>{error}</div>
      </form>
      <button onClick={toggleAccount}>{newAccount ? 'Sign In' : 'Create Account'}</button>
      <div>
        <button type='button' onClick={onSocialClick} name='google'>
          Continue with Google
        </button>
        <button type='button' onClick={onSocialClick} name='github'>
          Continue with Github
        </button>
      </div>
    </div>
  );
};
export default Auth;
