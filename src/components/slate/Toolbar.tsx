import { IconContext } from 'react-icons';

const Toolbar = ({ children = null }: any) => {
  return (
    <IconContext.Provider value={{ size: '18px' }}>
      <div className='sticky top-12 flex gap-1 flex-wrap py-3 mb-3 bg-white border-b border-gray-400 z-10'>
        {children}
      </div>
    </IconContext.Provider>
  );
};

export default Toolbar;
