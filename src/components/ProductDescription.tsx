const ProductDescription: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className='pt-[30px] text-gray-700'>
      <h4 className='mb-[10px] font-medium text-gray-500 text-base'>
        Description
      </h4>
      <div className='leading-[24px]'>{content}</div>
    </div>
  );
};

export default ProductDescription;
