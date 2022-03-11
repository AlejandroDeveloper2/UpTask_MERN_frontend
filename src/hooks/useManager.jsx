import useProjects from "./useProjects"
import useAuth from "./useAuth"

const useManager=()=>{
    const {project}=useProjects()
    const {auth}=useAuth()

    return project.creator === auth._id
}
export default useManager