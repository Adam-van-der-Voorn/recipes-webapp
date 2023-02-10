import React, { useContext } from 'react';
import { DropdownContext } from './DropdownMenu';
import './DropdownMenu.css';

type Props = {
    text: string;
    action: () => void;
};

export default function MenuItemAction({text, action}: Props) {
    const { setDropdownOpen } = useContext(DropdownContext)
    return (
        <li role="button" className="menu-button" onClick={() => {
            action();
            setDropdownOpen(false);
        }}>
            <span>{text}</span>
        </li>
    );

}
