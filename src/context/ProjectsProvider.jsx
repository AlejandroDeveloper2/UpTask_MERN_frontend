import { useState, useEffect, createContext} from 'react'
import {useNavigate} from 'react-router-dom'
import io from 'socket.io-client'

import axiosClient from '../config/axiosClient'
import useAuth from '../hooks/useAuth'

let socket

const ProjectsContext=createContext()

const ProjectsProvider=({children})=>{

    const[projects, setProjects]=useState([])
    const[alert, setAlert] = useState({})
    const[project, setProject]=useState({})
    const[loading, setLoading] =useState(false)
    const[modalForm, setModalForm]=useState(false)
    const[deleteTaskModal, setDeleteTaskModal]=useState(false)
    const[task, setTask]=useState({})
    const[collaborator, setCollaborator]=useState({})
    const[deleteCollaboratorModal, setDeleteCollaboratorModal]=useState(false)
    const[searcher, setSearcher]=useState(false)

    const navigate=useNavigate()
    const {auth}=useAuth()

    useEffect(()=>{
        const getAllProjects=async ()=>{
            try {
                const token=localStorage.getItem('token')
                if(!token)return
                const config={
                    headers:{
                        "Content-Type": "application/json",
                        Authorization:  `Bearer ${token}`       
                    }
                }
                const {data}=await axiosClient('/projects', config) 
                setProjects(data)
            } catch (error) {
                console.log(error)  
            } 
        }
        getAllProjects()
    },[auth])

    useEffect(()=>{
        socket=io(import.meta.env.VITE_BACKEND_URL)
    }, [])

    const showAlert=alert=>{
        setAlert(alert)
        setTimeout(()=>{
            setAlert({})
        },5000)
    }

    const submitProject=async project=>{
        if(project.id){
            await editProject(project)
        }else{
            await addNewProject(project)
        }
        
    }
    const editProject =async project=>{
        try {
            const token=localStorage.getItem('token')
            if(!token)return
            const config={
                headers:{
                    "Content-Type": "application/json",
                    Authorization:  `Bearer ${token}`       
                }
            }
            const {data}=await axiosClient.put(`/projects/${project.id}`, project, config)

            //sync up state
            const updatedProjects=projects.map(projectState => projectState._id ===
            data._id ? data : projectState)
            setProjects(updatedProjects)

            //Show alert
            setAlert({
                msg:'Project has been updated successfully!',
                error: false
            })

            //Redirect
            setTimeout(() =>{
                setAlert({})
                navigate('/projects')
            },3000)  

        } catch (error) {
            console.log(error)
        }
    }
    const addNewProject=async project=>{
        try {
            const token=localStorage.getItem('token')
            if(!token)return
            const config={
                headers:{
                    "Content-Type": "application/json",
                    Authorization:  `Bearer ${token}`       
                }
            }
            const {data}=await axiosClient.post('/projects', project, config)
            setProjects([...projects, data])
            setAlert({
                msg:'Project has been created successfully!',
                error: false
            })
            setTimeout(() =>{
                setAlert({})
                navigate('/projects')
            },3000)
        } catch (error) {
            console.log(error)
        }
    }
    const getProject=async id=>{
        setLoading(true)
        try {
            const token=localStorage.getItem('token')
            if(!token)return
            const config={
                headers:{
                    "Content-Type": "application/json",
                    Authorization:  `Bearer ${token}`       
                }
            }
            const {data}=await axiosClient(`/projects/${id}`, config)
            setProject(data)
            setAlert({})
        } catch (error) {
            navigate('/projects')
            setAlert({
                msg: error.response.data.msg,
                error:true
            })
            setTimeout(() =>{
                setAlert({})
            },3000)
        }finally{
            setLoading(false)
        }
    }
    const deleteProject = async id =>{
        try {
            const token=localStorage.getItem('token')
            if(!token)return
            const config={
                headers:{
                    "Content-Type": "application/json",
                    Authorization:  `Bearer ${token}`       
                }
            }
            const {data}=await axiosClient.delete(`/projects/${id}`, config)
            //Sync up state
            const updatedProjects=projects.filter(projectState => projectState._id !== id)
            setProjects(updatedProjects)
            
            setAlert({
                msg:data.msg,
                error:false
            })

            setTimeout(() =>{
                setAlert({})
                navigate('/projects')
            },3000)

        } catch (error) {
            console.log(error)
        }
    }
    const handleModalForm=()=>{
        setModalForm(!modalForm)
        setTask({})
    }
    const submitTask= async (task, id) =>{
        console.log(id)
        if(id){
           await editTask(task, id)
        }else{
           await addTask(task)
        }
    }
    const addTask = async  task => {      
        console.log(task)
        try {
            const token=localStorage.getItem('token')
            if(!token)return
            const config={
                headers:{
                    "Content-Type": "application/json",
                    Authorization:  `Bearer ${token}`       
                }
            }
            const {data}=await axiosClient.post('/tasks', task, config)     
            setAlert({})
            setModalForm(false)
            //Socket io
            socket.emit('new task', data)      
        } catch (error) {
            console.log(error.response.data.msg)
        }
    }
    const editTask= async (task, id)=>{
        // console.log(task, id)
        try {
            const token=localStorage.getItem('token')
            if(!token)return
            const config={
                headers:{
                    "Content-Type": "application/json",
                    Authorization:  `Bearer ${token}`       
                }
            }
            const {data}=await axiosClient.put(`/tasks/${id}`, task, config)
           
            setAlert({})
            setModalForm(false)

            //SOCKET
            socket.emit('update task', data)

        } catch (error) {
            console.log(error)
        }
    }
    const handleEditTaskModal=task=>{
        setTask(task)
        setModalForm(true)
    }
    const handleDeleteTaskModal=task=>{
        setTask(task)
        setDeleteTaskModal(!deleteTaskModal)
    }
    const deleteTask= async () =>{
        try {
            const token=localStorage.getItem('token')
            if(!token)return
            const config={
                headers:{
                    "Content-Type": "application/json",
                    Authorization:  `Bearer ${token}`       
                }
            }
            const {data}=await axiosClient.delete(`/tasks/${task._id}`, config)
            setAlert({
                msg:data.msg,
                error:false
            })
                    
            setDeleteTaskModal(false)

            //SOCKET
            socket.emit('delete task', task)       

            setTask({})
            setTimeout(() =>{
                setAlert({})
            },3000)
        } catch (error) {
            console.log(error)
        }
    }
    const submitCollaborator=async email=>{
        setLoading(true)
        try{
            const token=localStorage.getItem('token')
            if(!token)return
            const config={
                headers:{
                    "Content-Type": "application/json",
                    Authorization:  `Bearer ${token}`       
                }
            }
            const {data}=await axiosClient.post('/projects/collaborators', {email}, config)
            setCollaborator(data)
            setAlert({})
        }catch(error){
            setAlert({
                msg:error.response.data.msg,
                error:true
            })
        }finally{
            setLoading(false)
        }
    }
    const addCollaborator =async email=>{
        try {
            const token=localStorage.getItem('token')
            if(!token){return}
            const config={
                headers:{
                    "Content-Type": "application/json",
                    Authorization:  `Bearer ${token}`       
                }
            }
            const {data}=await axiosClient.post(`/projects/collaborators/${project._id}`, email, config)
            setAlert({
                msg:data.msg,
                error:false
            })
            setCollaborator({})
            setTimeout(() =>{
                setAlert({})
            }, 3000)
        } catch (error) {
            setAlert({
                msg:error.response.data.msg,
                error:true
            })
        }
    }
    const handleDeleteCollaboratorModal=collaborator=>{
        setDeleteCollaboratorModal(!deleteCollaboratorModal)
        setCollaborator(collaborator)
    }
    const deleteCollaborator=async()=>{
        try {
            const token=localStorage.getItem('token')
            if(!token)return
            const config={
                headers:{
                    "Content-Type": "application/json",
                    Authorization:  `Bearer ${token}`       
                }
            }
            const {data}=await axiosClient.post(`/projects/delete-collaborator/${project._id}`, {id:collaborator._id} , config)
            const updatedProject={...project}
            updatedProject.collaborators=updatedProject.collaborators.filter(
            collaboratorState => collaboratorState._id !== collaborator._id) 
            setProject(updatedProject)
            setAlert({
                msg:data.msg,
                error:false
            })
            setCollaborator({})
            setDeleteCollaboratorModal(false)
            setTimeout(() =>{
                setAlert({})
            },3000)
            
        } catch (error) {
            console.log(error)
        }
    }
    const completeTask = async id =>{
        try{
            const token=localStorage.getItem('token')
            if(!token)return
            const config={
                headers:{
                    "Content-Type": "application/json",
                    Authorization:  `Bearer ${token}`       
                }
            }
            const {data}= await axiosClient.post(`/tasks/status/${id}`, {}, config)          
            setTask({})
            setAlert({})

            //SOCKET
            socket.emit('change state', data)

        }catch (error) {
            console.log(error)
        }
    }
    const handleSearcher=()=>{
        setSearcher(!searcher)
    }
    //Socket io
    const submitTasksProject=task=>{
        //Add task to state
        const updatedProject={...project}
        updatedProject.tasks=[...updatedProject.tasks, task]
        setProject(updatedProject)  
    }
    const deleteTaskProject=task=>{
        const updatedProject={...project}
        updatedProject.tasks=updatedProject.tasks.filter(taskState=>
        taskState._id !== task._id)
        setProject(updatedProject)
    }
    const updateTaskProject=task=>{
        const updatedProject={...project}
        updatedProject.tasks=updatedProject.tasks.map(taskState=>
        taskState._id===task._id ? task:taskState)
        setProject(updatedProject)
    }
    const changeTaskState=task=>{
        const updatedProject={...project}
        updatedProject.tasks= updatedProject.tasks.map(taskState=>
        taskState._id === task._id ? task:taskState)
        setProject(updatedProject)
    }
    const logOutProjects=()=>{
        setProjects([])
        setProject({})
        setAlert({})    
    }
    return(
        <ProjectsContext.Provider
            value={{
                projects,
                showAlert,
                alert,
                submitProject,
                getProject,
                project,
                loading,
                deleteProject,
                modalForm,
                handleModalForm,
                submitTask,
                handleEditTaskModal,
                task,
                deleteTaskModal, 
                handleDeleteTaskModal,
                deleteTask,
                submitCollaborator,
                collaborator,
                addCollaborator,
                handleDeleteCollaboratorModal,
                deleteCollaboratorModal,
                deleteCollaborator,
                completeTask,
                searcher,
                handleSearcher,
                submitTasksProject,
                deleteTaskProject,
                updateTaskProject,
                changeTaskState,
                logOutProjects
            }}
        >
            {children}
        </ProjectsContext.Provider>
    )
}
export {
    ProjectsProvider
}
export default ProjectsContext