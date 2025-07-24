import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-gray-900 to-gray-800">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-emerald-400">
        <h1 className="text-4xl font-extrabold text-emerald-400 mb-6 drop-shadow">Urban Noise Pollution Platform</h1>
        <p className="text-lg text-gray-200 mb-8">Welcome! Please select your login type:</p>
        <div className="flex flex-col gap-6">
          <button
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg shadow transition text-lg"
            onClick={() => navigate("/login?role=user")}
          >
            Login as User
          </button>
          <button
            className="bg-gray-800 hover:bg-gray-900 text-emerald-400 font-semibold py-3 rounded-lg shadow transition text-lg border border-emerald-400"
            onClick={() => navigate("/login?role=admin")}
          >
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing; 