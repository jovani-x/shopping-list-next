"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/app/components/Button/Button";
import Modal from "@/app/components/Modal/Modal";
import InviteFriendForm from "@/app/components/InviteFriendForm/InviteFriendForm";
import authFormStyles from "@/app/assets/styles/authForm.module.scss";

const InviteFriend = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={authFormStyles.btnHolder}>
      <Button
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        {t("inviteFriend")}
      </Button>
      <Modal
        isOpen={isModalOpen}
        setOpened={setIsModalOpen}
        title={t("inviteFriend")}
      >
        <InviteFriendForm />
      </Modal>
    </div>
  );
};

export default InviteFriend;
