import { iconProps } from "@/global";
import { Flex } from "@mantine/core";
import { cloneElement } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

interface NavbarItemProps {
    link: string;
    icon?: React.ReactElement;
    text?: string;
}
export default function NavbarItem({ link, icon = <></>, text = "nav bar item" }: NavbarItemProps) {
    const isCurrent = (): boolean => {
        return window.location.pathname.includes(link);
    };

    return (
        <Link to={link}>
            <Flex
                gap={8}
                align={"center"}
                className={classNames("cursor-pointer", {
                    "text-blue-800 font-semibold": isCurrent(),
                })}
            >
                {cloneElement(icon, iconProps)}
                {text}
            </Flex>
        </Link>
    );
}
