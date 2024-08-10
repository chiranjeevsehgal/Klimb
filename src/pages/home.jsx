import { CirclePlus, Search, UserPen } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { Link } from 'react-router-dom';


function Home({ app }) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUsers = async () => {
            const db = getFirestore(app);
            const usersCollection = collection(db, 'users');
            const userSnapshot = await getDocs(usersCollection);
            const userList = userSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userList);
            setFilteredUsers(userList);
            setLoading(false);
        };

        fetchUsers();
    }, []);


    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === '') {
            setFilteredUsers(users);
            setSuggestions([]);
        } else {
            const matchedUsers = users.filter(user =>
                user.email.toLowerCase().includes(term)
            );
            setSuggestions(matchedUsers.map(user => ({
                email: user.email,
                fullName: `${user.firstname} ${user.lastname}`
            })));
            setFilteredUsers(matchedUsers);
        }
    };

    const handleSelectSuggestion = (email) => {
        setSearchTerm(email);
        setFilteredUsers(users.filter(user => user.email === email));
        setSuggestions([]);
    };


    return (
        <>
            <div className='flex justify-center mt-12 p-4'>
                <div className='flex flex-col w-full max-w-4xl border-4 border-gray-400 py-4 px-2'>
                    <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-4">
                        <h3 className='text-lg text-green-600'>Manage Users</h3>
                        <div className='flex flex-row gap-x-4 items-center'>
                            <button><Search size={28} /></button>
                            <a href='/adduser' className='px-4 sm:px-8 py-2 bg-green-600 rounded-lg items-center gap-x-2 flex text-white'><CirclePlus size={18} /> <span className='hidden sm:inline'>Add</span></a>
                        </div>
                    </div>
                    <div className='bg-gray-100 w-full p-4 sm:p-6 mt-4'>
                        <input type="text" name="" id="" placeholder='Search for email' className='px-4 sm:px-8 rounded-lg py-2 bg-white border ' value={searchTerm} onChange={handleSearch} />
                        {suggestions.length > 0 && (
                            <ul className='z-10 bg-white border border-gray-300 w-full mt-2 rounded-lg overflow-auto'>
                                {suggestions.map((suggestion, index) => (
                                    <li 
                                        key={index} 
                                        className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                                        onClick={() => handleSelectSuggestion(suggestion.email)}
                                    >
                                        <span className='font-bold'>{suggestion.email}</span> - {suggestion.fullName}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className='w-full mt-8'>
                    {loading ? (
                            <div className="text-center py-8">
                                <div className="loader"></div> 
                                <p>Loading users...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                            <table className="w-full text-sm sm:text-base mb-12 ">
                            <colgroup>
                                <col className='w-1/6' />
                                <col className='w-1/6' />
                                <col className='w-1/8' />
                                <col className='w-1/5' />
                                <col className='w-1/6' />
                                <col />

                                <col className="w-1/8" />
                                </colgroup>
                                <thead className="">
                                    <tr className="text-left">
                                        <th className="p-3 px-12">NAME</th>
                                        <th className="p-3 whitespace-nowrap">PHONE NO.</th>
                                        <th className="p-3">TYPE</th>
                                        <th className="p-3">LOCATION</th>
                                        <th className="p-3">FUNCTION</th>
                                        <th className="p-3">EDIT</th>

                                    </tr>
                                </thead>
                                <tbody>
                                {filteredUsers.length > 0 ? (
                                        filteredUsers.map(user => (
                                            <tr key={user.id} className="border-b border-opacity-20 border-gray-800 ">
                                            <td className="p-3 px-12 font-bold whitespace-nowrap">{user.firstname} {user.lastname}</td>
                                            <td className="p-3 whitespace-nowrap">{user.phone}</td>
                                            <td className="p-3 font-bold whitespace-nowrap">{user.type}</td>
                                            <td className="p-3 whitespace-nowrap">{user.location}</td>
                                            <td className="p-3 ">{user.function}</td>
                                            <td className="p-3">
                                                <Link to={`/adduser/${user.id}`}>
                                                    <button><UserPen /></button>
                                                </Link>
                                            </td>
                                        </tr>
                                        ))
                                    ): (
                                        <tr>
                                            <td colSpan="6" className="p-3 text-center text-red-600">
                                                No results found
                                            </td>
                                        </tr>
                                    
                                    )}
                                </tbody>
                            </table>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home