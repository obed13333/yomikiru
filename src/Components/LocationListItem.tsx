import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement, useContext, useState } from "react";
import { AppContext } from "../App";

const LocationListItem = ({
    name,
    link,
    inHistory,
    setCurrentLink,
}: {
    name: string;
    link: string;
    setCurrentLink: React.Dispatch<React.SetStateAction<string>>;
    inHistory?: boolean;
}): ReactElement => {
    const { openInReader } = useContext(AppContext);

    const [alreadyRead, setAlreadyRead] = useState(inHistory || false);
    return (
        <li className={alreadyRead ? "already-read" : ""}>
            <a
                className="a-context"
                onClick={() => {
                    console.log("aaaaaa");
                    if (window.fs.existsSync(link) && window.fs.lstatSync(link).isDirectory())
                        setCurrentLink(link);
                }}
                // data-name="${e}"
                // data-link="${link}"
            >
                <span className="text">{name}</span>
            </a>
            <button
                title="Open In Reader"
                className="open-in-reader-btn"
                onClick={() => openInReader(link)}
                // onclick="makeImg($(this).siblings('a').attr('data-link'))"
            >
                <FontAwesomeIcon icon={faAngleRight} />
            </button>
        </li>
    );
};

export default LocationListItem;
