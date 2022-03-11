import {useState} from 'react'
import { Link, useNavigate } from "react-router-dom"

import Alert from "../components/Alert"
import axiosClient from '../config/axiosClient'
import useAuth from '../hooks/useAuth'

const Login = () => {

    const [loginUserData, setLoginUserData] =useState({
        email:'',
        password:''
    })
    const [alert, setAlert] = useState({})
    const {setAuth} =useAuth()

    const navigate=useNavigate()


    const {email, password} = loginUserData

    const handleChange = e =>{
        setLoginUserData({...loginUserData, 
        [e.target.name]:e.target.value})
    }
    const handleSubmit= async e=>{
        e.preventDefault()
        if([email, password].includes('')){
            setAlert({
                msg:'All fields are required!',
                error: true
            })
            return
        }
        try {
            const {data}=await axiosClient.post('/users/login', loginUserData)
            setAlert({})
            localStorage.setItem('token', data.token)  
            setAuth(data)    
            navigate('/projects')
        } catch (error) {
            console.log(error)
            setAlert({
                msg:error.response.data.msg,
                error:true
            })
        }
    }
    const {msg}=alert
    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">Log in and manage  your {' '}
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
                        name="email"
                        value={email}
                        onChange={handleChange}
                    />
                </div>
                <div className="my-5">
                    <label 
                        htmlFor="password" 
                        className="uppercase text-gray-600 block text-xl font-bold"
                    >
                        Password
                    </label>
                    <input 
                        type="password"
                        placeholder="Your password"
                        className="w-full mt-3 p-3 border rounded-xl bg-grey-50"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                    />
                    
                </div>
                <input
                    type="submit"
                    value="Log in"
                    className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded
                    hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
                />
            </form>
            <nav className="lg:flex lg:justify-between">
                <Link 
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to="/register"
                >Do not you have a account? Sign in</Link>
                <Link 
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to="/recover-password"
                >I forgot my password!</Link>
            </nav>
        </>
    )
}

export default Login