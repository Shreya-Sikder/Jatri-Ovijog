import React from 'react';
import { Header } from '../components/Header';
import { FeedList } from '../components/feed/FeedList';

export function FeedPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <FeedList />
      </main>
    </div>
  );
}