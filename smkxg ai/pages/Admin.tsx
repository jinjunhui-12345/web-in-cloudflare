
import React, { useState } from 'react';
import { Lock, Search, Trash2, Edit2, Plus, Save, LogOut, Filter, X } from 'lucide-react';
import { db } from '../services/db';
import { Reservation, ReservationFormData } from '../types';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Data state
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // New: Date filter
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state for Add/Edit
  const [formData, setFormData] = useState<ReservationFormData>({
    name: '',
    identity: '',
    phone: '',
    visitDate: '',
    visitTime: '09:00',
    remarks: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '114514114514') {
      setIsAuthenticated(true);
      setError('');
      loadData();
    } else {
      setError('访问密码错误，无法进入系统');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await db.getAll();
      setReservations(data);
    } catch (e) {
      console.error("Failed to load data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这条预约记录吗？此操作不可恢复。')) {
      try {
        await db.delete(id);
        await loadData();
      } catch (e) {
        alert("删除失败");
      }
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ 
        name: '', 
        identity: '', 
        phone: '', 
        visitDate: '', 
        visitTime: '09:00', 
        remarks: '' 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (reservation: Reservation) => {
    setEditingId(reservation.id);
    setFormData({
      name: reservation.name,
      identity: reservation.identity,
      phone: reservation.phone,
      visitDate: reservation.visitDate,
      visitTime: reservation.visitTime,
      remarks: reservation.remarks
    });
    setIsModalOpen(true);
  };

  const validatePhone = (phone: string) => /^1\d{10}$/.test(phone);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(formData.phone)) {
        alert("手机号必须是1开头的11位数字");
        return;
    }

    try {
      if (editingId) {
        await db.update(editingId, formData);
      } else {
        await db.add(formData);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (e) {
      alert("保存失败");
    }
  };

  const filteredReservations = reservations.filter(r => {
    const matchesSearch = 
        r.name.includes(searchTerm) || 
        r.phone.includes(searchTerm) ||
        r.identity.includes(searchTerm) ||
        r.id.includes(searchTerm);
    
    const matchesDate = dateFilter ? r.visitDate === dateFilter : true;
    
    return matchesSearch && matchesDate;
  });

  // Time slots for modal
  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // --- Login View ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-science-100 text-science-600 rounded-full flex items-center justify-center mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">管理员登录</h2>
            <p className="text-gray-500 text-sm mt-2">Life Science Museum Admin</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">系统密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-science-500 focus:border-science-500 outline-none transition-all"
                placeholder="请输入管理员密码"
                autoFocus
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-science-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-science-700 transition-colors shadow-sm"
            >
              验证身份
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Dashboard View ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">预约管理系统</h1>
          <p className="text-gray-500 text-sm mt-1">
            共 {reservations.length} 条记录，当前显示 {filteredReservations.length} 条
            {loading && <span className="ml-2 text-science-600">(同步中...)</span>}
          </p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={openAddModal}
             className="flex items-center gap-2 bg-science-600 text-white px-4 py-2 rounded-lg hover:bg-science-700 transition-colors shadow-sm text-sm font-medium"
           >
             <Plus size={18} /> 新增预约
           </button>
           <button 
             onClick={() => setIsAuthenticated(false)}
             className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
           >
             <LogOut size={18} /> 退出
           </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索ID、姓名、手机号或身份..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-science-500 focus:border-science-500 outline-none text-sm"
          />
        </div>
        
        {/* Date Filter */}
        <div className="flex items-center gap-2">
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-science-500 focus:border-science-500 outline-none text-sm text-gray-700"
                />
            </div>
            {dateFilter && (
                <button 
                    onClick={() => setDateFilter('')}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="清除日期筛选"
                >
                    <X size={18} />
                </button>
            )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-b-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-900 w-24">ID</th>
                <th className="px-6 py-4 font-semibold text-gray-900">访客姓名</th>
                <th className="px-6 py-4 font-semibold text-gray-900">身份</th>
                <th className="px-6 py-4 font-semibold text-gray-900">联系电话</th>
                <th className="px-6 py-4 font-semibold text-gray-900">预约时间</th>
                <th className="px-6 py-4 font-semibold text-gray-900">填写时间</th>
                <th className="px-6 py-4 font-semibold text-gray-900">备注</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-right sticky right-0 bg-gray-50">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReservations.length > 0 ? (
                filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs" title={reservation.id}>
                        {reservation.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{reservation.name}</td>
                    <td className="px-6 py-4 text-gray-600">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {reservation.identity}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{reservation.phone}</td>
                    <td className="px-6 py-4 text-gray-600">
                        <div className="flex flex-col">
                            <span className="font-medium">{reservation.visitDate}</span>
                            <span className="text-xs text-science-600">{reservation.visitTime}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(reservation.submitTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs max-w-xs truncate" title={reservation.remarks}>
                        {reservation.remarks || '-'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 sticky right-0 bg-white group-hover:bg-gray-50">
                      <button 
                        onClick={() => openEditModal(reservation)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                        title="编辑"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(reservation.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        title="删除"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    {loading ? '正在加载数据...' : '没有找到相关记录'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {editingId ? '编辑预约信息' : '新增预约'}
                    </h3>
                    <div className="mt-4 space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">姓名</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-science-500 focus:ring-science-500 border p-2"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      
                      {/* Identity */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">身份</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-science-500 focus:ring-science-500 border p-2"
                          value={formData.identity}
                          onChange={(e) => setFormData({...formData, identity: e.target.value})}
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">联系电话 (11位)</label>
                        <input
                          type="text"
                          maxLength={11}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-science-500 focus:ring-science-500 border p-2"
                          value={formData.phone}
                          onChange={(e) => {
                             const val = e.target.value.replace(/\D/g, '');
                             setFormData({...formData, phone: val});
                          }}
                        />
                      </div>

                      {/* Date & Time */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">参观日期</label>
                            <input
                            type="date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-science-500 focus:ring-science-500 border p-2"
                            value={formData.visitDate}
                            onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">时间段</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-science-500 focus:ring-science-500 border p-2"
                                value={formData.visitTime}
                                onChange={(e) => setFormData({...formData, visitTime: e.target.value})}
                            >
                                {timeSlots.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                      </div>

                      {/* Remarks */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">备注</label>
                        <textarea
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-science-500 focus:ring-science-500 border p-2"
                          value={formData.remarks || ''}
                          onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-science-600 text-base font-medium text-white hover:bg-science-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
