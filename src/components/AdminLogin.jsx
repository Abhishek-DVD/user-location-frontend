import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const AdminLogin = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/admin/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/admin/dashboard");
    } catch (error) {
      setError(error?.response?.data || "Something went wrong!!");
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Admin Login</h2>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Email ID</span>
              </div>
              <input
                type="text"
                value={emailId}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs my-2 relative">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                className="input input-bordered w-full max-w-xs pr-10"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute top-12 right-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </label>
            <p className="text-red-500">{error}</p>
            <div className="card-actions justify-center m-2">
              <button className="btn btn-primary" onClick={handleLogin}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
