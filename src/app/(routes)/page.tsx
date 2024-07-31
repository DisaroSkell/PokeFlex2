import Link from "next/link";

import LanguageSelectors from "../_components/languageSelectors/component";

import "./page.css";

export default function Home() {
    return (
        <div className="mainContainer">
            <h1>Welcome to your dream land</h1>
            <LanguageSelectors />
            <Link className="navLink" href="/quiz">Go to Quiz</Link>
        </div>
    );
}
