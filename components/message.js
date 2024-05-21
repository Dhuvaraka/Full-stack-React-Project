import React, { useState } from "react";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

export default function Message({ id, avatar, username, description, isOwner, onDelete, onEdit }) {
  const [editMode, setEditMode] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    onEdit(updatedDescription);
    setEditMode(false);
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") {
      return;
    }
    const updatedComments = [...comments, { text: newComment, user: username }];
    setComments(updatedComments);
    setNewComment("");
  };

  return (
    <div className="bg-white p-8 border-b-2 rounded-lg shadow-lg">
      <div className="flex items-center gap-2">
        <img src={avatar} className="w-10 rounded-full" alt="User Avatar" />
        <h2>{username}</h2>
      </div>
      <div className="py-4">
        {editMode ? (
          <textarea
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            className="bg-gray-200 w-full rounded-lg p-2"
          />
        ) : (
          <p>{description}</p>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        {comments.map((comment, index) => (
          <div key={index} className="bg-gray-100 p-2 rounded-lg mb-2">
            <strong>{comment.user}:</strong> {comment.text}
          </div>
        ))}
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full rounded-lg p-2"
          />
          <button onClick={handleAddComment} className="bg-gray-600 text-white py-2 px-4 rounded-lg">
            Comment
          </button>
        </div>
      </div>
      {isOwner && (
        <div className="flex gap-4 mt-4">
          {editMode ? (
            <button onClick={handleSave} className="text-teal-600 py-2 px-4">
              Save
            </button>
          ) : (
            <button onClick={handleEdit} className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
              <AiFillEdit className="text-2xl" />
              Edit
            </button>
          )}
          <button onClick={onDelete} className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm">

          <BsTrash2Fill className="text-2xl" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
