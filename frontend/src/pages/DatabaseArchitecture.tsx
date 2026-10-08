import React from 'react';

export const DatabaseArchitecture = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-4xl font-display font-bold text-white mb-8">Database Architecture</h1>
    <div className="glass-card p-8 rounded-2xl mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">Relational Schema</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-zinc-300">
        <div>
          <h3 className="text-primary font-bold mb-2">USERS</h3>
          <ul className="list-disc pl-5"><li>user_id (PK)</li><li>phone_number (UNIQUE)</li><li>role</li></ul>
        </div>
        <div>
          <h3 className="text-primary font-bold mb-2">MOVIES</h3>
          <ul className="list-disc pl-5"><li>movie_id (PK)</li><li>title, duration, rating</li></ul>
        </div>
        <div>
          <h3 className="text-primary font-bold mb-2">SHOWS</h3>
          <ul className="list-disc pl-5"><li>show_id (PK)</li><li>movie_id (FK), screen_id (FK)</li><li>start_time, end_time</li></ul>
        </div>
        <div>
          <h3 className="text-primary font-bold mb-2">BOOKINGS</h3>
          <ul className="list-disc pl-5"><li>booking_id (PK)</li><li>user_id (FK), show_id (FK)</li><li>total_amount, status</li></ul>
        </div>
      </div>
    </div>
  </div>
);
