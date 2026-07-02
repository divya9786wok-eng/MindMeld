import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ category, title, difficulty, description, logo, image, link }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(link);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white p-6 rounded-lg shadow-md font-poppins cursor-pointer hover:shadow-lg transition-shadow"
        >
            <div className="flex items-center mb-4">
                {logo && <img src={logo} alt="logo" className="w-10 h-10 mr-3" />}
                <span className="text-xl font-bold text-gray-700">{category}</span>
            </div>
            { image && <img src={image} alt="card" className="w-full h-40 object-cover mt-4 rounded-lg" /> }
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <div className="flex justify-between items-center mt-4">
                {difficulty && (
                    <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                        {difficulty}
                    </span>
                )}
                {description && (
                    <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                        {description}
                    </span>
                )}
            </div>
        </div>
    );
};

export default Card;
