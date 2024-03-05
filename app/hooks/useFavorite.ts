// Các tính năng chính của axios bao gồm:
// Hỗ trợ Promise API: Điều này giúp việc xử lý các yêu cầu HTTP trở nên dễ dàng hơn thông qua việc sử dụng .then() và .catch().
// Hỗ trợ yêu cầu và phản hồi chuyển đổi: Bạn có thể tự định nghĩa cách chuyển đổi yêu cầu hoặc phản hồi dữ liệu.
// Hỗ trợ bảo vệ CSRF (Cross-Site Request Forgery): axios tự động bao gồm cookie CSRF (nếu có) vào header của yêu cầu.
// Hỗ trợ việc gửi yêu cầu bằng phương thức HTTP khác nhau như GET, POST, DELETE, PUT, PATCH, etc.
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";

interface IUseFavorite {
    listingId: string;
    currentUser?: SafeUser | null
}
  
const useFavorite = ({listingId,currentUser}: IUseFavorite) => {
    const router = useRouter();
    const loginModal = useLoginModal();
    
    const hasFavorited = useMemo(() => {
        const list = currentUser?.favoriteIds || [];
        return list.includes(listingId);
      }, [currentUser, listingId]);

    const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if(!currentUser) {
            return loginModal.onOpen();
        }

        try {
            let request;
           if (hasFavorited) {
             request = () => axios.delete(`/api/favorites/${listingId}`);
           } else {
             request = () => axios.post(`/api/favorites/${listingId}`);
           }

           await request();
           router.refresh();
           toast.success('Success');
        } catch (error) {
           toast.error('Something went wrong.');
        }
    }, [currentUser, hasFavorited, listingId, loginModal,router])
    return {
        hasFavorited,
        toggleFavorite,
    }
}
export default useFavorite;