import Link from "next/link";
import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default function EntryLayout({ children }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-sm text-green-700 hover:text-green-800"
        >
          <span>&#8592;</span> Back to Dashboard
        </Link>
      </div>
      <Suspense fallback={<BarLoader color="green" width={"100%"} />}>
        {children}
      </Suspense>
    </div>
  );
}

