// Được sử dụng để xây dựng các phản hồi (response) cho yêu cầu HTTP
import { NextResponse } from "next/server";
// Đại diện cho kết nối tương tác với cơ sở dữ liệu thông qua Prisma
import prisma from "@/app/libs/prismadb";
// Lấy thông tin từ người dùng hiện tại  
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser(); // Sử dụng await để đợi cho việc lấy thông tin người dùng hiện tại từ `getCurrentUser`
  if (!currentUser) {
    return NextResponse.error(); // Nếu không có người dùng hiện tại trả về lỗi sử dụng NextResponse.error
  }

  const body = await request.json(); // Lấy dữ liệu từ yêu cầu HTTP, giả định rằng nó là dữ liệu dạng JSON lưu trữ vào biến body
  const { listingId, startDate, endDate, totalPrice } = body;
  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error(); // Kiểm tra xem các trường có tồn tại không nếu không tồn tại trả về lỗi ứng dụng
  }
  // Sử dụng prisma để cập nhập một bản ghi trong cơ sở sở dữ liệu
  // Đang cố gắng cập nhập 1 danh sách listing
  const listingAndReservation = await prisma.listing.update({
    // Cập nhập 1 bản ghi dựa trên điều kiện where
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startDate,
          endDate,
          totalPrice,
        },
      },
    },
  });
  return NextResponse.json(listingAndReservation);
}
