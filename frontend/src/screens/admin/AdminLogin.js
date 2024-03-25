import React, { useState } from 'react'
import { loginAdmin } from '../../api/adminAPI';
import {useNavigate} from 'react-router-dom'
const AdminLogin = () => {
    const initialInput = {
        email: '',
        password: ''
    }
    const [input, setInput] = useState(initialInput)
    const [error, setError] = useState(null);
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInput((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const result = await loginAdmin(input)
            console.log(result);
            navigate('/admin-panel')
        }
        catch(err){
            setError(err.response.data.message)
        }
        finally{
            setLoading(false)
        }
    }
    return (
        <section class="bg-purple-100 rounded-2xl p-5 mb-10">
            <div class="container mx-auto">
                <div class="py-28">
                    <h2 class="text-center text-5xl font-bold">
                        Admin Login
                    </h2>
                </div>
                <div class=" w-1/2 text-center mx-auto mb-10 bg-white p-10 rounded-2xl shadow-lg">
                    <h2 class="text-center text-3xl font-bold text-gray-700">Login</h2><br />
                    <div class="border flex flex-col justify-center p-12">
                        <input onChange={handleInput} class="border border-black p-3 rounded-2xl font-bold text-lg shadow mb-5" type="email"
                            name='email' placeholder="Enter E-mail" />

                        <input onChange={handleInput} class="border border-black p-3 rounded-2xl font-bold text-lg shadow" type="password"
                            name='password' placeholder="Enter Password" />
                        {error && <h3 class="mb-5 font-bold text-red-600 text-lg text-left">{error}</h3>}
                        <div class="flex justify-center">
                            <button onClick={handleSubmit}
                                class="bg-purple-600 text-lg text-white p-3 rounded-2xl hover:bg-purple-900 mt-5">{loading ? 'Loading...' : 'Submit'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AdminLogin