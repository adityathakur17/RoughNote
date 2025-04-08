import Link from "next/link";
import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";

const WriteLayout = ({ children }) => {
  return (
    <div className="container mx-auto px-8 py-1">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-green-700 hover:text-green-800 cursor pointer"
        >
          <span>&#8592;</span> Back to Dashboard
        </Link>
      </div>
      <Suspense fallback={<BarLoader color="green" width={"100%"}/>}>{children}</Suspense>
    </div>
  );
};

export default WriteLayout;
