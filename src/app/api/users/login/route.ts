import {connect} from '@/dbConfig/db.connect'
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken';

connect()

export async function POST(request:NextRequest){
    try {
        const data = await request.json()
        const {email, password} = data;

        console.log(data);
        
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error:"User not found"},{status:500})
        }
        
        const validPassword = await bcryptjs.compare(password,user.password)

        if (!validPassword) {
            return NextResponse.json({error:"Check your credentials"})
        }
        const tokenData={
            id:user._id,
            email:user.email,
            username:user.username
        }

        const token= jwt.sign(tokenData, process.env.TOKEN_SECREAT!, {expiresIn:'1d'} )

        const response = NextResponse.json({
            message:"Login successful",
            success:true
        })

        response.cookies.set("token",token,{
            httpOnly:true
        })

        return response;

    } catch (error:any) {
        return NextResponse.json({error:error.message})
    }
}