import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate()

    const { backendurl, setIsLoggedin,getuserdata } = useContext(AppContent)


    const [state, setstate] = useState('Sing Up');
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');


    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            axios.defaults.withCredentials = true;
            if (state === 'Sing Up') {
                const { data } = await axios.post(backendurl + '/api/auth/register', { name, email, password })
                if (data.success) {
                    setIsLoggedin(true)
                    getuserdata()
                    navigate('/')
                }
                else { toast.error(data.message) }
            }
            else {
                const { data } = await axios.post(backendurl + '/api/auth/login', { email, password })
                if (data.success) {
                    setIsLoggedin(true)
                    getuserdata()
                    navigate('/')
                }
                else { toast.error(data.message) }
            }
        }

        catch (error) {
            toast.error(data.message)
        }

    }

    return (
        <div className=' flex items-center justify-center min-h-screen px-6 sm:px-0
    bg-gradient-to-br  from-blue-200 to-purple-400'>
            <img src={assets.logo} alt="" onClick={() => navigate('/')}
                className='absolute left-5 sm:left-20 top-5
          w-28 sm:w-23 cursor-pointer' />
            <div className='bg-slate-900 p-10 rounded-lg shadow-lg  w-full sm:w-96 text-indigo-300 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === "Sing Up" ? "Create  Account" : "Login"}</h2>

                <p className='text-center mb-6 text-sm '>{state === "Sing Up" ? "Create Your Account" : "Login to your Account!"}</p>

                <form onSubmit={onSubmitHandler}>
                    {state === 'Sing Up' && (

                        <div className='mb-4 flex items-center  gap-3 w-full px-5 py-2.5 
            rounded-full bg-[#333A5C]'>
                            <img src={assets.person_icon} alt="" />
                            <input className=' bg-transparent outline-none ' type="text" onChange={(e) => setname(e.target.value)} value={name} placeholder='Full name' required />
                        </div>
                    )}


                    <div className='mb-4 flex items-center  gap-3 w-full px-5 py-2.5 
            rounded-full bg-[#333A5C]'>
                        <img src={assets.mail_icon} alt="" />
                        <input className=' bg-transparent outline-none ' onChange={(e) => setemail(e.target.value)} value={email} type="email" placeholder='Enter Email' required />
                    </div>

                    <div className='mb-4 flex items-center  gap-3 w-full px-5 py-2.5 
            rounded-full bg-[#333A5C]'>
                        <img src={assets.lock_icon} alt="" />
                        <input className=' bg-transparent outline-none ' onChange={(e) => setpassword(e.target.value)} value={password} type="password" placeholder='Enter Password' required />
                    </div>

                    <p className='mb-4 text-indigo-500 cursor-pointer' onClick={() => navigate('/reset-password')}>Forgot Password?</p>
                    <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900'>{state}</button>
                </form>
                {state === 'Sing Up' ? (<p className='text-gray-400 text-center text-xs mt-4'
                >Already have an Account?{'  '} <span onClick={() => setstate('Login')} className='text-blue-400 cursor-pointer underline'> Login here</span></p>
                ) : (<p className='text-gray-400 text-center text-xs mt-4'
                >Don't have an account?{'  '} <span onClick={() => setstate('Sing Up')} className='text-blue-400 cursor-pointer underline'>Sing Up</span></p>
                )}



            </div>
        </div>
    )
}

export default Login