import Image from 'next/image';

import "./footer.css"

export default function Footer() {
    const xmlnsAttributes = {
        "xmlns:cc":"http://creativecommons.org/ns#",
        "xmlns:dct":"http://purl.org/dc/terms/",
    }

    return <div className="footerContainer">
        <p
            {...xmlnsAttributes}
        >PokéFlex 2 by <a
            rel="cc:attributionURL dct:creator"
            property="cc:attributionName"
            href="https://github.com/DisaroSkell"
        >DisaroSkell</a> is licensed under <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
            target="_blank"
            rel="license noopener noreferrer"
            style={{ display: "inline-block" }}
        >CC BY-NC-SA 4.0<Image
            className="ccImage"
            src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
            alt=""
            height={22}
            width={22}
        /><Image
            className="ccImage"
            src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
            alt=""
            height={22}
            width={22}
        /><Image
            className="ccImage"
            src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"
            alt=""
            height={22}
            width={22}
        /><Image
            className="ccImage"
            src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"
            alt=""
            height={22}
            width={22}
        /></a></p>
    </div>
}