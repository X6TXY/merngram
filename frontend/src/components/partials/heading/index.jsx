import axios from "axios";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";

export const Heading = () => {
  const { isAuthenticated, userData, logout } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/?search=${search}`);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (search.trim()) {
      axios
        .get(`http://localhost:8000/api/posts/get-posts?search=${search}`)
        .then((response) => {
          setSearchResults(response.data.posts);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setSearchResults([]);
    }
  }, [search]);

  return (
    <div className="navbar bg-[#d9d9d9]">
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost text-xl">
          <span className="p-0 m-0 inline">M</span>
          <span className="text-red-700 p-0 m-0 inline">E</span>
          <span className="p-0 m-0 inline text-yellow-400">R</span>
          <span className="p-0 m-0 inline text-blue-600">N</span>
          <span className="p-0 m-0 inline text-green-600">gram</span>
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control relative">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-md z-50"
            >
              {searchResults.map((result) => (
                <Link
                  key={result._id}
                  to={`/post/${result._id}`}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => setSearchResults([])}
                >
                  {result.title}
                </Link>
              ))}
            </motion.div>
          )}
        </div>
        <div className="flex-none gap-2">
          <Link to={"/chat"} className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              id="message"
              className="w-6 h-6"
            >
              <g>
                <g>
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="16" cy="12" r="1"></circle>
                  <circle cx="8" cy="12" r="1"></circle>
                  <path d="M19.07 4.93a10 10 0 0 0-16.28 11 1.06 1.06 0 0 1 .09.64L2 20.8a1 1 0 0 0 .27.91A1 1 0 0 0 3 22h.2l4.28-.86a1.26 1.26 0 0 1 .64.09 10 10 0 0 0 11-16.28zm.83 8.36a8 8 0 0 1-11 6.08 3.26 3.26 0 0 0-1.25-.26 3.43 3.43 0 0 0-.56.05l-2.82.57.57-2.82a3.09 3.09 0 0 0-.21-1.81 8 8 0 0 1 6.08-11 8 8 0 0 1 9.19 9.19z"></path>
                </g>
              </g>
            </svg>
            Message
          </Link>
        </div>
        <div>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                id="logout"
                className="w-6 h-6"
              >
                <g>
                  <g>
                    <rect
                      width="24"
                      height="24"
                      opacity="0"
                      transform="rotate(90 12 12)"
                    ></rect>
                    <path d="M7 6a1 1 0 0 0 0-2H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2H6V6zM20.82 11.42l-2.82-4a1 1 0 0 0-1.39-.24 1 1 0 0 0-.24 1.4L18.09 11H10a1 1 0 0 0 0 2h8l-1.8 2.4a1 1 0 0 0 .2 1.4 1 1 0 0 0 .6.2 1 1 0 0 0 .8-.4l3-4a1 1 0 0 0 .02-1.18z"></path>
                  </g>
                </g>
              </svg>
              Logout
            </button>
          ) : (
            <Link to={"/auth"} className="btn btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                id="login"
                className="h-6 w-6"
              >
                <g>
                  <g>
                    <rect
                      width="24"
                      height="24"
                      opacity="0"
                      transform="rotate(-90 12 12)"
                    ></rect>
                    <path d="M19 4h-2a1 1 0 0 0 0 2h1v12h-1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zM11.8 7.4a1 1 0 0 0-1.6 1.2L12 11H4a1 1 0 0 0 0 2h8.09l-1.72 2.44a1 1 0 0 0 .24 1.4 1 1 0 0 0 .58.18 1 1 0 0 0 .81-.42l2.82-4a1 1 0 0 0 0-1.18z"></path>
                  </g>
                </g>
              </svg>
              Login
            </Link>
          )}
        </div>
        {isAuthenticated && userData && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="User avatar" src={userData.profilepicture || ""} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to={"/profile"} className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to={"/activity"}>Activity</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
