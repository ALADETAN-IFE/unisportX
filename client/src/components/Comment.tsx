interface Comment {
    _id: string;
    user: {
      _id: string;
      username: string;
    };
    profilePicture?: string;
    content: string;
    createdAt: string;
}

interface CommentProps {
  comment: Comment;
  user?: { _id: string };
  isDeleting?: boolean;
  handleDeleteComment?: (commentId: string) => void;
  formatDate?: (dateString: string) => string;
}

const Comment = ({ comment, user, isDeleting, handleDeleteComment, formatDate }: CommentProps) => {
    return (
        <div key={comment._id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      
                      {
                comment?.profilePicture ? (
                    <img src={comment?.profilePicture} alt={comment.user.username.charAt(0).toUpperCase()}/>
                ): `${comment.user.username.charAt(0).toUpperCase()}`
              }
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">
                            {comment.user.username}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate ? formatDate(comment.createdAt) : comment.createdAt}
                          </span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 text-sm mt-1">
                          {comment.content}
                        </p>
                      </div>
                      {user?._id === comment.user._id && handleDeleteComment && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          disabled={isDeleting}
                          className="text-xs text-red-500 hover:text-red-700 mt-1"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
    )
}

export default Comment