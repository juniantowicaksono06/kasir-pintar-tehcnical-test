import { Formik, Form, Field } from "formik";
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as FaSolid from '@fortawesome/free-solid-svg-icons';
import ImageCropper from '@/components/ImageCropper';
import Loading from "@/components/Loading";
import { useProfile } from "@/providers/UserProfileProvider";
import { useParams } from "react-router-dom";

interface IRegister {
    email: string;
    password: string;
    name: string;
    role: "staff" | "direktur" | "finance";
    phone: string;
    passwordConfirmation: string;
    nip: string;
    picture?: string;
}

export default function EditUser() {
    let params = useParams();
    const [initialValues, setInitialValues] = useState<IRegister>({
        password: "",
        passwordConfirmation: "",
        email: "",
        phone: "",
        name: "",
        role: "staff",
        nip: "",
    });
    async function getData() {
        const response = await fetch(`/api/v1/users/${params.id}`, {
            method: 'GET'
        });
        if(response.ok) {
            const result: API.IAPIResponse = await response.json();
            if(result.code == 200) {
                let responseData = result.data as IRegister;
                setInitialValues({
                    nip: responseData.nip,
                    name: responseData.name,
                    email: responseData.email,
                    phone: responseData.phone,
                    role: responseData.role,
                    password: '',
                    passwordConfirmation: '',
                });
            }
        }
    }
    const { state } = useProfile();
    useEffect(() => {
        document.title = "Eidt User";
        if(state.profile?.role != 'direktur') {
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
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [uploadedImgUrl, setUploadedImgUrl] = useState("");
    const [openCropper, setOpenCropper] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    
    const loginSchema = Yup.object().shape({
        email: Yup.string()
        .email('Not a valid email address')
        .required('Input email wajib diisi'),
        password: Yup.string()
        .min(6, 'Input password minimal 6 karakter')
        .optional(),
        passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'Password harus sama')
        .optional(),
        phone: Yup.string()
        .matches(/^\d{10,13}$/, 'Nomor HP harus terdiri dari 10 hingga 13 digit angka')
        .required("Nomor HP wajib diisi"),
        name: Yup.string()
        .min(2, 'Input nama minimal 2 karakter')
        .required('Input nama wajib diisi'),
        role: Yup.string().required('Input role wajib diisi'),
        nip: Yup.string().min(13, 'Input NIP harus terdiri dari 13 digit angka').required('Input NIP wajib diisi')
    });
    return (
        <React.Fragment>
            <div className="px-3 py-2 border-gray-200 border-2 rounded-md">
                <div className="mb-3">
                    <h2 className="text-4xl font-bold mb-4">Edit User</h2>
                    <div className='overflow-x-auto'>
                        <Formik 
                                enableReinitialize
                                initialValues={initialValues}
                                validationSchema={loginSchema}
                                onSubmit={async(values) => {
                                    var data: IRegister;
                                    if(!uploadedImgUrl) {
                                        data = {
                                            ...values
                                        }
                                        delete data['picture'];
                                    }
                                    else {
                                        data = {
                                            ...values,
                                            picture: uploadedImgUrl
                                        }
                                    }
                                    setIsLoading(true);
                                    const response = await fetch(`${window.location.origin as string}/api/v1/users/edit/${params.id}`, {
                                        method: "POST",
                                        body: JSON.stringify(data),
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    });
                                    setIsLoading(false);
                                    var result: API.IAPIResponse;
                                    if(response.ok) {
                                        result = await response.json();
                                        if(result.code == 201) {
                                            Swal.fire({
                                                title: "Berhasil",
                                                text: result.message,
                                                icon: "success",
                                                position: 'top',
                                                showConfirmButton: false,
                                                toast: true,
                                                timer: 3000,
                                                didClose: () => {
                                                    window.location.href = '/users';
                                                }
                                            });
                                        }
                                        else {
                                            let errors = result.errors as { [key: string]: string[] };
                                            let errorList = "<ol>";
                                            Object.keys(errors).forEach((key: string) => {
                                                errors[key].forEach((error: string) => {
                                                    errorList += `<li>${error}</li>`;
                                                });
                                            });
                                            errorList += "</ol>";
                                            Swal.fire({
                                                title: "Perigatan",
                                                icon: 'warning',
                                                html: errorList,
                                                showConfirmButton: true,
                                                position: 'center'
                                            })
                                        }
                                    }
                                    else {
                                        result = await response.json();
                                        Swal.fire({
                                            title: "Gagal",
                                            icon: "error",
                                            text: result.message,
                                            showConfirmButton: true
                                        });
                                    }
                                }}
                            >
                                {({ isSubmitting, errors, touched }) => (
                                    <Form>
                                        <div className="mb-4">
                                            <label htmlFor="email" className="mb-2.5 block font-medium">
                                                Nama Lengkap
                                            </label>
                                            <div className="">
                                                <Field
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    placeholder="Masukkan Nama Lengkap"
                                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary"
                                                />
                                            </div>
                                            {errors.name && touched.name ? (
                                                <div className="text-red-600">{errors.name}</div>
                                            ) : null}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="nip" className="mb-2.5 block font-medium">
                                                NIP
                                            </label>
                                            <div className="">
                                                <Field
                                                    type="text"
                                                    name="nip"
                                                    id="nip"
                                                    placeholder="Masukkan NIP"
                                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary"
                                                />
                                            </div>
                                            {errors.nip && touched.nip ? (
                                                <div className="text-red-600">{errors.nip}</div>
                                            ) : null}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="email" className="mb-2.5 block font-medium">
                                                Email
                                            </label>
                                            <div className="">
                                                <Field
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    placeholder="Masukkan Email"
                                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary"
                                                />
                                            </div>
                                            {errors.email && touched.email ? (
                                                <div className="text-red-600">{errors.email}</div>
                                            ) : null}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="email" className="mb-2.5 block font-medium">
                                                Nomor HP
                                            </label>
                                            <div className="">
                                                <Field
                                                    type="text"
                                                    name="phone"
                                                    id="phone"
                                                    placeholder="Masukkan Nama Lengkap"
                                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary"
                                                />
                                            </div>
                                            {errors.phone && touched.phone ? (
                                                <div className="text-red-600">{errors.phone}</div>
                                            ) : null}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="password" className="mb-2.5 block font-medium">
                                                Password
                                            </label>
                                            <div className="">
                                                <Field
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    placeholder="Masukkan Password"
                                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary"
                                                />
                                            </div>
                                            {errors.password && touched.password ? (
                                                <div className="text-red-600">{errors.password}</div>
                                            ) : null}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="password" className="mb-2.5 block font-medium">
                                                Konfirmasi Password
                                            </label>
                                            <div className="">
                                                <Field
                                                    type="password"
                                                    name="passwordConfirmation"
                                                    id="passwordConfirmation"
                                                    placeholder="Masukkan Password"
                                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary"
                                                />
                                            </div>
                                            {errors.passwordConfirmation && touched.passwordConfirmation ? (
                                                <div className="text-red-600">{errors.passwordConfirmation}</div>
                                            ) : null}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="email" className="mb-2.5 block font-medium">
                                                Role
                                            </label>
                                            <div className="">
                                                <Field
                                                    as="select"
                                                    name="role"
                                                    className="w-full rounded-lg border border-stroke bg-white py-3.5 px-5 font-medium text-black dark:border-strokedark dark:bg-boxdark"
                                                >
                                                    <option value="staff">Staff</option>
                                                    <option value="direktur">Direktur</option>
                                                    <option value="finance">Finance</option>
                                                </Field>
                                            </div>
                                            {errors.email && touched.email ? (
                                                <div className="text-red-600">{errors.email}</div>
                                            ) : null}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="email" className="mb-2.5 block font-medium">
                                                Upload Gambar
                                            </label>
                                            <div className='mb-5 relative'>
                                                <div className="absolute w-full h-40 top-0 left-0 border-dashed border-gray rounded border flex justify-center items-center">
                                                    <div>
                                                        <div className="text-center mb-3">
                                                            <FontAwesomeIcon icon={FaSolid.faImage} color="gray" size="2xl" className="text-6xl" />
                                                        </div>
                                                        <div>
                                                            <h3>Pilih atau tarik gambar kesini</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <input type="file" accept="image/jpg, image/jpeg, image/png" ref={inputFileRef} className="opacity-0 w-full h-40 hover:cursor-pointer" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    const currentFiles = event.target.files
                                                    if(currentFiles && currentFiles.length > 0) {
                                                        const reader = new FileReader()
                                                        reader.onload = (e: ProgressEvent<FileReader>) => {
                                                            setImageUrl(e.target!.result as string);
                                                            setOpenCropper(true);
                                                            inputFileRef.current!.value = ""
                                                        }
                                                        reader.readAsDataURL(currentFiles[0])
                                                    }
                                                }} />
                                            </div>
                                            {uploadedImgUrl != "" ? <div>
                                                <h3 className="bg-green-600 text-white p-2 rounded-md">Gambar telah diupload</h3>
                                            </div> : <></>}
                                        </div>
                                        <div className="mb-2">
                                            <input
                                                type="submit"
                                                value="Submit"
                                                disabled={isSubmitting}
                                                className="rounded-lg bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white px-3 py-2"
                                            />
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                    </div>
                </div>
            </div>
            <Loading isLoading={isLoading} />
            <ImageCropper isOpen={openCropper} imageUrl={imageUrl} closeCropper={() => setOpenCropper(false)} uploadImage={async (file: Blob | null) => {
                const formData = new FormData();
                formData.append('image', file as Blob, 'gambar.png');
                const response = await fetch(`${window.location.origin as string}/api/v1/upload_image`, {
                    method: "POST",
                    body: formData
                });
                setIsLoading(true);
                if(response.ok) {
                    const result: {
                        code: number,
                        data: {
                            image: string
                        },
                        message: string
                    } = await response.json();
                    setIsLoading(false);
                    Swal.fire({
                        title: "Berhasil upload gambar",
                        icon: "success",
                        timer: 5000,
                        toast: true,
                        showConfirmButton: false,
                        position: "top"
                    });
                    setOpenCropper(false);
                    setImageUrl("");
                    setUploadedImgUrl(result.data.image);
                }
                else {
                    const result: {
                        message: string
                    } = await response.json();
                    Swal.fire({
                        title: "Gagal upload gambar",
                        icon: "warning",
                        text: result.message
                    });
                }
            }} />
        </React.Fragment>
    );
}