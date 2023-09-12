import React from 'react'

const ConfirmModel = ({ message, onConfirmClick, onCancelClick }) => {
    return (
        <> <div className='relative w-full'>
            <div className='outline-2 z-10 h-48 absolute rounded w-3/4 p-10 bg-white mx-auto left-0 right-0  mt-10'>
                <div className='outline outline-gray-300  h-full w-full rounded'>
                    <h3 className='text-xl text-center py-5'>
                        {message}
                    </h3>
                    <div className='flex justify-center'>
                        <button onClick={onConfirmClick} >
                            <div className='border-2  font-bold border-gray-600 rounded-full text-sm p-0.5 px-2 m-1 flex items-center '>
                                Confirm
                            </div>
                        </button>
                        <button onClick={onCancelClick} >
                            <div className='border-2  font-bold border-gray-600 rounded-full text-sm p-0.5 px-2 m-1 flex items-center '>
                                cancel
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div> </>
    )
}

export default ConfirmModel