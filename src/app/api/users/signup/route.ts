import {connect} from '@/dbConfig/db.connect'
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from '@/helpers/mailer'

connect()

export async function POST(request:NextRequest){
    try {
        const data = await request.json()
        const {username, email, password} = data;

        const existUser = await User.findOne({email})

        if(existUser){
            return NextResponse.json({error:"User Already Exixted"})
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password:hashedPassword,
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        await sendEmail({email,emailType:"VERIFY",userId:savedUser._id})
        return NextResponse.json({message:"User Register Successfully",savedUser})

        

    } catch (error:any) {
        return NextResponse.json({error:error.message})
    }
}