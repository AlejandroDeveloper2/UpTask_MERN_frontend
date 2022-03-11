import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'

import Alert from './Alert'
import useProjects from '../hooks/useProjects'

const ProjectForm = () => {

    const [id, setId]=useState(null)
    const [projectData, setProjectData]=useState({
        name:'',
        description:'',
        dateDelivery:'',
        costumer:''
    })
    const params=useParams()
    const {showAlert, alert, submitProject, project}=useProjects()

    useEffect(()=>{
        if(params.id){
            setId(project._id)
            setProjectData({
                name:project.name,
                description:project.description,
                dateDelivery:project.dateDelivery?.split('T')[0],
                costumer:project.costumer
            })
        }
    },[params])

    const handleChange=e=>{
        setProjectData({...projectData, 
        [e.target.name]:e.target.value})
    }
   
    const {name, description, dateDelivery, costumer}=projectData

    const handleSubmit=async e=>{
        e.preventDefault()
        if([name, description, dateDelivery, costumer].includes('')){
            showAlert({
                msg:'All fields are required!',
                error:true
            })
            return
        }
        //all OK
        await submitProject({id, name, description, dateDelivery, costumer})
        setId(null)
        setProjectData({
            name:'',
            description:'',
            dateDelivery:'',
            costumer:''
        })
    }

    const {msg}=alert

    return (
        <>
            <form 
                className="bg-white py-10 px-5  lg:w-1/3 rounded-lg shadow"
                onSubmit={handleSubmit}
            >
                {msg && <Alert alert={alert} />}
                <div className="mb-5">
                    <label 
                        htmlFor="name"
                        className="text-gray-700 uppercase font-bold text-sm"
                    >
                        Project Name
                    </label>
                    <input 
                        id="name"
                        name="name"
                        type="text" 
                        className="border w-full p-2 mt-2 placeholder-gray-400 
                        rounded-md"
                        placeholder="Project's name"
                        value={name}
                        onChange={handleChange}
                    />
                </div>   
                <div className="mb-5">
                    <label 
                        htmlFor="description"
                        className="text-gray-700 uppercase font-bold text-sm"
                    >
                        Description
                    </label>
                    <textarea 
                        id="description"
                        name="description"
                        className="border w-full p-2 mt-2 placeholder-gray-400 
                        rounded-md"
                        placeholder="Project's description"
                        value={description}
                        onChange={handleChange}
                    />
                </div> 
                <div className="mb-5">
                    <label 
                        htmlFor="date-delivery"
                        className="text-gray-700 uppercase font-bold text-sm"
                    >
                        Delivery Date
                    </label>
                    <input 
                        id="date-delivery"
                        name="dateDelivery"
                        type="date" 
                        className="border w-full p-2 mt-2 placeholder-gray-400 
                        rounded-md"
                        value={dateDelivery}
                        onChange={handleChange}
                    />
                </div>  
                <div className="mb-5">
                    <label 
                        htmlFor="costumer"
                        className="text-gray-700 uppercase font-bold text-sm"
                    >
                        Project costumer's Name
                    </label>
                    <input 
                        id="costumer"
                        name="costumer"
                        type="text" 
                        placeholder="Project's costumer"
                        className="border w-full p-2 mt-2 placeholder-gray-400 
                        rounded-md"
                        value={costumer}
                        onChange={handleChange}
                    />
                </div>  
                <input 
                    type="submit" 
                    value={id ? "Edit Project" :"Create Project"}
                    className="bg-sky-600 w-full p-3 uppercase font-bold
                    text-white rounded cursor-pointer hover:bg-sky-700
                    transition-colors"
                />
            </form>
        </>
    )
}

export default ProjectForm