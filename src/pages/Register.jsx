import {useState} from 'react'
import { Link } from "react-router-dom"
import axiosClient from '../config/axiosClient'

import Alert from '../components/Alert'

const Register = () => {
    const[userData, setUserData]=useState({
        name:'',
        email:'',
        password:'',
        confirm_password:''
    })
    const[alert, setAlert]=useState({})

    const {name, email, password, confirm_password}=userData

    const handleChange=e=>{
        setUserData({...userData, [e.target.name]:e.target.value})
    }
    const handleSubmit=async e=>{
        e.preventDefault()
        if([name, email, password, confirm_password].includes('')){
            setAlert({
                msg:'All fields are required!',
                error:true
            })
            return
        }
        if(password !== confirm_password){
            setAlert({
                msg:'Passwords do not match!',
                error:true
            })
            return
        }
        if(password.length < 6){
            setAlert({
                msg:'Password is too short, add 6 characters as minimum!',
                error:true
            })
            return
        }
        setAlert({})
        
        //create the user at the API 
        try {
            const {data}=await axiosClient.post('/users',
            {name, email, password})
            setAlert({
                msg:data.msg,
                error:false
            })
            setUserData({
                name:'',
                email:'',
                password:'',
                confirm_password:''
            })
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
            <h1 className="text-sky-600 font-black text-6xl capitalize">Create your account 
                and manage your{' '}
                <span className="text-slate-700">projects</span>
            </h1>
            {msg && <Alert alert={alert}/>}
            <form 
                className="my-10 bg-white shadow rounded-lg p-10"
                onSubmit={handleSubmit}
            >                
                <div className="my-5">
                    <label 
                        htmlFor="name" 
                        className="uppercase text-gray-600 block text-xl font-bold"
                    >
                        Name
                    </label>
                    <input 
                        type="text"
                        placeholder="Your full name"
                        className="w-full mt-3 p-3 border rounded-xl bg-grey-50"
                        id="name"
                        value={name}
                        name="name"
                        onChange={handleChange}
                    />
                </div>
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
                        name="email"
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
                        value={password}
                        name="password"
                        onChange={handleChange}
                    />
                    
                </div>
                <div className="my-5">
                    <label 
                        htmlFor="confirm_password" 
                        className="uppercase text-gray-600 block text-xl font-bold"
                    >
                        Confirm password
                    </label>
                    <input 
                        type="password"
                        placeholder="Confirm your password"
                        className="w-full mt-3 p-3 border rounded-xl bg-grey-50"
                        id="confirm_password"
                        value={confirm_password}
                        name="confirm_password"
                        onChange={handleChange}
                    />                   
                </div>
                <input
                    type="submit"
                    value="Sign in"
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
                    to="/recover-password"
                >I forgot my password!</Link>
            </nav>
        </>
    )
}

export default Register