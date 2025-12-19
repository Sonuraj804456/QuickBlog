import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, blog_data, comments_data } from '../../assets/assets'
import Navbar from '../Navbar'
import Footer from '../Footer'
import Moment from 'moment'
import Loader from '../Loader'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'

const Blog = () => {
  const { id } = useParams()
  const {axios} = useAppContext();

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])

  // Add comment states
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  // Fetch blog
  const fetchBlogData = async () => {
    try {
      const {data} = await axios.get(`/api/blog/${id}`);
      data.success ? setData(data.blog) : toast.error(data.message)
    }catch (error) {
      toast.error(error.message)
    }
  }

  // Fetch comments
  const fetchComments = async () => {
    try {
      const {data} = await axios.post(`/api/blog/comments`, {blogId: id});
      data.success ? setComments(data.comments) : toast.error(data.message)
    }catch (error) {
      toast.error(error.message)
    }
  }

  // Add new comment
  const addComment = async (e) => {
  e.preventDefault();

  try {
    const { data } = await axios.post('/api/blog/add-comment', {
      blog: id,
      name,
      content
    });

    if (data.success) {
      toast.success(data.message);
      setName('');
      setContent('');
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
}


  useEffect(() => {
    fetchBlogData()
    fetchComments()
  }, [])

  return data ? (
    <div className="relative">

      {/* Background */}
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-50 -z-10 opacity-50"
      />

      <Navbar />

      {/* BLOG HEADER */}
      <div className="text-center mt-20 text-gray-600">
        <p className="text-primary py-4 font-medium">
          Published on {Moment(data.createdAt).format('MMMM Do YYYY')}
        </p>

        <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
          {data.title}
        </h1>

        <h2 className="my-5 max-w-lg truncate mx-auto">
          {data.subTitle}
        </h2>
      </div>

      {/* BLOG IMAGE */}
      <div className="max-w-5xl mx-auto my-10">
        <img src={data.image} alt="" className="rounded-lg" />
      </div>

      {/* BLOG CONTENT */}
      <div
        className="rich-text max-w-3xl mx-auto "
        dangerouslySetInnerHTML={{ __html: data.description }}
      />

      {/* COMMENTS LIST */}
      <div className="mt-14 mb-10 max-w-3xl mx-auto">
        <p className="font-semibold mb-4">
          Comments ({comments.length})
        </p>

        <div className="flex flex-col gap-4">
          {comments.map((item, index) => (
            <div
              key={index}
              className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
            >
              <div className="flex items-center gap-2 mb-2">
                <img src={assets.user_icon} alt="" className="w-6" />
                <p className="font-medium">{item.name}</p>
              </div>

              <p className="text-sm max-w-md ml-8">{item.content}</p>

              <div className="absolute right-4 bottom-3 text-xs">
                {Moment(item.createdAt).fromNow()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD COMMENT SECTION */}
      <div className="max-w-3xl mx-auto">
        <p className="font-semibold mb-4">Add your comment</p>

        <form
          onSubmit={addComment}
          className="flex flex-col items-start gap-4 max-w-lg"
        >
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded outline-none"
          />

          <textarea
            placeholder="Comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded outline-none h-48"
          />

          <button
            type="submit"
            className="bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all"
          >
            Submit
          </button>
        </form>
      </div>

      {/* SHARE BUTTONS */}
      <div className="my-24 max-w-3xl mx-auto">
        <p className="font-semibold my-4">
          Share this article on social media
        </p>

        <div className="flex gap-4">
          <img src={assets.facebook_icon} width={50} alt="" />
          <img src={assets.twitter_icon} width={50} alt="" />
          <img src={assets.googleplus_icon} width={50} alt="" />
        </div>
      </div>

      <Footer />
    </div>
  ) : <Loader/>
}

export default Blog
