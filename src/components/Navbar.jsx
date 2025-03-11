import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import axios from "axios";

const Navbar = () => {
    const user = useSelector((store)=>store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

   const handleLogout = async () => {
     try{
       await axios.post(BASE_URL+"/logout",{},{
        withCredentials:true,
       });
       dispatch(removeUser());
       return navigate("/login");
     }catch(err){
       console.log(err);
     }
   }

  return (
    <div className="navbar bg-base-200 shadow-md px-5">
      <div className="flex-1">
        {user?.isAdmin ? <Link to="/admin/dashboard" className="text-xl font-bold text-primary">Trackify</Link>
        : <Link to="/" className="text-xl font-bold text-primary">Trackify</Link>}
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {user?.isAdmin && <li><Link to="/admin/dashboard">Dashboard</Link></li>}
          <li><a onClick={handleLogout}>Logout</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar