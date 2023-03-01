import { useContext } from 'react';
import { DropdownContext } from './DropdownMenu';
import style from './style.module.css';

type Props = {
    text: string;
    action: () => void;
};

export default function MenuItemAction({text, action}: Props) {
    const { setDropdownOpen } = useContext(DropdownContext)
    return (
        <li role="button" className={style['menu-button']} onClick={() => {
            action();
            setDropdownOpen(false);
        }}>
            <span>{text}</span>
        </li>
    );

}
