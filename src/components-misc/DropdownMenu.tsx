import { off } from 'process';
import { Popup } from 'reactjs-popup';
import { PopupPosition } from 'reactjs-popup/dist/types';
import './DropdownMenu.css';

type Props = {
    trigger: any;
    position?: PopupPosition | PopupPosition[];
    offset?: string[];
    children?: JSX.Element | JSX.Element[];
};
export default function DropdownMenu({ trigger, position, offset, children }: Props) {
    console.assert(!offset || offset.length == 2, 'DropdownMenu: Offset should be an array [x, y]');
    const offsetStyle = offset ? { top: offset[1], left: offset[0] } : undefined;
    return (
        <Popup
            trigger={trigger}
            position={position}
            on="click"
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            arrow={false}
        >
            <div className="dropdown-menu" style={offsetStyle}>
                {children}
            </div>
        </Popup>
    );

}

