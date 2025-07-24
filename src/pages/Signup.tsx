import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Sign Up Disabled</h2>
        <p className="mb-4 text-gray-700">Signup is disabled. Please use the admin credentials to <Link to="/login" className="text-blue-500 hover:underline">login</Link>.</p>
      </div>
    </div>
  );
};

export default Signup; 