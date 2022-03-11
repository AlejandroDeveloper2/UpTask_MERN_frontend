import {useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import io from 'socket.io-client'

import ModalFormTask from '../components/ModalFormTask'
import DeleteTaskModal from '../components/DeleteTaskModal'
import useProjects from '../hooks/useProjects'
import useManager from '../hooks/useManager'
import Task from '../components/Task'
import Collaborator from '../components/Collaborator'
import DeleteCollaboratorModal from '../components/DeleteCollaboratorModal'

let socket

const Project = () => {
    const params=useParams() 
    const {getProject, project, loading, handleModalForm, 
    submitTasksProject, deleteTaskProject, updateTaskProject,
    changeTaskState}=useProjects()
    
    const manager=useManager()
    
    useEffect(()=>{
        //console.log(project)
        getProject(params.id)
    },[])

    useEffect(()=>{
        socket =io(import.meta.env.VITE_BACKEND_URL)
        socket.emit('open project', params.id)
    },[])

    useEffect(()=>{
        socket.on('added task',(newTask)=>{
            if(newTask.project === project._id){
                submitTasksProject(newTask)
            }       
        })
        socket.on('deleted task', deletedTask=>{
            if(deletedTask.project===project._id){
                deleteTaskProject(deletedTask)
            }
        })
        socket.on('updated task', updatedTask=>{
            if(updatedTask.project._id===project._id){
                updateTaskProject(updatedTask)
            }
        })
        socket.on('new state',  newTaskState=>{
            if(newTaskState.project._id===project._id){
                changeTaskState(newTaskState)
            }
        })
    })
    const {name}=project
    return (
        loading ? '...' : (
            // msg && alert.error ? <Alert alert={alert}/>:(
                <>
                    <div className="flex justify-between">
                        <h1 className="font-black text-4xl">{name}</h1>
                        {manager && (                       
                            <div className="flex items-center gap-2 text-gray-400 hover:text-black">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                <Link
                                    to={`/projects/edit/${params.id}`}
                                    className="uppercase font-bold"
                                >
                                    Edit
                                </Link>
                            </div> 
                        )}              
                    </div>
                    {manager && (     
                        <button
                            onClick={handleModalForm}
                            type="button"
                            className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase 
                            font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center"
                        > 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            New Task
                        </button>
                    )}
                    <p className="font-bold text-xl mt-10">Project's tasks</p>                
                    <div className="bg-white shadow mt-10 rounded-lg">
                        {
                            project.tasks?.length ? 
                                project.tasks?.map(task=>(
                                    <Task
                                        key={task._id}
                                        task={task}
                                    />
                                ))
                            : 
                                <p className="text-center my-5 p-10">There's no tasks</p>
                        }       
                    </div>
                    {manager && (   
                        <>  
                            <div className="flex items-center justify-between mt-10">
                                <p className="font-bold text-xl ">Project's collaborators</p>
                                <Link
                                    to={`/projects/new-collaborator/${project._id}`}
                                    className="text-gray-400 hover:text-gray-500 uppercase font-bold"
                                >
                                    Add
                                </Link>
                            </div>
                            <div className="bg-white shadow mt-10 rounded-lg">
                                {
                                    project.collaborators?.length ? 
                                        project.collaborators?.map(collaborator=>(
                                            <Collaborator
                                                key={collaborator._id}
                                                collaborator={collaborator}
                                            />
                                        ))
                                    : 
                                    <p className="text-center my-5 p-10">There're no collaborators</p>
                                }       
                            </div>
                        </>
                    )}
                    <ModalFormTask/>
                    <DeleteTaskModal/>
                    <DeleteCollaboratorModal/>                  
                </>
            // )
        )
      
    )
}

export default Project