// import một đối tượng `Next Response ` từ thư viện `next/server`. Đối tượng này được sử dụng và trả về các phản hồi từ trang
import { NextResponse } from "next/server";
// GetCurrenUser là một hàm lấy thông tin người dùng
import getCurrentUser from "@/app/actions/getCurrentUser";
//  Là đối tượng được sử dụng để tương tác với cơ sở dữ liệu thông qua Prisma.
import prisma from "@/app/libs/prismadb";

// Định nghĩa một interface `IParams` để đại diện cho các tham số của yêu cầu, trong trường hợp này là reservationId
interface IParams {
    reservationId?: string;
}

// Khai báo hàm DELETE sử dụng trong trường hợp xử lý yêu cầu HTTP DELETE. 
export async function DELETE(
    request: Request, // Hàm này nhận vào một đối tượng `request` đối tượng (yêu cầu HTTP)
    { params }: { params: IParams } // Và một đối tượng `{params}` chứa các tham số từ URL
  ) {
    // getCurrentUser lấy thông tin người dùng hiện tại
    const currentUser = await getCurrentUser();
    // Nếu không có người dùng hiện tại trả về lỗi 
    if (!currentUser) {
      return NextResponse.error();
    }
    // Lấy dữ liệu `reservationId` từ đối tượng `params` được truyền vào 
    const { reservationId } = params;
    
    // Kiểm tra xem reservationId có tồn tại và có đúng là 1 chuỗi không nếu không thì nó sẽ thông báo lỗi Invalid ID
    if(!reservationId || typeof reservationId !== 'string' ) {
      throw new Error('Invalid ID')
    }
    // if (!reservationId || typeof reservationId !== 'string') {
    //   throw new Error('Invalid ID');
    // }
    
    // Sử dụng prima để xoá các bản ghi trong cơ sở dữ liệu `deleteMany` được sử dụng với điều kiện where 
    const reservation = await prisma.reservation.deleteMany({
      where: {
        id: reservationId,
        OR: [
          { userId: currentUser.id },
          { listing: { userId: currentUser.id } }
        ]
      }
    });
    // Trả về một phản hồi JSON chứa thông tin về reservation sau khi nó đã được xóa từ cơ sở dữ liệu.
    return NextResponse.json(reservation);
  }