import { FiSettings } from "react-icons/fi";
import { Outlet, Link } from 'react-router-dom'



const PublicLayout = () => {
    return (
        <main className='flex h-screen w-screen bg-gradient-to-bl from-red-500 via-purple-500 to-blue-500'>

            <div className='w-full'>
                <div className="w-[30%] min-w-[400px]  bg-white m-5 mx-auto rounded-xl ">
                    {/* Outlet for nested routed which are difined in children route of this componet */}
                    <Outlet />
                </div>
            </div>
        </main>
    )
}

export default PublicLayout