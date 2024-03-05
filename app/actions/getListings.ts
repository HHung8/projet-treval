import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
    userId?: string;
    guestCount?: number;
    roomCount?:number;
    bathroomCount?:number;
    startDate?:string;
    endDate?:string;
    locationValue?:string;
    category?: string;
}
export default async function getListings(
    params: IListingsParams
) {
    //try,catch Mọi mã trong khối này sẽ được thực thi và nếu có lỗi, nó sẽ được bắt bởi khối catch
    try {
        const {userId, roomCount,guestCount, bathroomCount, locationValue,startDate,endDate,category} = params;
        let query: any = {};
        if(userId) {
            query.userId = userId;
        }

        if(category) {
            query.category = category;
        }

        if(roomCount) {
            query.roomCount = {
                gte: +roomCount
            }
        }
        
        if(guestCount) {
            query.guestCount = {
                gte: +guestCount
            }
        }

        if(bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount
            }
        }

        if(locationValue) {
            query.locationValue = locationValue;
        }

        if(startDate && endDate) {
            query.NOT = {
                reservations: {
                    some: {
                        OR: [
                            {
                                endDate: {gte: startDate},
                                startDate: {lte: startDate},
                            },
                            {
                                startDate: {lte: endDate},
                                endDate: {gte: endDate}
                            }
                        ]
                    }
                }
            }
        }

        // prisma sẽ được khởi tạo và có một bảng dữ liệu listing.
        const listings = await prisma.listing.findMany({
            where: query,
            // Đây là một tham số truyền vào findMany
            orderBy: {
                createdAt: 'desc'
            }
        })  
        
        const safeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
        }))
        return safeListings
        
    } catch (error: any) {
        throw new Error(error)
    }
}