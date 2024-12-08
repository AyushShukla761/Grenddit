import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { GiGrenade } from "react-icons/gi";
import { buttonVariants } from "./ui/Button";
import { UserNav } from "./UserNav";
import SearchBar from "./SearchBar";


const Navbar = async ()=>{
    const session=await getServerSession(authOptions);
    return (
    <div className=" fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300"> 
        <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <Link href='/' className="flex gap-2 items-center">
            <p className="hidden text-zinc-700 text-sm font-medium md:block">Grenddit</p>
            <GiGrenade className="h-8 w-8 sm:h-6 sm:w-6"/>
        </Link>

        <SearchBar/>

        {session?.user ? <UserNav user={session.user}/> : <Link href='/sign-in' className={buttonVariants()}>Sign In</Link> }
        
        </div>
    </div>)
}

export default Navbar