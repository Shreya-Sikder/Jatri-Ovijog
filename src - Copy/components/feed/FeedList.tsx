import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { FeedPost } from './FeedPost';
import { getCurrentUser } from '../../lib/auth';

export function FeedList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
  }, []);

  const fetchCurrentUser = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
  };

  const fetchPosts = async () => {
    try {
      const data = await api.reports.getAll();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) return;

    try {
      await api.likes.toggle(postId, currentUser.id);
      fetchPosts(); // Refresh posts to get updated like count
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (postId: string) => {
    // TODO: Implement comment modal/form
    console.log('Comment on post:', postId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      {posts.length === 0 ? (
        <div className="text-center text-gray-500">
          No reports yet. Be the first to report an issue!
        </div>
      ) : (
        posts.map((post) => (
          <FeedPost
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))
      )}
    </div>
  );
}