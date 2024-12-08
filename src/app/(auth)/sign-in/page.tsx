import { buttonVariants } from "@/components/ui/Button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import SignIn from "@/components/SignIn"

export default function page(){
    return (<div>
         <div>
            <Link href='/' className={cn(buttonVariants({variant: 'ghost'}),'self-start -mt-20')}>Home</Link>
            <SignIn/>
         </div>
    </div>)
}