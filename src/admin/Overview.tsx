import React from 'react';

const Overview: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-black text-white italic mb-12 uppercase">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/5 p-8 rounded-[32px] border border-white/10"><p className="text-xs uppercase text-gray-500 mb-2">Total Sales</p><h3 className="text-2xl text-white font-black">৳142,500</h3></div>
        <div className="bg-white/5 p-8 rounded-[32px] border border-white/10"><p className="text-xs uppercase text-gray-500 mb-2">Orders</p><h3 className="text-2xl text-white font-black">28</h3></div>
        <div className="bg-white/5 p-8 rounded-[32px] border border-white/10"><p className="text-xs uppercase text-gray-500 mb-2">Revenue Growth</p><h3 className="text-2xl text-emerald-500 font-black">+14%</h3></div>
      </div>
    </div>
  );
};

export default Overview;
