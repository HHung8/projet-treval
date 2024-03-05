import { useRouter, useSearchParams } from "next/navigation";
//useRouter là một hook cho phép bạn truy cập thông tin về địa chỉ URL hiện tại và các tham số truy vấn.
//useSearchParams là một hook cho phép bạn đọc thông tin từ chuỗi truy vấn của url hiện tạo 
import { useCallback } from "react";
import { IconType } from "react-icons";
import qs from "query-string";

interface CategoryBoxProps {
    icon: IconType;
    label: string;
    selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({icon: Icon, label, selected}) => {
  const router = useRouter();
  const params = useSearchParams();
  // Tạo 1 hàm xử lý sự kiện click và sử dụng useCallback để đảm bao rằng hàm này không được tạo lại mỗi khi component render lại. Việc này giúp tối ưu hoá hiệu suất và tránh render lại không cần thiêys
  const handleClick = useCallback(() => {
    // Khởi tạo một biến currentQuery là một đối tượng trống để lưu trữ các tham số truy vấn hiện tại từ URL.
    let currentQuery = {};

    // Kiểm tra xem biến params có tồn tại hay không. Nếu có, thì chuyển đổi params từ đối tượng URLSearchParams sang đối tượng JavaScript bằng qs.parse. Điều này giúp lấy thông tin về các tham số truy vấn từ URL.
    if(params) {
      currentQuery = qs.parse(params.toString());
    }

    // Tạo một bản sao của đối tượng currentQuery và thêm một thuộc tính mới có tên là 'category' với giá trị là label. Điều này là để cập nhật tham số truy vấn cho chuyển hướng URL mới.
    const updatedQuery: any = {
      ...currentQuery, 
      category: label
    }

    //  Kiểm tra xem nếu tham số truy vấn 'category' đã tồn tại và giống với label, thì xóa nó khỏi đối tượng updatedQuery. Mục đích là để xử lý việc người dùng click lại vào một mục đã chọn, khi đó 'category' sẽ bị xóa khỏi URL.
    if(params?.get('category') === label) {
      delete updatedQuery.category;
    }

    // Sử dụng qs.stringifyUrl để tạo một chuỗi URL mới từ đối tượng updatedQuery. Cấu hình skipNull: true giúp loại bỏ các giá trị null hoặc undefined khi chúng được chuyển đổi thành chuỗi URL.
    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery 
    }, {skipNull: true})
    
    //Sử dụng router để thực hiện chuyển hướng đến URL mới được tạo. Điều này giúp chuyển đổi giữa các trạng thái và hiển thị nội dung tương ứng với tham số truy vấn mới.
    router.push(url)
  }, [label, params,router])

  return (
    <div 
        onClick={handleClick}
        className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer
        ${selected ? 'border-b-neutral-800' : 'border-transparent'}
        ${selected ? 'text-neutral-800' : 'text-neutral-500'}
    `}>
        <Icon size={26} />
        <div className="font-medium text-sm" >
          {label}
        </div>
    </div>
  )
}

export default CategoryBox