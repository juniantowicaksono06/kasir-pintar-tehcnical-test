import React, {useState, useEffect} from 'react';
import Loading from '@/components/Loading';
import { useProfile } from "@/providers/UserProfileProvider";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaSolid from '@fortawesome/free-solid-svg-icons';

interface IData {
    id: string;
    nip: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
}

export default function Reimbursement() {
    const {state} = useProfile();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<IData[]>([]);
    async function getData() {
        setIsLoading(true);
        const response = await fetch(`${window.location.origin as string}/api/v1/users`, {
            method: "GET"
        })
        if(response.ok) {
            const result: API.IAPIResponse = await response.json();
            if(result.code == 200) {
                let responseData = result.data as IData[];
                setData(responseData);
            }
        }
        setIsLoading(false);
    }
    useEffect(() => {
        document.title = "Data User";
        if(state.profile?.role == 'staff') {
            Swal.fire({
                toast: false,
                icon: 'warning',
                position: 'center',
                title: 'Peringatan',
                text: 'Anda tidak diizinkan mengakses halaman ini',
                showConfirmButton: true,
                didClose: () => {
                    window.location.href = '/';
                }
            })
            return;
        }
        getData();
    }, [])
    return <React.Fragment>

        <Loading isLoading={isLoading} />
        <div className="px-3 py-2 border-gray-200 border-2 rounded-md">
            <div className="mb-3">
                <h2 className="text-4xl font-bold mb-4">Data User</h2>
                <div className='overflow-x-auto'>
                    <div className="mb-3">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => {
                                window.location.href = '/users/create';
                            }}
                        >
                            <FontAwesomeIcon icon={FaSolid.faPlus} className="mr-2" />
                            Tambah User
                        </button>
                    </div>
                    <table className="min-w-full border-collapse border border-gray-400">
                        <thead>
                            <tr>
                                <th className="border border-gray-400 px-4 py-2">Action</th>
                                <th className="border border-gray-400 px-4 py-2">NIP</th>
                                <th className="border border-gray-400 px-4 py-2">Nama User</th>
                                <th className="border border-gray-400 px-4 py-2">Email</th>
                                <th className="border border-gray-400 px-4 py-2">Nomor HP</th>
                                <th className="border border-gray-400 px-4 py-2">Role</th>
                                <th className="border border-gray-400 px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            data.map((item, index) => {
                                return <tr key={item.id} className={index % 2 !== 0 ? 'bg-gray-200' : ''}>
                                    <td className="border border-gray-400 px-4 py-2">
                                        {
                                            item.id == state.profile?.id ? <></> : 
                                            <>
                                                <button className={`bg-blue-500 text-white px-3 py-2 ml-2 mr-2 rounded-md`} onClick={
                                                async () => {
                                                    window.location.href = `/users/${item.id}`;
                                                }}>
                                                    <FontAwesomeIcon icon={FaSolid.faPencil} />
                                                </button>
                                                {
                                                    item.status == 'active' ? 
                                                        <button className={`bg-red-500 text-white px-3 py-2 rounded-md`} onClick={async () => {
                                                            Swal.fire({
                                                                toast: false,
                                                                showConfirmButton: true,
                                                                title: "Apakah anda yakin?",
                                                                icon: 'warning',
                                                                text: "Apakah anda yakin ingin menonaktifkan user ini?",
                                                                showDenyButton: true,
                                                                showCancelButton: false,
                                                                confirmButtonText: 'Iya',
                                                                denyButtonText: `Tidak`,
                                                                position: 'center',
                                                            }).then(async (result) => {
                                                                if (result.isConfirmed) {
                                                                    setIsLoading(true);
                                                                    const response = await fetch(`${window.location.origin as string}/api/v1/users/${item.id}`, {
                                                                        method: "DELETE"
                                                                    });
                                                                    setIsLoading(false);
                                                                    if(response.ok) {
                                                                        Swal.fire({
                                                                            toast: true,
                                                                            showConfirmButton: false,
                                                                            title: "Sukses",
                                                                            icon: 'success',
                                                                            position: 'top',
                                                                            text: "Berhasil dinonaktifkan",
                                                                            timer: 3000,
                                                                        });
                                                                        getData();
                                                                    }
                                                                }
                                                            })
                                                        }}>
                                                            <FontAwesomeIcon icon={FaSolid.faTrash} />
                                                        </button> : <button className={`bg-green-500 text-white px-3 py-2 rounded-md`} onClick={async () => {
                                                    Swal.fire({
                                                        toast: false,
                                                        showConfirmButton: true,
                                                        title: "Apakah anda yakin?",
                                                        icon: 'warning',
                                                        text: "Apakah anda yakin ingin mengaktifkan user ini?",
                                                        showDenyButton: true,
                                                        showCancelButton: false,
                                                        confirmButtonText: 'Iya',
                                                        denyButtonText: `Tidak`,
                                                        position: 'center',
                                                    }).then(async (result) => {
                                                        if (result.isConfirmed) {
                                                            setIsLoading(true);
                                                            const response = await fetch(`${window.location.origin as string}/api/v1/users/activate/${item.id}`, {
                                                                method: "POST"
                                                            });
                                                            setIsLoading(false);
                                                            if(response.ok) {
                                                                Swal.fire({
                                                                    toast: true,
                                                                    showConfirmButton: false,
                                                                    title: "Sukses",
                                                                    icon: 'success',
                                                                    position: 'top',
                                                                    text: "Berhasil diaktifkan",
                                                                    timer: 3000,
                                                                });
                                                                getData();
                                                            }
                                                        }
                                                    })
                                                }}>
                                                    <FontAwesomeIcon icon={FaSolid.faCheck} />
                                                </button> 
                                                }
                                                
                                            </>
                                        }
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2">{item.nip}</td>
                                    <td className="border border-gray-400 px-4 py-2">{item.name}</td>
                                    <td className="border border-gray-400 px-4 py-2">{item.email}</td>
                                    <td className="border border-gray-400 px-4 py-2">{item.phone}</td>
                                    <td className="border border-gray-400 px-4 py-2">{item.role.toUpperCase()}</td>
                                    <td className="border border-gray-400 px-4 py-2">{item.status}</td>
                                </tr>
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </React.Fragment>
}