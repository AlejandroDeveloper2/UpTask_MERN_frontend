import {formatDate} from '../helpers/formatDate'
import useProjects from '../hooks/useProjects'
import useManager from '../hooks/useManager'

const Task = ({task}) => {
    const {handleEditTaskModal, handleDeleteTaskModal, completeTask}=useProjects()
    const manager=useManager()

    const {description, name, priority, deliveryDate, status, _id}=task

    return (
        <div className="border-b p-5 flex justify-between 
        items-center">
            <div className="flex flex-col items-start">
                <p className="mb-1 text-xl">{name}</p>
                <p className="mb-1 text-sm text-gray-500 uppercase">{description}</p>              
                <p className="mb-1 text-sm">{formatDate(deliveryDate)}</p>
                <p className="mb-1 text-xl text-gray-600">{priority}</p>
                {status && <p className='text-xs bg-green-600 uppercase text-white
                p-1 rounded-lg text-center'>Done by {task.completed.name}</p>}
            </div>
            <div className="flex flex-col lg:flex-row gap-2">
                {manager &&  (             
                    <button 
                        className="bg-indigo-600 px-4 py-3 text-white
                        uppercase font-bold text-sm rounded-lg"
                        onClick={()=>handleEditTaskModal(task)}
                    >
                        Edit        
                    </button>
                )}
                <button 
                    className={`${status ? 'bg-sky-600': 'bg-gray-600'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
                    onClick={()=>completeTask(_id)}
                >
                    {status ? 'Done':'incomplete'}  
                </button>
                {manager && (                             
                    <button 
                        className="bg-red-600 px-4 py-3 text-white
                        uppercase font-bold text-sm rounded-lg"
                        onClick={()=>handleDeleteTaskModal(task)}
                    >
                        Delete  
                    </button>
                )}
            </div>
        </div>
    )
}

export default Task