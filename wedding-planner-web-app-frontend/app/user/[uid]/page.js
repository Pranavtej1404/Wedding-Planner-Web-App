'use client'
import { useParams } from 'next/navigation'
export default function user(){
    const param=useParams()
    return(
        <div>
            <p>hello user{param.uid}</p>
        </div>
    )
}