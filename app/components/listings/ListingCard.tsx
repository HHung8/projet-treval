"use client";

import Image from "next/image";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { format } from "date-fns";
import useCountries from "@/app/hooks/useCountries";

import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null
};

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = '',
  currentUser,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();
  const location = getByValue(data.locationValue);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // Ngăn chặn sự kiện lan ra các phần tử cha
      // Nếu disable là true thì hàm sẽ kết thúc mà không thực hiện hành động nào
      if (disabled) {
        return;
      }
      // Nếu disable không phải là true thì gọi onAction?.(actioId) để thực hiện hành động liên quan đến actionId
      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  // useMemo laf Lưu trữ giá trị trả về của 1 hàm. Mỗi khi component re-render nó kiểm tra các tham số truyền vào hàm. Nếu các tham số không thay đổi, giá trị lưu trữ sẽ được sử dụng lại
  const price = useMemo(() => {
    // Nếu reservation tồn tại (khác null, hoặc undefind), hàm trả về giá trị của reservation.totalPrice
    if (reservation) {
      return reservation.totalPrice;
    }
    // Nếu reservation không tồn tại, hàm trả về giá trị của data.price.
    return data.price;
  }, [reservation, data.price]);
  // Nếu reservation hoặc data.price thay đổi, useMemo sẽ tính toán lại giá trị của price

  const reservationDate = useMemo(() => {
    // Nếu reservation không tồn tại (khác null hoặc undefined), hàm trả về null
    if (!reservation) {
      return null;
    }
    // Nếu reservation tồn tại chúng ta tạo hai đối tượng start và end từ ngày bắt đầu đến ngày kết thúc của reservation
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    return `${format(start, "PP")} - ${format(end, "pp")}`;
  }, [reservation]); // Nếu reservation thay đổi thì, usememo tính toán lại giá trị của reservation

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            alt="Listing"
            src={data.imageSrc}
            className=" object-cover h-full w-full group-hover:scale-110 transition "
          />
          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="font-semibold text-lg">
            {location?.region}, {location?.label}
        </div>
        <div className="font-light text-neutral-500">
              {reservationDate || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
            <div className="font-semibold">
                ${price}
            </div>
            {/* Nếu biến reservation không tồn tại */}
            {!reservation && (
              <div className="font-light" >night</div>
            )}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel }
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
