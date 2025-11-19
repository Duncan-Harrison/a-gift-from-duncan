import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from './UserContext';

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const user = (await res.json()) as User;
      alert(`New User Registered! Welcome, ${user.username}!`);
      navigate('/sign-in');
    } catch (err) {
      alert(`Error registering user: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container">
      <h2 className="text-x1 font-bold">Register New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="m-3">
            <label htmlFor="username" className="form-label mx-2">
              Username
              <input
                required
                name="username"
                type="text"
                className="form-control"
                id="inputUsername"
              />
            </label>
            <label htmlFor="password" className="form-label mx-2">
              Password
              <input
                name="password"
                type="password"
                className="form-control"
                id="inputPassword"
              />
            </label>
          </div>
        </div>
        <button disabled={isLoading} type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
}
