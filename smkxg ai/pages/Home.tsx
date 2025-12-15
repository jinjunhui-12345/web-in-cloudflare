
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Phone, Clock, ArrowRight, CreditCard, MessageSquare, Watch } from 'lucide-react';
import { db } from '../services/db';
import { ReservationFormData } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ReservationFormData>({
    name: '',
    identity: '',
    phone: '',
    visitDate: '',
    visitTime: '09:00',
    remarks: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePhone = (phone: string) => {
    return /^1\d{10}$/.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(formData.phone)) {
        alert("请输入有效的手机号码（1开头，11位数字）");
        return;
    }

    setLoading(true);

    try {
      const newReservation = await db.add(formData);
      navigate(`/success/${newReservation.id}`);
    } catch (error) {
      console.error("Submission failed", error);
      alert("预约提交失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // Calculate min date (today)
  const today = new Date().toISOString().split('T')[0];

  // Generate time slots (09:00 to 16:00)
  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="bg-science-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/1920/1080')] bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            探索生命的奥秘
          </h1>
          <p className="text-xl md:text-2xl text-science-100 max-w-2xl">
            欢迎预约参观生命科学馆。在这里，每一次呼吸都是一次发现之旅。
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 mb-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-science-600 px-6 py-4 border-b border-science-500 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              预约登记
            </h2>
            <span className="text-science-100 text-sm">快速 · 便捷 · 免费</span>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border-gray-300 border bg-gray-50 focus:bg-white focus:border-science-500 focus:ring-science-500 py-3 transition-colors"
                    placeholder="请输入您的姓名"
                  />
                </div>
              </div>

              {/* Identity (New) */}
              <div className="space-y-2">
                <label htmlFor="identity" className="block text-sm font-medium text-gray-700">
                  身份 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="identity"
                    name="identity"
                    required
                    value={formData.identity}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border-gray-300 border bg-gray-50 focus:bg-white focus:border-science-500 focus:ring-science-500 py-3 transition-colors"
                    placeholder="例如：学生、教师、游客"
                  />
                </div>
              </div>

              {/* Phone (Modified Validation) */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  联系电话 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    maxLength={11}
                    value={formData.phone}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ''); // 只允许数字
                        setFormData(prev => ({...prev, phone: val}));
                    }}
                    className="pl-10 block w-full rounded-lg border-gray-300 border bg-gray-50 focus:bg-white focus:border-science-500 focus:ring-science-500 py-3 transition-colors"
                    placeholder="请输入11位手机号码"
                  />
                </div>
              </div>

              {/* Visit Date */}
              <div className="space-y-2">
                <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700">
                  参观日期 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="visitDate"
                    name="visitDate"
                    required
                    min={today}
                    value={formData.visitDate}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border-gray-300 border bg-gray-50 focus:bg-white focus:border-science-500 focus:ring-science-500 py-3 transition-colors"
                  />
                </div>
              </div>

              {/* Time Slot (New) */}
              <div className="space-y-2">
                <label htmlFor="visitTime" className="block text-sm font-medium text-gray-700">
                  参观时间 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Watch className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="visitTime"
                    name="visitTime"
                    required
                    value={formData.visitTime}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border-gray-300 border bg-gray-50 focus:bg-white focus:border-science-500 focus:ring-science-500 py-3 transition-colors appearance-none"
                  >
                    {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Remarks (New) */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                  备注 <span className="text-gray-400 font-normal">(选填)</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="remarks"
                    name="remarks"
                    rows={2}
                    value={formData.remarks}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border-gray-300 border bg-gray-50 focus:bg-white focus:border-science-500 focus:ring-science-500 py-3 transition-colors"
                    placeholder="如有特殊需求请在此留言"
                  />
                </div>
              </div>

            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-science-600 hover:bg-science-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-science-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99]"
              >
                {loading ? '提交中...' : (
                  <>
                    立即预约 <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-900">填写信息</h3>
            <p className="text-sm text-gray-500 mt-2">填写真实姓名与联系方式</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-900">获取凭证</h3>
            <p className="text-sm text-gray-500 mt-2">提交后保存电子预约凭证</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-900">入馆参观</h3>
            <p className="text-sm text-gray-500 mt-2">现场出示凭证即可入馆</p>
          </div>
        </div>
      </div>
    </div>
  );
}
    