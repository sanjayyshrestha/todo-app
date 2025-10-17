"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { addTask, editTask, getTask, deleteTask } from "@/actions/task.action";
import { DeleteAlertDialog } from "./DeleteAlertDialog";
import toast from "react-hot-toast";

type Tasks = Awaited<ReturnType<typeof getTask>>;
export type Task = Tasks[number];

const DashboardClient = ({ tasks }: { tasks: Task[] }) => {
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [priority, setPriority] = useState("");
  const [isLoading, setLoading] = useState(false);
const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "LOW",
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
      toast.success('Task added successfully')
    } catch (error) {
      console.error("Error in submit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedTask) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("id", selectedTask.id);
      formData.append("title", taskData.title);
      formData.append("description", taskData.description);
      formData.append("dueDate", taskData.dueDate);
      formData.append("priority", taskData.priority);
      await editTask(formData);
      toast.success('Task edited successfully')
      setShowOpenDialog(false);
      setSelectedTask(null);
      setTaskData({ title: "", description: "", dueDate: "", priority: "LOW" });
    } catch (error) {
      console.error("Error in edit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (deletingTaskId) return;
    try {
      setDeletingTaskId(taskId);
      await deleteTask(taskId);
      toast.success('Task deleted successfully')
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setDeletingTaskId(null);
    }
  };

  const filteredTasks = priority
    ? tasks.filter((task) => task.priority.toLowerCase() === priority.toLowerCase())
    : tasks;

  return (
    <div className="p-4 sm:p-8 bg-background text-foreground min-h-screen transition-colors duration-300">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4 sm:gap-0">
        <Button
          onClick={() => {
            setModalMode("add");
            setTaskData({ title: "", description: "", dueDate: "", priority: "LOW" });
            setSelectedTask(null);
            setShowOpenDialog(true);
          }}
        >
          Add Task
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
  <select
    name="filterByPriority"
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
    className="
      w-32
      border
      border-border
      rounded
      px-3
      py-2
      text-sm
      bg-white
      text-gray-800
      focus:outline-none
      focus:ring-2
      focus:ring-primary
      dark:bg-gray-800
      dark:text-gray-100
      dark:border-gray-600
      dark:focus:ring-primary
    "
  >
    <option value="">All</option>
    <option value="LOW">Low</option>
    <option value="MEDIUM">Medium</option>
    <option value="HIGH">High</option>
  </select>

  <p className="text-sm text-muted-foreground dark:text-gray-400">
    Filter By Due Date (Coming Soon)
  </p>
</div>

      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTasks.map((task) => {
          const priorityColor =
            task.priority === "HIGH"
              ? "text-destructive"
              : task.priority === "MEDIUM"
              ? "text-yellow-500"
              : "text-green-500";

          return (
            <div
              key={task.id}
              className="bg-card text-card-foreground border border-border p-4 rounded-lg shadow-sm flex flex-col justify-between h-full relative group"
              onClick={() => {
                setModalMode("edit");
                setTaskData({
                  title: task.title,
                  description: task.description,
                  dueDate: task.dueDate,
                  priority: task.priority,
                });
                setSelectedTask(task);
                setShowOpenDialog(true);
              }}
            >
              {/* Task content */}
              <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
              <div className="flex justify-between items-end mt-auto text-xs text-muted-foreground">
                <span>Due: {task.dueDate}</span>
                <span className={`${priorityColor} font-medium`}>Priority: {task.priority}</span>
              </div>

              {/* Delete Button */}
              <div
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation(); // prevent parent click
                }}
              >
                <DeleteAlertDialog
                  onDelete={() => handleDelete(task.id)}
                  isDeleting={deletingTaskId===task.id}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Dialog open={showOpenDialog} onOpenChange={setShowOpenDialog}>
        <form>
          <DialogContent className="sm:max-w-md bg-card text-card-foreground border border-border rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {modalMode === "add" ? "Add New Task" : "Edit Task"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input
                  id="task-title"
                  type="text"
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                  className="w-full border border-border bg-background text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  rows={4}
                  value={taskData.description}
                  onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                  className="w-full border border-border bg-background text-foreground rounded px-3 py-2 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="text"
                  placeholder="YYYY-MM-DD"
                  value={taskData.dueDate}
                  onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                  className="w-full border border-border bg-background text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={taskData.priority}
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                  className="w-full border border-border bg-background text-foreground rounded px-3 py-2"
                >
                  <option>LOW</option>
                  <option>MEDIUM</option>
                  <option>HIGH</option>
                </select>
              </div>

              <Button
                onClick={modalMode === "add" ? handleSubmit : handleEdit}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded"
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
