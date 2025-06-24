import * as Dialog from "@radix-ui/react-dialog";
import { useDialogStore } from "../stores/DialogStore";

export default function StudentOperationResultDialog() {
  const {
    isOpen,
    closeDialog,
    notFoundList,
    failedList,
    alreadyCreatedList,
    type,
  } = useDialogStore();

  if (!isOpen) return null;

  const isDelete = type === "delete";
  const isAdd = type === "add";

  return (
    <Dialog.Root open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content
          className="fixed top-[50%] left-[50%] max-w-md w-[90%] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 space-y-4 z-50"
          aria-describedby="dialog-description"
        >
          <Dialog.Title className="text-xl font-bold text-black">
            {isDelete ? "Deletion Result" : "Addition Result"}
          </Dialog.Title>

          <Dialog.Description
            id="dialog-description"
            className="text-sm text-gray-500 mb-4"
          >
            See details below :
          </Dialog.Description>

          {isDelete && notFoundList.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Students Not Found:
              </h3>
              <ul className="list-disc list-inside text-sm text-yellow-700">
                {notFoundList.map((s, idx) => (
                  <li key={idx}>
                    {s.rollNumber} – {s.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isDelete && failedList.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-300">
              <h3 className="font-semibold text-red-800 mb-2">
                Failed Deletions:
              </h3>
              <ul className="list-disc list-inside text-sm text-red-700">
                {failedList.map((s, idx) => (
                  <li key={idx}>
                    {s.rollNumber} – {s.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isDelete && notFoundList.length == 0 && failedList.length == 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
              <h3 className="font-semibold text-yellow-800 mb-2">
                All Students deleted successfully!
              </h3>
            </div>
          )}

          {isAdd && alreadyCreatedList.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Already Created Students:
              </h3>
              <ul className="list-disc list-inside text-sm text-yellow-700">
                {alreadyCreatedList.map((s, idx) => (
                  <li key={idx}>
                    {s.rollNumber} – {s.email}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isAdd && failedList.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-300">
              <h3 className="font-semibold text-red-800 mb-2">
                Failed to Add:
              </h3>
              <ul className="list-disc list-inside text-sm text-red-700">
                {failedList.map((s, idx) => (
                  <li key={idx}>
                    {s.rollNumber || "Unknown"} – {s.email || "Unknown"}
                    {s.reason ? ` (${s.reason})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isAdd &&
            alreadyCreatedList.length == 0 &&
            failedList.length == 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  All Students created successfully and emails are sent!
                </h3>
              </div>
            )}

          <Dialog.Close asChild>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4 ml-auto block">
              Close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
