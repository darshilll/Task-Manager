/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import clsx from "clsx";
import { useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdAttachFile,
} from "react-icons/md";
import { toast } from "sonner";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../utils";
import { FaList } from "react-icons/fa";
import Button from "../Button";
import UserInfo from "../UserInfo";
import ConfirmatioDialog from "./Dialogs";
import {
  useGetAllTasksQuery,
  useTrashTaskMutation,
} from "../../redux/slices/taskApiSlice";
import AddTask from "./AddTask";
import { useParams } from "react-router-dom";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = () => {
  const params = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [trashTask] = useTrashTaskMutation();

  const status = params?.status || "";

  const { data } = useGetAllTasksQuery({
    strQuery: status,
    isTrashed: "",
    search: "",
  });

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editTaskHandler = (el) => {
    setSelected(el);
    setOpenEdit(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await trashTask({
        id: selected,
        isTrash: "trash",
      }).unwrap();
      toast.success(res?.message);

      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const TableHeader = () => (
    <thead className="w-full border-b border-gray-300">
      <tr className="w-full text-black text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2 line-clamp-1 ">Created At</th>
        <th className="py-2">Assets</th>
        <th className="py-2">Team</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-3 h-3 p-1 rounded-full", TASK_TYPE[task.stage])}
          />
          <p className="w-full line-clamp-2 text-base text-black">
            {task?.title}
          </p>
        </div>
      </td>

      <td className="py-2">
        <div className="flex gap-1 items-center ">
          <span
            className={clsx(
              "text-lg hidden lg:block",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            {ICONS[task?.priority]}
          </span>
          <span className="capitalize line-clamp-1 hidden lg:block">
            {task?.priority} Priority
          </span>
        </div>
      </td>

      <td className="py-2">
        <span className="text-sm text-gray-600 hidden lg:block">
          {formatDate(new Date(task?.date))}
        </span>
      </td>

      <td className="py-2">
        <div className="flex items-center gap-3 -ml-20 md:ml-0">
          <div className="flex gap-1 items-center text-sm text-gray-600">
            <BiMessageAltDetail />
            <span>{task?.activities?.length}</span>
          </div>
          <div className="flex gap-1 items-center text-sm text-gray-600">
            <MdAttachFile />
            <span>{task?.assets?.length}</span>
          </div>
          <div className="flex gap-1 items-center text-sm text-gray-600">
            <FaList />
            <span>{task?.subTasks?.length}</span>
          </div>
        </div>
      </td>

      <td className="py-2">
        <div className="flex">
          {task?.team?.map((m, index) => (
            <div
              key={m._id}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS?.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>

      <td className="py-2 flex gap-2 md:gap-4 justify-end">
        <Button
          className="text-black hover:text-gray-700 font-semibold sm:px-0 text-sm md:text-base"
          label="Edit"
          type="button"
          onClick={() => editTaskHandler(task)}
        />

        <Button
          className="text-red-600 font-semibold hover:text-red-700 sm:px-0 md:text-base"
          label="Delete"
          type="button"
          onClick={() => deleteClicks(task._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full py-4">
        {data?.tasks.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No tasks are assigned
          </div>
        ) : (
          <div className="bg-white px-2 md:px-4 pt-4 pb-9 shadow-md rounded">
            <div className="overflow-x-auto">
              <table className="w-full">
                <TableHeader />
                <tbody>
                  {data?.tasks.map((task, index) => (
                    <TableRow key={index} task={task} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selected}
        key={new Date().getTime()}
      />
    </>
  );
};
export default Table;
