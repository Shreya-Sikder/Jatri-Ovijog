import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FeedPost } from './FeedPost';
import { getCurrentUser } from '../../lib/auth';

export function FeedList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
    
    // Subscribe to new reports
    const subscription = supabase
      .channel('reports_feed')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'reports' 
      }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchCurrentUser = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          bus_company:bus_company_id (
            id,
            name
          ),
          likes:post_likes (
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to include liked_by_user
      const transformedPosts = data.map(post => ({
        ...post,
        liked_by_user: post.likes?.some(like => like.user_id === currentUser?.id) || false
      }));

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.liked_by_user) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .match({ report_id: postId, user_id: currentUser.id });
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({ report_id: postId, user_id: currentUser.id });
      }

      fetchPosts();
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