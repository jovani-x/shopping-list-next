"use client";

import { ButtonSimple } from "@/app/components/Button/Button";

const Share = ({ onClick }: { onClick?: () => void }) => (
  <ButtonSimple onClick={onClick}>👥</ButtonSimple>
);

export default Share;
