"use client"

import { Board } from "@prisma/client"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { deleteBoard } from "@/actions/delete-board";
import { toast } from "sonner";

interface BoardOptionsProps{
    id:string;
}
export const BoardOptions = async({
    id
}:BoardOptionsProps)=>{
    const {execute, isLoading} = useAction(deleteBoard, {
        onError:(error)=>{
            toast.error(error)
        }
    })
    const onDelete = ()=>{
        execute({id}) 
    }
    return(
        <Popover>
            <PopoverTrigger asChild>
                <Button className="h-auto w-auto p-2" variant="transparent">
                    <MoreHorizontal className = "h-4 w-4"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="px-0 py-3" align="start" side="bottom">
                <div className="text-sm font-medium text-center text-neutral-500">
                    Board Options
                </div>
                <PopoverClose asChild>
                    <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
                        <X className="h-4 w-4"/>
                    </Button> 
                </PopoverClose>
                <Button variant="ghost" onClick={onDelete} disabled={isLoading}
                className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm">
                    Delete this board
                </Button>
            </PopoverContent>
        </Popover>
    )
}