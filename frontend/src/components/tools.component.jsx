// Importing required tools
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import { uploadImage } from "../common/aws"; // Assuming the AWS image upload function is already defined

// Function to upload image by file
const uploadImageByFile = (e) => {
  return uploadImage(e).then(url => {
    if (url) {
      return {
        success: 1,
        file: { url }
      };
    }
  });
};

// Function to upload image by URL
const uploadImageByURL = (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e); // Assuming `e` is the URL of the image
    } catch (err) {
      reject(err);
    }
  });

  return link.then(url => {
    return {
      success: 1,
      file: { url }
    };
  });
};

// Editor.js tools configuration
export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true // Enables inline toolbar for list
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByURL, // Correctly using uploadByUrl
        uploadByFile: uploadImageByFile // Correctly using uploadByFile
      }
    }
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading...", // Placeholder text for header input
      levels: [2, 3], // Available heading levels
      defaultLevel: 2 // Default heading level
    }
  },
  quote: {
    class: Quote,
    inlineToolbar: true // Enables inline toolbar for quotes
  },
  marker: Marker, // Enables text marker tool
  inlineCode: InlineCode // Enables inline code tool
};
