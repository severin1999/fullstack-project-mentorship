import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'

const CratePage = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const [link, setLink] = useState('')
    const {request} = useHttp()
    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const pressHandler = async event => {
        if (event.key === 'Enter') {
            try {
                const data = await request('/api/link/generate', 'POST', {from: link}, {
                    Authorization: `Bearer ${auth.token}`
                })
                history.push(`/detail/${data.link._id}`)
            } catch (e) {}
        }
    }

    return (
        <div className='row'>
            <div className='col s8 offset-s2'>
                <div className='input-field'>
                    <input placeholder="Insert your link" id="link" value={link} type="text" onChange={e => setLink(e.target.value)} onKeyPress={pressHandler} />
                    <label htmlFor="link">Insert link</label>
                </div>
            </div>
        </div>
    )
}

export default CratePage
