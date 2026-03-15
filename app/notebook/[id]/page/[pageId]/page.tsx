"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import CanvasEditor from "@/components/CanvasEditor"

type Page = {
id:number
pageNumber:number
image?:string
}

export default function PageEditor(){

const params = useParams()
const router = useRouter()

const notebookId = Number(params.id)
const pageId = Number(params.pageId)

const [pages,setPages] = useState<Page[]>([])
const [theme,setTheme] = useState("black")
const [showMenu,setShowMenu] = useState(false)

useEffect(()=>{

fetch("/api/notebooks",{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
id:notebookId,
lastPage:pageId
})
})

},[pageId,notebookId])

useEffect(()=>{

async function loadPages(){

const res = await fetch(`/api/pages?notebookId=${notebookId}`)
const data = await res.json()

setPages(data)

}

loadPages()

},[notebookId])

useEffect(()=>{

async function loadNotebook(){

const res = await fetch("/api/notebooks")
const data = await res.json()

const notebook = data.find((n:any)=>n.id === notebookId)

if(notebook){
setTheme(notebook.theme)
}

}

loadNotebook()

},[notebookId])

async function addPage(){

const res = await fetch("/api/pages",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({notebookId})
})

const page = await res.json()

router.push(`/notebook/${notebookId}/page/${page.id}`)

}

async function deletePage(id:number){

if(pages.length <= 1){
alert("Notebook must have at least one page")
return
}

await fetch("/api/pages",{
method:"DELETE",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({id})
})

const res = await fetch(`/api/pages?notebookId=${notebookId}`)
const data = await res.json()

setPages(data)

if(id === pageId){
router.push(`/notebook/${notebookId}/page/${data[0].id}`)
}

}

return(

 <div className="min-h-screen bg-black text-green-400 font-mono">

  <Link
   href="/"
   className="fixed top-4 left-4 border border-green-500 px-3 py-1 z-20"
  >
   ← NOTEBOOKS
  </Link>

  <div className="fixed top-4 right-4 flex gap-2 z-20">

<button
onClick={()=>setShowMenu(!showMenu)}
className="border border-green-500 px-3 py-1"

>

```
PAGES
```

   </button>

<button
onClick={addPage}
className="border border-green-500 px-3 py-1"

>

```
+ PAGE
```

   </button>

  </div>

{showMenu && (

   <div className="fixed top-16 right-4 w-72 max-h-96 overflow-y-auto bg-black border border-green-500 p-4 z-30">

```
{pages.map(p=>(

 <div
  key={p.id}
  className="flex justify-between items-center border border-green-500 p-2 mb-3"
 >

  <Link
   href={`/notebook/${notebookId}/page/${p.id}`}
   onClick={()=>setShowMenu(false)}
   className="flex items-center gap-3"
  >

   <div className="w-16 h-12 border border-green-500 overflow-hidden">

    {p.image ? (
     <img
      src={p.image}
      className="w-full h-full object-cover"
     />
    ) : (
     <div className="w-full h-full flex items-center justify-center text-xs">
      empty
     </div>
    )}

   </div>

   <div>
    Page {p.pageNumber}
   </div>

  </Link>

  <button
   onClick={()=>deletePage(p.id)}
   className="border border-green-500 px-2"
  >
   🗑
  </button>

 </div>

))}
```

   </div>

)}

  <CanvasEditor pageId={pageId} theme={theme}/>

 </div>

)

}
