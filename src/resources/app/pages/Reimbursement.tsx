import React, {useState, useEffect} from 'react';
import Loading from '@/components/Loading';
import { useProfile } from "@/providers/UserProfileProvider";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaSolid from '@fortawesome/free-solid-svg-icons';

interface IData {
    id: number;
    submitted_by: string;
    description: string;
    supporting_file: string;
    submitted_date: string;
    responded_by: string | null | undefined;
    responded_status: string | null | undefined;
    responded_date: string | null | undefined;
    responded_by_name: string | null | undefined;
    submitted_by_name: string | null | undefined;
}

export default function Reimbursement() {
    const {state} = useProfile();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<IData[]>([]);
    async function getData() {
        setIsLoading(true);
        const response = await fetch(`${window.location.origin as string}/api/v1/reimbursement`, {
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
        document.title = "Data Reimbursement";
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
        }
        getData();
    }, [])
    return <React.Fragment>

        <Loading isLoading={isLoading} />
        <div className="px-3 py-2 border-gray-200 border-2 rounded-md">
            <div className="mb-3">
                <h2 className="text-4xl font-bold mb-4">Data Reimbursement</h2>
                <div className='overflow-x-auto'>
                    <table className="min-w-full border-collapse border border-gray-400">
                        <thead>
                            <tr>
                                <th className="border border-gray-400 px-4 py-2">Action</th>
                                <th className="border border-gray-400 px-4 py-2">Tanggal Pengajuan</th>
                                <th className="border border-gray-400 px-4 py-2">Diajukan Oleh</th>
                                <th className="border border-gray-400 px-4 py-2">Tanggal Ditanggapi</th>
                                <th className="border border-gray-400 px-4 py-2">Ditanggapi Oleh</th>
                                <th className="border border-gray-400 px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            data.map((item, index) => {
                                return <tr key={item.id} className={index % 2 !== 0 ? 'bg-gray-200' : ''}>
                                    <td className="border border-gray-400 px-4 py-2">
                                        {
                                            item.responded_status != 'approved' && item.responded_status != 'rejected' ? <>
                                                <button className={`bg-green-500 text-white px-3 py-2 ml-2 mr-2 rounded-md`} onClick={async () => {
                                                    Swal.fire({
                                                        toast: false,
                                                        showConfirmButton: true,
                                                        title: "Apakah anda yakin?",
                                                        icon: 'warning',
                                                        text: "Apakah anda yakin ingin menyetujui pengajuan ini?",
                                                        showDenyButton: true,
                                                        showCancelButton: false,
                                                        confirmButtonText: 'Iya',
                                                        denyButtonText: `Tidak`,
                                                        position: 'center',
                                                    }).then(async (result) => {
                                                        if (result.isConfirmed) {
                                                            setIsLoading(true);
                                                            const response = await fetch(`${window.location.origin as string}/api/v1/reimbursement/approve/${item.id}`, {
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
                                                                    text: "Berhasil diterima",
                                                                    timer: 3000,
                                                                });
                                                                getData();
                                                            }
                                                        }
                                                    })
                                                }}>
                                                    <FontAwesomeIcon icon={FaSolid.faCheck} />
                                                </button>
                                                <button className={`bg-red-500 text-white px-3 py-2 rounded-md`} onClick={async () => {
                                                    Swal.fire({
                                                        toast: false,
                                                        showConfirmButton: true,
                                                        title: "Apakah anda yakin?",
                                                        icon: 'warning',
                                                        text: "Apakah anda yakin ingin menolak pengajuan ini?",
                                                        showDenyButton: true,
                                                        showCancelButton: false,
                                                        confirmButtonText: 'Iya',
                                                        denyButtonText: `Tidak`,
                                                        position: 'center',
                                                    }).then(async (result) => {
                                                        if (result.isConfirmed) {
                                                            setIsLoading(true);
                                                            const response = await fetch(`${window.location.origin as string}/api/v1/reimbursement/reject/${item.id}`, {
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
                                                                    text: "Berhasil ditolak",
                                                                    timer: 3000,
                                                                });
                                                                getData();
                                                            }
                                                        }
                                                    })
                                                }}>
                                                    <FontAwesomeIcon icon={FaSolid.faTimes} />
                                                </button> 
                                            </>: <></>
                                        }
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2">{item.submitted_date}</td>
                                    <td className="border border-gray-400 px-4 py-2">{item.submitted_by_name}</td>
                                    <td className="border border-gray-400 px-4 py-2">{item.responded_date}</td>
                                    <td className="border border-gray-400 px-4 py-2">{item.responded_by_name}</td>
                                    <td className={item.responded_status != null && item.responded_status != undefined ? item.responded_status == 'approved' ? 'border border-gray-400 px-4 py-2 text-green-500 text-center' : 'border border-gray-400 px-4 py-2 text-red-500 text-center' : 'border border-gray-400 px-4 py-2'}>{item.responded_status?.toUpperCase()}</td>
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