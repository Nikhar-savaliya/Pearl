import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

import { storage } from "../common/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast, Toaster } from "react-hot-toast";

const uploadImageByUrl = (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (err) {
      reject(err);
    }
  });
  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};
const uploadImageByFile = async (file) => {
  try {
    const timestamp = new Date().getTime();
    const uniqueFileName = `${timestamp}_${file.name}`;
    const imageRef = ref(storage, uniqueFileName);

    // Upload the image
    await uploadBytes(imageRef, file);

    // Get the download URL
    const url = await getDownloadURL(imageRef);

    return {
      success: 1,
      file: {
        url: url,
      },
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: 0,
      file: {
        url: null,
      },
    };
  }
};

export const tools = {
  embed: Embed,
  list: { class: List, inlineToolbar: true },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Enter a Heading",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  quote: { class: Quote, inlineToolbar: true },
  marker: Marker,
  inlineCode: InlineCode,
};
