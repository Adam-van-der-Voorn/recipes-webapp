import { MdCheckBox , MdCheckBoxOutlineBlank} from 'react-icons/md';


type Props = {
    text: string;
    value: boolean;
    toggle: (b: boolean) => void;
};

export default function MenuItemToggleable({text, value, toggle}: Props) {
    const checkBox = value ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />;

    return (
        <li role="button" className='menu-button' onClick={() => toggle(!value)}>
            <span>{text}</span>
            <span className='menu-button-checkbox'>{checkBox}</span>
        </li>
    );

}
