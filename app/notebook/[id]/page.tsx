"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

type Page = {
 id:number
 pageNumber:number
}

export default function NotebookPage(){

const params = useParams()
const id = Number(params?.id)

const [pages,setPages] = useState<Page[]>([])

async function load(){

 const res = await fetch(`/api/pages?notebookId=${id}`,{
  cache:"no-store"
 })

 const data = await res.json()

 setPages(data)

}

useEffect(()=>{

 const handleFocus = ()=>{
  load()
 }

 window.addEventListener("focus",handleFocus)

 return ()=>{
  window.removeEventListener("focus",handleFocus)
 }

},[])

useEffect(()=>{
 if(!params?.id) return
 load()
},[params.id])

async function addPage(){

 await fetch("/api/pages",{
  method:"POST",
  headers:{
   "Content-Type":"application/json"
  },
  body:JSON.stringify({notebookId:id})
 })

 load()

}

return(

<div className="min-h-screen bg-black text-green-400 font-mono p-10">

<Link
href="/"
className="border border-green-500 px-3 py-1 inline-block mb-6"
>
← BACK
</Link>

<h1 className="text-3xl mb-6">
NOTEBOOK
</h1>

<button
onClick={addPage}
className="border border-green-500 px-4 py-2 mb-6"
>
+ ADD PAGE
</button>

<div className="space-y-4">

{pages.map(p=>(
<Link
key={p.id}
href={`/notebook/${id}/page/${p.id}`}
className="border border-green-500 p-4 block"
>
Page {p.pageNumber}
</Link>
))}

</div>

</div>

)

}