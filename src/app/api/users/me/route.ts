import { connect } from '@/dbConfig/db.connect';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
    }
    return NextResponse.json({ message: 'User Found', data: user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
