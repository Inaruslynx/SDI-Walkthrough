import React from "react";

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ThemeItem({ value }: Readonly<{ value: string }>): React.ReactNode {
    return (
        <li>
            <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label={capitalizeFirstLetter(value)}
                value={value}
                data-set-theme={value}
            />
        </li>
    );
}