"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Notebook = {
id:number
title:string
theme:string
lastPage:number | null
}

export default function Home(){

const router = useRouter()

const [notebooks,setNotebooks] = useState<Notebook[]>([])
const [title,setTitle] = useState("")
const [theme,setTheme] = useState("black")

async function load(){

const res = await fetch("/api/notebooks")
const data = await res.json()

setNotebooks(data)

}

useEffect(()=>{
load()
},[])

async function create(){

if(!title) return

const res = await fetch("/api/notebooks",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({title,theme})
})

const notebook = await res.json()

router.push(`/notebook/${notebook.id}/page/1`)

}

return(

<div className="min-h-screen bg-black text-green-400 font-mono p-10">

<h1 className="text-4xl mb-10 tracking-widest">
NOTEBOOKS
</h1>

<div className="mb-10">

<input
placeholder="Notebook name"
value={title}
onChange={e=>setTitle(e.target.value)}
className="bg-black border border-green-500 p-2 mr-2"
/>

<select
value={theme}
onChange={e=>setTheme(e.target.value)}
className="bg-black border border-green-500 p-2 mr-2"

>

<option value="black">Black</option>
<option value="white">White</option>
<option value="grid">Grid</option>
</select>

<button
onClick={create}
className="border border-green-500 px-4 py-2"

>

CREATE </button>

</div>

<div className="grid grid-cols-3 gap-6">

{notebooks.map(nb=>(

<Link
href={`/notebook/${nb.id}/page/${nb.lastPage ?? 1}`}
className="border border-green-500 p-4 block"
key={nb.id}
>

{nb.title}

</Link>

))}

</div>

</div>

)

}
