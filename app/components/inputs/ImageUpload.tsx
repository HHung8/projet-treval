"use client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from 'react-icons/tb'

// declare được sử dụng để tạo một biến toàn cục (global variable) có tên là cloundinaray
declare global {
    var cloudinary: any
}

// là một cách để đặt tên cho các kiểu dữ liệu. Giúp xác định các hợp đồng (contract về cấu trúc dữ liệu mà các đối tượng phải tuân theo)
interface ImageUploadProps {
    onChange: (value: string) => void;
    value: string;
}
  
const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  // handleUpload: Đây là tên của hàm (function) mà chúng ta đang định nghĩa
  // useCallback Đây là một hook trong React để tối ưu hoá việc gọi hàm. Nó giúp tránh việc tạo lại hàm mỗi khi component re-render
  // Sử dụng useCallBack để đảm bảo rằng hàm handleUpload không tạo lại mỗi khi components re-render
  const handleUpload = useCallback(
    (result: any) => {
      // info.secure_url, đại diện cho URL an toàn của hình ảnh đã tải lên
      onChange(result.info.secure_url); // hình ảnh được tải lên và cần được cập nhập giá trị
    },[onChange]); // Đây là dependency (danh sách các biến phụ thuộc). Nếu bất kỳ biến nào trong danh sách này thay đổi giá trị, hàm handleUpload sẽ được tạo lại
  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset="xkpx412r"
      options={{ 
        maxFiles: 1,
      }}
    >
       {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="
              relative
              cursor-pointer
              hover:opacity-70
              transition
              border-dashed 
              border-2 
              p-20 
              border-neutral-300
              flex
              flex-col
              justify-center
              items-center
              gap-4
              text-neutral-600
            "
          >
            <TbPhotoPlus
              size={50}
            />
            <div className="font-semibold text-lg">
              Click to upload
            </div>
            {value && (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  fill 
                  style={{ objectFit: 'cover' }} 
                  src={value} 
                  alt="Upload " 
                />
              </div>
            )}
          </div>
        ) 
    }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
