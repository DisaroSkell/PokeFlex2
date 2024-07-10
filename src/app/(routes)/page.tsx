import Link from "next/link";
import "./page.css";

export default function Home() {
  return (
    <div className="mainContainer">
      <h1>Welcome to your dream land</h1>
      <div className="centered">
        <Link className="navLink" href="/quiz">Go to Quiz</Link>
      </div>
    </div>
  );
}
