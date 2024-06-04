"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested card.</p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={(e) => {
          e.preventDefault();
          router.back();
        }}
      >{`< ${t("back")}`}</Link>
    </main>
  );
}
