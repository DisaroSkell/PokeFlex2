import Link from "next/link";
import "./page.module.css";

export default function Home() {
  return (
    <div>
      <h1>Welcome to your dream land</h1>
      <div className="navButton">
        <Link href="/quiz">Go to Quiz</Link>
      </div>
    </div>
  );
}
