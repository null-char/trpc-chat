export function read(file: File) {
  return new Promise<string | undefined>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

interface Dimensions {
  height: number;
  width: number;
}
export function getImgDimensions(url: string) {
  return new Promise<Dimensions>((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ height: img.height, width: img.width });
    };
    img.src = url;
  });
}
