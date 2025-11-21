import { Suspense } from "react";
import NewsEvents from "./NewsEvents";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsEvents />
    </Suspense>
  );
}
