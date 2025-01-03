import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import Tabs from "../components/Tabs";
import Dialog from "../components/Dialog";
import Button from "../components/Button";
import Add from "../icons/Add";
import Share from "../icons/Share";
import Logout from "../icons/Logout";
import { logout } from "../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store/store";
import { toggleDialog } from "../slices/dialogTriggers";
import { toggleShareDialog } from "../slices/dialogTriggers";
import ShareDialog from "../components/ShareDialog";
import toast, { Toaster } from "react-hot-toast";

const Layout = ({setActiveTab,activeTab}:{setActiveTab:Dispatch<SetStateAction<string>>,activeTab:string}) => {
  const [active, setActive] = useState("Home");

  const dialog = useSelector((state: RootState) => state.trigger.dialog);
  const shareDialog = useSelector(
    (state: RootState) => state.trigger.shareDialog,
  );
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    localStorage.setItem("token", "");
    toast.success("Logged Out");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  useEffect(() => {
    if (token === "" || !token) {
      navigate("/");
    }
  });
  return (
    <div className="w-[100vw]  h-[100vh] overflow-hidden flex font-inter">
      {dialog && <Dialog />}
      {shareDialog && <ShareDialog />}
      <SideBar active={active} setActive={setActive} />
      <div className="border-y border-r w-full h-full border-y-black-700 border-r-black-700 text-black-300">
        <div className="w-full h-[70px] flex items-center md:justify-between justify-evenly gap-2 lg:px-8 md:px-4">
          <Tabs setActiveTab={setActiveTab} activeTab={activeTab}/>
          <div className="md:flex gap-5 hidden">
            <span onClick={() => dispatch(toggleDialog())}>
              <Button text={"Add content"} icon={<Add />} />
            </span>
            <span onClick={()=>{dispatch(toggleShareDialog())}}>
              <Button text={"Share content"} icon={<Share />} />
            </span>
            <span onClick={handleLogout}>
              <Button text="Logout" icon={<Logout />}/>
            </span>
          </div>
          <span onClick={handleLogout} className="md:hidden">
            <Logout />
          </span>
        </div>
        <span onClick={()=>{dispatch(toggleShareDialog())}} className="absolute z-50 bottom-32 right-12 md:hidden">
              <div className="w-[60px] border-4 rounded-full p-2">
              <Share />
              </div>
            </span>
         <span onClick={() => dispatch(toggleDialog())} className="absolute z-50 bottom-10 right-10 md:hidden">
               <div className="w-[70px]">
               <Add />
               </div>
          </span>
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;
