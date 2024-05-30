import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWindowSize } from "@uidotdev/usehooks";
import { images } from "../../../../constants";
import { AiFillDashboard, AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import NavItem from "./NavItem";
import NavItemCollapse from "./NavItemCollapse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { createPost } from "../../../../services/index/post";

const Header = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const userState = useSelector(state=>state.user)
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [activeNavName, setActiveNavName] = useState("dashboard");
  const windowSize = useWindowSize();
  const { mutate: mutateCreatePost, isLoading: isLoadingCreatePost } = useMutation({
    mutationFn: ({  token }) => {
      return createPost({ token });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["posts"]);
      toast.success("Post  is created, edit that now!");
      console.log(data)
      navigate(`/admin/posts/manage/edit/${data.slug}`)
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });
  const toggleMenuHandler = () => {
    setIsMenuActive(!isMenuActive);
  };
  useEffect(() => {
    if (windowSize.width < 1024) {
      setIsMenuActive(false);
    } else {
      setIsMenuActive(true);
    }
  }, [windowSize.width]);
  
  const handleCreateNewPost = ({token}) => {
  mutateCreatePost({token})
}
  return (
    <header
      className="flex h-fit w-full items-center justify-between p-4 
    lg:h-full lg:max-w-[300px] lg:flex-col lg:items-start lg:justify-start lg:p-0"
    >
      {/* logo */}
      <Link to="/">
        <img src={images.Logo} alt="Logo" className="w-16 lg:hidden"></img>
      </Link>

      {/* menu burger icon */}
      <div className="cursor-pointer lg:hidden">
        {isMenuActive ? (
          <AiOutlineClose className="w-6 h-6 " onClick={toggleMenuHandler} />
        ) : (
          <AiOutlineMenu className="w-6 h-6 " onClick={toggleMenuHandler} />
        )}
      </div>

      {/* sidebar container */}
      {isMenuActive && (
        <div className="fixed inset-0 lg:static lg:h-full">
          {/* underlay */}
          <div
            className="fixed inset-0 bg-black opacity-50 lg:hidden"
            onClick={toggleMenuHandler}
          />
          {/* sidebar */}
          <div
            className="fixed top-0 bottom-0 left-0 z-50 w-3/4 overflow-y-auto
             bg-white p-4 lg:static lg:h-full lg:w-full lg:p-6 "
          >
            <Link to="/">
              <img src={images.Logo} alt="Logo" className="w-16" />
            </Link>
            <h4 className="mt-10 font-bold text-[#C7C7C7]">MAIN MENU</h4>
            {/* menu items */}
            <div className="mt-6 flex flex-col gap-y-[0.563rem]">
              <NavItem
                title="Dashbord"
                link="/admin"
                icon={<AiFillDashboard className="text-xl" />}
                name="dashboard"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />
              <NavItem
                title="Comment"
                link="/admin/comments"
                icon={<FaComment className="text-xl" />}
                name="comment"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />

              <NavItemCollapse
                title="Posts"
                icon={<MdDashboard className="text-xl" />}
                name="posts"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              >
                <Link to="/admin/posts/manage"> Manage all posts</Link>
                {/* <Link to="/admin/posts/new" > New</Link> */}
                <button disabled={isLoadingCreatePost } className="text-start disabled:opacity-60 disabled:cursor-not-allowed" onClick={() => handleCreateNewPost({ token: userState.userInfo.token })}>Add New post</button>
              </NavItemCollapse>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
