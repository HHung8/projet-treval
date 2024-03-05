import { IconType } from "react-icons";

interface CategoryInputProps {
    icon: IconType;
    label: string;
    seleted?:boolean;
    onClick:(value: string) => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({icon: Icon, label, seleted, onClick}) => {
  return (
    <div
        onClick={() => onClick(label)}
        className={`rounded-xl border-2 py-4 flex flex-col gap-3 hover:border-black transition cursor-pointer 
            ${seleted ? 'border-black' : 'border-neutral-200'}
        `}    
    >
        <Icon size={30} />
        <div className="font-semibold">
            {label}
        </div>
    </div>
  )
}

export default CategoryInput