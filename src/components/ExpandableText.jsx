import { useState, useRef, useEffect } from 'react';

const ExpandableText = ({ 
  text, 
  maxWidth = 'max-w-[75%]', 
  readMoreText = 'Read more',
  readLessText = 'Read less'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setIsOverflowing(
          textRef.current.scrollWidth > textRef.current.clientWidth
        );
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    return () => window.removeEventListener('resize', checkOverflow);
  }, [text]);

  return (
    <div className={`${maxWidth} flex items-baseline gap-1`}>
      <div 
        ref={textRef}
        className={`
          flex-1
          ${!isExpanded ? 'whitespace-nowrap overflow-hidden overflow-ellipsis' : ''}
          transition-all duration-200
        `}
      >
        {text}
      </div>
      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium focus:outline-none flex-shrink-0 cursor-pointer underline"
        >
          {isExpanded ? readLessText : readMoreText}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;