// NextResponse là một lớp được sử dụng để tạo ra phản hồi HTTP trong NEXTJS
import { NextResponse } from "next/server";
// Sử dụng để lấy thông tin người dùng hiện tại 
import getCurrentUser from "@/app/actions/getCurrentUser";
// prisma sử dụng để làm việc với cơ sở dữ liệu 
import prisma from "@/app/libs/prismadb";

// Định nghĩa 1 interfacce Iparams với thuộc tính listingID có thể có hoặc không và kiểu dữ liệu là string
interface IParams {
    listingId?:string;
}

// Định nghĩa một hàm bất đồng bộ POST để xử lý yêu cầu POST.Hàm này nhận vào hai tham số request và params 
export async function POST (
    request: Request,
    {params} : {params: IParams}
) {
    // Lấy thôn tin người dùng hiện tại bằng getCurrentUser 
    const currentUser = await getCurrentUser();
    // Nếu không có người dùng hiện tại, Hàm sẽ trả về 1 lỗi bằng cách gọi NEXTRESPONSE.error();
    if(!currentUser) {
        return NextResponse.error();
    }
    const {listingId} = params;
    if(!listingId || typeof listingId !== 'string') {
        throw new Error("InvalidId") 
    }
    let favoriteIds = [...(currentUser.favoriteIds || [])];
    favoriteIds.push(listingId);
    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favoriteIds
        }
    })
    return NextResponse.json(user)
}

export async function DELETE (
    request: Request,
    {params} : {params: IParams}
) {
    const currentUser = await getCurrentUser();
    if(!currentUser) {
        return NextResponse.error();
    }
    const {listingId} = params;
    if(!listingId || typeof listingId !== 'string') {
        throw new Error("Invalind ID")
    }
    let favoriteIds = [...(currentUser.favoriteIds || [])];
    favoriteIds = favoriteIds.filter((id => id !== listingId));
    const user = await prisma.user.update({
        where : {
            id: currentUser.id
        },
        data: {
            favoriteIds
        }
    });
    return NextResponse.json(user)
}