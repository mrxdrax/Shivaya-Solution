import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Eye } from 'lucide-react';
import { Product } from '../../types';
import { COMPANY_INFO } from '../../utils/constants';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const handleWhatsAppInquiry = () => {
    const message = encodeURIComponent(
      `Hi ${COMPANY_INFO.name}, I'm interested in "${product.product_name}". Please provide more details about pricing and availability.`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.product_name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="inline-block px-3 py-1 bg-brand-warm-orange text-white text-xs font-medium rounded-full">
            {product.category.replace('-', ' ').toUpperCase()}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="bg-white/90 text-gray-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Eye className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {product.product_name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <button
            onClick={handleWhatsAppInquiry}
            className="flex items-center space-x-2 bg-brand-deep-mustard hover:bg-brand-burnt-coral text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Inquire</span>
          </button>
          <button className="text-brand-warm-orange hover:text-brand-deep-mustard font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;