import React, {useState,useEffect} from 'react'
import { useForm } from 'react-hook-form';
import {apiConnector} from "../../services/apiconnector";
import {contactusEndpoint} from "../../services/api";
import {toast} from "react-hot-toast"

import CountryCode from "../../data/countrycode.json"

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful}
    } = useForm();

    useEffect( () =>{
        if(isSubmitSuccessful){
            reset({
                email:"",
                firstname:"",
                lastname:"",
                message:"",
                phoneNo:"",
            })
        }
    },[reset, isSubmitSuccessful]);

    const submitContactForm = async(data) =>{
        //console.log("Logging Data:",data);
        const toastId = toast.loading("loading...");
        try{
            setLoading(true);
            const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
            //console.log("Logged response:",response);
            if(!response.data.success){
                toast.error("Please try again, information not sent!");
            }
            setLoading(false);
            toast.success("Information sent Successfully...");
        }
        catch(err){
            console.log("Error: ",err.message);
            setLoading(false);
        }
        toast.dismiss(toastId);
    }
  return (
    <form onSubmit={handleSubmit(submitContactForm)}
        className="flex flex-col gap-7">
        <div className='flex flex-col gap-5 lg:flex-row'>
            {/* Firstname */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor='firstname' className="lable-style">
                    First Name
                </label>
                <input
                    type='text'
                    name="firstname"
                    id='firstname'
                    placeholder='Enter first name'
                    className="form-style"
                    {...register("firstname", {required: true})}
                    />
                    {
                        errors.firstname && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please enter your first name
                            </span>
                        )
                    }
            </div>

            {/* lastname */}
            <div className='flex flex-col gap-2 lg:w-[48%]'>
                <label htmlFor='lastname' className="lable-style">
                    Last Name
                </label>
                <input
                    type='text'
                    name="lastname"
                    id='lastname'
                    placeholder='Enter first name'
                    className="form-style"
                    {...register("lastname",{required: true})}
                    />
                    {
                        errors.lastname && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please enter your last name
                            </span>
                        )
                    }
            </div>
        </div>

        {/* email */}
        <div className='flex flex-col gap-2'>
            <label htmlFor='email' className='label-style'>
                Email address
            </label>
            <input 
                id='email'
                text="email"
                placeholder='Enter your Email'
                name='email'
                className='form-style'
                {...register("email", {required:true})}
                />
                {
                    errors.email && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Enter your Email
                        </span>
                    )
                }
        </div>

        {/* phoneno */}
        <div className="flex flex-col gap-2">
            <label htmlFor="phonenumber" className="lable-style">
                Phone Number
            </label>

            <div className="flex gap-5">
            <div className="flex w-[81px] flex-col gap-2">
                <select
                type="text"
                name="countrycode"
                id="countrycode"
                defaultValue={"+91"}
                className="form-style"
                {...register("countrycode", { required: true })}
                >
                {CountryCode.map((ele, i) => (
                    <option key={i} value={ele.code}>
                        {ele.code} -{ele.country}
                    </option>
                ))}
                </select>
            </div>
            <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                <input
                name="phonenumber"
                id="phonenumber"
                placeholder="12345 67890"
                className="form-style"
                {...register("phoneNo", {
                    required: {
                    value: true,
                    valueAsNumber: true,
                    message: "Please enter your Phone Number.",
                    },
                    pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must be 10 digits.",
                    },
                })}
                />
            </div>
            </div>
            {errors.phoneNo && (
            <span className="-mt-1 text-[12px] text-yellow-100">
                {errors.phoneNo.message}
            </span>
            )}
        </div>


        {/* message */}
        <div className='flex flex-col gap-2'>
            <label htmlFor='message' className='label-style'>
                Message
            </label>
            <textarea
                name='message'
                id='message'
                cols="30"
                rows="7"
                placeholder='Enter your message here'
                className='form-style'
                {...register("message",{required: true})}
                />
                {
                    errors.message && (
                        <span
                        className="-mt-1 text-[12px] text-yellow-100">
                            Enter your message
                        </span>
                    )
                }
        </div>

        <button
            disabled={loading}
            type="submit"
            className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
            ${
            !loading &&
            "transition-all duration-200 hover:scale-95 hover:shadow-none"
            }  disabled:bg-richblack-500 sm:text-[16px] `}
        >
            Send Message
      </button>

    </form>
  )
}

export default ContactUsForm