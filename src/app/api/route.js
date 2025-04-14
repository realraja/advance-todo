import { NextResponse } from 'next/server';

// export async function GET(request) {
//     return NextResponse.json({ message: 'Server working perfectly' });
// }

export const GET = async (request) => {
    return NextResponse.json({success:true, message: 'Server working perfectly' });
} 