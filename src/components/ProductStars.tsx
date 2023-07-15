import { BsStarFill } from 'react-icons/bs';

const ProductStars = () => {
    return (
        <span className="flex items-center">
            {[...Array(4)].map((_, i) => (
                <BsStarFill key={i} size={16} className="text-[#FFC107]" />
            ))}
            <BsStarFill size={16} className="text-gray-400" />
        </span>
    );
};

export default ProductStars;
