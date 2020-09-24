import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState({ email: '', password: '' })

    useEffect(() => {
       message(error)
       clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        } catch (e) {}
    }

    const registerHandler = async () => {
        try {
            await request('/api/auth/register', 'POST', {...form})
        } catch (e) {}
    }

    return (
        <div className='row'>
            <div className='col s6 offset-s3'>
                <h1>Short up your links</h1>
                <div className="card  blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authentification</span>
                        <div>
                            <div className='input-field'>
                                <input placeholder="Insert your email" id="email" type="email" name='email' value={form.email} className="validate" onChange={changeHandler} />
                                <label htmlFor="first_name">Email</label>
                            </div>

                            <div className='input-field'>
                                <input placeholder="Insert your password" id="password" type="password" name='password'  className="validate" onChange={changeHandler} />
                                <label htmlFor="first_name">Password</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button disabled={loading} className='btn yellow darken-4' onClick={loginHandler}>Log In</button>
                        <button disabled={loading} className='btn grey lighten-1 black-text' onClick={registerHandler}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage
