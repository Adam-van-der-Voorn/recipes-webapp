import React from 'react';
import { createContext, useState } from 'react';
import { Popup } from 'reactjs-popup';
import { PopupPosition } from 'reactjs-popup/dist/types';
import ValidChild from '../../types/ValidChild';
import './DropdownMenu.css';


type Props = {
    trigger: any;
    position?: PopupPosition | PopupPosition[];
    offset?: string[];
    children?: ValidChild | ValidChild[];
};

type Context = {
    setDropdownOpen: (value: boolean) => void;
}

export const DropdownContext = createContext<Context>({setDropdownOpen: (b) => {}});

export default function DropdownMenu({ trigger, position, offset, children }: Props) {
    console.assert(!offset || offset.length === 2, 'DropdownMenu: Offset should be an array [x, y]');
    const offsetStyle = offset ? { top: offset[1], left: offset[0] } : undefined;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popup
            trigger={trigger}
            position={position}
            on="click"
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            arrow={false}
            open={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
        >
            <DropdownContext.Provider value={{setDropdownOpen: setIsOpen}}>
                <menu className="dropdown-menu" style={offsetStyle}>
                    {children}
                </menu>
            </DropdownContext.Provider>
        </Popup>
    );

}

