import { useContext, useEffect, useState } from 'react';
import authService from '../../appwrite/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { SetContext } from '../../contexts/setContext';

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    const secret = params.get('secret');
    const alertShown = useRef(false);
    const [msg, setMsg] = useState(null);
    const [loader, setLoader] = useState(false);
    const {setUserData} = useContext(SetContext);



    useEffect(() => {
        const emailVerification = async () => {
            setMsg(null);

            if (userId && secret) {
                setLoader(true)
                await authService.verifyEmail(userId, secret)
                    .then(() => {
                        setMsg("success")
                        setUserData((prev) => ({...prev, emailVerification: true}))
                            ; // Redirect after verification
                    })
                    .catch(async (error) => {
                        await authService.logout()
                        console.error(error.message);
                        setMsg("failed")

                    })
                    .finally(() => {
                        setLoader(false)
                    })
            }
        };

        emailVerification();
    }, []);

    return (
    <div className="h-[70vh] flex justify-center flex-col items-center gap-6">
        
        {loader ? <div className=' bg-blue-700 px-10 py-4 text-4xl h-20 rounded-lg text-white'>Verifying email...</div> : <p className='cursor-pointer text-center hover:bg-blue-800 bg-blue-700 px-10 py-4 text-4xl h-20 rounded-lg text-white transition duration-300'>{msg==="success" ? <span onClick={() => navigate("/")}>Email verification successful, go to home page</span> : <span onClick={() => navigate("/verifypage")}>Email verification failed, go to verifypage</span>}</p>}
    </div>
    )
};

export default VerifyEmail;
