"use client"

import { ListWithCards } from "@/types";
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";
import { toast } from "sonner";

interface ListContainerProps{
    data: ListWithCards[];
    boardId:string;
}
function reorder<T>(list: T[], startIndex:number, endIndex: number){
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}
export const ListContainer= ({
    data, boardId
}:ListContainerProps)=>{
    const [dataList, setDataList] = useState(data)

    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess:()=>{
            toast.success("List reordered")
        },
        onError:(error)=>{
            toast.error(error)
        }
    })
    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess:()=>{
            toast.success("Card reordered")
        },
        onError:(error)=>{
            toast.error(error)
        }
    })
    useEffect(()=>{
        setDataList(data)
    },[data])
    
    const onDragEnd = (result:any)=>{
        const { destination, source, type} = result;
        if(!destination){
            return;
        }
        //Dropped in the same position
        if(destination.droppabledId === source.droppableId &&
            destination.index === source.index){
                return;
            }
        //User moves a list
        if(type ==="list"){
            const items = reorder(
                dataList, source.index, destination.index
            ).map((item, index) =>({ ...item, order:index}))
            
            setDataList(items)
            executeUpdateListOrder({ items, boardId})
        }
        //user moves a card
        if(type ==="card"){
            let newOrderedData = [...dataList]
            // Source and destination list
            const sourceList = newOrderedData.find(list => list.id === source.droppableId)
            const destList = newOrderedData.find(list=> list.id === destination.droppableId)
            if(!sourceList || !destList){
                return;
            }
            // Check if cards exist on the sourceLIst
            if(!sourceList.cards){
                sourceList.cards = []
            }
            if(!destList.cards){
                destList.cards = []
            }
            // Moving the card on the same list
            if(source.droppableId === destination.droppableId){
                const reorderedCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index
                )
                reorderedCards.forEach((card,idx)=>{
                    card.order = idx
                })
                sourceList.cards = reorderedCards

                setDataList(newOrderedData)
                executeUpdateCardOrder
                // To-do: Trigger Server Action
                executeUpdateCardOrder({
                    boardId: boardId,
                    items: reorderedCards,
                })
                
            }else{
                // User moves the card to another list
                // Remove card from source list
                const [movedCard] = sourceList.cards.splice(source.index, 1)
                // Assign the new listId to the moved card
                movedCard.listId = destination.droppableId
                // Add card to the destination list
                destList.cards.splice(destination.index, 0, movedCard)

                sourceList.cards.forEach((card, idx)=>{
                    card.order = idx
                })
                // Update the other for each card in the destination list
                destList.cards.forEach((card,idx) =>{
                    card.order = idx;
                })

                setDataList(newOrderedData)
                executeUpdateCardOrder({
                    boardId:boardId,
                    items: destList.cards,
                })
            }
        }
    }
    return(
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided)=>(
                    <ol {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex gap-x-3 h-full">
                    {dataList.map((list, index)=>{
                        return(
                            <ListItem 
                            key={list.id} index={index} data={list} />
                        )
                        })}
                    <ListForm /> 
                    {provided.placeholder}
                    <div className="flex-shrink-0 w-1"/> 
                </ol> 
                )} 
            </Droppable> 
        </DragDropContext>
        
    )
    
}