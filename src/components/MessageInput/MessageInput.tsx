import React from "react";
import Paperclip from "public/icons/paperclip.svg";
import XCircle from "public/icons/x-circle.svg";
import { trpc } from "~/utils/trpc";
import { Message } from "~/types";

const readFile = (file: File) => {
  return new Promise<string | undefined>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
};

interface MessageInputProps {
  setQueuedMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  setQueuedMessages,
}) => {
  const [text, setText] = React.useState("");
  const [file, setFile] = React.useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = React.useState<string | undefined>();

  const utils = trpc.useContext();
  const addMessage = trpc.msg.add.useMutation();

  const onAddMessage = async () => {
    const data: Parameters<typeof addMessage.mutateAsync>[0] = {
      text: text.trimStart(),
      hasImage: !!file,
    };

    if (data.text.length) {
      resetForm();
      // Should be random enough
      const tempId = `${Date.now() + Math.random()}`;
      setQueuedMessages((queuedMessages) => {
        return [
          ...queuedMessages,
          {
            id: tempId,
            imageUrl: previewUrl,
            timestamp: new Date(),
            text: data.text,
            hasImage: !!data.hasImage,
          },
        ];
      });

      try {
        const { message, uploadUrl } = await addMessage.mutateAsync(data);

        if (uploadUrl) {
          await fetch(uploadUrl, { method: "PUT", body: file });
          resetFile();
        }

        const allMessages = utils.msg.list.getData();
        if (!allMessages) return;
        setQueuedMessages((queuedMessages) =>
          queuedMessages.filter((message) => message.id !== tempId)
        );
        utils.msg.list.setData([
          ...allMessages,
          // Load from device for now
          { ...message, imageUrl: previewUrl },
        ]);
      } catch (error) {
        console.log("Send message failed:", error);
      }
    }
  };

  const readUploadedImage = async (file: File | undefined) => {
    if (file) {
      const dataUrl = await readFile(file);
      if (dataUrl) setPreviewUrl(dataUrl);
    }
  };

  React.useEffect(() => {
    readUploadedImage(file);
  }, [file]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length) setFile(files[0]);
  };

  const resetForm = () => {
    setText("");
    resetFile();
  };

  const resetFile = () => {
    setFile(undefined);
    setPreviewUrl(undefined);
  };

  const onTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onAddMessage();
    }
  };

  return (
    <div className="flex w-full flex-col space-y-2 rounded-md bg-background-secondary py-3">
      {previewUrl && (
        <div className="w-full border-b border-background px-3 pb-2">
          <div className="group relative w-fit rounded-lg bg-background p-2">
            <img
              className="h-80 w-80 object-contain"
              src={previewUrl}
              alt="image preview"
            />
            <XCircle
              onClick={resetFile}
              className="absolute right-1 top-1 hidden cursor-pointer drop-shadow-lg group-hover:block"
              width={30}
              height={30}
              color="white"
            />

            <p className="mt-3 w-80 truncate text-sm text-white">
              {file?.name}
            </p>
          </div>
        </div>
      )}

      <div className="flex space-x-2 px-3">
        <label
          htmlFor="file"
          className="cursor-pointer rounded-full bg-background p-2"
        >
          <Paperclip width={20} height={20} color="white" />
          <input
            key={previewUrl} // Bit of a hack. Re-renders input to reset file input
            onChange={onFileChange}
            className="hidden"
            type="file"
            id="file"
            name="image"
            accept="image/jpeg,image/jpg,image/png"
            multiple={false}
          />
        </label>

        <input
          className="w-full appearance-none bg-transparent text-white focus:outline-none"
          autoFocus
          onChange={onTextInputChange}
          value={text}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
};
