import React, { useEffect, useState } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BsChevronDown  } from "react-icons/bs";
import {AiOutlineMenu} from "react-icons/ai"

import ProfileDropDown from "../cors/auth/ProfileDropDown";
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/api';

import {ACCOUNT_TYPE} from "../../utils/Constants";
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links";

const Navbar = () => {

  const {token} = useSelector((state) => state.auth);
  const {user} = useSelector( state => state.profile);
  const {totalItems} = useSelector( state => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchSublinks = async() =>{
    setLoading(true);
    try{
      const result = await apiConnector("GET",categories.CATEGORIES_API);
      console.log("printing sublinks result:",result.data.data);
      setSubLinks(result.data.data);
    }
    catch(err){
      console.log("could not fetch the categories list");
    }
    setLoading(false);
  }

  useEffect( () =>{
    fetchSublinks();
  },[])
  
  const matchRoute = (route) =>{
    return matchPath({path:route}, location.pathname);
  }

  return (
    <div  className={`flex h-14 items-center rounded-sm justify-center border-b-[1px] border-richblack-700
    ${location.pathname !== "/" ? "bg-richblack-800": ""} transition-all duration-200`}>

      <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
        <Link to="/">
          <img src={logo} alt='logo' width={160} height={42} loading='lazy'/>
        </Link>

        {/* Nav links */}
        <nav className='hidden md:block'>
          <ul className='flex gap-x-6 text-richblack-25'>
            {
              NavbarLinks.map((link, index) =>(
                <li key={index}>
                    {
                      link.title === "Catalog"
                      ?(
                        <div className={`flex flex-row items-center gap-1 group relative cursor-pointer
                        `}>
                          <p>{link.title}</p>
                          <BsChevronDown  />

                          <div className='invisible absolute left-[50%] top-[50%] z-[1000]
                          translate-x-[-50%] translate-y-[3rem] w-[200px]
                          flex flex-col
                          rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0
                          transition-all duration-150 group-hover:visible group-hover:opacity-100
                          group-hover:translate-y-[1.65rem] lg:w-[300px]'>

                            <div className='absolute left-[50%] top-0 -z-10
                            translate-x-[80%] translate-y-[-40%]
                            h-6 w-6 rotate-45 rounded bg-richblack-5'></div>
                               {
                                  loading ? (
                                    <p className='text-center'>Loading...</p>
                                  ) : (subLinks && subLinks.length > 0) ? (
                                    subLinks
                                      //?.filter((subLink) => subLink?.courses?.length > 0)
                                      ?.map((subLink) => (
                                        <Link
                                          to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                          key={subLink._id}
                                           className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                        >
                                          <p>{subLink.name}</p>
                                        </Link>
                                      ))
                                  ) : <p>No Course Found</p>
                                }
                          </div>
                          
                        </div>
                      )
                      :(
                        <Link to={link?.path}>
                          <p className={`${matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"}`}
                          >
                            {link.title}
                          </p>
                        </Link>
                      )
                    }

                  </li>
              ))
            }
          </ul>
        </nav>

        {/*Login/Signup/DashBoard */}
        <div className='flex gap-x-4 items-center'>
          {
            user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
              <Link to="/dashboard/cart" className='relative'>
                <AiOutlineShoppingCart className="text-2xl text-richblack-100"/>
                {
                  totalItems > 0 && (
                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                      {totalItems}
                    </span>
                  )
                }
              </Link>
            )
          }
          {
            token === null && (
              <Link to="/login">
                <button className='border border-richblack-700 bg-richblack-800 px-[12px]
                py-[8px] text-richblack-100 rounded-md'>
                  Log in
                </button>
              </Link>
            )
          }
          {
            token === null && (
              <Link to="/signup" >
                <button className='border border-richblack-700 bg-richblack-800 px-[12px]
                py-[8px] text-richblack-100 rounded-md'>
                  Sign up
                </button>
              </Link>
            )
          }
          {
            token !== null && <ProfileDropDown />
          }
          
          <button className="mr-4 md:hidden">  
            <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar