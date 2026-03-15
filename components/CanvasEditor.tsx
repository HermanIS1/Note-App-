"use client"

import { useRef, useState, useEffect } from "react"

type Props = {
pageId:number
theme:string
}

export default function CanvasEditor({ pageId, theme }:Props){

const bgCanvasRef = useRef<HTMLCanvasElement>(null)
const drawCanvasRef = useRef<HTMLCanvasElement>(null)

const saveTimeout = useRef<any>(null)

const historyRef = useRef<string[]>([])
const historyIndexRef = useRef<number>(-1)

const [drawing,setDrawing] = useState(false)
const [tool,setTool] = useState<"pen"|"eraser">(
 () => (localStorage.getItem("tool") as "pen"|"eraser") || "pen"
)

const [color,setColor] = useState(
 () => localStorage.getItem("color") || "#00ff88"
)

const [size,setSize] = useState(
 () => Number(localStorage.getItem("size")) || 3
)

useEffect(()=>{
 localStorage.setItem("tool",tool)
},[tool])

useEffect(()=>{
 localStorage.setItem("color",color)
},[color])

useEffect(()=>{
 localStorage.setItem("size",String(size))
},[size])

function getPos(e:any){

const rect = drawCanvasRef.current!.getBoundingClientRect()

return{
x:e.clientX - rect.left,
y:e.clientY - rect.top
}

}

function start(e:any){

const canvas = drawCanvasRef.current!
const ctx = canvas.getContext("2d")!

canvas.setPointerCapture(e.pointerId)

const pos = getPos(e)

ctx.beginPath()
ctx.moveTo(pos.x,pos.y)

setDrawing(true)

}

function draw(e:any){

if(!drawing) return

const canvas = drawCanvasRef.current!
const ctx = canvas.getContext("2d")!

const pos = getPos(e)

ctx.lineWidth = size
ctx.lineCap = "round"

if(tool === "pen"){

ctx.globalCompositeOperation = "source-over"
ctx.strokeStyle = color

}else{

ctx.globalCompositeOperation = "destination-out"

}

ctx.lineTo(pos.x,pos.y)
ctx.stroke()

scheduleSave()

}

function end(e:any){

const canvas = drawCanvasRef.current!
canvas.releasePointerCapture(e.pointerId)

setDrawing(false)

saveHistory()

}

async function save(){

const canvas = drawCanvasRef.current
if(!canvas) return

const data = canvas.toDataURL()

await fetch("/api/pages",{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
id:pageId,
image:data
})
})

}

function scheduleSave(){

if(saveTimeout.current){
clearTimeout(saveTimeout.current)
}

saveTimeout.current = setTimeout(()=>{
save()
},800)

}

function drawBackground(){

const canvas = bgCanvasRef.current
if(!canvas) return

const ctx = canvas.getContext("2d")!

if(theme === "black"){
ctx.fillStyle = "#000000"
ctx.fillRect(0,0,canvas.width,canvas.height)
}

if(theme === "white"){
ctx.fillStyle = "#ffffff"
ctx.fillRect(0,0,canvas.width,canvas.height)
}

if(theme === "grid"){

ctx.fillStyle = "#ffffff"
ctx.fillRect(0,0,canvas.width,canvas.height)

ctx.strokeStyle = "#e5e5e5"
ctx.lineWidth = 1

const grid = 40

for(let x=0;x<canvas.width;x+=grid){
ctx.beginPath()
ctx.moveTo(x,0)
ctx.lineTo(x,canvas.height)
ctx.stroke()
}

for(let y=0;y<canvas.height;y+=grid){
ctx.beginPath()
ctx.moveTo(0,y)
ctx.lineTo(canvas.width,y)
ctx.stroke()
}

}

}

function saveHistory(){

const canvas = drawCanvasRef.current
if(!canvas) return

const data = canvas.toDataURL()

historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)

historyRef.current.push(data)
historyIndexRef.current++

}

function undo(){

if(historyIndexRef.current <= 0) return

historyIndexRef.current--

const canvas = drawCanvasRef.current!
const ctx = canvas.getContext("2d")!

const img = new Image()
img.src = historyRef.current[historyIndexRef.current]

img.onload = ()=>{
ctx.clearRect(0,0,canvas.width,canvas.height)
ctx.drawImage(img,0,0)
}

}

useEffect(()=>{

const bgCanvas = bgCanvasRef.current
const drawCanvas = drawCanvasRef.current

if(!bgCanvas || !drawCanvas) return

bgCanvas.width = window.innerWidth
bgCanvas.height = window.innerHeight

drawCanvas.width = window.innerWidth
drawCanvas.height = window.innerHeight

drawBackground()

async function load(){

const res = await fetch(`/api/pages?id=${pageId}`)

if(!res.ok) return

const data = await res.json()

const ctx = drawCanvas!.getContext("2d")!

if(!data?.image){
saveHistory()
return
}

const img = new Image()
img.src = data.image

img.onload = ()=>{
ctx.drawImage(img,0,0)
saveHistory()
}

}

load()

},[pageId,theme])

return(

<div>

<div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black border border-green-500 p-3 flex gap-4 items-center z-10">

<button
onClick={undo}
className="px-3 py-1 border border-green-500 text-green-400"

>

↶ </button>

<button
onClick={()=>setTool("pen")}
className={`px-3 py-1 border ${tool==="pen" ? "bg-green-500 text-black" : "border-green-500 text-green-400"}`}

>

✏️ </button>

<button
onClick={()=>setTool("eraser")}
className={`px-3 py-1 border ${tool==="eraser" ? "bg-green-500 text-black" : "border-green-500 text-green-400"}`}

>

🧽 </button>

<input
type="color"
value={color}
onChange={e=>setColor(e.target.value)}
/>

<input
type="range"
min="1"
max="20"
value={size}
onChange={e=>setSize(Number(e.target.value))}
/>

</div>

<canvas
ref={bgCanvasRef}
className="fixed top-0 left-0 w-screen h-screen"
/>

<canvas
ref={drawCanvasRef}
className="fixed top-0 left-0 w-screen h-screen"
onPointerDown={start}
onPointerMove={draw}
onPointerUp={end}
onPointerLeave={end}
/>

</div>

)

}
