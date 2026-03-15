import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(){

const notebooks = await prisma.notebook.findMany({
orderBy:{id:"asc"}
})

return NextResponse.json(notebooks)

}

export async function POST(req:Request){

const {title,theme} = await req.json()

const notebook = await prisma.notebook.create({
data:{
title,
theme,
pages:{
create:{
pageNumber:1
}
}
}
})

return NextResponse.json(notebook)

}

export async function DELETE(req:Request){

const {id} = await req.json()

await prisma.notebook.delete({
where:{id}
})

return NextResponse.json({ok:true})

}

export async function PUT(req:Request){

const {id,lastPage} = await req.json()

const notebook = await prisma.notebook.update({
where:{id},
data:{lastPage}
})

return NextResponse.json(notebook)

}
