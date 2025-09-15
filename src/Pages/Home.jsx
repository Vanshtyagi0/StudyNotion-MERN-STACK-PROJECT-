import React from 'react'
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import HighlightText from '../components/cors/HomePage/HighlightText';
import CTAButton from '../components/cors/HomePage/Button'
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/cors/HomePage/CodeBlocks';
import TimelineSection from "../components/cors/HomePage/TimelineSection";
import LearningLanguageSection from '../components/cors/HomePage/LearningLanguageSection';
import InstructorSection from '../components/cors/HomePage/InstructorSection';
import ExploreMore from '../components/cors/HomePage/ExploreMore';
import Footer from '../components/common/Footer';
import ReviewSlider from '../components/common/ReviewSlider';

export const Home = () => {
  return (
    <div>
      {/* Section 1 */}
      <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center
      text-white justify-between'>

          <Link to={"/signup"}>
            <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
            transition-all duration-200 hover:scale-95 w-fit'>
              <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
              transition-all duration-200 group-hover:bg-richblack-900'>
                <p>Become an Instructor</p>
                <FaArrowRight />
              </div>
            </div>
                
            </Link>

          <div className='text-center text-4xl font-semibold mt-7'>
            Empower Your Future with
            <HighlightText text={"Coding Skills"} />
          </div>

          <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
            With our online coding course, you can learn at your own pace, from anywhere in the 
            world,and get access of resources,including hands-on projects,quizzes, and 
            personlised feedback from instructor.
          </div>

          <div className='flex flex-row gap-7 mt-8'>
            <CTAButton active={true} linkto={"/signup"}>
              Learn More
            </CTAButton>
            <CTAButton active={false} linkto={"/signup"}>
              Book a Demo
            </CTAButton>
          </div>

          <div className='mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200'>
            <video
            className='shadow-[20px_20px_rgba(255,255,255)]'
            muted
            loop
            autoPlay
            >
            <source src={Banner} type="video/mp4" />
            </video>
          </div>

          {/* code section 1 */}
          <div>
            <CodeBlocks
              position={"lg:flex-row"}
              heading={
                <div className='text-4xl font-semibold'>
                  Unlock your
                  <HighlightText text={"Coding potential "} />
                  with our online courses.
                </div>
              }
              subheading={
                "Our courses are designed and taught by industry experts who have year of experience in coding and are passionate about sharing their knowledge with you."
              }
              ctabtn1={
                {
                  btnText: "Try it yourself",
                  link: "/signup",
                  active: true
                }
              }
              ctabtn2={
                {
                  btnText: "Learn more",
                  link: "/login",
                  active: false
                }
              }
              codeColour={"text-yellow-25"}
              codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
              backgroundGradient={<div className='codeblock1 absolute'></div>}
            />

            {/* code section 2 */}
            <div>
              <CodeBlocks
                position={"lg:flex-row-reverse"}
                heading={
                  <div className='text-4xl font-semibold'>
                    Start
                    <HighlightText text={"Coding in Seconds"} />
                  </div>
                }
                subheading={
                  "Go ahead, give it a try. Our hands-on learning environment means you will be writing real code from your very first lesson."
                }
                ctabtn1={
                  {
                    btnText: "Continue Lesson",
                    link: "/signup",
                    active: true
                  }
                }
                ctabtn2={
                  {
                    btnText: "Learn more",
                    link: "/login",
                    active: false
                  }
                }
                codeColour={"text-white"}
                codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                backgroundGradient={<div className='codeblock2 absolute'></div>}
              />
          </div>

          </div>
          <ExploreMore />
      </div>
      {/* Section 2 */}
      <div className='bg-pure-greys-5 text-richblack-700'>
        <div className='homepage_bg h-[320px]'>
          {/*Explore Full category Section*/}
          <div className='mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8'>
            <div className='lg:h-[150px]'></div>
            <div className='flex flex-row gap-7 text-white lg:mt-8'>
              <CTAButton active={true} linkto={"signup"}>
                <div className='flex items-center gap-2'>
                  Explore Full catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/login"}>
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>

        <div className='mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between'>
          {/* job that is in demand -section -1*/}
          <div className='mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0'>
            <div className='text-4xl font-semibold lg:w-[45%]'>
              Get the skills you need for a{" "}
              <HighlightText text={"job that is in demand."} />
            </div>
            <div className='flex flex-col items-start gap-10 lg:w-[40%]'>
              <div className='text-[16px]'>
                The modern studyNotion is the dictates its own term.Today, to be a competitive
                specialist requires more than professional skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div className=''>Learn More</div>
              </CTAButton>
            </div>
          </div>
          {/*Time line section ->section 2 */}
          <TimelineSection />

          {/*Learning language Section -> section 2 */}
          <LearningLanguageSection />
        </div>
      </div>
      {/* Section 3 */}
      <div className='relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center
      justify-between gap-8 bg-richblack-900 text-white'>
      <InstructorSection />

      {/*Review from other learner */}
      <h1 className='text-center text-4xl fonr-semibold mt-8'>
        Review from other learners
      </h1>
        <ReviewSlider />
      </div>
      {/* Section 4 */}
        <Footer />
    </div>
  );
}
