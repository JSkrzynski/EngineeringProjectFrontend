import React, { useState } from 'react';
import axios from 'axios';
import { baseURL } from '../functions';

export default function LoginForm( props ) {
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
      };
    
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const data = {
                email: email,
                password: password
            }
            const response = await axios.post(`${baseURL}/api/auth`, data);
            if (response.data.role[0].authority === "ROLE_ADMIN") {
                props.onLoginSuccess(response.data.accessToken, response.data.email, "ADMIN");
            } else {
                props.onLoginSuccess(response.data.accessToken, response.data.email, "USER");
            }
            props.setTrigger(false);
            
        } catch (error) {
            console.error("Błąd podczas autoryzacji", error);
            props.onLoginError(error);
        }
    };

    return (props.trigger) ? (
        <div className='Popup'>
            <div className='PopupInner'>
                <button onClick={ () => props.setTrigger(false) } className="CloseButton">Zamknij</button><br/>
                <h2>Proszę się zalogować</h2>
                <a href={`${baseURL}/oauth2/authorization/google`}><img className='GoogleLoginImg' src='/web_light_sq_SI@1x.png' alt='Zaloguj poprzez Google'/></a>
                <div className='JWTInputs'>
                    <input type='text' id='email' autoComplete="on" onChange={handleEmailChange} placeholder='E-Mail'></input><br/>
                    <input type='password' id='pass' autoComplete="on" onChange={handlePasswordChange} placeholder='Hasło'></input><br/>
                    <button className='ConfirmLoginButton' onClick={handleSubmit} disabled={!email || !password}>Zaloguj</button>
                </div>
            </div>
        </div>
    ) : "";
}