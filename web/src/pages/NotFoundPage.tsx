import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <div className="text-center">
      <h1>Page not found</h1>
      <Link to="/">Back to home</Link>
    </div>
  );
}

export default NotFoundPage;
