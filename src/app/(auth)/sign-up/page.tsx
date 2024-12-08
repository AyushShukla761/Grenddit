import { buttonVariants } from "@/components/ui/Button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import SignUp from "@/components/SignUp"

export default async function  page(){
    return (<div>
         <div>
            <Link href='/' className={cn(buttonVariants({variant: 'ghost'}),'self-start -mt-20')}>Home</Link>
            <SignUp/>
         </div>
    </div>)
}