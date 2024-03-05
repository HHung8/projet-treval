  "use client";

  import { Range } from "react-date-range";
  import toast from "react-hot-toast";
  import axios from "axios";
  import { differenceInCalendarDays, eachDayOfInterval} from "date-fns";
  import { useRouter } from "next/navigation";
  import { useCallback, useEffect, useMemo, useState } from "react";

  import { SafeListing, SafeReservation, SafeUser, } from "@/app/types";
  import { categories } from "@/app/components/navbar/Categories";
  import Container from "@/app/components/Container";
  import ListingHead from "@/app/components/listings/ListingHead";
  import ListingInfo from "@/app/components/listings/ListingInfo";
  import useLoginModal from "@/app/hooks/useLoginModal";
  import ListingReservation from "@/app/components/listings/ListingReservation";

  const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  };

  interface ListingClientProps {
    reservations?: SafeReservation[];
    listing: SafeListing & {
      user: SafeUser;   
    };
    currentUser?: SafeUser | null;
  }

  const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    reservations = [], 
    currentUser, 
  }) => {   
    const loginModal = useLoginModal();
    const router = useRouter();

    // useMemo() là một hook trong React được sử dụng để tối ưu hoá hiệu suất bằng cách lưu trữ kết quả của một hàm tính toán phức tạp giữa các lần render lại
    // Giúp tránh việc tính toán lại nếu các dependencies kh ông thay đổi
    const disabledDates = useMemo(() => {
      let dates: Date[] = []; // Khai báo một mảng chứa các đối tượng ngày. Mảng này được gán giá trị rỗng
      reservations.forEach((reservation) => {
        // tạo range để lưu trữ danh sách các ngày trong khoảng thời gian từ start Date đến endDate
        // Hàm eachDayOfInterval Để tạo ra danh sách các ngày trong khoảng thời gian đã cho
        const range = eachDayOfInterval({
          start: new Date(reservation.startDate),
          end: new Date(reservation.endDate), 
        });   
        // Gộp mảng dates hiện có với mảng Range bằng cách sử dụng toán tử spread(...)
        // Dates sẽ chứa tất cả các ngày trong khoảng thời gian từ start đến end
        dates = [...dates, ...range];
      });
      return dates;
    }, [reservations]);

    const [isLoading, setIsLoading] = useState(false); // Kiểm tra xem có đang tải dữ liệu không
    const [totalPrice, setTotalPrice] = useState(listing.price); // Để lưu giá trị tổng của danh sách listing
    const [dateRange, setDateRange] = useState<Range>(initialDateRange); // Trạng thái để lưu khoảng thời gian (Ngày bắt đầu và ngày kết thúc)
    const onCreateReservation = useCallback(() => {
      if (!currentUser) {
        return loginModal.onOpen();
      }
      setIsLoading(true);
      // Thư viện HTTP client giúp gửi các yêu cầu HTTP. Trong đoạn mã, chúng ta sử dụng axios.post để gửi yêu cầu POST đến server.
      axios.post("/api/reservations", {
          totalPrice,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          listingId: listing?.id,
        })
        .then(() => {
          toast.success("Listing reserved!");
          setDateRange(initialDateRange);
          router.push('/trips')
        })
        .catch(() => {
          toast.error("Something went wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

    // useEffect cho phép quản lý các tác vụ liên quan đến hiệu suất  và tuơng tác với hệ thống bên ngoài
    useEffect(() => {
      // Kiểm tra dateRange.startDate, enDate có tồn tại hay không, nếu cả hai điều kiện đúng vào bên trong if
      if (dateRange.startDate && dateRange.endDate) {
        // Sử dụng differenceInDay để tính toán số ngày giữa dateRange.endDate và dateRange.startDate
        const dayCount = differenceInCalendarDays(dateRange.endDate, dateRange.startDate);
        // Nếu dayCount và listing.price đều tồn tại, thì tính giá tiền tổng cộng bằng cách nhân số ngày với giá tiền listing.price
        // Kết quả được đặt vào state totalPrice thông qua hàm setTotalPrice
        if (dayCount && listing.price) {
          setTotalPrice(dayCount * listing.price);
        } else {
          // Nếu một tròn các giá trị không tồn tại thì đặt listing.price vào total price 
          setTotalPrice(listing.price);
        }
      }
    }, [dateRange, listing.price]); // use effect sẽ chạy lại khi có sự thay đổi trong `dateRange` hoặc `listing.price`

    const category = useMemo(() => {
      return categories.find((item) => item.label === listing.category);
    }, [listing.category]);
    return (
      <Container>
        <div className="max-w-screen-lg mx-auto">
          <div className="flex flex-col gap-6">
            <ListingHead
              title={listing.title}
              imageSrc={listing.imageSrc}
              locationValue={listing.locationValue}
              id={listing.id}
              currentUser={currentUser}
            />
            <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
              <ListingInfo
                user={listing.user}
                category={category}
                description={listing.description}
                roomCount={listing.roomCount}
                guestCount={listing.guestCount}
                bathroomCount={listing.bathroomCount}
                locationValue={listing.locationValue}
              />
              <div className="order-first mb-10 md:order-last md:col-span-3">
                  <ListingReservation 
                      price={listing.price}
                      totalPrice = {totalPrice}
                      onChangeDate = {(value) => setDateRange(value)}
                      dateRange = {dateRange}
                      onSubmit = {onCreateReservation}
                      disabled = {isLoading}
                      disabledDates = {disabledDates}
                  />
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  };

  export default ListingClient;
