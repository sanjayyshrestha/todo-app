

import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import { getTask } from "@/actions/task.action";

const Dashboard = async () => {
  const tasks= await getTask()
 
  return (
    <DashboardClient tasks={tasks} />
    
    
  );
};

export default Dashboard;