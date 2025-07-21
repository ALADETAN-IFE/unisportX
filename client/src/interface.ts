export interface UserData {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
    isVerified: boolean;
    faculty?: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
}

export type Role = string;

export interface Post {
  _id: string;
  author: {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
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
    profilePicture?: string;
    content: string;
    createdAt: string;
  }>;
  tags: string[];
  category: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  country: string;
  school: {
    name: string;
    department?: string;
    faculty?: string;
    campus?: string;
  };
  eventType: string;
  participants: Array<{
    name: string;
    school: string;
    country: string;
  }>;
  tags: string[];
  youtubeLink: string;
  uploadTime: string;
  uploadedBy: {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
  };
}

export type FeedItem = Post | Video;