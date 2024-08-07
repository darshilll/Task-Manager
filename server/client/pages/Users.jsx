/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-undef */
import { useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { getInitials } from "../utils";
import clsx from "clsx";
import ConfirmatioDialog, { UserAction } from "../components/task/Dialogs";
import AddUser from "../components/task/AddUser";
import { toast } from "sonner";
import {
  useDeleteUserMutation,
  useGetTeamListQuery,
  useUserActionMutation,
} from "../redux/slices/userApiSlice";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  const { data, refetch } = useGetTeamListQuery();

  // console.log(error, data);
  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  const userActionHandler = async () => {
    try {
      const result = await userAction({
        isActive: !selected?.isActive,
        id: selected?._id,
      });
      refetch();

      toast.success(result.data.message);
      setSelected(null);
      setTimeout(() => {
        // setOpen(false);
        setOpenAction(false);
      }, 500);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const deleteHandler = async () => {
    try {
      const result = await deleteUser(selected);

      refetch();

      toast.success("Deleted successfully");
      setSelected(null);
      setTimeout(() => {
        setOpenDialog(false);
      }, 500);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  const userStatusClick = (el) => {
    setSelected(el);
    setOpenAction(true);
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-sm lg:text-base text-left">
        <th className="py-2">Full Name</th>
        <th className="py-2">Email</th>
        <th className="py-2">Title</th>
        <th className="py-2">Role</th>
        <th className="py-2">Active</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-200 text-gray-800 hover:bg-gray-400/10 text-sm lg:text-base">
      <td className="py-3">
        <div className="flex items-center gap-2 text-black">
          <div className="w-8 h-8 p-2 lg:w-10 lg:h-10 rounded-full text-white flex items-center justify-center text-sm bg-black">
            <span className="text-xs md:text-sm text-center">
              {getInitials(user.name)}
            </span>
          </div>
          <p>{user.name}</p>
        </div>
      </td>

      <td className="py-3 ">{user.email || "user@gmail.com"}</td>
      <td className="p-2 capitalize ">{user.role}</td>
      <td className="p-2 capitalize">{user.title}</td>

      <td>
        <button
          onClick={() => userStatusClick(user)}
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            user?.isActive ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </button>
      </td>
      <td className="py-3 flex justify-end">
        <FaEdit
          onClick={() => editClick(user)}
          className="mt-2 ml-2"
          size={20}
        />

        <MdDelete
          onClick={() => deleteClick(user?._id)}
          className="mt-2 ml-2 "
          size={20}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Team Members" />
          <Button
            label="Add New User"
            icon={<IoMdAdd className="text-lg" />}
            className="flex gap-1 items-center bg-black hover:bg-gray-800 text-white rounded-lg text-sm lg:text-base"
            onClick={() => setOpen(true)}
          />
        </div>

        <div className="bg-[#f8f8f8] px-2 md:px-4 py-4 rounded-2xl shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {data?.map((user, index) => (
                  <TableRow key={index} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </>
  );
};
export default Users;
