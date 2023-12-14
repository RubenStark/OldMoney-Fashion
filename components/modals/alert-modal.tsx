"use client";

import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

function AlertModal(props: AlertModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="¿Estas seguro?"
      description="Esta accion no puede ser deshecha"
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button
          disabled={props.loading}
          variant={"outline"}
          onClick={props.onClose}
        >
          Cancelar
        </Button>
        <Button
          disabled={props.loading}
          variant={"destructive"}
          onClick={props.onConfirm}
        >
          Continuar
        </Button>
      </div>
    </Modal>
  );
}

export default AlertModal;
