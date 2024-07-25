import { Formik, Form, Field } from "formik";
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as FaSolid from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Loading from "@/components/Loading";
import { useProfile } from "@/providers/UserProfileProvider";
export default function Reimbursement() {
    const {state} = useProfile();
    const initalValues: {
        submitted_date: Date;
        description: string;
    } = {
        submitted_date: new Date(),
        description: "",
    }
    const schema = Yup.object().shape({
        submitted_date: Yup.date().required("Input Tanggal wajib diisi"),
        description: Yup.string().required("Input Deskripsi wajib diisi"),
    })
    const [isLoading, setIsLoading] = useState(false);
    const [pdfFile, setPDFFile] = useState<File | undefined>(undefined);
    const inputFileRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        document.title = "Pengajuan Reimbursement";
        if(state.profile?.role != 'staff') {
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
    }, [])
    return <React.Fragment>
        <Loading isLoading={isLoading} />
        <div className="px-3 py-2 border-gray-200 border-2 rounded-md">
            <div className="mb-3">
                <h2 className="text-4xl font-bold">Reimbursement</h2>
            </div>
            <Formik initialValues={initalValues} validationSchema={schema} onSubmit={async(values, {resetForm}) => {
                if(pdfFile == undefined) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Peringatan',
                        position: 'center',
                        text: 'Input dokumen pendukung wajib diisi',
                        toast: false,
                        showConfirmButton: true
                    });
                    return;
                }
                setIsLoading(true);
                const formData = new FormData();
                formData.set('submitted_date', values.submitted_date.toISOString());
                formData.set('description', values.description);
                formData.set('supporting_file', pdfFile as File);
                const response = await fetch('/api/v1/reimbursement/submit', {
                    method: "POST",
                    body: formData
                });
                setIsLoading(false);
                if(response.ok) {
                    const result: API.IAPIResponse = await response.json();
                    if(result.code == 200) {
                        resetForm();
                        if(inputFileRef.current) {
                            inputFileRef.current.value = "";
                        }
                        setPDFFile(undefined);
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: result.message,
                            toast: true,
                            showConfirmButton: false,
                            position: 'top',
                            timer: 3000
                        })
                    }
                    else {
                        const errors = result.errors;
                        if(typeof errors == 'string') {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Peringatan',
                                position: 'center',
                                text: errors,
                                toast: false,
                                showConfirmButton: true
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
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: "Internal server error",
                        toast: false,
                        showConfirmButton: true,
                        position: 'center'
                    })
                }
            }}>
                {({ isSubmitting, values, errors, touched, setValues }) => (
                    <Form>
                        <div className="mb-4">
                            <label htmlFor="submitted_date" className="mb-2.5 block font-medium">
                                Tanggal Pengajuan
                            </label>
                            <div className="datepicker-container">
                                <DatePicker onChange={(date) => {
                                    setValues({
                                        ...values,
                                        submitted_date: date as Date
                                    })
                                }} selected={values.submitted_date} placeholderText="Pilih Tanggal" className="w-full border-2 border-gray-200 p-2" />
                            </div>
                            {errors.submitted_date && touched.submitted_date ? (
                                <div className="text-red-600">{errors.submitted_date as string}</div>
                            ) : null}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="mb-2.5 block font-medium">
                                Deskripsi
                            </label>
                            <div className="relative">
                                <Field
                                    as="textarea"
                                    rows={10}
                                    name="description"
                                    id="description"
                                    placeholder="Masukkan Deskripsi"
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary resize-none"
                                />
                            </div>
                            {errors.description && touched.description ? (
                                <div className="text-red-600">{errors.description}</div>
                            ) : null}
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="email" className="mb-2.5 block font-medium">
                                Dokumen Pendukung
                            </label>
                            <div className='mb-5 relative'>
                                <div className="absolute w-full h-40 top-0 left-0 border-dashed border-gray rounded border flex justify-center items-center">
                                    <div>
                                        <div className="text-center mb-3">
                                            <FontAwesomeIcon icon={FaSolid.faFile} color="gray" size="2xl" className="text-6xl" />
                                        </div>
                                        <div>
                                            <h3>Pilih atau tarik file PDF kesini</h3>
                                        </div>
                                    </div>
                                </div>
                                <input type="file" accept="application/pdf" ref={inputFileRef} className="opacity-0 w-full h-40 hover:cursor-pointer" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    const currentFiles = event.target.files
                                    setPDFFile(currentFiles![0]);
                                }} />
                                {pdfFile != undefined ? <div>
                                    <h3 className="bg-green-600 text-white p-2 rounded-md">File terpilih</h3>
                                </div> : <></>}
                            </div>
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
    </React.Fragment>
}