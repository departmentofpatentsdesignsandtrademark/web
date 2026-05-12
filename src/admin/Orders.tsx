import React, { useEffect, useState, useMemo } from 'react';
import { collection, query, getDocs, orderBy, updateDoc, doc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase-config/firebase';
import { Order } from '../types';
import { toast } from 'react-hot-toast';
import { Filter, Calendar, History, Search, ChevronDown, ChevronUp, Package } from 'lucide-react';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, s: string, currentStatus: string) => {
    if (s === currentStatus) return;
    
    try {
      const orderRef = doc(db, 'orders', id);
      const newHistoryEntry = {
        status: s,
        timestamp: new Date(), // using local for state update, but Firestore will have its own
        note: `Status changed from ${currentStatus} to ${s}`
      };

      await updateDoc(orderRef, { 
        status: s,
        statusHistory: arrayUnion({
          status: s,
          timestamp: new Date(),
          note: `Status changed from ${currentStatus} to ${s}`
        })
      });

      setOrders(prev => prev.map(o => 
        o.id === id 
          ? { 
              ...o, 
              status: s as any, 
              statusHistory: [...(o.statusHistory || []), newHistoryEntry as any] 
            } 
          : o
      ));
      toast.success(`Order ${s.toUpperCase()}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const updateTracking = async (id: string, trackingNumber: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), { trackingNumber });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, trackingNumber } : o));
      toast.success('Tracking updated');
    } catch {
      toast.error('Failed to update tracking');
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      let matchesDate = true;
      if (order.createdAt) {
        const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
        if (dateFilter.start) {
          matchesDate = matchesDate && orderDate >= new Date(dateFilter.start);
        }
        if (dateFilter.end) {
          const endDate = new Date(dateFilter.end);
          endDate.setHours(23, 59, 59, 999);
          matchesDate = matchesDate && orderDate <= endDate;
        }
      }
      
      return matchesStatus && matchesDate;
    });
  }, [orders, statusFilter, dateFilter]);

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Order Archive</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Managing global distribution logs</p>
        </div>

        <div className="flex flex-wrap gap-4 items-center bg-zinc-900/50 p-4 rounded-[30px] border border-zinc-800">
           <div className="flex items-center gap-2 px-4 border-r border-zinc-800">
             <Filter size={14} className="text-emerald-500" />
             <select 
               value={statusFilter} 
               onChange={(e) => setStatusFilter(e.target.value)}
               className="bg-transparent text-white text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
             >
                <option value="all" className="bg-zinc-900">All Status</option>
                <option value="pending" className="bg-zinc-900">Pending</option>
                <option value="confirmed" className="bg-zinc-900">Confirmed</option>
                <option value="processing" className="bg-zinc-900">Processing</option>
                <option value="delivered" className="bg-zinc-900">Delivered</option>
                <option value="cancelled" className="bg-zinc-900">Cancelled</option>
             </select>
           </div>

           <div className="flex items-center gap-4 px-4 h-full">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-emerald-500" />
                <input 
                  type="date" 
                  value={dateFilter.start}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                  className="bg-transparent text-white text-[10px] font-bold uppercase outline-none inverter-filter w-24"
                />
              </div>
              <span className="text-zinc-700 text-xs">-</span>
              <input 
                type="date" 
                value={dateFilter.end}
                onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                className="bg-transparent text-white text-[10px] font-bold uppercase outline-none inverter-filter w-24"
              />
           </div>
        </div>
      </div>

      <div className="bg-zinc-900/30 rounded-[40px] overflow-hidden border border-zinc-800 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-zinc-500">
              <tr>
                <th className="p-8">Order ID</th>
                <th className="p-8">Customer Detail</th>
                <th className="p-8">Financials</th>
                <th className="p-8">Logistics</th>
                <th className="p-8">State Control</th>
                <th className="p-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-zinc-600 text-xs font-black uppercase tracking-[0.4em]">
                    Zero Synchronization Matches Found
                  </td>
                </tr>
              ) : (
                filteredOrders.map(o => (
                  <React.Fragment key={o.id}>
                    <tr className={`text-sm hover:bg-white/5 transition-colors group ${expandedOrderId === o.id ? 'bg-white/5' : ''}`}>
                      <td className="p-8">
                        <p className="font-mono text-zinc-500 text-xs mb-1">#{o.id.substring(0, 8).toUpperCase()}</p>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                          {o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString() : 'N/A'}
                        </p>
                      </td>
                      <td className="p-8">
                        <p className="text-white font-black uppercase italic tracking-tighter text-lg leading-tight">{o.customer.name}</p>
                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">{o.customer.phone}</p>
                      </td>
                      <td className="p-8">
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-white italic tracking-tighter">৳{o.totalAmount.toLocaleString()}</span>
                          <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                            {o.items.length} Secure Asset(s)
                          </span>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            defaultValue={o.trackingNumber || ''}
                            placeholder="Enter Track #"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                            }}
                            onBlur={(e) => {
                              const val = e.target.value.trim();
                              if (val !== (o.trackingNumber || '')) updateTracking(o.id, val);
                            }}
                            className="bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-[10px] w-40 focus:border-emerald-500 outline-none text-white transition-all font-mono"
                          />
                          {o.trackingNumber && (
                            <a 
                              href={`https://www.aftership.com/track/${o.trackingNumber}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-lg active:scale-90"
                              title="Initialize External Tracking"
                            >
                               <Package size={16} strokeWidth={3} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-8">
                        <select 
                          value={o.status} 
                          onChange={e => updateStatus(o.id, e.target.value, o.status)} 
                          className={`bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer transition-all ${
                            o.status === 'delivered' ? 'text-emerald-500 border-emerald-500/30' : 
                            o.status === 'cancelled' ? 'text-red-500 border-red-500/30' : 'text-white'
                          }`}
                        >
                          <option value="pending" className="bg-zinc-900">PENDING</option>
                          <option value="confirmed" className="bg-zinc-900">CONFIRMED</option>
                          <option value="processing" className="bg-zinc-900">PROCESSING</option>
                          <option value="delivered" className="bg-zinc-900">DELIVERED</option>
                          <option value="cancelled" className="bg-zinc-900">CANCELLED</option>
                        </select>
                      </td>
                      <td className="p-8 text-right">
                        <button 
                          onClick={() => setExpandedOrderId(expandedOrderId === o.id ? null : o.id)}
                          className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all text-zinc-400 hover:text-white"
                        >
                          {expandedOrderId === o.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expandable History Panel */}
                    {expandedOrderId === o.id && (
                      <tr className="bg-black/40">
                        <td colSpan={6} className="p-0 border-b border-zinc-800">
                          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12 animate-slide-up">
                             <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                  <History size={16} className="text-emerald-500" />
                                  Status Evolution Log
                                </h4>
                                <div className="space-y-6 border-l-2 border-zinc-800 ml-2 pl-8 py-2">
                                   {o.statusHistory && o.statusHistory.length > 0 ? (
                                     o.statusHistory.map((h, i) => (
                                       <div key={i} className="relative">
                                          <div className="absolute -left-[41px] top-1 w-4 h-4 bg-zinc-900 border-2 border-emerald-500 rounded-full"></div>
                                          <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-1">{h.status}</p>
                                          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-2">
                                            {h.timestamp?.toDate ? h.timestamp.toDate().toLocaleString() : new Date(h.timestamp).toLocaleString()}
                                          </p>
                                          <p className="text-xs text-zinc-400 italic">"{h.note}"</p>
                                       </div>
                                     ))
                                   ) : (
                                     <div className="relative">
                                        <div className="absolute -left-[41px] top-1 w-4 h-4 bg-zinc-900 border-2 border-zinc-700 rounded-full"></div>
                                        <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-1 italic">Genesis Node</p>
                                        <p className="text-xs text-zinc-500">Order successfully registered in mainframe.</p>
                                     </div>
                                   )}
                                </div>
                             </div>

                             <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                  <Search size={16} className="text-emerald-500" />
                                  Payload Inspection
                                </h4>
                                <div className="bg-black/40 rounded-3xl p-6 border border-zinc-800 max-h-[300px] overflow-y-auto custom-scrollbar">
                                   <div className="space-y-4">
                                      {o.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                           <div className="w-12 h-12 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                                           </div>
                                           <div className="flex-grow">
                                              <p className="text-xs font-black text-white uppercase italic tracking-tight">{item.name}</p>
                                              <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">
                                                ID: {item.productId.substring(0,6)} | QTY: {item.quantity}
                                              </p>
                                           </div>
                                           <p className="text-xs font-bold text-white">৳{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                      ))}
                                   </div>
                                   
                                   <div className="mt-8 pt-6 border-t border-zinc-800">
                                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Delivery Coordinates</p>
                                      <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                                        {o.customer.address}
                                      </p>
                                      {o.customer.notes && (
                                        <div className="mt-4 p-4 bg-emerald-600/5 border border-emerald-500/10 rounded-xl">
                                          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Special Directives</p>
                                          <p className="text-xs text-emerald-100 italic">"{o.customer.notes}"</p>
                                        </div>
                                      )}
                                   </div>
                                </div>
                             </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
