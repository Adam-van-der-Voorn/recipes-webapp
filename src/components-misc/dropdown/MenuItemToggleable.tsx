import { MdCheckBox , MdCheckBoxOutlineBlank} from 'react-icons/md';
import './DropdownMenu.css';

type Props = {
    text: string;
    value: boolean;
    toggle: (b: boolean) => void;
};

export default function MenuItemToggleable({text, value, toggle}: Props) {
    const checkBox = value ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />;

    return (
        <div className="menu-button toggle" onClick={() => toggle(!value)}>
            <span className="Text">{text}</span>
            <span className="checkbox">{checkBox}</span>
        </div>
    );

}
