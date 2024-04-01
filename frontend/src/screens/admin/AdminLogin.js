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
        <section className="bg-purple-200 rounded-2xl p-5 mb-5">
            <div className="container mx-auto">
                <div className="py-5">
                    <h2 className="text-center text-5xl font-bold">
                        Admin Login
                    </h2>
                </div>
                <div className=" w-1/2 text-center mx-auto mb-10 bg-white p-5 rounded-2xl shadow-lg">
                    <h2 className="text-center text-3xl font-bold text-gray-700">Login</h2><br />
                    <div className=" flex flex-col justify-center p-12">
                        <input onChange={handleInput} className="border border-black p-3 rounded-2xl font-bold text-lg shadow mb-5" type="email"
                            name='email' placeholder="Enter E-mail" />

                        <input onChange={handleInput} className="border border-black p-3 rounded-2xl font-bold text-lg shadow" type="password"
                            name='password' placeholder="Enter Password" />
                        {error && <h3 className="mb-5 font-bold text-red-600 text-lg text-left">{error}</h3>}
                        <div className="flex justify-center">
                            <button onClick={handleSubmit}
                                disabled={loading}
                                className="bg-purple-600 text-lg text-white px-2 py-0.5 rounded-xl font-bold mt-3 hover:bg-purple-900 mt-5">{loading ? 'Loading...' : 'Submit'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AdminLogin