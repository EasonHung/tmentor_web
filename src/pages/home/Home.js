import { useEffect } from 'react';
import { gapi } from 'gapi-script'
import './css/home.css'
import { useNavigate } from 'react-router-dom';
import { login } from './service/loginService'

function HomePage() {
    const navigate = useNavigate()

    useEffect(() => {
        gapi.load('auth2', () => {
            gapi.auth2.init().then(function(auth2) {
                if (auth2.isSignedIn.get()) {
                    var googleUser = auth2.currentUser.get();
                    login(googleUser)
                    .then(() => {
                        navigate('/classroom')
                    })
                }
            });
        })

        gapi.signin2.render('my-signin2', {
            'scope': 'profile email',
            'longtitle': true,
        })
    }, [navigate])


    return (
    <div className='center'>
        {/* <h1>My Home Page</h1> */}
        <img src="/assets/images/logo.png" alt=''></img>
        <div className='loginBtn' id='my-signin2'></div>
    </div>
    )
}

export default HomePage