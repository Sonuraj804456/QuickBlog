import React, { useEffect, useRef, useState } from "react";
import { assets } from "../../../assets/assets";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useAppContext } from "../../../context/AppContext";
import { toast } from "react-hot-toast";
import {parse} from 'marked';

const AddBlog = () => {

  const {axios} = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [Loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isPublished, setIsPublished] = useState(false);

  /* ------------------ INIT QUILL ------------------ */
  useEffect(() => {
  // Initiate Quill only once
  if (!quillRef.current && editorRef.current) {
    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
    });
  }
}, []);


  /* ------------------ AI GENERATE ------------------ */
  const generateContent = async () => {
  if (!title) return toast.error("Please enter a title");

  try {
    setLoading(true);

    const { data } = await axios.post("/api/blog/generate-content", {
      prompt: title,
    });

    if (data.success) {
      quillRef.current.root.innerHTML = parse(data.content);
    } else {
      toast.error(
        data.message || "AI quota exceeded. Please write manually."
      );
    }
  } catch (error) {
    // Handle quota / trial exceeded
    if (error.response?.status === 429) {
      toast.error("AI quota exceeded. Please write manually.");
    } else {
      toast.error("Something went wrong. Please write manually.");
    }
  } finally {
    setLoading(false);
  }
};



  /* ------------------ SUBMIT ------------------ */
  const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    setIsAdding(true);

    const blog = {
      title,
      subTitle,
      description: quillRef.current.root.innerHTML,
      category,
      isPublished,
    };

    const formData = new FormData();
    formData.append("blog", JSON.stringify(blog));
    formData.append("image", image);

    const { data } = await axios.post("/api/blog/add", formData);

    if (data.success) {
      toast.success(data.message);

      // reset form
      setTitle("");
      setSubTitle("");
      setCategory("");
      setIsPublished(false);
      setImage(null);
      quillRef.current.root.innerHTML = "";
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  } finally {
    setIsAdding(false);
  }
};


  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded"
      >
        {/* Upload Thumbnail */}
        <p>Upload thumbnail</p>
        <label htmlFor="image">
          <img
            src={
              !image
                ? assets.upload_area
                : URL.createObjectURL(image)
            }
            alt=""
            className="mt-2 h-16 rounded cursor-pointer"
          />
          <input
            type="file"
            id="image"
            hidden
            required
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        {/* Blog Title */}
        <p className="mt-4">Blog title</p>
        <input
          type="text"
          placeholder="Type here"
          className="w-full mt-2 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Subtitle */}
        <p className="mt-4">Sub title</p>
        <input
          type="text"
          placeholder="Type here"
          className="w-full mt-2 p-2 border rounded"
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
          required
        />

        {/* Blog Description */}
        <p className="mt-4">Blog Description</p>

<div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
  <div ref={editorRef}></div>

  {Loading && (
  <div className='absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2'>
    <div className='w-8 h-8 rounded-full border-2 border-t-white animate-spin'></div>
  </div>
)}


  <button
    disabled={Loading}
    type="button"
    onClick={generateContent}
    className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer"
  >
    Generate with AI
  </button>
</div>


        {/* Category */}
        <p className="mt-4">Category</p>
        <select
          className="mt-2 p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Startup</option>
          <option>Technology</option>
          <option>Lifestyle</option>
          <option>Finance</option>
        </select>

        {/* Publish */}
        <div className="flex gap-2 items-center mt-4">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={() => setIsPublished(!isPublished)}
          />
          <p>Publish Now</p>
        </div>

        {/* Submit */}
        <button
          disabled={isAdding}
          type="submit"
          className="mt-6 bg-primary text-white px-6 py-2 rounded"
        >
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
