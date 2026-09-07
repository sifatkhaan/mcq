"use client";

import { Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Button from "../button/Button";

interface DeleteConfirmProps {
  onConfirm: () => Promise<void> | void;
  title?: string;
  content?: string;
  loading?: boolean;
}

export default function DeleteConfirm({
  onConfirm,
  title = "Delete Confirmation",
  content = "Are you sure you want to delete this item? The item will be removed from the active list.",
  loading = false,
}: DeleteConfirmProps) {
  function handleClick() {
    Modal.confirm({
      title,
      content,
      icon: <DeleteOutlined />,
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: {
        danger: true,
        loading,
      },
      centered: true,
      onOk: async () => {
        await onConfirm();
      },
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      loading={loading}
      onClick={handleClick}
      className="text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      {!loading && <DeleteOutlined />} Delete{" "}
    </Button>
  );
}
