import React from 'react'
import Logo from './Logo'
import { Link } from 'react-router-dom'
const Header = () => {
  return (
    <div className='z-10 w-full items-center justify-center text-sm lg:flex'>  
    <div className=' bg fixed top-0 w-full py-2 px-4 h-16 text-center flex justify-between items-center bg-primary/95 text-white z-50'>
      <div className='flex space-x-3 items-center'>
        <Link to ={'/'}>
        <Logo />
        </Link>
        <p className='text-black opacity-80 font-[14px] tracking-wider text-sm'>
        Have questions? Email
        <a href="mailto:founders@hyperbound.ai" className="underline">founders@hyperbound.ai</a>
        </p>
      </div>
      <div className='flex space-x-3 '>
        <button className='bg-slate-200 opacity-100 hover:opacity-90 text-secondary-foreground hover:bg-secondary/80 text-black inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary  shadow-sm  h-12 px-8 text-[15px] rounded-full'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-check w-4 h-4 mr-2"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="m9 16 2 2 4-4"></path></svg>Book a demo to build your own bots
        </button>
      </div>
    </div>
      <div className=''></div>
    </div>
  )
}

export default Header