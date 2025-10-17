"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { addTask, editTask } from "@/actions/task.action";
import { title } from "process";
import { getTask } from "@/actions/task.action";

type Tasks = Awaited<ReturnType<typeof getTask>>;
export type Task = Tasks[number];

// --- Task Card Component ---
// The structure for a single task card

const TaskCard = ({ title, description, dueDate, priotity }: Task) => {
  // Determine color based on priority
  let priorityColor = "text-green-600";
  if (priotity === "HIGH") {
    priorityColor = "text-red-600";
  } else if (priotity === "MEDIUM") {
    priorityColor = "text-yellow-600"; // You might use a more subtle green/yellow in final design
  }

  // Adjusting text sizes and padding for the pixel-perfect look
  return (
    <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-lg flex flex-col justify-between h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>

      {/* Footer/Details section */}
      <div className="flex justify-between items-end mt-auto text-xs">
        <span className="text-gray-500">Due: {dueDate}</span>
        <span className={`${priorityColor} font-medium`}>
          Priority: {priotity}
        </span>
      </div>
    </div>
  );
};

// --- Dropdown Filter Component ---
const FilterDropdown = ({
  label,
  options,
}: {
  label: string;
  options?: string;
}) => (
  // Dropdown appearance is simplified using a button and an arrow.
  <button className="flex items-center space-x-1 p-2 bg-white text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-150">
    <span>{label}</span>
    <svg
      className="w-4 h-4 ml-1 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      ></path>
    </svg>
  </button>
);

const DashboardClient = ({ tasks }: { tasks: Task[] }) => {
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", taskData.title);
      formData.append("description", taskData.description);
      formData.append("dueDate", taskData.dueDate);
      formData.append("priority", taskData.priority);
      await addTask(formData);
      setShowOpenDialog(false);
    } catch (error) {
      console.log("Error in submit : ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedTask) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", taskData.title);
      formData.append("description", taskData.description);
      formData.append("dueDate", taskData.dueDate);
      formData.append("priority", taskData.priority);

      formData.append("id", selectedTask.id);

      await editTask(formData); // You’ll need a separate edit API
      setShowOpenDialog(false);
      setSelectedTask(null);
      setTaskData({ title: "", description: "", dueDate: "", priority: "Low" });
    } catch (error) {
      console.log("Error in submit : ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <button
          onClick={() => {
            setModalMode("add"); // Add mode
            setTaskData({
              title: "",
              description: "",
              dueDate: "",
              priority: "Low",
            }); // reset
            setSelectedTask(null);
            setShowOpenDialog(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 shadow-md text-sm"
        >
          Add Task
        </button>
        <div className="flex space-x-3">
          <FilterDropdown label="Filter by Priority" />
          <FilterDropdown label="Filter by Due Date" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tasks.map((task, index) => (
          <div
            key={index}
            onClick={() => {
              setModalMode("edit"); // Edit mode
              setTaskData({
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priotity,
              });
              setSelectedTask(task);
              setShowOpenDialog(true);
            }}
          >
            <TaskCard
              id={task.id}
              title={task.title}
              description={task.description}
              dueDate={task.dueDate}
              priotity={task.priotity}
            />
          </div>
        ))}
      </div>

      <Dialog open={showOpenDialog} onOpenChange={setShowOpenDialog}>
        <form>
          <input type="hidden" id={selectedTask?.id} />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-normal">
                {modalMode === "add" ? "Add New Task" : "Edit Task"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label htmlFor="task-title" className="text-sm font-normal">
                  Task Title
                </Label>
                <Input
                  id="task-title"
                  type="text"
                  value={taskData.title}
                  onChange={(e) =>
                    setTaskData({ ...taskData, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-normal">
                  Description
                </Label>
                <textarea
                  id="description"
                  rows={4}
                  value={taskData.description}
                  onChange={(e) =>
                    setTaskData({ ...taskData, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date" className="text-sm font-normal">
                  Due Date
                </Label>
                <Input
                  id="due-date"
                  type="text"
                  placeholder="YYYY-MM-DD"
                  value={taskData.dueDate}
                  onChange={(e) =>
                    setTaskData({ ...taskData, dueDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-normal">
                  Priority
                </Label>
                <select
                  id="priority"
                  value={taskData.priority}
                  onChange={(e) =>
                    setTaskData({ ...taskData, priority: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <Button
                onClick={modalMode === "add" ? handleSubmit : handleEdit}
                disabled={isLoading}
                className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 rounded"
              >
                {isLoading ? "Saving..." : "Save Task"}
              </Button>
            </div>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default DashboardClient;
