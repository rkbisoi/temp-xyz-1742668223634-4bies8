import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ActionButtonProps {
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, text, onClick }) => {
    return (
        <button onClick={onClick} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 bg-white w-32">
            <span className='text-sm text-intelQEDarkBlue'>{icon}</span>
            <span className='text-sm text-gray-700' >{text}</span>
        </button>
    );
};

interface ActionDropdownProps {
    actions: {
        icon: React.ReactNode;
        text: string;
        onClick: () => void;
    }[];
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ actions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
          ) {
            setIsOpen(false);
          }
        };
    
        if (isOpen) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [isOpen]);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="flex items-center gap-2 px-2 py-1.5 border rounded text-sm bg-intelQEDarkBlue text-white">
                
                <span className='ml-1'>Actions</span>
                {isOpen ? (<ChevronUp className='size-4'/>):(<ChevronDown className='size-4'/>)}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-20">
                    {actions.map((action, index) => (
                        <ActionButton key={index} {...action} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActionDropdown;