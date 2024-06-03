import {connect} from '@/dbConfig/db.connect'
import { NextRequest, NextResponse } from 'next/server'

connect()

export async function GET(request:NextRequest){
    try {
        const response = NextResponse.json({
            message:"Logout successful",
            success:true
        })

        response.cookies.set("token","",{
            httpOnly:true
        })

        return response;


    } catch (error:any) {
        return NextResponse.json({error:error.message})
    }
}