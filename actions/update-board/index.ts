"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { UpdateBoard } from "./schema"
import { createSafeAction } from "@/lib/create-safe-action"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
import { createAuditLog } from "@/lib/create-audit-log"
const handler = async(data:InputType): Promise<ReturnType>=>{
    const{ userId, orgId }= auth()

    if(!userId || !orgId){
        return{
            error:"Unauthorized"
        }
    }
    const {title, id}= data;
    let board;
    try{
        board = await db.board.update({
            where:{
                id, orgId,
            },
            data:{
                title,
            }
        })
        await createAuditLog({
            entityTitle: board.title,
            entityId: board.id,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.UPDATE,
        })
    }catch(error){
        return{
            error:"Failed to update."
        }
    }
    revalidatePath(`/board/${id}`)
    return { data:board }
}
export const updateBoard= createSafeAction(UpdateBoard, handler)