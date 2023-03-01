import { MdCheckBox , MdCheckBoxOutlineBlank} from 'react-icons/md';
import style from './style.module.css';

type Props = {
    text: string;
    value: boolean;
    toggle: (b: boolean) => void;
};

export default function MenuItemToggleable({text, value, toggle}: Props) {
    const checkBox = value ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />;

    return (
        <li role="button" className={style['menu-button']} onClick={() => toggle(!value)}>
            <span>{text}</span>
            <span className={style['menu-button-checkbox']}>{checkBox}</span>
        </li>
    );

}
