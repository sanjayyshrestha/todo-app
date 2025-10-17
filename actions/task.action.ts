'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addTask(formData:FormData){
const title=formData.get('title') as string
const description=formData.get('description') as string
const dueDate=formData.get('dueDate') as string
const priority=formData.get('priority') as string
  await prisma.task.create({
    data:{
      title,
      description,
      dueDate,
      priority:priority==='LOW'?'LOW':priority==='MEDIUM'?'MEDIUM':'HIGH'
    }
  })
  revalidatePath('/')
}

export async function getTask(){
  return await prisma.task.findMany({
    select:{
      id:true,
      title:true,
      description:true,
      priority:true,
      dueDate:true
    }
  })
  
}

export async function editTask(formData:FormData){
  const id=formData.get('id') as string
  const title=formData.get('title') as string
const description=formData.get('description') as string
const dueDate=formData.get('dueDate') as string
const priority=formData.get('priority') as string

await prisma.task.update({
  where:{id},
  data:{
    title,description,dueDate, priority:priority==='LOW'?'LOW':priority==='MEDIUM'?'MEDIUM':'HIGH'
  }
})

revalidatePath('/')
}

export async function deleteTask(taskId:string){
console.log(taskId)
  await prisma.task.delete({
    where:{
      id:taskId
    }
  })
  revalidatePath('/')
}