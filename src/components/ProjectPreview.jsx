import {Link} from 'react-router-dom'

import useAuth from '../hooks/useAuth'

const ProjectPreview = ({project}) => {
    const {auth}=useAuth()
    const {name, _id, costumer, creator }=project
    return (
        <div className="border-b p-5 flex flex-col lg:flex-row justify-between">
           <div className="flex items-center gap-2 md:flex-between">
                <p className="flex-1  font-semibold"> 
                        {name}
                        <span className="text-sm text-gray-500 uppercase font-normal">
                            {' '}{costumer}
                        </span> 
                </p>

                {auth._id !== creator ? (
                    <p className="p-1 text-xs rounded-lg text-white bg-green-500
                    font-bold uppercase">Collaborator</p>
                ):(
                    <p className="p-1 text-xs rounded-lg text-white bg-blue-500
                    font-bold uppercase">Manager</p>
                )}             
           </div>
           <Link 
                to={`${_id}`}
                className="text-gray-600 hover:text-gray-800 uppercase
                text-sm font-bold"
           >
               See Project
           </Link>
        </div>
    )
}

export default ProjectPreview