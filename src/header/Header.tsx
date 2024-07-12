type Props = {
    children: string;
    left?: JSX.Element[],
    right?: JSX.Element[],
};

export function Header({ children, left, right }: Props) {

    left = left ?? [];
    right = right ?? [];
    let gridTemplateColumns: string[] = [];
    for (const x of left) {
        gridTemplateColumns.push(`auto`);
    }
    gridTemplateColumns.push("1fr");
    for (const x of right) {
        gridTemplateColumns.push(`auto`);
    }

    const style: React.CSSProperties = {
        gridTemplateColumns: gridTemplateColumns.join(" "),
    };

    const x = <header style={style}>
        {left}
        <span className="headerTitle">{children}</span>
        {right}
    </header>;
    return x;
}