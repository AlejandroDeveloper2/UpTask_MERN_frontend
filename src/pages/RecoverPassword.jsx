import {useState} from 'react'
import {Link} from 'react-router-dom'
import axiosClient from '../config/axiosClient'

import Alert from '../components/Alert'

const RecoverPassword = () => {

    const [email, setEmail]=useState('')
    const [alert, setAlert] = useState({})

    const handleSubmit=async e =>{
        e.preventDefault()
        if(email==='' || email.length < 6){
            setAlert({
                msg:"Email is required!",
                error:true
            })
            return
        }
        try{
            const {data}=await axiosClient.post('/users/recover_password',
            {email})
            setAlert({
                msg:data.msg,
                error:false
            })         
        }catch(error){
            setAlert({
                msg:error.response.data.msg,
                error:true
            })
        }
    }
    const {msg}=alert

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">Recover your access
                and do not lose your{' '}
                <span className="text-slate-700">projects</span>
            </h1>
            {msg && <Alert alert={alert}/>}
            <form 
                className="my-10 bg-white shadow rounded-lg p-10"
                onSubmit={handleSubmit}
            >
                <div className="my-5">
                    <label 
                        htmlFor="email" 
                        className="uppercase text-gray-600 block text-xl font-bold"
                    >
                        Email
                    </label>
                    <input 
                        type="email"
                        placeholder="Your email address"
                        className="w-full mt-3 p-3 border rounded-xl bg-grey-50"
                        id="email"
                        value={email}
                        onChange={e=>setEmail(e.target.value)}
                    />
                </div>
                <input
                    type="submit"
                    value="Send instructions"
                    className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded
                    hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
                />
            </form>
            <nav className="lg:flex lg:justify-between">
                <Link 
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to="/"
                >Do you already have an account? Log in</Link>
                <Link 
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to="/register"
                >Do not you have a account? Sign in</Link>
            </nav>
        </>
    )
}

export default RecoverPassword