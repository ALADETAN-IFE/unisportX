export interface UserData {
    _id:string;
    username: string;
    email: string;
}

export interface Post {
  _id: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
  content: string;
  images: Array<{
    public_id: string;
    url: string;
    width: number;
    height: number;
  }>;
  likes: Array<{
    _id: string;
    user: {
      _id: string;
      username: string;
    };
    type: string;
  }>;
  comments: Array<{
    _id: string;
    user: {
      _id: string;
      username: string;
    };
    content: string;
    createdAt: string;
  }>;
  tags: string[];
  category: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}