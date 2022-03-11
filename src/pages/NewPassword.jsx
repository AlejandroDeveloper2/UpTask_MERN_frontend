import {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import axiosClient from '../config/axiosClient'

import Alert from '../components/Alert'

const NewPassword = () => {

    const [password, setPassword]=useState('')
    const [validToken, setValidToken] = useState(false)
    const [alert, setAlert] = useState({})
    const [isPasswordModified, setIsPasswordModified] = useState(false)

    const params=useParams()
    const {token}=params

    useEffect(()=>{
        const confirmToken=async ()=>{
            try {
                await axiosClient(`/users/recover_password/${token}`)
                setValidToken(true)
            } catch (error) {
                setAlert({
                    msg:error.response.data.msg,
                    error:true
                })
            }
        }
        confirmToken()
    },[])

    const handleSubmit=async e =>{
        e.preventDefault()
        if(password.length < 6){
            setAlert({
                msg:'Password must be at least 6 characters',
                error:true
            })
            return
        }
        try {
            const url=`/users/recover_password/${token}`
            const {data}=await axiosClient.post(url, {password})
            setAlert({
                msg:data.msg,
                error:false
            })
            setIsPasswordModified(true)
        } catch (error) {
            setAlert({
                msg:error.response.data.msg,
                error:true
            })
        }
    }
    const {msg}=alert

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">Restore  your password 
                and  do not lose access to your{' '}
                <span className="text-slate-700">projects</span>
            </h1>
            {msg && <Alert alert={alert}/>}
            {validToken &&(
                <form 
                    className="my-10 bg-white shadow rounded-lg p-10"
                    onSubmit={handleSubmit}
                >
                    <div className="my-5">
                        <label 
                            htmlFor="new_password" 
                            className="uppercase text-gray-600 block text-xl font-bold"
                        >
                        New Password
                        </label>
                        <input 
                            type="password"
                            placeholder="Type your new password"
                            className="w-full mt-3 p-3 border rounded-xl bg-grey-50"
                            id="new_password"
                            value={password}
                            onChange={e=>setPassword(e.target.value)}
                        />
                        
                    </div>
                    <input
                        type="submit"
                        value="Restore password"
                        className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded
                        hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
                    />
                </form>
            )} 
            { isPasswordModified &&(
                <Link 
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to="/"
                >Log in</Link>
            )}          
        </>
    )
}

export default NewPassword