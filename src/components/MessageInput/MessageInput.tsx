import React from "react";
import Paperclip from "public/icons/paperclip.svg";
import XCircle from "public/icons/x-circle.svg";
import { trpc } from "~/utils/trpc";
import { QueuedMessages } from "~/state/queuedMessages";
import * as fileUtils from "~/utils/file";
import { Message } from "~/types";

export const MessageInput: React.FC = () => {
  const [text, setText] = React.useState("");
  const [image, setImage] = React.useState<File | undefined>();
  const [imageUrl, setImageUrl] = React.useState<string | undefined>();
  const queuedMessages = QueuedMessages.useContainer();

  const utils = trpc.useContext();
  const addMessage = trpc.msg.add.useMutation();

  const onAddMessage = async () => {
    const data: Parameters<typeof addMessage.mutateAsync>[0] = {
      text: text.trimStart(),
    };
    if (image && imageUrl) {
      const { height, width } = await fileUtils.getImgDimensions(imageUrl);

      // hasImage is redundant information at this point
      data.hasImage = true;
      data.imageDimensions = {
        height,
        width,
      };
    }

    if (data.text.length) {
      resetForm();
      // Should be random enough
      const tempId = `${Date.now() + Math.random()}`;
      queuedMessages.add({
        id: tempId,
        imageUrl: imageUrl,
        timestamp: new Date(),
        ...data,
      } as Message);

      try {
        const { message, uploadUrl } = await addMessage.mutateAsync(data);

        if (uploadUrl) {
          await fetch(uploadUrl, { method: "PUT", body: image });
        }

        const allMessages = utils.msg.list.getData();
        if (!allMessages) return;
        queuedMessages.remove(tempId);
        utils.msg.list.setData([
          ...allMessages,
          // Load from device for now
          { ...message, imageUrl: imageUrl },
        ]);
      } catch (error) {
        console.log("Send message failed:", error);
      }
    }
  };

  const readUploadedImage = async (file: File | undefined) => {
    if (file) {
      const dataUrl = await fileUtils.read(file);
      if (dataUrl) setImageUrl(dataUrl);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length) {
      const file = files[0];
      setImage(file);
      readUploadedImage(file);
    }
  };

  const resetForm = () => {
    setText("");
    resetImage();
  };

  const resetImage = () => {
    setImage(undefined);
    setImageUrl(undefined);
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
      {imageUrl && (
        <div className="w-full border-b border-background px-3 pb-2">
          <div className="group relative w-fit rounded-lg bg-background p-2">
            <img
              className="h-80 w-80 object-contain"
              src={imageUrl}
              alt="image preview"
            />
            <XCircle
              onClick={resetImage}
              className="absolute right-1 top-1 hidden cursor-pointer drop-shadow-lg group-hover:block"
              width={30}
              height={30}
              color="white"
            />

            <p className="mt-3 w-80 truncate text-sm text-white">
              {image?.name}
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
            key={imageUrl} // Bit of a hack. Re-renders input to reset file input
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
