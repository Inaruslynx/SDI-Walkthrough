"use client";
import { ReactNode, useState } from "react";
import IconEdit from "@/components/ui/icons/edit";
import IconSave from "@/components/ui/icons/save";
import IconDelete from "@/components/ui/icons/delete";

export default function WalkthroughCard(): ReactNode {
  const [canEdit, setCanEdit] = useState<boolean>(false);

  const handleEditClick = () => {
    setCanEdit(true);
  };

  const handleSaveClick = () => {
    //TODO send to server
    setCanEdit(false);
  };

  const handleDeleteClick = () => {
    //TODO Confirm delete and then send to server
  };

  return (
    <div className="card w-96 bg-base-300 text-base-content">
      <div className="card-body">
        {canEdit ? (
          // TODO delete readOnly once I have some actual logic
          <input type="text" value={"New Area!"} readOnly />
        ) : (
          <h2>New Area!</h2>
        )}
      </div>
      <div className="card-actions justify-end">
        {canEdit ? (
          <>
            <button
              className="btn btn-primary btn-circle p-2 mr-2 mb-2"
              onClick={handleSaveClick}
            >
              <IconSave />
            </button>
            <button
              className="btn btn-error btn-circle p-2 mr-2 mb-2"
              onClick={handleDeleteClick}
            >
              <IconDelete />
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary btn-circle p-2 mr-2 mb-2"
            onClick={handleEditClick}
          >
            <IconEdit />
          </button>
        )}
      </div>
    </div>
  );
}
