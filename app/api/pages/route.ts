import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {

const { searchParams } = new URL(req.url)

const id = searchParams.get("id")

if (id && !isNaN(Number(id))) {

const page = await prisma.page.findUnique({
where: { id: Number(id) }
})

return NextResponse.json(page || {})
}

const notebookId = Number(searchParams.get("notebookId"))

const pages = await prisma.page.findMany({
where: { notebookId },
orderBy: { pageNumber: "asc" }
})

return NextResponse.json(pages)
}

export async function POST(req: Request) {

const body = await req.json()

const id = Number(body.notebookId)

const count = await prisma.page.count({
where:{ notebookId:id }
})

const page = await prisma.page.create({
data:{
notebookId:id,
pageNumber:count + 1
}
})

return NextResponse.json(page)

}

export async function PUT(req:Request){

const {id,image} = await req.json()

const existing = await prisma.page.findUnique({
where:{id}
})

if(!existing){
return NextResponse.json(
{error:"Page not found"},
{status:404}
)
}

const page = await prisma.page.update({
where:{id},
data:{image}
})

return NextResponse.json(page)

}

export async function DELETE(req:Request){

const {id} = await req.json()

await prisma.page.delete({
where:{id}
})

return NextResponse.json({ok:true})

}
