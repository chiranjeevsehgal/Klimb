import React, { useEffect, useState } from 'react'
import { getFirestore, collection, addDoc, getDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore/lite';
import { useParams, useNavigate } from 'react-router-dom';

function Add({ app }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        email: '',
        phone: '',
        type: '',
        location: '',
        function: ''
    });
    const [originalEmail, setOriginalEmail] = useState('');
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (id) {
            const fetchUser = async () => {
                const db = getFirestore(app);
                const userDoc = doc(db, 'users', id);
                const userSnapshot = await getDoc(userDoc);
                if (userSnapshot.exists()) {
                    setFormData(userSnapshot.data());
                }
                setLoading(false);
            };
            fetchUser();
        }
        else {
            setLoading(false);
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const checkEmailExists = async (email) => {
        const db = getFirestore(app);
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const db = getFirestore(app);
        try {


            if (id) {
                await updateDoc(doc(db, 'users', id), formData);
                console.log("Document updated with ID: ", id);
            } else {

                const emailExists = await checkEmailExists(formData.email);

                if (emailExists && (!id || formData.email !== originalEmail)) {
                    alert('This email id already exists.');
                    return;
                }

                const docRef = await addDoc(collection(db, 'users'), formData);
                console.log("Document written with ID: ", docRef.id);
            }

            alert(id ? 'User updated successfully!' : 'User added successfully!');
            navigate('/');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error updating user. Please try again.');
        }
    };


    return (
        <>
            <div className='flex justify-center mt-12 p-4'>
                <div className='flex flex-col w-full max-w-4xl border-4 border-gray-400 py-4 px-2'>
                    <div className="flex flex-col sm:flex-row w-full justify-end px-4">
                        <h3 className='text-md text-gray-400 italic'>All fields are mandatory</h3>

                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="inline-block w-8 h-8">
                                <span className="">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className='w-full p-4 sm:p-6 mt-4 flex flex-col gap-y-4'>
                            <form onSubmit={handleSubmit} className='w-full p-4 sm:p-6 mt-4 flex flex-col gap-y-4'>
                                <div className='flex flex-col sm:flex-row gap-4'>
                                    <div className='flex flex-col w-full sm:w-1/2'>
                                        <label htmlFor="firstName" className='text-sm'>FIRST NAME <span className='text-red-600'>*</span></label>
                                        <input type="text" name="firstname" id="firstname" value={formData.firstname} onChange={handleChange} placeholder='First Name' className='px-4 sm:px-8 rounded-lg py-2 bg-white border w-full' required />
                                    </div>

                                    <div className='flex flex-col w-full sm:w-1/2'>
                                        <label htmlFor="lastName" className='text-sm'>LAST NAME <span className='text-red-600'>*</span></label>
                                        <input type="text" name="lastname" id="lastname" value={formData.lastname} onChange={handleChange} placeholder='Last Name' className='px-4 sm:px-8 rounded-lg py-2 bg-white border w-full' required />
                                    </div>
                                </div>
                                <div className='flex flex-col sm:flex-row gap-4'>

                                    <div className='flex flex-col w-full sm:w-1/2'>
                                        <label htmlFor="phone" className='text-sm'>PHONE <span className='text-red-600'>*</span></label>
                                        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} placeholder='Phone Number' className='px-4 sm:px-8 rounded-lg py-2 bg-white border w-full' required maxLength={10} pattern="\d*"
                                            onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}

                                        />
                                    </div>
                                    <div className='flex flex-col w-full sm:w-1/2'>
                                        <label htmlFor="email" className='text-sm'>EMAIL ID <span className='text-red-600'>*</span></label>
                                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} placeholder='Email' className='px-4 sm:px-8 rounded-lg py-2 bg-white border w-full' required />
                                    </div>
                                </div>
                                <div className='flex flex-col sm:flex-row gap-4'>
                                    <div className='flex flex-col w-full sm:w-1/2'>
                                        <label htmlFor="role" className='text-sm'>ROLE <span className='text-red-600'>*</span></label>
                                        <input type="text" name="type" id="type" value={formData.type} onChange={handleChange} placeholder='Role' className='px-4 sm:px-8 rounded-lg py-2 bg-white border w-full' required />
                                    </div>
                                    <div className='flex flex-col w-full sm:w-1/2'>
                                        <label htmlFor="location" className='text-sm'>LOCATION <span className='text-red-600'>*</span></label>
                                        <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} placeholder='Location' className='px-4 sm:px-8 rounded-lg py-2 bg-white border w-full' required />
                                    </div>
                                </div>
                                <div className='flex flex-col sm:flex-row gap-4'>
                                    <div className='flex flex-col w-full sm:w-1/2'>

                                        <label htmlFor="department" className='text-sm'>DEPARTMENT <span className='text-red-600'>*</span></label>
                                        <input type="text" name="function" id="function" value={formData.function} onChange={handleChange} placeholder='Department' className='px-4 sm:px-8 rounded-lg py-2 bg-white border w-full' required />
                                    </div>
                                </div>
                                <div className='flex justify-center mt-6 gap-x-10'>

                                    <a href='/' className='px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
                                        Back
                                    </a>
                                    <button type="submit" className='px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Add