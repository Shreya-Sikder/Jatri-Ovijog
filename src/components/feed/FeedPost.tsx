import React from 'react';
import { AlertTriangle, Clock, MapPin, ThumbsUp, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FeedPostProps {
  post: {
    id: string;
    type: string;
    description: string;
    bus_company?: {
      id: string;
      name: string;
    };
    location?: { latitude: number; longitude: number };
    created_at: string;
    status: string;
    likes_count: number;
    comments_count: number;
    liked_by_user?: boolean;
  };
  onLike: (id: string) => void;
  onComment: (id: string) => void;
}

export function FeedPost({ post, onLike, onComment }: FeedPostProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'investigating':
        return 'text-blue-500';
      case 'resolved':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <AlertTriangle className={`h-5 w-5 ${
            post.type === 'harassment' ? 'text-red-500' : 
            post.type === 'reckless-driving' ? 'text-yellow-500' : 
            'text-blue-500'
          } mr-2`} />
          <div>
            <h3 className="font-medium text-gray-900 capitalize">{post.type.replace('-', ' ')}</h3>
            {post.bus_company && (
              <p className="text-sm text-gray-600">Bus: {post.bus_company.name}</p>
            )}
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </span>
      </div>

      <p className="mt-2 text-gray-600">{post.description}</p>

      {post.location && (
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          <span>Location: {post.location.latitude.toFixed(6)}, {post.location.longitude.toFixed(6)}</span>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between pt-3 border-t">
        <div className="flex space-x-4">
          <button 
            onClick={() => onLike(post.id)}
            className={`flex items-center ${
              post.liked_by_user ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            <ThumbsUp className="h-5 w-5 mr-1" />
            <span>{post.likes_count}</span>
          </button>
          <button 
            onClick={() => onComment(post.id)}
            className="flex items-center text-gray-500 hover:text-blue-500"
          >
            <MessageSquare className="h-5 w-5 mr-1" />
            <span>{post.comments_count}</span>
          </button>
        </div>
        <div className="flex items-center">
          <Clock className={`h-4 w-4 mr-1 ${getStatusColor(post.status)}`} />
          <span className={`text-sm capitalize ${getStatusColor(post.status)}`}>
            {post.status}
          </span>
        </div>
      </div>
    </div>
  );
}